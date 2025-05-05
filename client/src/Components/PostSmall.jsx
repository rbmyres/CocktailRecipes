import React from 'react'
import { Link } from 'react-router-dom';
import { useTimeAgo } from '../utils/useTimeAgo';
import { LikeButton } from './LikeButton';
import { ReportButton } from './ReportButton';
import { FaPencilAlt } from "react-icons/fa";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';


function PostSmall({recipe_id, recipe_title, user_name, user_icon, recipe_image, like_count, post_time, owner_id, liked}) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { authorized } = useAuth();
  const timeAgo = useTimeAgo(post_time);

  const isOwner = authorized?.user_id === owner_id;

  // Component for each individual small post (content card)
  return (
        <div className="previewContainer">
          <div className='previewHeader'>
            <img className="previewUserIcon" src={user_icon} alt={`${user_name}'s icon`} width={128} height={128}/>
            <Link className='previewUserName'to={`/profile/${user_name}`}>{user_name}</Link>
            <div className='previewTime'>{timeAgo}</div>
          </div>

          <Link to={`/post/${recipe_id}`} className='previewBody'>
              <img className="previewImage" src={recipe_image} alt={`image of ${recipe_title}`} />
              <h3 className='previewTitle'>{recipe_title}</h3>
            </Link>

            <div className='previewFooter'>
              <LikeButton recipe_id={recipe_id} initialCount={like_count} initialLiked={liked} owner_id={owner_id}/>
              { isOwner ? (
                <button className='editIcon' onClick={() => navigate(`/edit/${recipe_id}`)}><FaPencilAlt /></button>
              ) : (
                <ReportButton recipe_id={recipe_id} />
              )}
            </div>
        </div>
    )
}

export default PostSmall;