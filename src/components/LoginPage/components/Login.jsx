import React, { useState } from 'react'
import './Login.css'
import { usePage } from '../../../hooks/usePage'
import { useAuth } from '../../../hooks/useAuth'
import axios from 'axios'
import config from '../../../../config.json'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const { setCurrentPage } = usePage()
  const { setAuth } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post(`${config.BACKEND_URI}/api/auth/login`, {
        username,
        password
      })
      
      const { jwt } = response.data
      setAuth(username, jwt)
      setCurrentPage('MainPage')
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Invalid credentials')
            break
          case 404:
            setError('User not found')
            break
          case 500:
            setError('Server error. Please try again later')
            break
          default:
            setError('An unexpected error occurred')
        }
      } else if (err.request) {
        setError('Network error. Please check your internet connection')
      } else {
        setError('An unexpected error occurred')
      }
      
      console.error('Login error:', err)
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome to Wargames</h1>
        <p>Sign in to continue your journey</p>
      </div>

      <form id="loginForm" onSubmit={handleSubmit}>
        {error && (
          <div className="error-container">
            <span className="error-message">{error}</span>
          </div>
        )}
        
        <div className="form-group">
          <input
            className="form-input"
            id="username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <i className="input-icon fas fa-envelope"></i>
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-input"
            id="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i className="input-icon fas fa-lock"></i>
        </div>

        <button type="submit" className="submit-button">Sign In</button>
      </form>
    </div>
  )
}

export default Login

