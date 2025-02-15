import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config.json";
import { usePage } from "../../hooks/usePage";
import { useAuth } from "../../hooks/useAuth";
import { useConfig } from "../../hooks/useConfig";
import { FaArrowLeft } from "react-icons/fa";
import Vortex from "./Vortex.jsx"; // Add this import
import "./Leaderboard.css";

const Leaderboard = () => {
  const { setCurrentPage } = usePage();
  const { username } = useAuth();
  const { setCurrentRank } = useConfig();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isHidden, setIsHidden] = useState(false);

  // Generate placeholder data for hidden top 5
  const placeholderTop5 = [
    { username: "Hidden Player", score: 2500 },
    { username: "Hidden Player", score: 2300 },
    { username: "Hidden Player", score: 2100 },
    { username: "Hidden Player", score: 1900 },
    { username: "Hidden Player", score: 1700 },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URI}/api/leaderboard`);
        const { hidden, data } = response.data;
        setIsHidden(hidden);

        // If hidden, add placeholder data for top 5
        const displayData = hidden 
          ? [...placeholderTop5, ...data]
          : data;

        setLeaderboardData(displayData);

        // Update current user's rank
        if (username) {
          const userEntry = data.find(entry => entry.username === username);
          if (userEntry) {
            const userRank = data.findIndex(entry => entry.username === username) + (hidden ? 6 : 1);
            setCurrentRank(userRank);
          } else if (hidden) {
            // User not in visible list and data is hidden = user in top 5
            setCurrentRank(0);
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [username, setCurrentRank]);

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="bigcontainer">
      <div className="vortex-wrapper">
        <Vortex />
      </div>
      
      <button onClick={() => setCurrentPage('MainPage')} className="back-button">
        <FaArrowLeft className="back-icon" />
      </button>

      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1 className="title">Wargames Leaderboard</h1>
          {isHidden && username && !leaderboardData.slice(5).find(entry => entry.username === username) && (
            <div className="top-5-notice">You're in Top 5! 🏆</div>
          )}
        </div>

        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead className="table-header">
              <tr>
                <th className="header-cell">Rank</th>
                <th className="header-cell">Player</th>
                <th className="header-cell">Score</th>
                <th className="header-cell">Last Submitted</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr
                  key={index}
                  className={`table-row ${isHidden && index < 5 ? "blur-effect" : ""} ${entry.username === username ? "current-user" : ""}`}
                >
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell name-cell">{entry.username}</td>
                  <td className="table-cell">{entry.score}</td>
                  <td className="table-cell">{formatTime(entry.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;