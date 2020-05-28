import React from 'react';

const CallbackHandler = () => {

  React.useEffect(() => {
    window.opener.postMessage(window.location.search);
    window.close();
  }, [])

  return <div>{'Loading'}</div>;
}

export default CallbackHandler;