import type React from "react"
import { useState } from "react"
import { SiDocker } from "react-icons/si"

interface TopbarProps {
  levelName: string
  onEnter: (input: string) => void
}

const Topbar: React.FC<TopbarProps> = ({ levelName, onEnter }) => {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onEnter(input)
    setInput("")
  }

  return (
    <header className="bg-navy-800 text-white p-4 flex flex-wrap items-center justify-between shadow-md gap-4">
      <h1 className="text-xl font-semibold flex items-center space-x-2">
        <SiDocker size={70} className="text-4xl text-blue-400" />
        <span>{levelName}</span>
      </h1>

      <form onSubmit={handleSubmit} className="flex space-x-2">
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
      </form>
    </header>
  )
}

export default Topbar


