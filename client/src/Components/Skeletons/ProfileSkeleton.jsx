import React from 'react';

function ProfileSkeleton() {
    return (
        <div className="profileContainer skeleton">
            <div className="profileInfo">
                <div className="skeleton-circle profile-icon-skeleton"></div>
                <div className="skeleton-text profile-name-skeleton"></div>
                <div className="skeleton-text profile-stats-skeleton"></div>
                <div className="skeleton-text profile-bio-skeleton"></div>
            </div>
            
            <div className="buttonContainer">
                <div className="skeleton-button tab-skeleton"></div>
                <div className="skeleton-button tab-skeleton"></div>
                <div className="skeleton-button tab-skeleton"></div>
            </div>
        </div>
    );
}

export default ProfileSkeleton;