import React, { useEffect, useState } from "react";
import Main from "./Components/mainComponent";
// import AnimatedIntro from "./Components/Pages/AnimatedIntro";

const App = () => {
  // const [showIntro, setShowIntro] = useState(true);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowIntro(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);
  // return <>{showIntro ? <AnimatedIntro /> : <Main />}</>;
  return <Main />;
};

export default App;
