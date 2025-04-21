import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext"; 
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [signupEmail, setSignupEmail] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPrivacy, setSignupPrivacy] = useState('');
  const [signupStatus, setSignupStatus] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        user_name: signupUsername,
        user_email: signupEmail,
        user_password: signupPassword,
        last_name: signupLastName,
        first_name: signupFirstName,
        private: signupPrivacy
      },
      {withCredentials: true}
    );
      setSignupStatus(response.data.message);
      if (response.status === 201) {
        await login({ user_name: signupUsername, user_password: signupPassword });
        setTimeout(() =>{
          navigate(`/profile/${signupUsername}`);
        }, 1000);
      }
    } catch (error) {
        if (error.response.data){
          setSignupStatus(error.response.data.message);
        } else {
          setSignupStatus("Signup failed");
        }
    }
  };

    return (

      <>
        <div className="signup">
          <form onSubmit={handleSignup}>
          <h1>Sign Up</h1>
            <label>First Name</label>
              <input 
                  type="text" 
                  onChange={(e) => setSignupFirstName(e.target.value)}
                  required
              />
              <label>Last Name</label>
              <input 
                  type="text" 
                  onChange={(e) => setSignupLastName(e.target.value)}
                  required
              />
              <label>Email</label>
              <input 
                  type="email" 
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
              />
              <label>Username</label>
              <input 
                  type="text" 
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
              />
              <label>Password</label>
              <input 
                  type="password" 
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
              />
              <label className='privacyToggle'>
                <input 
                type="checkbox" 
                onChange={(e) => setSignupPrivacy(e.target.checked)} 
                />
                <span className='privacyToggleText'>Private Profile?</span>
              </label>
              <button type="submit">Sign Up</button>
              <div className="signupStatus">{signupStatus}</div>
            </form>
            <div className="loginLink">Already have an account? <Link to="/login">Log In Here</Link></div>
        </div>
        </>
        );
  }

export default Signup;