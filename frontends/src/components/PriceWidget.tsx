import { useEffect, useState, useContext } from "react";
import gold from "../assets/gold.png";
import rise from "../assets/rise.png";
import down from "../assets/down_.png";
import axios from "axios";
import { goldPriceApiKey } from "../config";
import { AppContext } from "../App";

const PriceWidget = () => {
  const appContext: any = useContext(AppContext);
  const [goldPrice, setGoldPrice] = useState(null);
  const [chp, setChp] = useState("0.00");

  const fetchGoldPrice = async () => {
    const url = "https://www.goldapi.io/api/XAU/USD";
    const headers = {
      "x-access-token": goldPriceApiKey
    };

    try {
      const response = await axios.get(url, { headers });
      console.log("gold price response = ", response.data);
      setGoldPrice(response.data.price);

      if (appContext.startPrice > 0 && goldPrice) {
        const delta = Number(goldPrice) - Number(appContext.startPrice);
        const percent = ((delta / Number(appContext.startPrice)) * 100).toFixed(2);
        setChp(percent);
      }
    } catch (error) {
      console.error("Error fetching gold price:", error);
    }
  };

  useEffect(() => {
    fetchGoldPrice();

    const intervalId = setInterval(() => {
      fetchGoldPrice();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center justify-center border border-[#FCD80AFF] rounded-full h-[9.8vh] gap-4 font-semibold font-poppins px-4 w-[79vw]">
      <img src={gold} className="h-[5.3vh]"></img>
      {goldPrice !== null ? (
        <div className="flex flex-col items-center gap-1">
          <label className="text-[#FCD80AFF] text-[2vh] select-none">
            Gold Live = ${goldPrice}
          </label>
          <div className="flex items-center gap-1">
            {Number(chp!) >= 0 ? (
              <img src={rise}></img>
            ) : (
              <img src={down} className="transform rotate-180"></img>
            )}
            <label
              className={`${
                Number(chp!) >= 0 ? "text-[#00D320]" : "text-[#ff0000]"
              } text-[2vh]`}
            >
              {chp}%
            </label>
          </div>
        </div>
      ) : (
        <div className="text-[#FCD80AFF] text-center w-full">Loading...</div>
      )}
    </div>
  );
};

export default PriceWidget;
