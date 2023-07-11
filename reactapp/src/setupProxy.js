const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/coin/GetAllCoins",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7116/api',
        secure: false
    });
    app.use(appProxy);
};
