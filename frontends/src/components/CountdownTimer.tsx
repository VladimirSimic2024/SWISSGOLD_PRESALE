import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { predictionTime } from "../config";

interface Props {
  onFinish: () => void;
  leftTime: number;
}

const CountdownTimer: React.FC<Props> = ({ onFinish, leftTime }) => {
  const [timeLeft, setTimeLeft] = useState(leftTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear interval on component unmount
    } else {
      onFinish();
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  const percentage = (timeLeft / predictionTime) * 100; // Calculate percentage for progress bar

  return (
    <div className="relative flex flex-col items-center w-[172px] h-[172px] bg-[#ACB5D9] bg-opacity-5 rounded-full backdrop-blur-sm select-none">
      <CircularProgressbar
        value={percentage}
        text={`${formattedTime}`}
        strokeWidth={4}
        styles={buildStyles({
          strokeLinecap: "butt",
          textSize: "30px",
          pathTransitionDuration: 0.5,
          pathColor: `rgba(0, 255, 136, 1)`, // Green bar decreasing in opacity
          textColor: "#fff",
          trailColor: `rgba(172, 181, 217, 0.1)`,
          backgroundColor: `rgba(172, 181, 217, 0.1)`,
        })}
      />
      <div className="absolute bottom-8 text-center text-white mt-2 text-[18px] font-medium font-poppins select-none">
        SEC
      </div>
    </div>
  );
};

export default CountdownTimer;
