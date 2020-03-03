import * as React from 'react';
import {useCallback} from 'react';

type Props = {
  onLogin: () => void;
};

export const GuestBlock = React.memo<Props>(({onLogin}) => {
  const handleClickLogin = useCallback(() => {
    onLogin();
  }, [onLogin]);

  return (
    <div>
      <div>Please login by Microsoft</div>
      <button onClick={handleClickLogin}>
        Login
      </button>
    </div>
  );
});
