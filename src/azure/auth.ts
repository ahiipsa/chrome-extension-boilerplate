import {GRAPH_CONFIG, MSAL_CONFIG} from '../config';
import {UserAgentApplication} from 'msal';
import has = Reflect.has;

declare global {
  interface Window {
    Msal: any;
  }
}

const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read', 'User.ReadBasic.All'],
};

let signInType;

const myMSALObj = new UserAgentApplication(MSAL_CONFIG);

myMSALObj.handleRedirectCallback(authRedirectCallBack);

function isCallBackPage() {
  return !myMSALObj.isCallback(window.location.hash);
}

export function getAccount() {
  return myMSALObj.getAccount();
}

function isAuthed() {
  return Boolean(getAccount());
}

function authRedirectCallBack(error, response) {
  if (error) {
    console.log('authRedirectCallBack error', error);
    return;
  }

  if (response.tokenType === 'id_token' && isAuthed() && !isCallBackPage()) {
    console.log('id_token acquired at: ' + new Date().toString());
    getTokenRedirect(loginRequest);
    return;
  }

  if (response.tokenType === 'access_token') {
    console.log('access_token acquired at: ' + new Date().toString());
    return;
  }

  console.log('token type is:' + response.tokenType);
}

export function signIn() {
  myMSALObj.loginPopup(loginRequest)
    .then(loginResponse => {
      console.log('### loginPopup success', loginResponse);
    }).catch(function (error) {
      console.log(error);
    });
}

export function signOut() {
  myMSALObj.logout();
}

function getTokenPopup(request) {
  return myMSALObj.acquireTokenSilent(request)
    .catch(error => {
      console.log('silent token acquisition fails. acquiring token using popup');
      // fallback to interaction when silent call fails
      return myMSALObj.acquireTokenPopup(request)
        .then(tokenResponse => {
        }).catch(error => {
          console.log(error);
        });
    });
}

// This function can be removed if you do not need to support IE
function getTokenRedirect(request) {
  return myMSALObj.acquireTokenSilent(request)
    .then((response) => {
    }).catch(error => {
      console.log('silent token acquisition fails. acquiring token using redirect');
      // fallback to interaction when silent call fails
      return myMSALObj.acquireTokenRedirect(request);
    });
}

// ################################

function callMSGraph(endpoint, accessToken, callback) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  fetch(endpoint, options)
    .then(response => response.json())
    .then(response => callback(response, endpoint))
    .catch(error => console.log(error));
}

export async function loadProfile() {
  if (!myMSALObj.getAccount()) {
    return false;
  }

  const response = await getTokenPopup(loginRequest);

  if (response) {
    return new Promise((resolve, reject) => {
      callMSGraph(GRAPH_CONFIG.graphMeEndpoint, response.accessToken, (response) => {
        if (response) {
          return resolve(response)
        }

        return reject();
      });
    });
  }

  return false;
}


function updateUI(...args) {
  console.log('### update ui', args);
}
