import React, { useState } from "react";
import Posts from '../Components/Posts';
import { FaSearch } from "react-icons/fa";
import { useDebounce } from '../utils/useDebounce';

function Home() {
    const [search, setSearch] = useState("");
    const [primarySpirit, setPrimarySpirit] = useState("");
    const [sort, setSort] = useState("newest");
    const debouncedSearch = useDebounce(search, 300);

    return (
        <div className="home">

            <div className="filters">
                <div className="searchContainer">
                    <FaSearch className="searchIcon"/>
                    <input type="search" placeholder="Search by recipe or user..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>

                <div className="selects">
                <select className='spiritSelect' value={primarySpirit} onChange={(e) => setPrimarySpirit(e.target.value)}>
                    <option value="">- Primary Spirit -</option>
                    <option value="Vodka">Vodka</option>
                    <option value="Tequila">Tequila</option>
                    <option value="Whiskey">Whiskey</option>
                    <option value="Gin">Gin</option>
                    <option value="Rum">Rum</option>
                    <option value="Other">Other</option>
                </select>

                <select className="sortSelect" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most Popular</option>
                </select>
                </div>
            </div>

            <Posts 
                post_type={"Public"}
                search={debouncedSearch}
                primary_spirit={primarySpirit}
                sort={sort}
            />
        </div>
    )
}

export default Home;