// import Scene from './components/Scene'
import { useState } from 'react'
import DockerWhale from './components/DockerWhale'
import Login from './components/Login'

import './styles.css'
import './pmndrs.css'

export default function LoginPageApp() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Handle login logic here if needed, or let Login component manage its own logic
    console.log('Username:', username)
    console.log('Password:', password)
    
  }

  return (
    <>
      <div className="main">
      {/* <Scene /> */}
      <img src='public/bg.png' className='w-screen h-screen ' ></img>
        <DockerWhale />
        <div className="code">
          <div className="code-container">
            <Login />
          </div>
        </div>
      </div>
    </>
  )
}