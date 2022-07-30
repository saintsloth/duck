import React from 'react';
import { Outlet } from 'react-router-dom';

const Frame = () => {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}

export default Frame;
