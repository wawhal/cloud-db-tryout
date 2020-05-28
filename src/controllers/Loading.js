import React from 'react';
import { getNewDBURL, capitalize } from '../util/utils';
import Status from '../components/Status';

const Loading = ({ sessionInfo, setDBUrl }) => {

  const [creatingApp, setCreatingApp] = React.useState('started');
  const [creatingAddon, setCreatingAddon] = React.useState('pending');
  const [gettingConfigVars, setGettingConfigVars] = React.useState('pending');
  const [error, setError] = React.useState(null);

  const { 
    access_token,
    refresh_token,
    token_type,
    user_id,
  } = sessionInfo;


  const appCreateCallback = (appInfo) => {
    setCreatingApp('complete');
    setCreatingAddon('started');
  };
  const addonCreateCallback = (addonInfo) => {
    setCreatingAddon('complete');
    setGettingConfigVars('started');
  };
  const configVarsCallback = (configVars) => {
    setGettingConfigVars('complete');
    setDBUrl(configVars['DATABASE_URL']);
    console.log(configVars);
  }

  React.useEffect(() => {
    getNewDBURL(
      access_token,
      appCreateCallback,
      addonCreateCallback,
      configVarsCallback,
      (e) => setError(e)
    )
  }, [])

  return (
    <div
      style={{marginTop: '20px'}}
    >
      {error && (<div className="error-message">{error}</div>)}
      <Status
        status={creatingApp}
        label="Creating Heroku app"
      />
      <Status
        status={creatingAddon}
        label="Installing Postgres"
      />
      <Status
        status={gettingConfigVars}
        label="Getting the database URL"
      />
    </div>
  )

}

export default Loading