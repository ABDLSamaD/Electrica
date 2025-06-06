import React, { useEffect, useState } from "react";
import Main from "./Components/Main";
import OfflineScreen from "./Components/OtherComponents/OfflineScreen";
import IntroOverlay from "./Components/Pages/Intro";

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <>
      {isOnline ? (
        <>
          {showIntro && <IntroOverlay onFinish={() => setShowIntro(false)} />}
          {!showIntro && <Main />}
        </>
      ) : (
        <OfflineScreen />
      )}
    </>
  );
};

export default App;
