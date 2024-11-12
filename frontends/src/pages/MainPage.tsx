import { AppContext } from "../App";
import Navbar from "../components/Navbar";
import PresaleWidget from "../components/PresaleWidget";
import { useContext } from "react";
import ProfileSubPage from "./ProfileSubPage";
import PlaySubPage from "./PlaySubPage";
import PredictionDownPanel from "./PredictionDownPanel";
import PredictionUpPanel from "./PredictionUpPanel";
import WinPanel from "./WinPanel";
import LossPanel from "./LossPanel";
import EnergyPanel from "./EnergyPanel";
import LoadingPanel from "./LoadingPanel";
import MarketClose from "./MarketClose";

const MainPage = () => {
  const appContext: any = useContext(AppContext);

  return (
    <div className="relative w-screen h-screen bg-[#0E0E0E] overflow-hidden overflow-y-auto">
      <div
        className={`w-screen h-screen px-[27px] flex flex-col gap-2 pt-[15vh] ${
          appContext.panelState > 0 ? "blur-sm" : ""
        }`}
      >
        <div className="absolute w-[50vw] h-[50vh] top-[50vh] left-0 bg-gradient-to-tr from-[#D8B33A] to-[#D8B33A00] opacity-60 blur-[100px] z-0"></div>

        {/* {appContext.mainState == 0 ? <PresaleWidget /> : <></>} */}
        {appContext.mainState == 1 ? <ProfileSubPage /> : <></>}
        {appContext.mainState == 2 ? <PlaySubPage /> : <></>}
        {appContext.mainState == 3 ? <PresaleWidget /> : <></>}

        <div className="w-full flex justify-center">
          {appContext.panelState == 0 ? <Navbar /> : <></>}
        </div>
      </div>

      {appContext.panelState == 1 ? <PredictionUpPanel /> : <></>}
      {appContext.panelState == 2 ? <PredictionDownPanel /> : <></>}
      {appContext.panelState == 3 ? <WinPanel /> : <></>}
      {appContext.panelState == 4 ? <LossPanel /> : <></>}
      {appContext.panelState == 5 ? <EnergyPanel /> : <></>}
      {appContext.panelState == 6 ? <LoadingPanel /> : <></>}
      {appContext.panelState == 7 ? <MarketClose /> : <></>}
    </div>
  );
};

export default MainPage;
