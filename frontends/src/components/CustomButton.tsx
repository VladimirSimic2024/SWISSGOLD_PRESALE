import React from "react";
import yellow from "../assets/yellowbutton.png";

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <div
      className="relative flex flex-col items-center select-none z-10"
      onClick={!disabled ? () => onClick() : () => {}}
    >
      <img src={yellow} className="h-[50px] select-none"></img>
      <label className="absolute top-[10px] font-semibold text-[16px] font-inter text-black select-none">
        {text}
      </label>
    </div>
  );
};

export default CustomButton;
