import victory from "../assets/victory.png";
import cup from "../assets/cup.png";
import PriceWidget from "../components/PriceWidget";
import CustomButton from "../components/CustomButton";
import { AppContext } from "../App";
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { base_api_uri, rewardPoints } from "../config";

const WinPanel = () => {
  const appContext: any = useContext(AppContext);

  useEffect(() => {
    axios.post(base_api_uri + "/api/game", {
      chatId: appContext.userInfo.chatId,
      point: rewardPoints,
      energy: appContext.energy,
    });
    appContext.setUserPoints(appContext.point + rewardPoints);
  }, []);

  const handleNewGame = () => {
    console.log("handleNewGame");
    axios.post(base_api_uri + "/api/game", {
      chatId: appContext.userInfo.chatId,
      passed: 0
    });
    appContext.setPanelState(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center bg-[#161616] bg-opacity-70 z-50 select-none"
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <img src={victory} className=""></img>
          <img src={cup} className="mt-[-30px] mb-[-70px] ml-2 z-50"></img>
          <div className="flex flex-col items-center justify-center border border-[#FCD80AFF] rounded-full w-[224px] h-[224px] text-white bg-[#161616] bg-opacity-70 backdrop-blur-sm">
            <label className="text-[20px] font-bold select-none">You earned:</label>
            <label className="text-[#FCD80AFF] font-bold text-[40px]">
              {rewardPoints}
            </label>
            <label className="text-[20px] font-bold">Cheese Points</label>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-12">
          <PriceWidget />
          <CustomButton
            text={"New Game"}
            onClick={handleNewGame}
            disabled={false}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WinPanel;
