const LoadingScreen = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "30vh",
        position: "absolute",
        top: "4rem",
        left: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="loader"></div>
    </div>
  );
};

export default LoadingScreen;
