import { useEffect, useState, useCallback } from 'react';
import { usePage } from '../../hooks/usePage';
import DebugCheckList from './components/DebugCheckList';
import './styles.css';

const DebugPage = () => {
  const { setCurrentPage } = usePage();
  const [allChecksComplete, setAllChecksComplete] = useState(false);
  const [isRechecking, setIsRechecking] = useState(false);
  const bgImagePath = process.env.NODE_ENV === "production" ? "bg.png" : "/public/bg.png";

  // When all checks are complete, navigate to login page after delay
  useEffect(() => {
    if (allChecksComplete) {
      const timer = setTimeout(() => {
        setCurrentPage('LoginPage');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [allChecksComplete, setCurrentPage]);

  // Handlers for buttons
  const handleRecheck = useCallback(() => {
    setIsRechecking(true);
    setTimeout(() => setIsRechecking(false), 100);
    setAllChecksComplete(false);
  }, []);

  const handleContinueAnyway = useCallback(() => {
    setCurrentPage('LoginPage');
  }, [setCurrentPage]);

  return (
    <div className="debug-page-container">
      {/* Same background image as LoginPage */}
      <img src={bgImagePath} className="w-screen h-screen" style={{ position: 'absolute', zIndex: 10, objectFit: 'cover' }} />
      
      {/* Black overlay to darken the background */}
      <div className="black-overlay"></div>
      
      {/* Decorative glowing effects */}
      <div className="glow-effect" style={{ top: '20%', left: '20%' }}></div>
      <div className="glow-effect" style={{ bottom: '30%', right: '10%' }}></div>
      
      <div className="debug-content">
        <h1>SYSTEM DIAGNOSTICS</h1>
        <div className="debug-description">
          <p>Initializing environment checks...</p>
        </div>
        
        {/* Key will force re-render when isRechecking changes */}
        <DebugCheckList 
          key={isRechecking ? 'rechecking' : 'initial'} 
          onAllChecksComplete={() => setAllChecksComplete(true)} 
        />
        
        {allChecksComplete ? (
          <div className="all-checks-passed">
            <p>All systems operational. Launching application...</p>
          </div>
        ) : (
          <div className="debug-actions">
            <button className="debug-button recheck-button" onClick={handleRecheck}>
              <span className="button-icon">⟳</span> Recheck
            </button>
            <button className="debug-button continue-button" onClick={handleContinueAnyway}>
              <span className="button-icon">→</span> Continue Anyway
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPage;
