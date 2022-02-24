const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:8000/',
    secure: false, //se https true
    logLevel: 'debug',
    pathRewrite: { '^/api': '' }
  }
];

module.exports = PROXY_CONFIG;
