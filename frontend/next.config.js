const withPWA = require('next-pwa')

// module.exports = withPWA({
//   pwa: {
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
//     dynamicStartUrl: false
//   },
//   env: {
//     AAD_CLIENT_ID: process.env.AAD_CLIENT_ID,
//     AAD_LOGIN_URL: process.env.AAD_LOGIN_URL
//   }
// })

module.exports = {
  env: {
    AAD_CLIENT_ID: process.env.AAD_CLIENT_ID,
    AAD_LOGIN_URL: process.env.AAD_LOGIN_URL,
    AAD_DEFAULT_SCOPE: process.env.AAD_DEFAULT_SCOPE,
    API_URL: process.env.API_URL
  }
}