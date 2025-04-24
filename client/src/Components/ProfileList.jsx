import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProfileList({open, type, userID, onClose, recipe_id}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!open) return;

    let endpoint = "";

    if(type === "Followers"){
      endpoint = `/follow/followers/${userID}`;
    }
    else if(type === "Following"){
      endpoint = `/follow/following/${userID}`;
    }
    else if(type === "Likes"){
      endpoint = `/like/list/${recipe_id}`;
    }

    axios.get(`${API_URL}${endpoint}`)
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err)
      })
  }, [recipe_id, userID, type, open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
    <div className='profileListOverlay' onClick={ onClose }></div>
    <div className='profileListContainer'>
      <div className='profileListHeader'>
        <div className='profileListTitle'>{ type }</div>
        <div className='closeProfileListButton'>
          <svg className='closeProfileListIcon' onClick={onClose} xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#131112"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
        </div>
      </div>

      <div className='lineBetween'></div>

        <div className='profileList'>
          {users.length === 0 ? (
            <div className='noUsersAlert'>No Users Found</div>
          ) : (
            users.map((u) => (
              <div key={u.user_id} className='listItem'>
                <img className="profileListIcon" src={`${API_URL}${u.user_icon}`} alt={`${u.user_name}'s icon`} width={128} height={128}/>
                <Link className='profileListName'to={`/profile/${u.user_name}`} onClick={onClose}>{u.user_name}</Link>
              </div>
            ))
          )}
        </div>
    </div>
    </>,
    document.getElementById("portal")
  )
}

export default ProfileList