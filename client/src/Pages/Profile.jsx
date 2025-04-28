import React, {useState, useEffect} from "react";
import { useAuth } from "../AuthContext"; 
import { useParams } from 'react-router-dom';
import axios from "axios";
import ProfileInfo from "../Components/ProfileInfo";
import Posts from '../Components/Posts';
import Login from "./Login";
import { IoGrid } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";


function Profile() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { authorized} = useAuth(); 
  const { user_name } = useParams();
  const [user, setUser] = useState(null);
  const [postType, setPostType] = useState('Public');
  const [liked, setLiked] = useState(false);

  if (!authorized) { return <Login /> }

  const fetchProfile = () => {
    axios.get(`${API_URL}/user/id/${ user_name }`)
        .then(res => {
            const userID = res.data.user_id;

            return axios.get(`${API_URL}/user/${ userID }`)
        })
        .then(res => {
            setUser(res.data);
        })
        .catch(err => {
            console.error(err);
        })
    }

    useEffect(fetchProfile, [user_name]);

    if(!user){
        return (<p>No user found</p>)
    }

    const showPublicPosts = () => {
      setPostType("Public");
      setLiked(false);
    };
  
    const showDraftPosts = () => {
      setPostType("Drafts");
      setLiked(false);
    };
  
    const showLikedPosts = () => {
      setPostType('');
      setLiked(true);
    };

    const isOwner = authorized.user_id === user.user_id;
    

  return (
    <>  
      { isOwner ? ( 
        <div className="profile">
          <ProfileInfo />
          <div className="buttonContainer">
            <div className="publicButton" onClick={showPublicPosts}><IoGrid /><span>Posts</span></div>
            <div className="draftsButton" onClick={showDraftPosts}><FaLock /> <span>Drafts</span></div>
            <div className="likedButton" onClick={showLikedPosts}><FaHeart /><span>Liked</span></div>
          </div>
          <Posts 
            user_id={user.user_id}
            post_type={postType}
            liked={liked}
          />
        </div>

      ) : (
        
        <div className="profile">
          <ProfileInfo />
          <Posts 
            user_id={user.user_id}
            post_type={"Public"}
          />
        </div>
      

      )}
    
    
    
    
    </>
    
  );
}

export default Profile;
