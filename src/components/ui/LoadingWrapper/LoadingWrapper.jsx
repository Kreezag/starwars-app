import React from 'react';
import './LoadingWrapper.less';

const LoadingWrapper = ({ isLoading = true, children }) => {
  if (!isLoading) {
    const childrenIsFunction = typeof children === 'function';

    return childrenIsFunction ? children() : children;
  }

  return <div className="LoadingWrapper">Loading...</div>;
};

export default LoadingWrapper;
