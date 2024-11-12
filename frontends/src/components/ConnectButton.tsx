import {
  useTonConnectUI,
  useTonWallet,
  useTonAddress,
} from "@tonconnect/ui-react";
import axios from "axios";
import { useEffect, useContext } from "react";
import { base_api_uri } from "../config";
import { AppContext } from "../App";

const ConnectButton = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const walletAddress = useTonAddress();
  const appContext: any = useContext(AppContext);

  const handleClick = () => {
    if (wallet) {
      tonConnectUI.disconnect();
    } else {
      tonConnectUI.openModal();
    }
  };

  useEffect(() => {
    console.log("tonConnectUI change");
    tonConnectUI.onStatusChange(async (wallet) => {
      if (wallet) {
        const address = useTonAddress();
        console.log("ton address = ", address);
        console.log("wallet address =", wallet.account.address);
        axios.post(base_api_uri + "/api/user/wallet", {
          chatId: appContext.userInfo.chatId,
          wallet: address,
        });
        appContext.setMainState(1);
      }
    });
  }, [tonConnectUI]);

  useEffect(() => {
    // Handle when the mini app is closing
    if ((window as any).Telegram?.WebApp) {
      (window as any).Telegram.WebApp.onEvent("web_app_close", () => {
        tonConnectUI.disconnect();
      });
    }

    // Optional: Cleanup event listener
    return () => {
      if ((window as any).Telegram?.WebApp) {
        (window as any).Telegram.WebApp.offEvent("web_app_close", () => {
          tonConnectUI.disconnect();
        });
      }
    };
  }, [wallet]);

  return (
    <button
      className="flex justify-center items-center bg-gradient-to-tr from-[#FCD80AFF] to-[#FFBB01E6]  py-[8px] px-[16px] rounded-[8px] h-[4vh] w-[28vw]"
      onClick={() => handleClick()}
    >
      {wallet ? (
        <label className="text-black font-inter font-semibold text-[14px] pb-[1px] select-none truncate">
          {walletAddress}
        </label>
      ) : (
        <label className="text-black font-inter font-semibold text-[14px] pb-[1px] select-none">
          Connect
        </label>
      )}
    </button>
  );
};

export default ConnectButton;
