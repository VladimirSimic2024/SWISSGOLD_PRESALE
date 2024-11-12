import heart from "../assets/heart.png";
import cheese from "../assets/cheese.png";
import up from "../assets/up.png";
import down from "../assets/down.png";
import PriceWidget from "../components/PriceWidget";
import { AppContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import start_logo from "../assets/start_logo.png";
import up_arrow from "../assets/up_arrow.png";
import down_arrow from "../assets/down_arrow.png";
import coin from "../assets/coin.png";
import axios from "axios";
import {
  base_api_uri,
  goldPriceApiKey,
  initialEnergy,
  predictionTime
} from "../config";
import { toast } from "react-toastify";
import { useTonAddress } from "@tonconnect/ui-react";

const PlaySubPage = () => {
  const appContext: any = useContext(AppContext);
  const address = useTonAddress();
  const [jettonBalance, setJettonBalance] = useState(0);

  const handleUp = async () => {
    console.log("handleup");

    if (!address) {
      toast.warn("Connect wallet");
      return;
    }

    if (jettonBalance == 0) {
      toast.warn("You have no SGOLD!");
      return;
    }
    if (appContext.energy > 0) {
      const goldPrice = await getGoldPrice();

      axios.post(base_api_uri + "/api/game", {
        chatId: appContext.userInfo.chatId,
        energy: appContext.energy - 1,
        goldPrice: goldPrice,
        upDown: true,
        running: true
      });

      appContext.setUserEnergy(appContext.energy - 1);
      appContext.setLeftTime(predictionTime);
      appContext.setStartPrice(goldPrice);

      appContext.setPanelState(1); // show up panel
    } else {
      toast.warn("You have no energy!");
    }
  };

  const handleDown = async () => {
    console.log("handleDown");

    if (!address) {
      toast.warn("Connect wallet");
      return;
    }

    if (jettonBalance == 0) {
      toast.warn("You have no SGOLD");
      return;
    }

    if (appContext.energy > 0) {
      const goldPrice = await getGoldPrice();

      axios.post(base_api_uri + "/api/game", {
        chatId: appContext.userInfo.chatId,
        energy: appContext.energy - 1,
        goldPrice: goldPrice,
        upDown: false,
        running: true
      });

      appContext.setLeftTime(predictionTime);
      appContext.setStartPrice(goldPrice);
      appContext.setUserEnergy(appContext.energy - 1);

      appContext.setPanelState(2); // show down panel
    } else {
      toast.warn("You have no energy!");
    }
  };

  useEffect(() => {
    axios
      .get(base_api_uri + "/api/presale?chatId=" + appContext.userInfo.chatId)
      .then((result) => {
        console.log("PlaySubPage.tsx presale info =", result.data.data);
        setJettonBalance(result.data.data.tokenAmount);
      })
      .catch((error) => {
        console.log("presale info error", error);
      });

    axios
      .get(base_api_uri + "/api/game?chatId=" + appContext.userInfo.chatId)
      .then(async (result) => {
        console.log("PlaySubPage.tsx game Info = ", result.data.data);
        if (result.data.data.passed && Number(result.data.data.passed) > 0) {
          // game started before
          if (Number(result.data.data.passed) >= predictionTime) {
            // already result on backend
            const predictionResult = result.data.data.result;
            const startPrice = result.data.data.goldPrice;

            appContext.setStartPrice(startPrice);
            if (predictionResult) {
              // show winning
              appContext.setPanelState(3);
            } else {
              // show loss
              appContext.setPanelState(4);
            }
          } else {
            // current not exist
            const passedTime = Number(result.data.data.passed);
            const leftTime = predictionTime - passedTime;

            appContext.setLeftTime(leftTime);
            appContext.setStartPrice(result.data.data.goldPrice);

            if (result.data.data.upDown)
              appContext.setPanelState(1); // show up panel
            else appContext.setPanelState(2); // show down panel
          }
        } else {
          // No game
          const goldPrice = await getGoldPrice();
          appContext.setStartPrice(goldPrice);
        }
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="z-30"
    >
      <div className="relative flex flex-col h-full w-full overflow-hidden z-20">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-between w-full px-4">
            <div className="flex flex-col items-center font-semibold font-poppins">
              <label className="text-[#FCD80AFF] text-[10px] select-none">
                Energy
              </label>
              <div className="flex relative">
                <img
                  src={heart}
                  className="absolute left-[-10px] top-[-8px] h-[4.6vh]"
                ></img>
                <label className="border border-[#e6ce4a] w-[100px] rounded-full text-[#FCD80AFF] text-center pl-4 text-[2vh]">
                  {`${appContext.energy} / ${initialEnergy}`}
                </label>
              </div>
            </div>

            <div className="flex flex-col items-center font-semibold font-poppins">
              <label className="text-[#FCD80AFF] text-[10px] ml-3 select-none">
                Cheese Point
              </label>
              <div className="flex relative">
                <img
                  src={cheese}
                  className="absolute left-[-10px] top-[-8px] h-[4.6vh]"
                ></img>
                <label className="border border-[#FCD80AFF] w-[100px] rounded-full text-[#FCD80AFF] text-center pl-4 text-[2vh]">
                  {appContext.point}
                </label>
              </div>
            </div>
          </div>

          <PriceWidget />

          <div className="relative flex flex-col items-center justify-center">
            <img src={start_logo} className="h-[39.5vh] z-10"></img>
            <div className="absolute top-[14vh] flex justify-center gap-[13vh] ml-[20px]">
              <img src={down_arrow} className="h-[5vh] z-20"></img>
              <img src={up_arrow} className="h-[5vh] z-20"></img>
            </div>
            <div className="absolute top-[25vh] flex justify-center gap-[170px] ml-[20px]">
              <img
                src={coin}
                className="h-[7vh] blur-sm mb-[20px] animate-coin-down"
              ></img>
              <img src={coin} className="h-[8vh] z-30 animate-coin-up"></img>
            </div>
          </div>

          <div className="flex w-full justify-center z-50">
            <div onClick={() => handleUp()}>
              <img src={up} className="w-[44vw]"></img>
            </div>
            <div onClick={() => handleDown()}>
              <img src={down} className="w-[44vw]"></img>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const getGoldPrice = async () => {
  const url = "https://www.goldapi.io/api/XAU/USD";
  const headers = {
    "x-access-token": goldPriceApiKey
  };

  const response = await axios.get(url, { headers });
  return Number(response.data.price);
};

export default PlaySubPage;
