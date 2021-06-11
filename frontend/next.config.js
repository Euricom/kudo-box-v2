const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    dynamicStartUrl: false
  },
  env: {
    AAD_CLIENT_ID: process.env.AAD_CLIENT_ID,
    AAD_LOGIN_URL: process.env.AAD_LOGIN_URL,
    AAD_DEFAULT_SCOPE: process.env.AAD_DEFAULT_SCOPE,
    API_URL: process.env.API_URL,
    WS_SELECT_EVENT: process.env.WS_SELECT_EVENT,
    WS_EVENT_NAMESPACE: process.env.WS_EVENT_NAMESPACE,
    WS_NEW_KUDO: process.env.WS_NEW_KUDO,
  }
})