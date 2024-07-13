const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/timer",
    createProxyMiddleware({
      target: "http://ec2-3-107-70-86.ap-southeast-2.compute.amazonaws.com",
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
