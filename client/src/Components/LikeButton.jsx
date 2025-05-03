import React, { useState } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileList  from './ProfileList';

export function LikeButton({ recipe_id, initialLiked, initialCount, owner_id }) {
  const { authorized } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);

  const [profileListOpen, setProfileListOpen] = useState(false);
  const [listType, setListType] = useState("");
    

  const toggleLike = async () => {
    if (!authorized) { navigate(`/login`)}

    try {
      const {data} = await axios.post(`${API_URL}/like/${recipe_id}`, {})
      setLiked(data.liked);
      setLikeCount(data.like_count)
    } catch (err) {
      console.error('Error toggling like', err);
    }
  }

  const handleClick = () => {
    if (!authorized ){
      navigate('/login');
    } else {
      setListType("Likes");
      setProfileListOpen(true);
    }
  }

  return (
    <>
    <button
      className={`likeIcon ${liked ? 'Liked' : ''}`}
      onClick={toggleLike}
    > 
      {liked ? <FaHeart /> : <FaRegHeart />}
    </button>
    
    <div className='likeCount' onClick={() => handleClick()}>{likeCount}</div>

    <ProfileList 
        open={profileListOpen} 
        onClose={() => setProfileListOpen(false)}
        type={listType}
        recipe_id={recipe_id}
    />

    </>
    
  )
}
