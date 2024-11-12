import home from "../assets/home.png";
import profile from "../assets/profile.png";
import coin from "../assets/coin_nav.png";
import { AppContext } from "../App";
import { useContext } from "react";

const Navbar = () => {
  const appContext: any = useContext(AppContext);

  const onClickProfile = () => {
    appContext.setMainState(1); // profile
  };

  const onClickHome = () => {
    appContext.setMainState(2); // home
  };

  const onClickSGOLD = () => {
    appContext.setMainState(3); // game
  };

  return (
    <div className="w-full z-30 select-none mb-4">
      <div className="border border-[#E2CF00] bg-[#292929] h-[9vh] rounded-full flex justify-around text-[#9F9F9F] z-30">
        <div
          className="flex flex-col items-center justify-center select-none"
          onClick={() => onClickProfile()}
        >
          <img src={profile} className="w-[8vw]"></img>
          <label
            className={`${
              appContext.mainState == 0 || appContext.mainState == 1
                ? "text-[#FFEA00]"
                : ""
            } font-bold text-[1.2vh]`}
          >
            Profile
          </label>
        </div>

        <div
          className="flex flex-col items-center justify-center select-none"
          onClick={() => onClickHome()}
        >
          <img src={home} className="w-[8vw]"></img>
          <label
            className={`${
              appContext.mainState == 2 ? "text-[#FFEA00]" : ""
            } font-bold text-[1.2vh]`}
          >
            Home
          </label>
        </div>

        <div
          className="flex flex-col items-center justify-center select-none"
          onClick={() => {
            onClickSGOLD();
          }}
        >
          <img src={coin} className="w-[8vw]"></img>
          <label
            className={`${
              appContext.mainState == 3 ? "text-[#FFEA00]" : ""
            } font-bold text-[1.2vh]`}
          >
            SGOLD
          </label>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
