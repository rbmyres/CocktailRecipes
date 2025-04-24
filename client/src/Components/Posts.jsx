import React, {useEffect, useState} from "react";
import axios from 'axios';
import PostSmall from './PostSmall';
import { useAuth } from "../AuthContext";

function Posts({ user_id, post_type, primary_spirit, liked }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const { authorized } = useAuth();

    useEffect(() => {
        setLoading(true);
        const params = {}
        if (user_id)        params.user_id        = user_id
        if (post_type)      params.post_type      = post_type
        if (primary_spirit) params.primary_spirit = primary_spirit
      
        setLoading(true);

        axios.get(`${API_URL}/post/small`, { params, withCredentials: true })
            .then(res => {
                setPosts(res.data)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setLoading(false);
            })
    }, [API_URL, user_id, post_type, primary_spirit]);

    if (loading) {
        return (<p>Loading...</p>)
    } 

    return (
            <div className="feed">
                {posts.map(post => (
                    <PostSmall
                        key={post.recipe_id}
                        owner_id={post.owner_id}
                        recipe_id={post.recipe_id}
                        recipe_title={post.recipe_title}
                        user_name={post.user_name}
                        user_icon={post.user_icon}
                        recipe_image={post.recipe_image}
                        like_count={post.like_count}
                        post_time={post.post_time}
                        liked={post.is_liked}
                    />
                ))}
            </div>
    )
}

export default Posts;