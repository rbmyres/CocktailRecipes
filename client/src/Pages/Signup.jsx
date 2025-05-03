import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext"; 
import { useLoading } from "../LoadingContext";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';

function Signup() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { login } = useAuth(); 
  const { setLoading } = useLoading();
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
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        user_name: signupUsername,
        user_email: signupEmail,
        user_password: signupPassword,
        last_name: signupLastName,
        first_name: signupFirstName,
        private: signupPrivacy
      });
      toast.success('Account created successfully!');
      setSignupStatus(response.data.message);
      if (response.status === 201) {
        await login({ user_name: signupUsername, user_password: signupPassword });
        setTimeout(() =>{
          navigate(`/profile/${signupUsername}`);
        }, 1000);
      }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Signup failed');
        setSignupStatus(error.response?.data?.message || 'Signup failed');
        setLoading(false);
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
              <button type="submit">Sign Up</button>
            </form>
            <div className="loginLink">Already have an account? <Link to="/login">Log In Here</Link></div>
        </div>
        </>
        );
  }

export default Signup;