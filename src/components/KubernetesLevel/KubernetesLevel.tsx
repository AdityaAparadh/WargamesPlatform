import { useState } from "react";
import { usePage } from "../../hooks/usePage";
import { useAuth } from "../../hooks/useAuth";
import { useConfig } from "../../hooks/useConfig";
import { IoTrophy } from "react-icons/io5";
import { LuShell } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { FaDocker } from "react-icons/fa";
import "./KubernetesLevel.css";

const KubernetesLevel = () => {
  const { setCurrentPage } = usePage();
  const { username, clearAuth } = useAuth();
  const { current_score, current_rank } = useConfig();
  const [selectedOption, setSelectedOption] = useState("");

  const handleLogout = () => {
    clearAuth();
    setCurrentPage('LoginPage');
  };

  const handleDockerClick = () => {
    setCurrentPage('MainPage');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle quiz submission logic here
  };

  return (
    <div className="kubernetes-container">
      <img src='public/bg.png' className='background-image' />
      
      <div className="ui-layer">
        <div className="top-bar">
          <div className="stats-section">
            <div className="stat-item">
              <IoTrophy className="stat-icon" />
              <span>{current_rank}</span>
            </div>
            <div className="stat-item">
              <LuShell className="stat-icon" />
              <span>Score: {current_score}</span>
            </div>
          </div>
          <div className="user-section">
            <span className="user-email">{username}</span>
            <button onClick={handleLogout} className="logout-button">
              <FiLogOut className="button-icon" />
              Logout
            </button>
          </div>
        </div>

        <div className="quiz-container">
          <div className="quiz-content">
            <h2>Kubernetes Quiz</h2>
            
            <div className="question-container">
              <p>What is the primary purpose of Kubernetes?</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="options-container">
                {[
                  "Container orchestration",
                  "Database management",
                  "Frontend development",
                  "Network security"
                ].map((option, index) => (
                  <label key={index} className="option-label">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedOption === option}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>

              <button type="submit" className="submit-button">
                Submit Answer
              </button>
            </form>
          </div>
        </div>

        <button
          onClick={handleDockerClick}
          className="docker-button"
        >
          <FaDocker className="docker-logo" />
        </button>
      </div>
    </div>
  );
};

export default KubernetesLevel;
