import React from "react";
import axios from 'axios';
import Posts from '../Components/Posts';

function Home() {
    const API_URL = import.meta.env.VITE_API_URL;

    return (
        <Posts 
            post_type={"Public"}
        />

    )
}

export default Home;