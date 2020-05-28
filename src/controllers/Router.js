import React from 'react';
import CallbackHandler from './CallbackHandler'
import App from './App';

const Router = () => {
  const pathname = window.location.pathname;
  if (pathname === '/callback') {
    return <CallbackHandler />
  } else if (pathname === "/") {
    return <App />
  } else {
    window.location.replace(window.location.origin);
    return null;
  }
};

export default Router;