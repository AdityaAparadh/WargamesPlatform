import { usePage } from "../../hooks/usePage";
import { FaArrowLeft } from "react-icons/fa";
import "./Leaderboard.css";

const Leaderboard = () => {
  const { setCurrentPage } = usePage();

  // Dummy data - replace with actual data from your backend
  const players = [
    { rank: 1, username: "master_coder", score: 2500 },
    { rank: 2, username: "docker_pro", score: 2100 },
    { rank: 3, username: "kube_warrior", score: 1800 },
    { rank: 4, username: "container_ninja", score: 1600 },
    { rank: 5, username: "cloud_expert", score: 1400 },
    { rank: 6, username: "cloud_expert", score: 1400 },
    { rank: 7, username: "cloud_expert", score: 1400 },
    { rank: 8, username: "cloud_expert", score: 1400 },
    { rank: 9, username: "cloud_expert", score: 1400 },
    { rank: 10, username: "cloud_expert", score: 1400 },
    { rank: 11, username: "cloud_expert", score: 1400 },
    { rank: 12, username: "cloud_expert", score: 1400 },
    { rank: 12, username: "cloud_expert", score: 1400 },
    { rank: 13, username: "cloud_expert", score: 1400 },
    { rank: 14, username: "cloud_expert", score: 1400 }
  ];

  return (
    <div className="leaderboard-container">
      <img src='public/bg.png' className='background-image' />
      
      <div className="leaderboard-content">
        <h1>Wargames Leaderboard</h1>
        
        <div className="players-list">
          {players.map((player) => (
            <div key={player.rank} className="player-card">
              <div className="rank">{`#${player.rank}`}</div>
              <div className="username">{player.username}</div>
              <div className="score">{player.score}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setCurrentPage('MainPage')}
        className="back-button"
      >
        <FaArrowLeft className="back-icon" />
      </button>
    </div>
  );
};

export default Leaderboard;