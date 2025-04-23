import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import IconUpload from './IconUpload';
import Modal from './Modal';
import SmallModal from './SmallModal';
import Settings from './Settings';
import FollowButton from './FollowButton';
import ProfileList from './ProfileList';

function ProfileInfo(){
    const API_URL = import.meta.env.VITE_API_URL;
    const { authorized } = useAuth();

    const { user_name } = useParams();

    const [user, setUser] = useState(null);
    const [iconModalOpen, setIconModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [profileListOpen, setProfileListOpen] = useState(false);
    const [listType, setListType] = useState("");

    const fetchProfile = () => {
        axios.get(`${API_URL}/user/id/${ user_name }`)
            .then(res => {
                const userID = res.data.user_id;

                return axios.get(`${API_URL}/user/${ userID }`)
            })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.error(err);
            })
        }

    useEffect(fetchProfile, [user_name]);

    if(!user){
        return (<p>Loading...</p>)
    }
    return (
        <>
            { authorized.user_id === user.user_id ? (
                <>
                <div className="profileInfoContainer">
                    <div className='profileIconDiv'>
                        <img className="profileIcon" src={`${API_URL}${user.user_icon}`} alt={`${user.user_name}'s icon`} width={128} height={128}/>
                        <div className='changeIconDiv' onClick={() => setIconModalOpen(true)}>
                            <svg className="pencilIcon" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#131112"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                        </div>
                    </div>

                    <div className="username"> { user.user_name}</div>
                    <div className="fullName">{ user.first_name } { user.last_name }</div>

                    <div className='settingsButtonDiv' onClick={() => setSettingsModalOpen(true)}>
                        <svg className="settingsIcon" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#131112"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
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
                                }));
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

                    <FollowButton 
                        followerUserID={authorized.user_id}
                        followingUserID={user.user_id}
                        setUser={setUser}
                        user={user}
                    />

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