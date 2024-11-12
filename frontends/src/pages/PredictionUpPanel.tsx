import up from "../assets/up.png";
import CountdownTimer from "../components/CountdownTimer";
import PriceWidget from "../components/PriceWidget";
import { AppContext } from "../App";
import { useContext } from "react";
import { motion } from "framer-motion";
import { goldPriceApiKey } from "../config";
import axios from "axios";

const PredictionUpPanel = () => {
  const appContext: any = useContext(AppContext);

  const onFinish = () => {
    console.log("uppanel on finish");
    const url = "https://www.goldapi.io/api/XAU/USD";
    const headers = {
      "x-access-token": goldPriceApiKey
    };
    axios.get(url, { headers }).then((response) => {
      console.log("UpPanel, prediction result price", response.data.price);
      console.log("UpPanel, start price", appContext.startPrice);
      if (response.data.price > appContext.startPrice)
        appContext.setPanelState(3);
      else appContext.setPanelState(4);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center bg-[#161616] bg-opacity-70 z-50"
    >
      <label className="text-[#00D320] text-[3.68vh] font-semibold font-poppins">
        Your Prediction:
      </label>
      <img src={up} className="w-[61vw]"></img>

      <div className="flex flex-col items-center gap-8">
        <PriceWidget />

        <CountdownTimer onFinish={onFinish} leftTime={appContext.leftTime} />

        <div className="text-white font-medium text-[15px] font-poppins select-none">
          Wait till the end of the countdown...
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionUpPanel;
