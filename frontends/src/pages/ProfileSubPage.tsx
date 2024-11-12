import line from "../assets/line.png";
import avatar from "../assets/avatar.png";
import coin_usd from "../assets/coin_1.png";
import { FaRegCopy } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import copy from "copy-to-clipboard";

import {
  useTonConnectUI,
  useTonWallet,
  useTonAddress,
} from "@tonconnect/ui-react";
import { AppContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { base_api_uri, bot_id } from "../config";

const ProfileSubPage = () => {
  const appContext: any = useContext(AppContext);
  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [referrals, setReferrals] = useState([]);
  const [jettonBalance, setJettonBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);

  const buyMore = () => {
    appContext.setMainState(3);
  };

  useEffect(() => {
    if (tonAddress) {
      setWalletAddress(tonAddress);
    } else {
      setWalletAddress('');
    }
  }, [tonAddress]);

  // // Get wallet address when connected
  useEffect(() => {
    // Get wallet address when connected
    tonConnectUI.onStatusChange(async (wallet) => {
      if (wallet) {
        console.log('connect');
      } else {
        setWalletAddress('');
      }
    });
  }, [tonConnectUI]);

  useEffect(() => {
    if (appContext.userInfo.chatId) {
      axios
        .get(
          base_api_uri +
          `/api/user?referredBy=${appContext.userInfo.chatId}`
        )
        .then((result) => {
          console.log("referral data = ", result.data.data);
          if (result.data.data && result.data.data.length > 0) {
            let total = 0;
            const filtered = result.data.data.map((item: any) => {
              if (item.wallet.length > 0) {
                total += Number(item.referralReward);
                return item;
              }
            });
            console.log("filtered referral data = ", filtered);
            setReferrals(filtered);
            setTotalPoints(total);
          }
        });

      axios
        .get(base_api_uri + "/api/user?chatId=" + appContext.userInfo.chatId)
        .then((result) => {
          console.log(" ProfileSubPage.tsx user data = ", result.data.data);
        });

      axios
        .get(base_api_uri + "/api/presale?chatId=" + appContext.userInfo.chatId)
        .then((result) => {
          console.log("ProfileSubPage.tsx presale info =", result.data.data);
          setJettonBalance(result.data.data.tokenAmount);
        })
        .catch((error) => {
          console.log("presale info error", error);
        });

      console.log("get referral");

      axios
        .get(
          base_api_uri + "/api/referral?chatId=" + appContext.userInfo.chatId
        )
        .then((result) => {
          console.log("ProfileSubPage.tsx referral code =", result.data.data);
          setReferralCode(
            "https://t.me/" +
            bot_id +
            "?start=ref" +
            result.data.data.referralCode
          );
        })
        .catch((error) => {
          console.log("get referral code error", error);
        });

      console.log("get referral 1");

      if (wallet) {
        // setWalletAddress(wallet.account.address);
        setWalletAddress(tonAddress);
      }
    }
  }, []);

  const handleCopy = async () => {
    // if (navigator.clipboard) {
    //   try {
    //     await navigator.clipboard.writeText(
    //       `t.me/${bot_id}/?start=${appContext.userInfo.chatId}`
    //     );
    //     setCopied(true);
    //     setTimeout(() => setCopied(false), 500); // Reset after 2 seconds
    //   } catch (error) {
    //     console.error("Failed to copy text: ", error);
    //   }
    // }
    try {
      copy(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (errr) {
      console.log("copy to clipborad error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative flex flex-col h-full w-full overflow-hidden">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center font-semibold">
            <div className="border border-[#BCAE43B0] rounded-full w-[53vw] p-1 bg-[#F0DC9B26] bg-opacity-15 backdrop-blur-[18.79px] drop-shadow-lg flex gap-2 items-center h-[4.4vh] overflow-hidden">
              <img src={avatar} className="h-[3vh]"></img>
              <label className="text-white text-[1.6vh] truncate">
                {wallet ? walletAddress : "Not Connected"}
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center font-semibold select-none">
            <div className="border border-[#BCAE43B0] rounded-full w-[53vw] p-2 bg-[#F0DC9B26] bg-opacity-15 backdrop-blur-[18.79px] drop-shadow-lg flex gap-2 items-center h-[4.4vh] overflow-hidden">
              <img src={coin_usd} className="h-[3vh]"></img>
              <label className="text-white text-[1.6vh]">
                SGOLD Balance : {wallet ? jettonBalance : 0}
              </label>
            </div>
            <label
              className="text-[#FFD900] text-[1.4vh]"
              onClick={() => buyMore()}
            >
              Buy More SGOLD
            </label>
          </div>
        </div>

        <img src={line} className="select-none h-[39px] mt-3"></img>

        <div className="mt-4 flex flex-col gap-2 font-semibold font-poppins">
          <div className="flex justify-between items-center">
            <label className="text-white ml-1 text-[1.75vh] select-none">
              Referral Link
            </label>
          </div>

          <div className="flex justify-between border border-[#BCAE43B0] rounded-[20px] h-[5.76vh] px-[10px] items-center">
            <label className="text-[#FFD900] text-[1.6vh] truncate">
              {referralCode}
            </label>
            <div>
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mx-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#BCAE43B0"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <FaRegCopy
                  className="w-5 h-5 transition duration-100 ease-in-out transform cursor-pointer active:scale-95 text-[#BCAE43B0]"
                  onClick={() => handleCopy()}
                />
              )}
            </div>
          </div>
          <label className="text-[#848484] font-medium text-[1.4vh] select-none">
            You’ll earn extra points by inviting friends
          </label>
        </div>

        <div className="text-white mt-4 flex flex-col gap-2 font-medium font-poppins">
          <div className="flex justify-between items-center">
            <label className="ml-1 text-[1.75vh] select-none">Friends List</label>
            <label className="text-[#FFD900] ml-1 text-[1.75vh] select-none">
              Total Earnings: {totalPoints} pts
            </label>
          </div>

          <div className="border border-[#BCAE43B0] rounded-[20.78px] p-4 pr-1 bg-[#161616] bg-opacity-[70%]">
            <div className="flex flex-col gap-4 h-[25vh] overflow-y-scroll overflow-x-hidden custom-scrollbar">
              {referrals &&
                referrals.map((referral: any, index: number) => (
                  <div className="flex gap-3 text-white items-center font-[14px]">
                    <label className="text-[1.6vh] w-[10vw] border border-l-[0px] border-t-[0px] border-b-[0px] border-r-[2px] border-[#8F9BBF33] text-center">
                      {index + 1}
                    </label>
                    <div className="flex items-center gap-8">
                      <img
                        src={referral.avatar}
                        className="h-[3.7vh] w-[3.7vh] rounded-full"
                      ></img>
                      <label className="text-[1.6vh]">{referral.wallet}</label>
                      <label className="text-[#FFD900] text-[1.6vh] w-[40px]">+{Number(referral.referralReward)} pts</label>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSubPage;
