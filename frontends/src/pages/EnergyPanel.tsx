import { motion } from "framer-motion";
import heart from "../assets/heart.png";
// import earn from "../assets/earn_energy.png";
import { useEffect, useState, useContext } from "react";
import { base_api_uri, delayTime } from "../config";
import { AppContext } from "../App";
import axios from "axios";

const EnergyPanel = () => {
  const appContext: any = useContext(AppContext);
  const [leftTime, setLeftTime] = useState(0);

  useEffect(() => {
    let chargeTime;
    axios
      .get(base_api_uri + "/api/game?chatId=" + appContext.userInfo.chatId)
      .then((result) => {
        chargeTime = result.data.data.chargeTime;
        console.log("chargeTime = ", chargeTime);
        console.log("now time1", new Date().getTime());
        if (chargeTime > 0) {
          const passtime = Number(new Date().getTime()) - chargeTime;
          console.log("passtime = ", passtime);
          setLeftTime(Math.round(delayTime - passtime / 1000));
        } else {
          axios.post(base_api_uri + "/api/game", {
            chatId: appContext.userInfo.chatId,
            chargeTime: new Date().getTime(),
          });
          setLeftTime(delayTime);
        }
      });

    const timer = setInterval(() => {
      setLeftTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (leftTime == 1) {
      appContext.setPanelState(0);
      axios.post(base_api_uri + "api/game", {
        chatId: appContext.userInfo.chatId,
        chargeTime: 0,
        energy: 10,
      });
      appContext.setUserEnergy(10);
    }
  }, [leftTime]);

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const formattedTime =
      `${h.toString().padStart(2, "0")}h ` +
      `${m.toString().padStart(2, "0")}min ` +
      `${s.toString().padStart(2, "0")}sec`;

    return formattedTime;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center bg-[#161616] bg-opacity-70 z-50 gap-4 font-poppins"
    >
      <div className="relative w-[41.8vw] flex flex-col items-center">
        <img src={heart} className="absolute left-[-20px] top-[1vh] z-50"></img>
        <label className="text-[#FCD80AFF] text-[1.2vh] font-semibold">
          Energy
        </label>
        <div className="relative flex items-center w-full h-[3vh] border border-[#FCD80AFF] rounded-full bg-gradient-to-r from-[#00ff00aa] to-[#00ff0011]">
          <label className="text-white z-30 w-full text-center text-semibold text-[1.74vh]">
            {formatTime(leftTime)}
          </label>
          <div
            className="bg-[#59FF00] h-full rounded-full absolute"
            style={{ width: `${(leftTime / delayTime) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-[2.5vh] text-[#E2CF00] font-extrabold text-center">
        Whoops, you’re out of energy!
      </div>

      <div className="rounded-md border border-[#E2CF00] bg-[#292929] text-white w-[80vw] h-[16vh] rounded-[29px] p-[20px] text-[2vh]">
        You should wait a bit for charging your energy.
      </div>
    </motion.div>
  );
};

export default EnergyPanel;
