import { AppContext } from "../App";
import StartSubPage from "./StartSubPage";
import TermsPanel from "./TermsPanel";
import { useContext } from "react";
import { motion } from "framer-motion";

const StartPage = () => {
  const appContext: any = useContext(AppContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative flex flex-col h-screen w-full bg-[#0E0E0E] px-[7%] py-20 overflow-hidden">
        <div
          className={`w-full h-full ${appContext.panelState == 6 ? "blur-sm" : ""}`}
        >
          <div className="absolute w-[50vw] h-[50vh] top-[50vh] left-0 bg-gradient-to-tr from-[#D8B33A] to-[#D8B33A00] opacity-60 blur-[100px]"></div>
          <StartSubPage />
        </div>
        {appContext.panelState == 6 ? <TermsPanel /> : <></>}
      </div>
    </motion.div>
  );
};

export default StartPage;
