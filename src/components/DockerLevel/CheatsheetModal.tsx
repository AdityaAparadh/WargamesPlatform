import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import './CheatsheetModal.css';

interface CheatsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheatsheetModal: React.FC<CheatsheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="cheatsheet-modal-overlay">
      <div className="cheatsheet-modal">
        <div className="cheatsheet-modal-header">
          <h2>Command Cheatsheet</h2>
          <button onClick={onClose} className="close-button">
            <IoCloseSharp />
          </button>
        </div>
        
        <div className="cheatsheet-modal-content">
          <div className="cheatsheet-section">
            <h3>Basic Navigation</h3>
            <ul>
              <li><span className="command">ls</span> - List files in current directory</li>
              <li><span className="command">ls -la</span> - List all files (including hidden) with details</li>
              <li><span className="command">cd directory</span> - Change to specified directory</li>
              <li><span className="command">cd ..</span> - Move up one directory</li>
              <li><span className="command">cd ~</span> - Change to home directory</li>
              <li><span className="command">pwd</span> - Print working directory</li>
            </ul>
          </div>

          <div className="cheatsheet-section">
            <h3>File Operations</h3>
            <ul>
              <li><span className="command">cat file</span> - Display file contents</li>
              <li><span className="command">touch file</span> - Create empty file</li>
              <li><span className="command">mkdir dir</span> - Create directory</li>
              <li><span className="command">rm file</span> - Remove file</li>
              <li><span className="command">rm -rf dir</span> - Remove directory and contents</li>
            </ul>
          </div>

          <div className="cheatsheet-section">
            <h3>Terminal Keybindings</h3>
            <ul>
              <li><span className="command">Ctrl + Insert</span> - Copy selected text</li>
              <li><span className="command">Shift + Insert</span> or <span className="command">Ctrl + Shift + V</span> - Paste text</li>
              <li><span className="command">Ctrl + C</span> - Cancel current command</li>
              <li><span className="command">Ctrl + L</span> - Clear screen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheatsheetModal;
