import React from 'react';
import Topbar from "./Topbar";
import Console from "./Console";
import Tools from "./Tools";
import { usePage } from "../../hooks/usePage";
import { cleanupLevel, restartLevel, currentLevel } from "../../utils/levelLoader";
import "./Term.css"
const DockerLevel: React.FC = () => {
  const { setCurrentPage } = usePage();

  const handleEnter = (input: string) => {
    console.log("User Input:", input);
  };

  const handleBack = () => {
    cleanupLevel(currentLevel, setCurrentPage);
  };

  const handleReset = () => {
    restartLevel(currentLevel, setCurrentPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-700 text-white flex flex-col">
      <Topbar levelName="Docker Level" onEnter={handleEnter} />
      <main className="flex-1 p-2 sm:p-4 bg-navy-800 bg-opacity-50 rounded-tl-lg rounded-tr-lg overflow-hidden flex flex-col">
        <div className="flex-grow overflow-auto">
          <Console />
        </div>
        <Tools onBack={handleBack} onReset={handleReset} />
      </main>
    </div>
  );
};

export default DockerLevel;

