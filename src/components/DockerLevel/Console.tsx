import type React from "react"
import { useEffect, useRef } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { FiInfo } from "react-icons/fi"
import "xterm/css/xterm.css"
import { FaFlag } from "react-icons/fa"
import { currentRunScript, currentLevel, currentLevelName } from "../../utils/levelLoader"
// import { useConfig } from "../../hooks/useConfig"
// import DockerLevels from "../../../levels/DockerLevels.json"

const Console: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const term = useRef<Terminal | null>(null)
  // const { current_docker_level } = useConfig()

  useEffect(() => {
    const initializeTerminal = async () => {
      if (!terminalRef.current || term.current) return;
      
      const { ipcRenderer } = window as any;
      if (!ipcRenderer) {
        console.error('IPC renderer not available');
        return;
      }

      term.current = new Terminal({
        cursorBlink: true,
        theme: {
          background: "#1a2c4d",
          foreground: "#d0d0d0",
          cursor: "#ffffff",
          selectionBackground: "#3a5169",
          black: "#000000",
          red: "#ff5555",
          green: "#50fa7b",
          yellow: "#f1fa8c",
          blue: "#61afef",
          magenta: "#ff79c6",
          cyan: "#8be9fd",
          white: "#f8f8f2",
        },
      });

      const fitAddon = new FitAddon();
      term.current.loadAddon(fitAddon);

      const resizeTerminal = () => {
        if (!term.current) return;
        fitAddon.fit();
        term.current.resize(term.current.cols, term.current.rows);
      };

      window.addEventListener("resize", resizeTerminal);

      term.current.open(terminalRef.current);
      
      // Focus terminal on load to ensure it captures keypresses
      setTimeout(() => {
        term.current?.focus();
      }, 300);

      // Add global keydown listener to ensure spacebar works in terminal
      const handleGlobalKeydown = (e: KeyboardEvent) => {
        // If the terminal element is active/focused and the key is spacebar
        if (document.activeElement === terminalRef.current && e.key === " ") {
          e.preventDefault(); // Prevent default spacebar behavior (like scrolling)
          if (term.current) {
            // Send spacebar character to terminal
            ipcRenderer.send("terminal.keystroke", " ");
          }
        }
      };

      window.addEventListener('keydown', handleGlobalKeydown);

      // Add listener for terminal focus restoration
      const handleTerminalRefocus = () => {
        console.log("Restoring terminal focus");
        setTimeout(() => {
          if (term.current) {
            term.current.focus();
            // Additionally, send a dummy command to ensure the terminal is responsive
            if (ipcRenderer) {
              // Sometimes we need to re-trigger the terminal input
              ipcRenderer.send("terminal.refocus");
            }
          }
        }, 100);
      };

      window.addEventListener('restore-terminal-focus', handleTerminalRefocus);

      // Make sure to resize terminal after a short delay to ensure DOM is fully rendered
      setTimeout(() => {
        if (term.current) {
          const fitAddon = new FitAddon();
          term.current.loadAddon(fitAddon);
          fitAddon.fit();
          term.current.focus(); // Ensure focus after resize
        }
      }, 100);

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (currentRunScript) {
        console.log("Running commands:", currentRunScript);
        ipcRenderer.send("terminal.keystroke", "clear\r");
        
        // Execute the run commands directly
        const commands = currentRunScript.split('\n');
        for (const cmd of commands) {
          if (cmd.trim()) {
            ipcRenderer.send("terminal.keystroke", `${cmd}\r`);
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      const handleIncomingData = (_event: any, data: string) => {
        term.current?.write(data);
      };

      ipcRenderer.on("terminal.incomingData", handleIncomingData);

      term.current.onData((data) => {
        ipcRenderer.send("terminal.keystroke", data);
      });

      return () => {
        window.removeEventListener('keydown', handleGlobalKeydown);
        window.removeEventListener("resize", resizeTerminal);
        window.removeEventListener('restore-terminal-focus', handleTerminalRefocus);
        ipcRenderer.off("terminal.incomingData", handleIncomingData);
        term.current?.dispose();
        term.current = null;
      };
    };

    initializeTerminal();
  }, [currentRunScript]);

  // Add a direct method to focus the terminal that can be called from outside
  useEffect(() => {
    // Expose a global method to focus the terminal
    (window as any).focusTerminal = () => {
      if (term.current) {
        term.current.focus();
      }
    };
    
    return () => {
      delete (window as any).focusTerminal;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-navy-600 shadow-lg terminal-wrapper">
      <div className="p-2 flex items-center justify-between bg-navy-800">
        <div className="flex items-center space-x-2">
          <FaFlag className="text-2xl text-blue-400" />
          <span className="text-lg font-semibold text-white">
            Level {currentLevel}: {currentLevelName || 'Unknown Level'}
          </span>
        </div>
        <div className="relative group">
          <FiInfo className="text-xl text-blue-400 cursor-pointer" />
          <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-72 bg-navy-700 text-white text-xs p-3 rounded shadow-lg z-10">
            Use the docker commands you learned in the console below to find the flag for this level. Then submit it
            above.
          </div>
        </div>
      </div>
      <div 
        className="terminal-content flex-grow" 
        onClick={() => term.current?.focus()} // Focus terminal on click
      >
        <div 
          ref={terminalRef} 
          className="h-full bg-navy-900 text-white"
          tabIndex={0} // Make div focusable
          onFocus={() => term.current?.focus()} // Ensure xterm gets focus
        />
      </div>
    </div>
  )
}

export default Console


