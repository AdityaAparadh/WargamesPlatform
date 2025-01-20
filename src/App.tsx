// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/electron-vite.animate.svg";
import "./App.css";
import createTerminal from "./utils/createTerminal";
import runCommand from "./utils/runCommand";

function App() {
  const open_term = async () => {
    // Using runCommand
    const result = await runCommand("pwd");

    const path = result.stdout.trim();
    console.log("PATH: ", path);

    // Using createTerminal
    createTerminal(path);
  };

  return (
    <>
      <h1> Wargames: Metamorphosis 2k25 </h1>

      <button onClick={open_term}> Open Terminal </button>
    </>
  );
}

export default App;
