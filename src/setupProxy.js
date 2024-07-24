const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/timer",
    createProxyMiddleware({
      // target url을 "/timer" 로 aliasing,
      // 서버 요청 시에는 .get("/timer/start") 등으로 전달 됨.
      target:
        "http://ec2-3-107-70-86.ap-southeast-2.compute.amazonaws.com/timer",
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
