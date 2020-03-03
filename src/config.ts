import {Configuration} from 'msal';

export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: "f6b7d742-1bcd-4a31-ba2a-60a886b63bfb",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: chrome.extension.getURL('popup.html'),
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
  }
};

export const GRAPH_CONFIG = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphMailEndpoint: 'https://graph.microsoft.com/me/messages',
};
