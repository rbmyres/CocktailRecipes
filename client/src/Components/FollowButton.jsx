import React, { useState, useEffect } from 'react'
import axios from 'axios';

function FollowButton({ followerUserID, followingUserID, setUser }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetches whether the user is following or not following a user

    useEffect(() => {

        axios.get(`${API_URL}/follow/check`, {
            params: {follower_id: followerUserID, following_id: followingUserID}
        })
        .then(res => {
            setIsFollowing(res.data.isFollowing);
        })
        .catch(err => {
            console.error(err);
        })
    }, [followerUserID, followingUserID]);

    // Toggles the follow button to update automatically

    const toggleFollowButton = () => {
        const routeEndPoint = isFollowing ? "unfollow" : "follow";

        axios.post(`${API_URL}/follow/${routeEndPoint}`, {
            follower_id: followerUserID,
            following_id: followingUserID
        },
            {headers: {'x-no-loading': true}})
        .then(() => {
            setIsFollowing(prev => !prev)

            setUser(prev => ({
                ...prev,
                follower_count: prev.follower_count + (isFollowing ? -1 : 1)
            }))
        })
        .catch(err => {
            console.error(err)
        })
    };

  return (
    <div className='followButtonDiv'>
        <button className='followButton' onClick={toggleFollowButton}>
            {isFollowing ? "Unfollow" : "Follow"}
        </button>
    </div>
  )
}

export default FollowButton