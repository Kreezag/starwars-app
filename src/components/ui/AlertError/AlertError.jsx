import Alert from 'react-bootstrap/Alert';
import React from 'react';
import './AlertError.less';

const AlertError = ({ children }) => {
  if (!children) {
    return null;
  }

  const isFunctionChildren = typeof children === 'function';

  return (
    <Alert variant="danger" className="AlertError">
      {isFunctionChildren ? children() : children}
    </Alert>
  );
};

export default AlertError;
