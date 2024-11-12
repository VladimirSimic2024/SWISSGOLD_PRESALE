import presalelogo from "../assets/presale_logo.png";
import arrow from "../assets/arrow.png";
import CustomButton from "./CustomButton";
import coin from "../assets/coin_usd.png";
import ton from "../assets/ton.png";
import { AppContext } from "../App";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  base_api_uri,
  initialEnergy,
  minBuyAmount,
  PresaleContractAddress
} from "../config";
import {
  useTonAddress,
  useTonWallet,
  useTonConnectUI,
  SendTransactionRequest
} from "@tonconnect/ui-react";
// import { useContract } from "../hooks/useContract";
import { toast } from "react-toastify";
import { getTonBalance } from "../hooks/util";
import { isNumber } from "../utils/utils";
import {
  Address,
  beginCell,
  Cell,
  storeMessage,
  loadMessage,
  toNano,
  Transaction
} from "@ton/core";
import { TonClient } from "@ton/ton";
import { useTonClient } from "../hooks/useTonClient";
import { Presale } from "../contracts/presale";

const PresaleWidget = () => {
  const rates = [0.1, 0.25, 0.5, 0.75, 1];
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();
  const tonAddress = useTonAddress();

  const appContext: any = useContext(AppContext);

  const [tonBalance, setTonBalance] = useState(0);
  const [jettonBalance, setJettonBalance] = useState(0);
  const [tonPrice, setTonPrice] = useState(0);
  const [jettonPrice, setJettonPrice] = useState(0);
  const [tonValue, setTonValue] = useState("");
  const [jettonValue, setJettonValue] = useState("");
  const [percent, setPercent] = useState(1);
  const [select, setSelect] = useState(-1);

  const [loading, setLoading] = useState<boolean>(false);
  const client = useTonClient();

  const handleBuy = async () => {
    if (!wallet) {
      toast.warn("Connect wallet");
      return;
    }

    if (tonPrice * Number(tonValue) < minBuyAmount) {
      toast.warn("Minimum $150 purchase Amount required!");
      return;
    }

    if (tonBalance < Number(tonValue)) {
      toast.warn("Insufficient TON balance!");
      return;
    }

    try {
      console.log("tokenValue--", toNano(tonValue.toString()));

      try {
        const body = Presale.buyMessage();

        const tx: SendTransactionRequest = {
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [
            {
              // The receiver's address.
              address: PresaleContractAddress,
              // Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
              amount: toNano((Number(tonValue) - 1).toString()).toString(),
              // (optional) Payload in boc base64 format.
              payload: body.toBoc().toString("base64")
            }
          ]
        };

        const result = await tonConnectUi.sendTransaction(tx);
        setLoading(true);
        appContext.setPanelState(6);
        const hash = Cell.fromBase64(result.boc).hash().toString("base64");
        const message = loadMessage(Cell.fromBase64(result.boc).asSlice());
        console.log("Message:", message.body.hash().toString("hex"));

        if (client) {
          console.log("waitForTransaction");

          const txFinalized = await waitForTransaction(
            {
              address: tonConnectUi.account?.address ?? "",
              hash: hash
            },
            client
          );

          console.log("txFinalized = ", txFinalized);
        }

        axios.post(base_api_uri + "/api/presale", {
          chatId: appContext.userInfo.chatId,
          tokenAmount: jettonValue,
          tonAmount: tonValue,
          txHash: "https://tonviewer.com/transaction/" + hash
        });

        // UPDATE ENERGY
        if (appContext.energy < initialEnergy) {
          await axios.post(base_api_uri + "/api/game", {
            chatId: appContext.userInfo.chatId,
            energy: initialEnergy
          });
          appContext.setUserEnergy(initialEnergy);
        }

        appContext.setPanelState(0);

        toast.success("Buy success");

        setJettonBalance((prev) => prev + Number(jettonValue));
        setTonBalance((prev) => prev - Number(tonValue));

        console.log("update balances");
      } catch (e) {
        console.error(e);
        appContext.setPanelState(0);
        toast.success("Buy failed");
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.log("Buy error -- ", err);
    }
  };

  useEffect(() => {
    axios
      .get(base_api_uri + "/api/presale?chatId=" + appContext.userInfo.chatId)
      .then((result) => {
        console.log("presale info =", result.data.data);
        setJettonPrice(result.data.data.price);
        if (wallet) setJettonBalance(result.data.data.tokenAmount);
        let perc =
          (Number(result.data.data.boughtAmount) /
            Number(result.data.data.totalAmount)) *
          100;
        console.log("percent = ", perc);
        if (perc < 1) perc = 1;
        setPercent(perc);
      })
      .catch((error) => {
        console.log("presale info error", error);
      });

    console.log("tonAddress = ", tonAddress);

    if (wallet && tonAddress)
      getTonBalance(tonAddress).then((tonbalance) => {
        console.log("=============> tonBalance = ", tonbalance);
        setTonBalance(tonbalance);
      });

    axios.get(base_api_uri + "/api/price").then((result) => {
      console.log("get ton price = ", result.data.data);
      setTonPrice(result.data.data);
    });
  }, []);

  useEffect(() => {
    console.log("PresaleWidget.tsx tonConnectUi chaged");
    tonConnectUi.onStatusChange(async (wallet) => {
      if (wallet) {
        // update wallet ton balance
        getTonBalance(wallet.account.address).then((tonbalance) => {
          console.log("=============> tonBAlance = ", tonbalance);
          setTonBalance(tonbalance);
        });

        // update bought jetton amount
        axios
          .get(
            base_api_uri + "/api/presale?chatId=" + appContext.userInfo.chatId
          )
          .then((result) => {
            console.log("presale info =", result.data.data);
            setJettonPrice(result.data.data.price);
            setJettonBalance(result.data.data.tokenAmount);
            let perc =
              (Number(result.data.data.boughtAmount) /
                Number(result.data.data.totalAmount)) *
              100;
            console.log("percent = ", perc);
            if (percent < 1) perc = 1;
            setPercent(perc);
          })
          .catch((error) => {
            console.log("presale info error", error);
          });

        // update ton price
        axios.get(base_api_uri + "/api/price").then((result) => {
          console.log("get ton price = ", result.data.data);
          setTonPrice(result.data.data);
        });
      } else {
        setTonBalance(0);
        setJettonBalance(0);
        setTonValue("");
        setJettonValue("");
      }
    });
  }, [tonConnectUi]);

  const handleSelect = (index: number) => {
    setTonValue((tonBalance * rates[index]).toFixed(2));
    setJettonValue(
      Math.round(Number(tonBalance * rates[index]) / jettonPrice).toString()
    );
    setSelect(index);
  };

  return (
    <div className="relative flex flex-col w-full">
      <div className="flex justify-center select-none">
        <img src={presalelogo} className="h-[19vh]"></img>
      </div>

      <div className="flex flex-col gap-3 w-full p-2 mb-4 text-white bg-[#F0DC9B26] border rounded-[19.4px] border-[#BCAE43B0] mt-[-6vh] backdrop-blur-[15.16px] font-poppins">
        <div className="flex gap-2 justify-center font-extrabold text-[2.5vh] select-none">
          <label className="text-[#FFD900]">$SGOLD</label>Presale
        </div>

        <div className="border border-[#FFD900] h-[15px] w-full rounded-[41px] flex flex-col justify-center px-[1.5px] bg-black select-none">
          <div
            className={`h-[9px] rounded-full bg-gradient-to-r from-[#FCD8DA] to-[#FFBB01] select-none`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        <div className="flex flex-col gap-[2px]">
          <div className="p-3 flex flex-col bg-white bg-opacity-10 text-white rounded-[19.4px] font-medium gap-1">
            <div className="flex justify-between text-[1.5vh] select-none">
              <label>You Pay</label>
              <label>Balance:{tonBalance.toFixed(2)}</label>
            </div>
            <div className="flex justify-between selet-none">
              <input
                className="font-medium font-poppins text-[3vh] w-[40vw] bg-transparent focus: outline-none"
                placeholder="0"
                value={tonValue}
                onChange={(e) => {
                  if (e.target.value && !isNumber(e.target.value)) {
                    toast.warn("Invalid number");
                  } else {
                    setTonValue(e.target.value);
                    console.log("jetton price = ", jettonPrice);
                    setJettonValue(
                      Math.round(
                        Number(e.target.value) / jettonPrice
                      ).toString()
                    );
                  }
                }}
              ></input>
              <div className="flex items-center gap-1 border border-[#BCAE43B0] rounded-full p-1 bg-[#F0DC9B] bg-opacity-15 w-[24vw]">
                <img src={ton} className="h-[3vh]"></img>
                <label className="text-[1.56vh] select-none">TON</label>
              </div>
            </div>
            <div className="flex justify-between mt-[2px]">
              <div
                className="w-1/5 px-[2px]"
                onClick={() => {
                  handleSelect(0);
                }}
              >
                <div
                  className={`flex items-center justify-center gap-1 border ${
                    select == 0
                      ? "border-[#BCAE43] bg-opacity-30"
                      : "border-[#BCAE43B0] bg-opacity-15"
                  } rounded-full p-1 bg-[#F0DC9B] bg-opacity-15 w-full`}
                >
                  <label className="text-[1.56vh] select-none">10%</label>
                </div>
              </div>

              <div
                className="w-1/5 px-[2px]"
                onClick={() => {
                  handleSelect(1);
                }}
              >
                <div
                  className={`flex items-center justify-center gap-1 border ${
                    select == 1
                      ? "border-[#BCAE43] bg-opacity-30"
                      : "border-[#BCAE43B0] bg-opacity-15"
                  } rounded-full p-1 bg-[#F0DC9B] bg-opacity-15 w-full`}
                >
                  <label className="text-[1.56vh] select-none">25%</label>
                </div>
              </div>

              <div
                className="w-1/5 px-[2px]"
                onClick={() => {
                  handleSelect(2);
                }}
              >
                <div
                  className={`flex items-center justify-center gap-1 border ${
                    select == 2
                      ? "border-[#BCAE43] bg-opacity-30"
                      : "border-[#BCAE43B0] bg-opacity-15"
                  } rounded-full p-1 bg-[#F0DC9B] bg-opacity-15 w-full`}
                >
                  <label className="text-[1.56vh] select-none">50%</label>
                </div>
              </div>

              <div
                className="w-1/5 px-[2px]"
                onClick={() => {
                  handleSelect(3);
                }}
              >
                <div
                  className={`flex items-center justify-center gap-1 border ${
                    select == 3
                      ? "border-[#BCAE43] bg-opacity-30"
                      : "border-[#BCAE43B0] bg-opacity-15"
                  } rounded-full p-1 bg-[#F0DC9B] bg-opacity-15 w-full`}
                >
                  <label className="text-[1.56vh] select-none">75%</label>
                </div>
              </div>

              <div
                className="w-1/5 px-[2px]"
                onClick={() => {
                  handleSelect(4);
                }}
              >
                <div
                  className={`flex items-center justify-center gap-1 border ${
                    select == 4
                      ? "border-[#BCAE43] bg-opacity-30"
                      : "border-[#BCAE43B0] bg-opacity-15"
                  } rounded-full p-1 bg-[#F0DC9B] w-full`}
                >
                  <label className="text-[1.56vh] select-none">100%</label>
                </div>
              </div>
            </div>
          </div>

          <div className="my-[-8px] justify-center flex z-30">
            <img
              src={arrow}
              className="h-[4vh] border-[#383526] border-[3px] rounded-full"
            ></img>
          </div>

          <div className="p-3 flex flex-col bg-white bg-opacity-10 text-white rounded-[19.4px] font-medium gap-1">
            <div className="flex justify-between text-[1.5vh] select-none">
              <label>You receive</label>
              <label>Balance:{jettonBalance}</label>
            </div>
            <div className="flex justify-between">
              <input
                className="font-medium font-poppins text-[3vh] w-[40vw] bg-transparent focus: outline-none"
                placeholder="0"
                value={jettonValue}
              ></input>
              <div className="flex items-center gap-1 border border-[#BCAE43B0] rounded-full p-1 bg-[#F0DC9B] bg-opacity-15 w-[24vw]">
                <img src={coin} className="h-[3vh]"></img>
                <label className="text-[1.56vh] select-none">SGOLD</label>
              </div>
            </div>
            <label className="text-[1.7vh] text-[#FFFFFF] opacity-50 select-none">
              ${(tonPrice * Number(tonValue)).toFixed(2)}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-center font-semibold font-poppins">
          {jettonPrice !== null && tonPrice !== null ? (
            <>
              <label className="text-[#FFD900] mr-1 text-[1.7vh]">
                SGold=$0.00009
              </label>
            </>
          ) : (
            <div className="text-[#FCD80AFF] text-center w-full select-none text-[1.7vh]">
              Loading...
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <CustomButton
            text={"Buy SGOLD"}
            onClick={handleBuy}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

interface WaitForTransactionOptions {
  address: string;
  hash: string;
  refetchInterval?: number;
  refetchLimit?: number;
}

const waitForTransaction = async (
  options: WaitForTransactionOptions,
  client: TonClient
): Promise<Transaction | null> => {
  const { hash, refetchInterval = 1000, refetchLimit, address } = options;

  return new Promise((resolve) => {
    let refetches = 0;
    const walletAddress = Address.parse(address);
    const interval = setInterval(async () => {
      refetches += 1;

      console.log("waiting transaction...");
      const state = await client.getContractState(walletAddress);
      if (!state || !state.lastTransaction) {
        clearInterval(interval);
        resolve(null);
        return;
      }
      const lastLt = state.lastTransaction.lt;
      const lastHash = state.lastTransaction.hash;
      const lastTx = await client.getTransaction(
        walletAddress,
        lastLt,
        lastHash
      );

      if (lastTx && lastTx.inMessage) {
        const msgCell = beginCell()
          .store(storeMessage(lastTx.inMessage))
          .endCell();

        const inMsgHash = msgCell.hash().toString("base64");
        console.log("InMsgHash", inMsgHash);
        if (inMsgHash === hash) {
          clearInterval(interval);
          resolve(lastTx);
        }
      }
      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval);
        resolve(null);
      }
    }, refetchInterval);
  });
};

export default PresaleWidget;
