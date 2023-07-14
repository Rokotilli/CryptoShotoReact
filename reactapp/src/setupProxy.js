const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/coin/GetAllCoins",
    "/news/GetAllNews",
    "/user/signup",
    "/user/LogIn",
    "/user/GetUserByAccessToken",
    "/user/ChangeName",
    "/validatetoken/CheckToken",
    "/validatetoken/CheckAndGiveAccessToken",
    "/user/DeleteRefreshToken",
    "/user/ChangePassword"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7116/api',
        secure: false
    });
    app.use(appProxy);
};