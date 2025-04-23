import React from 'react'
import { Link } from 'react-router-dom';

function PostPreview({title, user_name, user_icon, recipe_image, like_count}) {

  const API_URL = import.meta.env.VITE_API_URL;

  return (
        <div className="previewContainer">

          <div className='previewHeader'>
            <img className="previewUserIcon" src={`${API_URL}${user_icon}`} alt={`${user_name}'s icon`} width={128} height={128}/>
            <Link className='previewUserName'to={`/profile/${user_name}`}>{user_name}</Link>
          </div>

          <div className='previewBody'>
            <h3 className='previewTitle'>{title}</h3>
            <img className="previewImgae" src={`${API_URL}${recipe_image}`} alt={`image of ${title}`} />
          </div>

          <div className='previewFooter'>
            <div className='likeIcon'>{like_count}</div>
            <div className='reportIcon'>Report</div>
          </div>

        </div>
    )
}

export default PostPreview;