import type React from "react"
import { useEffect, useRef } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { FiInfo } from "react-icons/fi"
import "xterm/css/xterm.css"
import { FaFlag } from "react-icons/fa"
import { currentRunScript, currentLevel, currentLevelName } from "../../utils/levelLoader"

const Console: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null)
  const term = useRef<Terminal | null>(null)

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
      
      // Focus terminal on load
      setTimeout(() => {
        term.current?.focus();
      }, 300);

      // Make sure to resize terminal after a short delay
      setTimeout(() => {
        if (term.current) {
          const fitAddon = new FitAddon();
          term.current.loadAddon(fitAddon);
          fitAddon.fit();
          term.current.focus();
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
        window.removeEventListener("resize", resizeTerminal);
        ipcRenderer.off("terminal.incomingData", handleIncomingData);
        term.current?.dispose();
        term.current = null;
      };
    };

    initializeTerminal();
  }, [currentRunScript]);

  // Add a direct method to focus the terminal
  useEffect(() => {
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
        onClick={() => term.current?.focus()}
      >
        <div 
          ref={terminalRef} 
          className="h-full bg-navy-900 text-white"
          tabIndex={0}
          onFocus={() => term.current?.focus()}
        />
      </div>
    </div>
  )
}

export default Console


