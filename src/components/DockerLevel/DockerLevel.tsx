import React, { useState } from 'react';
import Topbar from "./Topbar";
import Console from "./Console";
import Tools from "./Tools";
import CheatsheetModal from "./CheatsheetModal";
import { usePage } from "../../hooks/usePage";
import { cleanupLevel, restartLevel, currentLevel } from "../../utils/levelLoader";
import { useAuth } from "../../hooks/useAuth"; 
import "./Term.css"

const DockerLevel: React.FC = () => {
  const { setCurrentPage } = usePage();
  const { token } = useAuth(); 
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);

  const handleEnter = (input: string) => {
    console.log("User Input:", input);
  };

  const handleBack = () => {
    cleanupLevel(currentLevel, token, setCurrentPage);
  };

  const handleReset = () => {
    restartLevel(currentLevel, token, setCurrentPage);
  };
  
  const handleCheatsheet = () => {
    setIsCheatsheetOpen(true);
  };

  const handleCloseCheatsheet = () => {
    setIsCheatsheetOpen(false);
  };

  return (
    <div className="docker-level-container bg-gradient-to-b from-navy-900 to-navy-700 text-white">
      <Topbar levelName="Docker Level" onEnter={handleEnter} />
      <main className="docker-level-main">
        <div className="terminal-container">
          <Console />
        </div>
        <div className="tools-container">
          <Tools onBack={handleBack} onReset={handleReset} onCheatsheet={handleCheatsheet} />
        </div>
      </main>
      <CheatsheetModal isOpen={isCheatsheetOpen} onClose={handleCloseCheatsheet} />
    </div>
  );
};

export default DockerLevel;

