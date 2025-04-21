import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditAccountForm({onUpdated, onBack}) {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [editEmail, setEditEmail] = useState('');
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editPrivacy, setEditPrivacy] = useState('');
    const [editStatus, setEditStatus] = useState('');

    
    useEffect(() => {
        axios.get(`${API_URL}/user/edit/info`, {withCredentials: true})
        .then(res => {
            setEditEmail(res.data.user_email)
            setEditFirstName(res.data.first_name)
            setEditLastName(res.data.last_name)
            setEditUsername(res.data.user_name)
            setEditPrivacy(!!res.data.private)
        })
        .catch(err => {
            console.error(err)
        })
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/user/submit/changes`, {
                    first_name: editFirstName,
                    last_name: editLastName,
                    user_email: editEmail,
                    user_name: editUsername,
                    private: editPrivacy
                },
                {withCredentials: true}
            );
            setEditStatus(response.data.message);
            onUpdated();
            navigate(`/profile/${editUsername}`, {replace: true})
        }catch (error){
            if (error.response.data) {
                setEditStatus(error.response.data.message);
            } else {
                setEditStatus("Edit failed")
            }
        }
    };







  return (
    <div className='editAccountForm'>
        <form onSubmit={handleUpdate}>
            <button className="backButton" onClick={onBack}><svg className="backIcon" xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="45px" fill="#131112"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></button>
            <label>First Name</label>
            <input 
                type="text"
                onChange={(e) => setEditFirstName(e.target.value)}
                required
                value={editFirstName}
            />
            <label>Last Name</label>
            <input 
                type="text"
                onChange={(e) => setEditLastName(e.target.value)}
                required
                value={editLastName}
            />
            <label>Email</label>
            <input 
                type="text"
                onChange={(e) => setEditEmail(e.target.value)}
                required
                value={editEmail}
            />
            <label>Username</label>
            <input 
                type="text"
                onChange={(e) => setEditUsername(e.target.value)}
                required
                value={editUsername}
            />
            <label className='privacyToggle'>
                <input 
                type="checkbox" 
                checked={editPrivacy} 
                onChange={(e) => setEditPrivacy(e.target.checked)} 
                />
                <span className='privacyToggleText'>Private Profile?</span>
            </label>
            <button className="submitButton" type="submit">Submit Changes</button>
            <div className="signupStatus">{editStatus}</div>
        </form>
    </div>
  )
}

export default EditAccountForm