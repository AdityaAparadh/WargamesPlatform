import React, { useState } from 'react'
import './Login.css'  // Import the login styles
import {usePage} from '../../../hooks/usePage'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const { setCurrentPage } = usePage();

  const handleLogin = (e) => {
    e.preventDefault()
    let isValid = true
    setEmailError('')
    setPasswordError('')

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }

    // Validate password length
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    }

    if (isValid) {
      alert('Login successful! (Demo only)')
      setEmail('')
      setPassword('')
    }
  }

  const handleSocialLogin = (provider) => {
    alert(`${provider} login would be implemented here`)
  }

  const handleForgotPassword = () => {
    alert('Forgot password functionality not implemented')
  }

  const handleSignUp = () => {
    alert('Sign up functionality not implemented')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage('MainPage');
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome to Wargames</h1>
        <p>Sign in to continue your journey</p>
      </div>

      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            id="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <i className="input-icon fas fa-envelope"></i>
          {emailError && <span className="error-message" id="emailError">{emailError}</span>}
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
          {passwordError && <span className="error-message" id="passwordError">{passwordError}</span>}
        </div>

        <button type="submit" className="submit-button">Sign In</button>
      </form>
    </div>
  )
}

export default Login ;
