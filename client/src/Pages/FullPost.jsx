import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLoading } from '../LoadingContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTimeAgo } from '../utils/useTimeAgo';
import { LikeButton } from '../Components/LikeButton';
import { ReportButton } from '../Components/ReportButton';
import ImageLoader from '../Components/ImageLoader';
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function FullPost() {
const API_URL = import.meta.env.VITE_API_URL;
const { recipe_id } = useParams();
const { authorized } = useAuth();
const { setLoading } = useLoading();
const navigate = useNavigate();

const [post, setPost] = useState(null);
const [localLoading, setLocalLoading] = useState(true);
const [error, setError] = useState('');

const timeAgo = useTimeAgo(post?.post_time);

// Fetch all post information from recipe_id (param)

useEffect(() => {
    setLocalLoading(true);
    setLoading(true);
    
    axios.get(`${API_URL}/post/${recipe_id}`)
      .then(res => {
        setPost(res.data);
      })
      .catch(err => {
        console.error('Failed to load recipe:', err);
        setError('Recipe not found');
      })
      .finally(() => {
        setLocalLoading(false);
        setLoading(false);
      });
  }, [API_URL, recipe_id, setLoading]);

  const handleDelete = () => {
    toast((t) => (
      <div>
        <p>Are you sure you want to delete this post?</p>
        <div className="toast-actions">
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              setLoading(true);
              axios.delete(`${API_URL}/post/delete/${recipe_id}`)
                .then(() => {
                  toast.success('Post successfully deleted');
                  navigate('/');
                })
                .catch(err => {
                  console.error('Delete failed ', err);
                  toast.error('Failed to delete post');
                  setLoading(false);
                });
            }}
            className="confirm-btn"
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };
  const verified = authorized?.user_id === post?.owner_id || authorized?.is_admin;

  if (localLoading) return null;
  if (error) return <p>{error}</p>;

const isOwner = authorized?.user_id === post.owner_id;


  return (
    <>

    <div className='postContainer'>

      <div className='postHeader'>
        <ImageLoader 
          className='postUserIcon' 
          src={post.user_icon} 
          alt={`${post.user_name}'s icon`} 
          width={50} 
          height={50}
          priority={true}
        />
        <Link className='postUserName'to={`/profile/${post.user_name}`}>{post.user_name}</Link>
        <div className='postTime'>{timeAgo}</div>
      </div>

      <ImageLoader 
        className="postImage" 
        src={post.recipe_image} 
        alt={`image of ${post.recipe_title}`}
        width="100%"
        height="400"
        priority={true}
      />
      
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