import React, { useEffect, useState } from 'react';

// Add a separate CSS file for modal styles
import './GameModal.css';

interface GameModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ message, isOpen, onClose }) => {
  // Add auto-close after a short period to prevent users from getting stuck
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Handle key events including pressing Enter or Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault(); // Prevent default behavior
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="game-modal-overlay">
      <div className="game-modal-container">
        <div className="game-modal-content">
          <p className="game-modal-message">{message}</p>
          <button className="game-modal-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
