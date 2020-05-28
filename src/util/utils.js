import { HEROKU_OAUTH_ID, LS_HEROKU_OAUTH_REQUEST_STATE, OAUTH_EXCHANGE_ENDPOINT } from './constants';


export const isWindow = () => {
  return (typeof window !== undefined)
};

export const persistRequestState = (state) => {
  if (isWindow()) {
    window.localStorage.setItem(LS_HEROKU_OAUTH_REQUEST_STATE, state);
  }
};
export const getPersistedRequestState = () => {
  if (isWindow()) {
    return window.localStorage.getItem(LS_HEROKU_OAUTH_REQUEST_STATE);
  }
};
export const clearPersistedRequestState = () => {
  if (isWindow()) {
    window.localStorage.removeItem(LS_HEROKU_OAUTH_REQUEST_STATE);
  }
};

export const getRandomString = (stringLength=16) => {
  const allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < stringLength; i++) {
    const randomNum = Math.floor((Math.random() * allChars.length));
    str += allChars.charAt(randomNum);
  }
  return str;
}

export const getHerokuAuthUrl = (requestState) => {
  return `https://id.heroku.com/oauth/authorize?client_id=${HEROKU_OAUTH_ID}&response_type=code&scope=global&state=${requestState}`
}

export const exchangeToken = async (code, successCb, errorCb) => {
  if (isWindow) {
    const httpResp = await window.fetch(
      OAUTH_EXCHANGE_ENDPOINT,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            code
          }
        })
      }
    );
    const tokenResponse = await httpResp.json();
    if (httpResp.status >= 300) {
      return errorCb(tokenResponse.message || 'unexpected')
    }
    return successCb(tokenResponse);
  } else {
    throw new Error('unexpected');
  }
}

export const createHerokuApp = async (accessToken) => {
  if (isWindow) {
    const httpResp = await fetch(
      'https://api.heroku.com/apps',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/vnd.heroku+json; version=3',
          authorization: `Bearer ${accessToken}`
        },
        body: '{}'
      }
    );
    const createResp = await httpResp.json();

    if (httpResp.status >= 300) {
      throw new Error(createResp.message)
    }

    return createResp;

  } else {
    throw new Error('unexpected')
  }
}

export const createPostgresAddon = async (appName, accessToken) => {
  if (isWindow) {
    const httpResp = await fetch(
      `https://api.heroku.com/apps/${appName}/addons`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/vnd.heroku+json; version=3',
          authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          plan: "heroku-postgresql:hobby-dev"
        })
      }
    );
    const createResp = await httpResp.json();

    if (httpResp.status >= 300) {
      throw new Error(createResp.message)
    }

    return createResp;

  } else {
    throw new Error('unexpected')
  }
}

export const getConfigVars = async (appName, accessToken) => {
  if (isWindow) {
    const httpResp = await fetch(
      `https://api.heroku.com/apps/${appName}/config-vars`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          accept: 'application/vnd.heroku+json; version=3',
          authorization: `Bearer ${accessToken}`
        }
      }
    );
    const configVarsResp = await httpResp.json();

    if (httpResp.status >= 300) {
      throw new Error(configVarsResp.message)
    }

    return configVarsResp;

  } else {
    throw new Error('unexpected')
  }
}


export const getNewDBURL = async (
  token,
  appCreateCallback,
  addonCreateCallback,
  configVarsCallback,
  errorCallback
) => {
  try {
    const app = await createHerokuApp(token);
    appCreateCallback(app);
    const addOnn = await createPostgresAddon(app.name, token);
    addonCreateCallback(addOnn);
    const configVars = await getConfigVars(app.name, token);
    configVarsCallback(configVars)
    console.log(configVars);
  } catch (e) {
    errorCallback(e.message || 'unexpected');
  }
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
};