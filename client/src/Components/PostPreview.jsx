import React from 'react'
import { Link } from 'react-router-dom';
import { LikeButton } from './LikeButton';
import { ReportButton } from './ReportButton';
import { FaPencilAlt } from "react-icons/fa";

function PostPreview({recipe_title, user_name, user_icon, recipe_image, like_count}) {

  const API_URL = import.meta.env.VITE_API_URL;

  return (
        <div className="previewContainer">

          <div className='previewHeader'>
            <img className="previewUserIcon" src={user_icon} alt={`${user_name}'s icon`} width={128} height={128}/>
            <div className='previewUserName'>{user_name}</div>
          </div>

          <div className='previewBody'>
            <img className="previewImage" src={recipe_image} alt={`image of ${recipe_title}`} />
            <h3 className='previewTitle'>{recipe_title}</h3>
          </div>

          <div className='previewFooter'>
            <LikeButton />
            <button className='editIcon'><FaPencilAlt /></button>
          </div>

        </div>
    )
}

export default PostPreview;