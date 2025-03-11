import { useState, useEffect } from "react";
import { usePage } from "../../hooks/usePage";
import { useAuth } from "../../hooks/useAuth";
import { useConfig } from "../../hooks/useConfig";
import { IoTrophy } from "react-icons/io5";
import { LuShell } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { FaDocker } from "react-icons/fa";
import { FaFlag } from "react-icons/fa6";
import config from "../../../config.json";
import ReactConfetti from "react-confetti";
import "./KubernetesLevel.css";
import axios from "axios";

interface QuizQuestion {
  question: string;
  options: string[];
  question_number: number;
}

const KubernetesLevel = () => {
  const { setCurrentPage } = usePage();
  const { username, clearAuth, token } = useAuth();
  const {
    current_score,
    current_rank,
    current_kube_level,
    setCurrentKubeLevel,
    setCurrentScore,
  } = useConfig();
  const [selectedOption, setSelectedOption] = useState("");
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string>("");

  const bgImagePath =
    process.env.NODE_ENV === "production" ? "bg.png" : "/public/bg.png";
  const handleLogout = () => {
    clearAuth();
    setCurrentPage("LoginPage");
  };

  const handleDockerClick = () => {
    setCurrentPage("MainPage");
  };

  const fetchQuestion = async (level: number) => {
    if (level > config.MAX_KUBES_LEVEL) {
      setQuestion(null);
      return;
    }
    try {
      const response = await fetch(`${config.BACKEND_URI}/level/getQuizLevel`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 401) {
        clearAuth();
        setCurrentPage("LoginPage");
        return;
      }

      const data = await response.json();
      setQuestion(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch question");
    }
  };

  useEffect(() => {
    fetchQuestion(current_kube_level);
  }, [current_kube_level]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;

    try {
      const optionIndex = question?.options.indexOf(selectedOption) ?? -1;
      if (optionIndex === -1) return;

      const response = await fetch(
        `${config.BACKEND_URI}/level/submitQuizAnswer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            currentLevel: current_kube_level,
            answer: optionIndex + 1,
          }),
        },
      );

      if (response.status === 401) {
        clearAuth();
        setCurrentPage("LoginPage");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setShowConfetti(true);
        setCurrentScore(data.totalScore);

      await axios.get(
        config.BACKEND_URI + "/info/updateLeaderboard", 
        { headers: { Authorization: `${token}` }}
      )

      } else {
        setError("Incorrect answer!");
      }

      // Always move to next question after 2 seconds
      setTimeout(() => {
        setShowConfetti(false);
        setError("");
        setSelectedOption("");
        setCurrentKubeLevel(current_kube_level + 1);
      }, 2000);
    } catch (err) {
      setError("Failed to submit answer");
    }
  };

  return (
    <div className="kubernetes-container">
      {showConfetti && <ReactConfetti />}
      <img src={bgImagePath} className="background-image" />

      <div className="ui-layer">
        <div className="top-bar">
          <div className="stats-section">
            <div className="stat-item">
              <IoTrophy className="stat-icon" />
              <span>{current_rank == 0 ? "?" : current_rank}</span>
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
            <h2>Technozion CTF Quiz</h2>

            {current_kube_level > config.MAX_KUBES_LEVEL ? (
              <div className="completion-message">
                <h3>🎉 Congratulations! 🎉</h3>
                <p>You have completed all Quiz questions!</p>
                {/* <p>Final Score: {current_score}</p> */}
              </div>
            ) : (
              <>
                <div className="question-container">
                  {error ? (
                    <p className="error-message">{error}</p>
                  ) : (
                    <p>{question?.question ?? "Loading..."}</p>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="options-container">
                    {question && question.options ? (
                      question.options.map((option, index) => (
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
                      ))
                    ) : (
                      <p>Loading options...</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={!question || !selectedOption}
                  >
                    Submit Answer
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <button onClick={handleDockerClick} className="docker-button">
          <FaFlag className="docker-logo" />
        </button>
      </div>
    </div>
  );
};

export default KubernetesLevel;
