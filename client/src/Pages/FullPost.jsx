import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTimeAgo } from '../utils/useTimeAgo';
import { LikeButton } from '../Components/LikeButton';
import { ReportButton } from '../Components/ReportButton';
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { ClimbingBoxLoader } from 'react-spinners';

function FullPost() {
const API_URL = import.meta.env.VITE_API_URL;
const { recipe_id } = useParams();
const { authorized } = useAuth();
const navigate = useNavigate();

const [post, setPost] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

const timeAgo = useTimeAgo(post?.post_time);

useEffect(() => {
    axios.get(`${API_URL}/post/${recipe_id}`, { withCredentials: true })
      .then(res => {
        setPost(res.data);
      })
      .catch(err => {
        console.error('Failed to load recipe:', err);
        setError('Recipe not found');
      })
      .finally(() => setLoading(false));
  }, [API_URL, recipe_id]);

  const handleDelete = () => {
    if (!window.confirm('Delete this post?')) return;

    axios.delete(`${API_URL}/post/delete/${recipe_id}`, { withCredentials: true })
    .then(() => {
      navigate('/');
    })
    .catch(err => {
      console.error('Delete failed ', err);
    })
  }

  const verified = authorized?.user_id === post?.owner_id || authorized?.is_admin;

  if (loading)   return <ClimbingBoxLoader />
  if (error)   return <p>{error}</p>;

const isOwner = authorized?.user_id === post.owner_id;


  return (
    <>

    <div className='postContainer'>

      <div className='postHeader'>
        <img className='postUserIcon' src={`${API_URL}${post.user_icon}`} alt={`${post.user_name}'s icon`} width={128} height={128} />
        <Link className='postUserName'to={`/profile/${post.user_name}`}>{post.user_name}</Link>
        <div className='postTime'>{timeAgo}</div>
      </div>

      <img className="postImage" src={`${API_URL}${post.recipe_image}`} alt={`image of ${post.recipe_title}`} />
      
      <div className='postFooter'>
        <h3 className='postTitle'>{post.recipe_title}</h3>
        <LikeButton recipe_id={post.recipe_id} initialCount={post.like_count} initialLiked={post.is_liked} owner_id={post.owner_id}/>
        { isOwner ? (
          <button className='editIcon' onClick={() => navigate(`/edit/${post.recipe_id}`)}><FaPencilAlt /></button>
        ) : (
          <ReportButton recipe_id={recipe_id} />
        )}
      </div>

      <div className='bottomLine'></div>

      <div className='ingredients'>
        <h3>Ingredients</h3>
        <ul>
          {post.ingredients.map(({ desc, amt}, i) => (
            <li key={i}>{amt} {desc}</li>

          ))}
        </ul>
      </div>

      <div className='directions'>
        <h3>Directions</h3>
        <ol>
          {post.directions.map((dir, i) => (
            <li key={i}>{dir}</li>
          ))}
        </ol>
      </div>

      {verified ? (
      <button className='deleteButton' onClick={handleDelete}>Delete</button>
    ) : (
      <div></div>
    )}
    </div>

    

    </>
  )
}

export default FullPost