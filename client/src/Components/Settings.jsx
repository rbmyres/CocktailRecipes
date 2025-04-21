import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import EditAccountForm from "./EditAccountForm";
import ChangePasswordForm from "./ChangePasswordForm";

function Settings({onUpdated}){
    const { logout } = useAuth();
    const [view, setView] = useState("menu");
    const {isPrivate, setIsPrivate} = useState(null);


    return (
        <>
        <div className="settingsContainer">
            {view === "menu" && (
                <div className="settingsMenu">
                    <button className="editAccountButton" onClick={() => setView("edit")}>Edit Account</button>
                    <button className="changePasswordButton" onClick={() => setView("password")}>Change Password</button>
                    <button className="logoutButton" onClick={ logout }>Logout</button>
                </div>
            )}

            {view === "edit" && (
                <EditAccountForm 
                    onBack={() => setView('menu')}
                    onUpdated={onUpdated}
                />
            )}

            {view === "password" && (
                <ChangePasswordForm 
                    onBack={() => setView('menu')}
                />
            )}
            
        </div>
        </>
      );
}

export default Settings;