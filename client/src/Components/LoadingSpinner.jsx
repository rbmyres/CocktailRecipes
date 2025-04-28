import React from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <ClimbingBoxLoader color="#FA7E61" />
    </div>
  );
}

export default LoadingSpinner;