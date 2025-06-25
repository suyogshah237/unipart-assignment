import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="text-center my-5">
      <Spinner 
        animation="border" 
        role="status" 
        style={{ color: '#d72626' }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
