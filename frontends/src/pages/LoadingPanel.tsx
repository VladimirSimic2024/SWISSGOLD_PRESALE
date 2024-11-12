import { motion } from "framer-motion";
import SniperIcon from "../components/SniperIcon";

const LoadingPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center bg-[#161616] bg-opacity-70 z-50"
    >
      <SniperIcon />
    </motion.div>
  );
};

export default LoadingPanel;
