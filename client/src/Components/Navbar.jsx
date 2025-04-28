import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FaSearch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";



function Navbar() {
    const { authorized, loading } = useAuth();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleSidebar = () => setSidebarOpen(prevState => !prevState);
    const closeSidebar = () => setSidebarOpen(false);

    const profileLink = authorized ? `/profile/${authorized.user_name}` : "/login";
    const reportsLink = authorized ? "/reports" : "/login";
    const postLink = authorized ? "/create" : "/login";



    if (loading) return <p>Loading...</p>; 

    return (
        <>

        {sidebarOpen && (
            <div className="overlay" onClick={ closeSidebar }></div>
        )}

        <nav className="nav">
            <ul className={`sidebar ${sidebarOpen ? "open" : ""}`} >
                <li className="closeSidebar" onClick={ handleSidebar }><Link to="#"><IoClose className="navIcon"></IoClose></Link></li>
                <li><Link to="/">
                    <FaHome className="navIcon"></FaHome>
                    <span className="sideLinkText">Home</span>
                </Link></li>
                <li><Link to="/search">
                    <FaSearch className="navIcon"></FaSearch>
                    <span className="sideLinkText">Search</span>
                </Link></li>
                { authorized?.is_admin ? (
                    <>
                    <li><Link to={reportsLink}>
                        <FaCircleExclamation className="navIcon"></FaCircleExclamation>
                        <span className="sideLinkText">Reports</span>
                    </Link></li>
                    <li><Link to={profileLink}>
                        <FaUserCircle className="navIcon"></FaUserCircle>                        
                        <span className="sideLinkText">Profile</span>
                    </Link></li>
                </>
                ) : (
                    <>
                        <li><Link to={postLink}>   
                            <IoIosAddCircle className="navIcon"></IoIosAddCircle>
                            <span className="sideLinkText">Create Post</span>
                        </Link></li>
                        <li><Link to={profileLink}>
                            <FaUserCircle className="navIcon"></FaUserCircle>                        
                            <span className="sideLinkText">Profile</span>
                        </Link></li>
                    </>
                )}
            </ul>
            <ul className="navbar">
                <li className="logo"><Link to="/">mixer</Link></li>
                <li className="navLinkFull"><Link to="/">
                    <FaHome className="navIcon"></FaHome>
                    <span className="navLinkText">Home</span>
                </Link></li>
                <li className="navLinkFull"><Link to="/search">
                    <FaSearch className="navIcon"></FaSearch>
                    <span className="navLinkText">Search</span>
                </Link></li>
                { authorized && authorized.is_admin ? (
                    <>
                    <li className="navLinkFull"><Link to={reportsLink}>
                        <FaCircleExclamation className="navIcon"></FaCircleExclamation>
                        <span className="navLinkText">Reports</span>
                    </Link></li>
                    <li className="navLinkFull"><Link to={profileLink}>
                        <FaUserCircle className="navIcon"></FaUserCircle>                        
                        <span className="navLinkText">Profile</span>
                    </Link></li>
                </>
                ) : (
                    <>
                        <li className="navLinkFull"><Link to={postLink}>   
                            <IoIosAddCircle className="navIcon"></IoIosAddCircle>
                            <span className="navLinkText">Create Post</span>
                        </Link></li>
                        <li className="navLinkFull"><Link to={profileLink}>
                            <FaUserCircle className="navIcon"></FaUserCircle>                        
                            <span className="navLinkText">Profile</span>
                        </Link></li>
                    </>
                )}
                <li className="openSidebar" onClick={handleSidebar} ><Link to="#"><IoMenu className="navIcon"></IoMenu></Link></li>
            </ul>
        </nav>  
        
        </>
    )
}

export default Navbar;