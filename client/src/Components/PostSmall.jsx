import React from 'react'
import { Link } from 'react-router-dom';

function PostSmall({recipe_id, recipe_title, user_name, user_icon, recipe_image, like_count, primary_spirit, post_time}) {

  const API_URL = import.meta.env.VITE_API_URL;

  return (
        <div className="previewContainer">

          <div className='previewHeader'>
            <img className="previewUserIcon" src={`${API_URL}${user_icon}`} alt={`${user_name}'s icon`} width={128} height={128}/>
            <Link className='previewUserName'to={`/profile/${user_name}`}>{user_name}</Link>
            <div className='previewTime'>{post_time}</div>
          </div>

          <Link to={`/post/${recipe_id}`} className='previewLink'>
            <div className='previewBody'>
              <h3 className='previewTitle'>{recipe_title}</h3>
              <div className='previewSpirit'>{primary_spirit}</div>
              <img className="previewImgae" src={`${API_URL}${recipe_image}`} alt={`image of ${recipe_title}`} />
            </div>

            <div className='previewFooter'>
              <div className='likeIcon'>{like_count}</div>
              <div className='reportIcon'>Report</div>
            </div>
          </Link>
        </div>
    )
}

export default PostSmall;