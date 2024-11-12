import axios from "axios";
import { AppContext } from "../App";
import CustomButton from "../components/CustomButton";
import MainLogo from "../components/MainLogo";
import { useContext } from "react";
import { base_api_uri } from "../config";
import { useNavigate } from "react-router-dom";

const StartSubPage = () => {
  const appContext: any = useContext(AppContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    console.log('Lets GO clicked');
    const user = await axios.get(
      base_api_uri + "/api/user?chatId=" + appContext.userInfo.chatId
    );
    console.log("Tos viewed = ", user.data.data.status);
    if (user.data.data.status) {
      navigate("/main");
    } else {
      appContext.setPanelState(6);
    }
  };

  return (
    <div className="flex flex-col justify-center select-none">
      <MainLogo />
      <div className="flex flex-col mt-4">
        <div className="text-[#FFD900] text-[22.93px] font-semibold text-center select-none">
          Welcome to SwissGold!
        </div>
        <div className="text-white font-medium text-center select-none">
          Predict, Play, Win!
        </div>
      </div>
      <div className="flex justify-center mt-12 z-30">
        <CustomButton
          text={"Let's GO!"}
          onClick={handleClick}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default StartSubPage;
