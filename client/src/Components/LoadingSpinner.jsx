import React from 'react';
import { BeatLoader } from 'react-spinners';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <BeatLoader color="#FA7E61" />
    </div>
  );
}

export default LoadingSpinner;