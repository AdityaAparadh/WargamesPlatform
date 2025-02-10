import { useState, useEffect } from "react";
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/electron-vite.animate.svg";
import "./App.css";
// import DockerLevel from "./components/DockerLevel/DockerLevel";
// import createTerminal from "./utils/createTerminal";
// import runCommand from "./utils/runCommand";
import Game from "./components/MainPage/Game";
import DockerLevel from "./components/DockerLevel/DockerLevel";

function App() {
  // State to track whether the terminal (DockerLevel) should be shown
  const [showDocker, setShowDocker] = useState(false);

  useEffect(() => {
    const handleTerminalTrigger = (e: CustomEvent) => {
      console.log("Terminal trigger event received:", e.detail);
      setShowDocker(true);
    };
    // Add listener for the custom event dispatched from Level.js
    window.addEventListener("terminal-trigger", handleTerminalTrigger as EventListener);
    return () => {
      window.removeEventListener("terminal-trigger", handleTerminalTrigger as EventListener);
    };
  }, []);

  // const open_term = async () => {
  //   // Using runCommand
  //   const result = await runCommand("pwd");

  //   const path = result.stdout.trim();
  //   console.log("PATH: ", path);

  //   // Using createTerminal
  //   createTerminal(path);
  // };

  return (
    <>
      {/* <h1 className> Wargames: Metamorphosis 2k25 </h1> */}

      {showDocker ? (
        // Pass the onBack callback so DockerLevel can call it (for example, via a "Back" button)
        <DockerLevel onBack={() => setShowDocker(false)} />
      ) : (
        <Game />
      )}
      {/* <button onClick={open_term}> Open Terminal </button> */}
    </>
  );
}

export default App;
