import React from 'react';
import {
  HEROKU_OAUTH_ID
} from '../util/constants'
import {
  isWindow,
  getHerokuAuthUrl,
  getRandomString,
  persistRequestState,
  receiveMessageFromPopup,
  exchangeToken
} from '../util/utils';
import Loading from './Loading';
import '../styles/App.css';

const App = () => {

  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false);
  const [code, setCode] = React.useState(null);
  const [sessionInfo, setSessionInfo] = React.useState(null);
  const [dbURL, setDBUrl] = React.useState(null);

  const openPopup = () => {
    if (isWindow()) {

      // callback to receive message from pop
      const receiveMessageFromPopup = (event) => {
        const searchParams = new URLSearchParams(event.data);
        const responseState = searchParams.get('state');
        if (requestState !== responseState) {
          setError('Invalid response state');
        } else {
          setCode(searchParams.get('code'));
        }
        setLoading(false)
      }

      // clear any existing message event listeners TODO check with team
      window.removeEventListener('message', receiveMessageFromPopup);

      // generate a random string as anti-forgery-token
      const requestState = getRandomString();

      // open popup
      setLoading(true);
      const popup = window.open(
        getHerokuAuthUrl(requestState),
        'heroku-auth',
        `menubar=no,toolbar=no,location=no,width=800,height=600`
      );

      // receive callback from popup
      window.addEventListener('message', receiveMessageFromPopup, false);

    }

  };

  React.useEffect(() => {
    if (code) {
      try {
        exchangeToken(
          code,
          (sess) => setSessionInfo(sess),
          err => setError(err)
        );
      } catch(e) {
        setError(e.message || 'unexpected');
      }
    }
  }, [code]);


  return (
    <div
      className="display-flex App"
    >
      <div className="display-flex-column">
        <div>
          {
            dbURL && (
              <input
                value={dbURL || ""}
                readOnly
                placeholder={"DATABASE_URL"}
                className="dburl"
              />
            )
          }
        </div>
        <button
          onClick={openPopup}
          className="loginButton"
          disabled={!!sessionInfo}
        >
          Try free Postgres from Heroku
        </button>
        {
          sessionInfo && (
            <Loading sessionInfo={sessionInfo} setDBUrl={setDBUrl}/>
          )
        }
      </div>
    </div>
  );
}

export default App;
