import React, { useRef } from "react";
import LoadingBar from "react-top-loading-bar";

const TopLoadingBar = ({ isLoading }) => {
  const ref = useRef(null);

  React.useEffect(() => {
    if (isLoading) {
      ref.current.continuousStart(); // Starts the loading animation
    } else {
      ref.current.complete(); // Completes and hides the loading bar
    }
  }, [isLoading]);

  return (
    <LoadingBar
      color="linear-gradient(to right, #4caf50, #2196f3)"
      height={4}
      shadow={true}
      ref={ref}
    />
  );
};

export default TopLoadingBar;
