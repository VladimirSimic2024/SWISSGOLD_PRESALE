import line from "../assets/line.png";
import swissgold from "../assets/swissgold.png";
import ConnectButton from "./ConnectButton";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col w-full h-[15vh] justify-center bg-[#0E0E0E] px-[7%] pt-[2vh]"
    >
      <div className="flex w-full justify-between items-center select-none">
        <img src={swissgold} className="h-[5vh] select-none"></img>
        <ConnectButton />
      </div>

      <img src={line} className="h-[39px] select-none"></img>
    </motion.div>
  );
};

export default Header;
