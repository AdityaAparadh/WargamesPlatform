// import Scene from './components/Scene'
import { useState } from 'react'
import DockerWhale from './components/DockerWhale'
import Login from './components/Login'
import {useAuth} from '../../hooks/useAuth';
import './styles.css'
import './pmndrs.css'
import axios from 'axios';

export default function LoginPageApp() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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