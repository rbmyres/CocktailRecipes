import React, { useState } from 'react';

function ImageLoader({ src, alt, className, width, height, priority = false }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = () => {
        setLoaded(true);
    };

    const handleError = () => {
        setError(true);
        setLoaded(true);
    };

    return (
        <div className={`image-loader ${className}-wrapper`}>
            {!loaded && !error && (
                <div 
                    className={`${className} image-skeleton`}
                    style={{ width, height }}
                />
            )}
            <img
                className={`${className} ${loaded ? 'loaded' : 'loading'}`}
                src={src}
                alt={alt}
                width={width}
                height={height}
                onLoad={handleLoad}
                onError={handleError}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                style={{ opacity: loaded ? 1 : 0 }}
            />
            {error && (
                <div 
                    className={`${className} image-error`}
                    style={{ width, height }}
                >
                    <span>Failed to load image</span>
                </div>
            )}
        </div>
    );
}

export default ImageLoader;