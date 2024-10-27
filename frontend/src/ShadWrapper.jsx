// ShadWrapper.js
import React from 'react';

const ShadWrapper = ({ children, className }) => {
  return (
    <div className={`shad ${className}`}>
      {children}
    </div>
  );
};

export default ShadWrapper;
