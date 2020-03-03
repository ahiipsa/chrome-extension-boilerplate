import {useCallback, useEffect, useState} from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as azure from '../azure/auth';
import {UserBlock} from './UserBlock';
import {GuestBlock} from './GuestBlock';
import '../styles/popup.css';

const App = () => {
  const [profile, setProfile] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    azure.loadProfile().then((profile) => {
      if (profile) {
        console.log('### profile', profile);
        setProfile(profile);
      }

      return true;
    }).finally(() => {
      setLoading(false);
    });
  }, [azure.getAccount()]);

  const handleLogout = useCallback(() => {
    azure.signOut();
    setProfile(null);
  }, []);

  const handleLogin = useCallback(() => {
    azure.signIn();
  }, []);

  const isAuth = Boolean(profile);

  return (
    <div className="popup-padded">
      <h1>{chrome.i18n.getMessage('l10nHello')}</h1>

      {
        loading && (<div>loading...</div>)
      }

      {!loading && isAuth &&
        <UserBlock email={profile.mail} name={profile.displayName} onLogout={handleLogout} />
      }
      {!loading && !isAuth &&
        <GuestBlock onLogin={handleLogin}/>
      }

    </div>
  );
};

// --------------

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
);
