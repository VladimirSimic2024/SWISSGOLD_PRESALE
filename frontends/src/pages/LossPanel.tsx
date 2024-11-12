import failed from "../assets/failed.png";
import PriceWidget from "../components/PriceWidget";
import CustomButton from "../components/CustomButton";
import { AppContext } from "../App";
import { useContext } from "react";
import { motion } from "framer-motion";
import { base_api_uri } from "../config";
import axios from "axios";

const LossPanel = () => {
  const appContext: any = useContext(AppContext);

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
      className="fixed left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center bg-[#161616] bg-opacity-70 z-50"
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center border border-[#D31900] rounded-full w-[224px] h-[224px] text-[#D31900] bg-[#161616] bg-opacity-70 backdrop-blur-lg">
          <img src={failed} className=""></img>
          <label className=" font-bold text-[30px] text-center">
            Wasn't Lucky
          </label>
          <label className="text-[30px] font-bold text-center">This Time</label>
        </div>

        <div className="flex flex-col items-center gap-4 mt-12">
          <PriceWidget />
          <CustomButton text={"New Game"} onClick={handleNewGame} disabled = {false} />
        </div>
      </div>
    </motion.div>
  );
};

export default LossPanel;
