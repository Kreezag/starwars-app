import React from 'react';
import './LoadingWrapper.less';

const LoadingWrapper = ({ isLoading = false, children }) => {
  if (isLoading) {
    return <div className="LoadingWrapper">Loading...</div>;
  }

  const childrenIsFunction = typeof children === 'function';
  return childrenIsFunction ? children() : children;
};

export default LoadingWrapper;
