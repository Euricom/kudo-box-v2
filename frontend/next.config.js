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
    AAD_LOGIN_URL: process.env.AAD_LOGIN_URL
  }
})