import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLoading } from '../LoadingContext';
import axios from 'axios';
import IconUpload from './IconUpload';
import Modal from './Modal';
import SmallModal from './SmallModal';
import Settings from './Settings';
import FollowButton from './FollowButton';
import ProfileList from './ProfileList';
import { FaPencilAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import toast from 'react-hot-toast';

function ProfileInfo(){
    const API_URL = import.meta.env.VITE_API_URL;
    const { authorized } = useAuth();
    const { setLoading } = useLoading();

    const { user_name } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);
    const [iconModalOpen, setIconModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [profileListOpen, setProfileListOpen] = useState(false);
    const [listType, setListType] = useState("");

    const fetchProfile = () => {
        setLocalLoading(true);
        setLoading(true);
        
        axios.get(`${API_URL}/user/id/${ user_name }`, {withCredentials: true})
            .then(res => {
                const userID = res.data.user_id;
                return axios.get(`${API_URL}/user/${ userID }`, {withCredentials: true})
            })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLocalLoading(false);
                setLoading(false);
            });
        }

        const handleDelete = () => {
            toast((t) => (
              <div>
                <p>Are you sure you want to delete this user?</p>
                <div className="toast-actions">
                  <button 
                    onClick={() => {
                      toast.dismiss(t.id);
                      setLoading(true);
                      axios.delete(`${API_URL}/user/delete/${user.user_id}`, { withCredentials: true })
                        .then(() => {
                          toast.success('User successfully deleted');
                          navigate('/');
                        })
                        .catch(err => {
                          console.error('Delete failed ', err);
                          toast.error('Failed to delete user');
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

    useEffect(() => {
        fetchProfile();
    }, [user_name]); 

    if (localLoading) return null;
    if (!user) return <p>Loading...</p>;
    return (
        <>
            { authorized.user_id === user.user_id ? (
                <>
                <div className="profileInfoContainer">
                    <div className='profileIconDiv'>
                        <img className="profileIcon" src={`${API_URL}${user.user_icon}`} alt={`${user.user_name}'s icon`} width={128} height={128}/>
                        <div className='changeIconDiv' onClick={() => setIconModalOpen(true)}>
                            <FaPencilAlt className='profilePencil'></FaPencilAlt>
                        </div>
                    </div>

                    <div className="username"> { user.user_name}</div>
                    <div className="fullName">{ user.first_name } { user.last_name }</div>

                    <div className='settingsButtonDiv' onClick={() => setSettingsModalOpen(true)}>
                        <FaGear className="profileGear"></FaGear>
                    </div>

                    <div className='postsNum'>
                        <span className='spanNum'>{ user.post_count} </span>
                        <span className='spanWord'>posts</span>
                    </div>
                    <div className='followersNum' onClick={() => {setListType("Followers"); setProfileListOpen(true)}}>
                        <span className='spanNum'>{ user.follower_count } </span> 
                        <span className='spanWord'>followers</span>
                    </div>
                    <div className='followingNum' onClick={() => {setListType("Following"); setProfileListOpen(true)}}>
                        <span className='spanNum'>{ user.following_count } </span> 
                        <span className='spanWord'>following</span>
                    </div>

                    <Modal open={iconModalOpen} onClose={() => setIconModalOpen(false)}>
                        <IconUpload 
                            onUpload={(iconURL) => {
                                setUser(u => ({
                                    ...u,
                                    user_icon: iconURL
                                }
                            ));
                                setIconModalOpen(false);
                            }}
                        />
                    </Modal>

                    <SmallModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)}>
                            <Settings onUpdated={fetchProfile}/>
                    </SmallModal>

                    <ProfileList 
                        open={profileListOpen} 
                        onClose={() => setProfileListOpen(false)}
                        type={listType}
                        userID={user.user_id}
                    />
                </div>

                <div className='bottomLine'></div>
                </>
            ) : (
                <>
                <div className="profileInfoContainer">
                    <div className='profileIconDiv'>
                        <img className="profileIcon" src={`${API_URL}${user.user_icon}`} alt={`${user.user_name}'s icon`} width={128} height={128}/>
                    </div>

                    <div className="username"> { user.user_name}</div>
                    <div className="fullName">{ user.first_name } { user.last_name }</div>

                    <div className='postsNum'>
                        <span className='spanNum'>{ user.post_count } </span>
                        <span className='spanWord'>posts</span>
                    </div>
                    <div className='followersNum' onClick={() => {setListType("Followers"); setProfileListOpen(true)}}>
                        <span className='spanNum'>{ user.follower_count } </span> 
                        <span className='spanWord'>followers</span>
                    </div>
                    <div className='followingNum' onClick={() => {setListType("Following"); setProfileListOpen(true)}}>
                        <span className='spanNum'>{ user.following_count } </span> 
                        <span className='spanWord'>following</span>
                    </div>

                    {authorized.is_admin ? (
                        <button className='deleteButton' onClick={handleDelete}>Delete</button>
                    ) : (
                    <FollowButton 
                        followerUserID={authorized.user_id}
                        followingUserID={user.user_id}
                        setUser={setUser}
                        user={user}
                    />
                    )}
                    

                    <ProfileList 
                        open={profileListOpen} 
                        onClose={() => setProfileListOpen(false)}
                        type={listType}
                        userID={user.user_id}
                    />

                </div>

                <div className='bottomLine'></div>
                </>
            )}
        </>
    )
}

export default ProfileInfo;