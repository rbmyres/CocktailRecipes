import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';

function FullPost() {
const API_URL = import.meta.env.VITE_API_URL;
const { recipe_id } = useParams();

const [post, setPost] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

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

if (loading) return <p>Loading…</p>;
if (error)   return <p>{error}</p>;

  return (
    <>
    <div>{post.recipe_title}</div>
    <div>{post.directions[0]}</div>
    </>
  )
}

export default FullPost