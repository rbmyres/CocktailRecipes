import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from '../utils/useDebounce';
import { FaSearch } from "react-icons/fa";
import axios from "axios";


function Search(){
    const API_URL = import.meta.env.VITE_API_URL;
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const debouncedQuery = useDebounce(search, 300);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
          setUsers([]);
          return;
        }
        axios
          .get(`${API_URL}/user/search`, {
            params: { search: debouncedQuery },
            withCredentials: true
          })
          .then(res => setUsers(res.data))
          .catch(err => console.error("User search error", err));
      }, [API_URL, debouncedQuery]);

    return (
        <>
            <div className="searchContainer">
                <div className="searchContainer">
                    <FaSearch className="searchIcon"/>
                    <input type="search" placeholder="Search for users..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>
            


            <div className='profileList'>
                <div className='lineBetween'></div>
                {users.length === 0 ? (
                <div className='noUsersAlert'>No Users Found</div>
                ) : (
                users.map((u) => (
                    <div key={u.user_id} className='listItem'>
                    <img className="profileListIcon" src={u.user_icon} alt={`${u.user_name}'s icon`} width={128} height={128}/>
                    <Link className='profileListName'to={`/profile/${u.user_name}`} >{u.user_name}</Link>
                    </div>
                ))
                )}
            </div>

            </div> 
        </>

    )

    
}

export default Search;