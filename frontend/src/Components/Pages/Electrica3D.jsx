import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import * as THREE from "three";
import "../../styles.css"

const Electrica3D = () => {
  const [votes, setVotes] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const boxRef = useRef();
  const paperRef = useRef();

  // Ballot box and paper animation
  useFrame(() => {
    if (isAnimating) {
      paperRef.current.position.y -= 0.1; // Move paper down into the box
      if (paperRef.current.position.y < -1) {
        setIsAnimating(false);
        paperRef.current.position.y = 1; // Reset paper position
      }
    }
  });

  const handleVote = () => {
    setVotes((prevVotes) => prevVotes + 1);
    setIsAnimating(true);
  };

  return (
    <div
      className="vote-container"
      style={{ position: "relative", height: "400px" }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Ballot Box */}
        <Box ref={boxRef} position={[0, 0, 0]} args={[2, 3, 2]}>
          <meshStandardMaterial color={"#007BFF"} />
        </Box>

        {/* Animated Ballot Paper */}
        <Box ref={paperRef} position={[0, 1, 0]} args={[0.5, 0.5, 0.1]}>
          <meshStandardMaterial color={"#FFF"} />
        </Box>

        <OrbitControls />
      </Canvas>

      {/* Vote Button */}
      <div className="vote-button">
        <button onClick={handleVote} className="vote-btn">
          Cast Vote
        </button>
      </div>

      {/* Vote Count */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          color: "#fff",
        }}
      >
        <h3>Votes: {votes}</h3>
      </div>
    </div>
  );
};

export default Electrica3D;
