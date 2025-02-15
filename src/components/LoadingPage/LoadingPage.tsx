import { useState, useEffect } from "react";
import "./LoadingPage.css";

// Ensure the gif file is available at the specified path.
const gifSrc = "public/loading.gif";

const messages = [
  "Pulling Images",
  "Setting up level",
  "Setting up containers"
];

const LoadingPage = () => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`loading-container ${isVisible ? 'visible' : ''}`}>
      <img
        src={gifSrc}
        alt="Loading animation"
        className="loading-gif fade-in"
      />
      <h1 key={index} className="loading-text">
        {messages[index]}
      </h1>
    </div>
  );
};

export default LoadingPage;