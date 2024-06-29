const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://ec2-3-107-70-86.ap-southeast-2.compute.amazonaws.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // '/api' 경로를 제거하여 기본 경로로 요청
      },
    })
  );
};
