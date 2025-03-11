import React, { useEffect } from 'react';
import Topbar from "./Topbar";
import Console from "./Console";
import Tools from "./Tools";
import { usePage } from "../../hooks/usePage";
import { cleanupLevel, restartLevel, currentLevel } from "../../utils/levelLoader";
import { useAuth } from "../../hooks/useAuth"; 
import "./Term.css"

const DockerLevel: React.FC = () => {
  const { setCurrentPage } = usePage();
  const { token } = useAuth(); 

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
    console.log("Opening cheatsheet");
  };

  // Handle global keydown events with higher priority for spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Special handling for spacebar key
      if (e.key === " ") {
        // Check if we're in a terminal or if we need to handle differently
        const terminalElement = document.querySelector('.terminal-content');
        const terminalHasFocus = terminalElement && 
          (document.activeElement === terminalElement || 
           terminalElement.contains(document.activeElement));

        if (terminalHasFocus) {
          // Terminal has focus, let it handle the spacebar
          return;
        } else {
          // If we're not in the terminal but in the DockerLevel component,
          // and there's no active alert (dialogs steal focus), focus the terminal
          if (!document.querySelector('.alert-overlay')) { // Check if there's an alert overlay
            // Focus terminal programmatically
            (window as any).focusTerminal?.();
            e.preventDefault();
          }
        }
      }
    };

    // Use capture phase to get event before other handlers
    window.addEventListener('keydown', handleKeyDown, true);
    
    // Add event listener for alert close
    window.addEventListener('restore-terminal-focus', () => {
      (window as any).focusTerminal?.();
    });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('restore-terminal-focus', () => {});
    };
  }, []);

  return (
    <div className="docker-level-container bg-gradient-to-b from-navy-900 to-navy-700 text-white">
      <Topbar levelName="Docker Level" onEnter={handleEnter} />
      <main className="docker-level-main">
        <div 
          className="terminal-container"
          // Add special handler for spacebar
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.stopPropagation(); // Prevent event bubbling
            }
          }}
        >
          <Console />
        </div>
        <div className="tools-container">
          <Tools onBack={handleBack} onReset={handleReset} onCheatsheet={handleCheatsheet} />
        </div>
      </main>
    </div>
  );
};

export default DockerLevel;

