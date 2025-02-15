import { FaDocker } from "react-icons/fa6";
import { IoTrophy} from "react-icons/io5";
import { LuShell } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import "./kubes.css"

import { useState } from "react";

const KubernetesLevel = () => {

    const [selectedOption,setSelectedOption] = useState('')

    const handleSubmit = () =>{
            console.log(selectedOption)
    }

    return (
        <div className="h-screen w-screen relative">
            
            <div className="top-bar">
          <div className="stats-section">
            <div className="stat-item">
              <IoTrophy className="stat-icon" />
              <span>Rank: #42</span>
            </div>
            <div className="stat-item">
              <LuShell className="stat-icon" />
              <span>Score: 0</span>
            </div>
          </div>
          <div className="user-section">
            <span className="user-email"></span>
            <button  className="logout-button cursor-pointer">
              <FiLogOut className="button-icon cursor-pointer" />
              Logout
            </button>
          </div>
        </div>

            <div className="absolute inset-0">
                <img 
                    src='bg.png' 
                    className='w-full h-full object-cover absolute -z-10' 
                    alt="Background"
                />
                <div className="absolute  bg-black/30"></div>
            </div>

            <div className="fixed bottom-6 left-6 w-16 h-16 rounded-full bg-[#fff]/90 border-none flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl">
            <FaDocker className="absolute h-16 p-2 w-16 cursor-pointer text-[#1D63ED]" />
            </div>

            <div className="flex w-screen h-screen justify-center items-center">
                <div className="flex flex-col backdrop-blur-xl items-center border-[1px] border-white/50 bg-white/10 shadow-2xl w-2/5 h-4/5 mt-5 rounded-2xl p-6">
                <h1 className="text-center text-[#516C80] font-bold tracking-wide text-2xl ">Level 1</h1>
                  
                   <h1 className="text-center text-[#516C80] font-bold tracking-wide text-2xl ">Kubernetes Quiz </h1>

                   <div className="flex flex-col w-full p-3">
                     <h2 className="text-center py-2 text-white text-md">Which of the following commands is used to create and start a Docker container?</h2>
                    
                    <div className="flex flex-col text-white text-sm justify-center gap-5 items-center py-5">
                    <button
    onClick={() => setSelectedOption("A")}
    className={`w-full cursor-pointer border-[1px] backdrop-blur-3xl border-white/50 shadow-xl transition-transform duration-500 ease-in-out hover:scale-105 p-3 rounded-md 
    ${selectedOption === "A" ? "!border-[2px] !border-blue-400 text-blue-200" : "bg-transparent"}`}>
    A) docker build
</button>

<button
    onClick={() => setSelectedOption("B")}
    className={`w-full cursor-pointer border-[1px] backdrop-blur-3xl border-white/50 shadow-xl transition-transform duration-500 ease-in-out hover:scale-105 p-3 rounded-md 
    ${selectedOption === "B" ? "!border-[2px] !border-blue-400 text-blue-200" : "bg-transparent"}`}>
    B) docker run
</button>

<button
    onClick={() => setSelectedOption("C")}
    className={`w-full cursor-pointer border-[1px] backdrop-blur-3xl border-white/50 shadow-xl transition-transform duration-500 ease-in-out hover:scale-105 p-3 rounded-md 
    ${selectedOption === "C" ? "!border-[2px] !border-blue-400 text-blue-200" : "bg-transparent"}`}>
    C) docker commit
</button>

<button
    onClick={() => setSelectedOption("D")}
    className={`w-full cursor-pointer border-[1px] backdrop-blur-3xl border-white/50 shadow-xl transition-transform duration-500 ease-in-out hover:scale-105 p-3 rounded-md 
    ${selectedOption === "D" ? "!border-[2px] !border-blue-400 text-blue-200" : "bg-transparent"}`}>
    D) docker start
</button>


                    </div>
                   </div>

                   <div className="flex justify-end w-full">
                   <button className=" cursor-pointer border-[1px] bg-[#516C80] text-white backdrop-blur-3xl border-white/50 shadow-xl transition-transform duration-500 ease-in-out hover:scale-105 p-2 px-6 rounded-md"
                   onClick={handleSubmit}>
                    Submit
                    </button>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default KubernetesLevel;

