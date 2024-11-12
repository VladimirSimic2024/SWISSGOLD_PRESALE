import CustomButton from "../components/CustomButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../App";
import { useContext, useState } from "react";
import axios from "axios";
import { base_api_uri } from "../config";

const TermsPanel = () => {
  const appContext: any = useContext(AppContext);

  const navigate = useNavigate();
  const handleContinue = () => {
    console.log("TermsPanel, handleContinue");
    axios.post(base_api_uri + "/api/user/acceptterms", {
      chatId: appContext.userInfo.chatId,
      status: true,
    });
    appContext.setPanelState(0);
    navigate("/main");
  };

  const [checked, setChecked] = useState(false);

  const onChange = () => {
    setChecked((prev: boolean) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center bg-[#0E0E0E] bg-opacity-90 w-full h-full"
    >
      <div className="flex flex-col items-center p-8 gap-2">
        <label className="text-[#E2CF00] font-extrabold text-[26px] font-poppins select-none">
          Terms and Conditions
        </label>

        <div className="border border-[#E2CF00] bg-[#292929] text-white p-6 rounded-[29.12px] font-poppins max-w-[400px] select-none">
          By participating in the SGOLD presale, you acknowledge the exciting
          potential rewards while accepting the inherent risks, understanding
          that market conditions can fluctuate. Your decision to purchase
          confirms that you have reviewed and agree to our terms, and are ready
          to embark on this unique opportunity.
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="checkbox checkbox-warning border-[#E2CF00] "
          />
          <div className="text-[15px] select-none">
            <label className="text-gray-500">I agree with the </label>
            <label className="text-[#E2CF00]">Terms and Conditions</label>
          </div>
        </div>
        <button
          className={`w-full ${checked ? "opacity-100" : "opacity-50"}`}
          disabled={checked ? false : true}
        >
          <CustomButton
            text={"Continue"}
            onClick={handleContinue}
            disabled={false}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default TermsPanel;
