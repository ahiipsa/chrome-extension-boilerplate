import {useCallback} from 'react';
import * as React from 'react';

type Props = {
  email: string;
  name: string;
  onLogout: () => void;
};

export const UserBlock: React.FC<Props> = React.memo(({email, name, onLogout}) => {

  const handleClickLogout = useCallback(() => {
    onLogout();
  }, [onLogout]);

  return (
    <div>
      <div>
        <img alt="avatar" src="https://graph.microsoft.com/v1.0/me/photos/48x48/$value" />
      </div>
      <div>
        {name}
      </div>
      <div>
        {email}
      </div>
      <button onClick={handleClickLogout}>
        logout
      </button>
    </div>
  );
})
