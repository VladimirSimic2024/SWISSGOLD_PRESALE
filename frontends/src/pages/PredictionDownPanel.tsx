import down from "../assets/down.png";
import CountdownTimer from "../components/CountdownTimer";
import PriceWidget from "../components/PriceWidget";
import { AppContext } from "../App";
import { useContext } from "react";
import { goldPriceApiKey } from "../config";
import axios from "axios";

const PredictionDownPanel = () => {
  const appContext: any = useContext(AppContext);

  const onFinish = () => {
    console.log("downpanel on finish");
    const url = "https://www.goldapi.io/api/XAU/USD";
    const headers = {
      "x-access-token": goldPriceApiKey
    };
    axios.get(url, { headers }).then((response) => {
      console.log("DownPanel, prediction result price", response.data.price);
      console.log("DownPanel, start price = ", appContext.startPrice);
      if (response.data.price < appContext.startPrice)
        appContext.setPanelState(3);
      else appContext.setPanelState(4);
    });
  };

  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center bg-[#161616] bg-opacity-70 z-50">
      <label className="text-[#00D320] text-[3.68vh] font-semibold font-poppins">
        Your Prediction:
      </label>
      <img src={down} className="w-[61vw]"></img>

      <div className="flex flex-col items-center gap-8">
        <PriceWidget />

        <CountdownTimer onFinish={onFinish} leftTime={appContext.leftTime} />

        <div className="text-white font-medium text-[15px] font-poppins select-none">
          Wait till the end of the countdown...
        </div>
      </div>
    </div>
  );
};

export default PredictionDownPanel;
