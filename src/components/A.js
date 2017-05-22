import React from 'react';
import { observer } from 'mobx-react';

function A(props) {
  const { children, onClick } = props;
  return (
    <a {...props} onClick={onClick}>{children}</a>
  );
}

export default observer(A);
