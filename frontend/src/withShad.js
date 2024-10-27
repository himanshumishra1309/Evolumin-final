// withShad.js
import React from 'react';

const withShad = (WrappedComponent) => {
  return (props) => {
    return <div className="shad"><WrappedComponent {...props} /></div>;
  };
};

export default withShad;
