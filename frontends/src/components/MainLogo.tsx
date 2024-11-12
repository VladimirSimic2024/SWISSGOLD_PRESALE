import start_logo from "../assets/start_logo.png";
import up_arrow from "../assets/up_arrow.png";
import down_arrow from "../assets/down_arrow.png";
import coin from "../assets/coin.png";

export const MainLogo = () => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <img src={start_logo} className="h-[43vh] z-10"></img>
      <div className="absolute top-[14vh] flex justify-center gap-[13vh] ml-[20px]">
        <img src={down_arrow} className="h-[5vh] z-20"></img>
        <img src={up_arrow} className="h-[5vh] z-20"></img>
      </div>
      <div className="absolute top-[25vh] flex justify-center gap-[170px] ml-[20px]">
        <img
          src={coin}
          className="h-[7vh] blur-sm mb-[20px] animate-coin-down"
        ></img>
        <img src={coin} className="h-[8vh] z-30 animate-coin-up"></img>
      </div>
    </div>
  );
};

export default MainLogo;
