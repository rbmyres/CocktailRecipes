import React from "react";
import { useAuth } from "../AuthContext"; 
import ProfileInfo from "../Components/ProfileInfo";
import Login from "./Login";

function Profile() {
  const { authorized, logout } = useAuth(); 

  if (!authorized) { return <Login /> }


  return (
    <div className="profile">
        <ProfileInfo />
  </div>
  );
}

export default Profile;
