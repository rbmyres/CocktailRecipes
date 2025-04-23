import React, {useEffect, useState} from "react";
import axios from 'axios';
import PostSmall from './PostSmall';

function Home() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        axios.get(`${API_URL}/post/small`)
            .then(res => {
                setPosts(res.data)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setLoading(false);
            })
    }, [API_URL]);

    if (loading) {
        return (<p>Loading...</p>)
    } 

    return (
            <div className="feed">
                {posts.map(post => (
                    <PostSmall
                        key={post.recipe_id}
                        recipe_id={post.recipe_id}
                        recipe_title={post.recipe_title}
                        user_name={post.user_name}
                        user_icon={post.user_icon}
                        recipe_image={post.recipe_image}
                        like_count={post.like_count}
                        primary_spirit={post.primary_spirit}
                        post_time={post.post_time}
                    />
                ))}
            </div>
    )
}

export default Home;