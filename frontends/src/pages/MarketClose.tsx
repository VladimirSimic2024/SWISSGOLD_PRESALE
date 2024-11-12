import CustomButton from "../components/CustomButton";
import { motion } from "framer-motion";
import { AppContext } from "../App";
import { useContext } from "react";
import marketclose from "../assets/markettime.png";

const MarketClose = () => {
  const appContext: any = useContext(AppContext);

  const handleBack = () => {
    console.log("MarketClose, handleBack");
    appContext.setPanelState(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed left-0 right-0 top-0 bottom-0 flex flex-col justify-center items-center bg-[#0E0E0E] bg-opacity-90 w-full h-full z-50"
    >
      <div className="flex flex-col items-center p-8 gap-2">
        <label className="text-[#E2CF00] font-extrabold text-[26px] font-poppins select-none">
          The Market is Closed!
        </label>

        <div className="flex flex-col border border-[#E2CF00] bg-[#292929] text-white p-6 rounded-[29.12px] font-poppins max-w-[400px] select-none">
          <p>
            Sorry! The market is closed on Saturday & Sundays. You can come back
            later.
          </p>
          <img src={marketclose} className="w-[70vw] h-[70vw]"></img>
        </div>

        <button className={`w-full mt-2`}>
          <CustomButton text={"Back"} onClick={handleBack} disabled={false} />
        </button>
      </div>
    </motion.div>
  );
};

export default MarketClose;
