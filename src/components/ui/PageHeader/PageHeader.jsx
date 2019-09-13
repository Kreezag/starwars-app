import React from 'react';
import './PageHeader.less';

const PageHeader = ({ children }) => {
  const childrenIsFunction = typeof children === 'function';

  return (
    <div className="PageHeader">
      {childrenIsFunction ? children() : children}
    </div>
  );
};

export default PageHeader;
