import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext"; 
import { useLoading } from "../LoadingContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login, loading: authLoading } = useAuth(); 
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading, setLoading]);

  if (authLoading) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      await login({ user_name: loginUsername, user_password: loginPassword });
      navigate("/");
    } catch (error) {
      if (error.response?.data){
        setLoginStatus(error.response.data.message);
      } else {
        setLoginStatus("Login Failed");
      }
      setLoading(false);
    }
  }
 
  return (
    <>
    <div className="login">
      <h1>Log In</h1>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input 
            type="text" 
            onChange={(e) => setLoginUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input 
            type="password" 
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
          <div className="loginStatus">{loginStatus}</div>
        </form>
        <div className="signupLink">Don't have an account? <Link to="/signup">Sign Up Here</Link></div>
    </div>
    </>
  );
}

export default Login;