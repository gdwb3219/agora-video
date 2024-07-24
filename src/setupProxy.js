const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/timer",
    createProxyMiddleware({
      // target url을 "/timer" 로 aliasing,
      // 서버 요청 시에는 .get("/timer/start") 등으로 전달 됨.
      // 개발서버
      // target: "http://127.0.0.1:8000/timer",
      // 배포 서버
      target: "https://www.api.monst-ar.com/timer",
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.path}`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Received response from target: ${proxyRes.statusCode}`);
      },
    })
  );
};
