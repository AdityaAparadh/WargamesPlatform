import axios from "axios"
import type React from "react"
import { useState } from "react"
import { SiDocker } from "react-icons/si"
import ReactConfetti from 'react-confetti'
// import { currentLevel } from "../../utils/levelLoader"
import { useConfig } from "../../hooks/useConfig"
import  config from "../../../config.json"
import { useAuth } from "../../hooks/useAuth"
import { usePage } from "../../hooks/usePage"
interface TopbarProps {
  levelName: string
  onEnter: (input: string) => void
}

const Topbar: React.FC<TopbarProps> = ({ levelName, onEnter }) => {
  const [input, setInput] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const {setCurrentPage}  = usePage();
  const { current_docker_level, setCurrentDockerLevel }  = useConfig();
  const { token }  = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Reset messages on new submission
    setError("")
    setSuccess("")
    
    try {
      const res = await axios.post(
        config.BACKEND_URI + "/level/submitFlag", 
        { currentLevel: current_docker_level, flag: input },
        { headers: { Authorization: `${token}` }}
      )
      
      if(res.status === 200){
        setShowConfetti(true)
        setSuccess("Correct Flag!")
        setInput("") // Clear input field on success
        setCurrentDockerLevel(current_docker_level + 1);
        setTimeout(() => {
          setShowConfetti(false)
          setSuccess("")
          setCurrentPage("MainPage")
        }, 5000) // hide confetti after 5 seconds
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError("Wrong Flag")
        setInput("") // Clear input field on error
      }
    }
  }

  const errorStyle = {
    color: '#ff4d4d',
    fontSize: '14px',
    fontWeight: '500'
  };

  const successStyle = {
    color: '#4BB543',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <>
      {showConfetti && <ReactConfetti />}
      <header className="bg-navy-800 text-white p-4 flex flex-wrap items-center justify-between shadow-md gap-4">
        <h1 className="text-xl font-semibold flex items-center space-x-2">
          <SiDocker size={70} className="text-4xl text-blue-400" />
          <span>{levelName}</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-end space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter Flag"
              className="px-3 py-2 rounded-md bg-navy-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white border border-navy-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              Enter
            </button>
          </div>
          {error && <span style={errorStyle}>{error}</span>}
          {success && <span style={successStyle}>{success}</span>}
        </form>
      </header>
    </>
  )
}

export default Topbar


