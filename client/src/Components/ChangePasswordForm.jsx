import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';



function ChangePasswordForm({ onBack }) {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/user/change/password`, {
        current_password: currentPassword,
        new_password: newPassword
      });
      toast.success('Password updated successfully!');
      setPasswordStatus(response.data.message);
    } catch (error) {
      if (error.response.data) {
        setPasswordStatus(error.response.data.message);
      } else {
        setPasswordStatus("Change failed");
      }
    }
  }


  return (
    <div className='changePasswordForm'>
      <form onSubmit={handleChange}>
      <button className="backButton" onClick={onBack}><svg className="backIcon" xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="45px" fill="#131112"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></button>
        <label>Current Password</label>
        <input 
          type="password"
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <label>New Password</label>
        <input 
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="submitButton" type="submit">Submit Changes</button>
      </form>
    </div>
  )
}

export default ChangePasswordForm