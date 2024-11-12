import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import StartPage from "./pages/StartPage";
import { createContext, useEffect, useState } from "react";
import MainPage from "./pages/MainPage";
import Header from "./components/Header";
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { base_api_uri, predictionTime } from "./config";
import axios from "axios";

export const AppContext = createContext({});

function App() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [mainState, setMainState] = useState(3);
  const [panelState, setPanelState] = useState(0);
  const [userInfo, setUserInfo] = useState<any>();
  const [point, setUserPoints] = useState(0);
  const [energy, setUserEnergy] = useState(0);
  const [leftTime, setLeftTime] = useState(predictionTime);
  const [startPrice, setStartPrice] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(
      (window as any).Telegram.WebApp.initData
    );
    const user = params.get("user");
    if (user) {
      console.log("User info: ", JSON.parse(user));
      setUserInfo({
        userName: JSON.parse(user).username,
        chatId: JSON.parse(user).id
      });

      console.log("send user");
      axios
        .get(base_api_uri + "/api/game?chatId=" + JSON.parse(user).id)
        .then((result) => {
          console.log("game info result = ", result.data.data);
          setUserEnergy(result.data.data.energy);
          setUserPoints(result.data.data.point);
        })
        .catch((error) => {
          console.log("send user error: ", error);
        });
      console.log("send user 1");
    }
  }, []);

  return (
    <TonConnectUIProvider
      manifestUrl="https://sgold.io/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
    >
      <AppContext.Provider
        value={{
          showNavbar,
          setShowNavbar,
          mainState,
          setMainState,
          panelState,
          setPanelState,
          userInfo,
          energy,
          setUserEnergy,
          point,
          setUserPoints,
          leftTime,
          setLeftTime,
          startPrice,
          setStartPrice
        }}
      >
        <div className="w-screen h-screen">
          <Router>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/main" element={<MainPage />} />
            </Routes>
          </Router>
          <div
            className={`fixed top-0 w-full z-40 ${
              panelState > 0 ? "blur-sm" : ""
            }`}
          >
            <Header></Header>
          </div>
        </div>
      </AppContext.Provider>
    </TonConnectUIProvider>
  );
}

export default App;
