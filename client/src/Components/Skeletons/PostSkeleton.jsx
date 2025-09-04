import React from 'react';

function PostSkeleton() {
    return (
        <div className="previewContainer skeleton">
            <div className='previewHeader'>
                <div className="previewUserIcon skeleton-circle"></div>
                <div className="skeleton-text skeleton-username"></div>
                <div className="skeleton-text skeleton-time"></div>
            </div>

            <div className='previewBody'>
                <div className="previewImage skeleton-image"></div>
                <div className="skeleton-text skeleton-title"></div>
            </div>

            <div className='previewFooter'>
                <div className="skeleton-text skeleton-likes"></div>
                <div className="skeleton-circle skeleton-button"></div>
            </div>
        </div>
    );
}

export default PostSkeleton;