const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/coin/GetAllCoins",
    "/coin/GetPaginatedCoins",
    "/coin/GetCountOfAllCoins",
    "/news/GetAllNews",
    "/user/signup",
    "/user/LogIn",
    "/user/GetUserByAccessToken",
    "/user/ChangeName",
    "/validatetoken/CheckToken",
    "/validatetoken/CheckAndGiveAccessToken",
    "/user/DeleteRefreshToken",
    "/user/ChangePassword",
    "/wallet/GetCountOfAllWallets",
    "/wallet/GetPaginatedWallets",
    "/wallet/BuyCoin",
    "/wallet/SellCoin",
    "/user/ChangeAvatar",
    "/post/GetUserPosts",
    "/post/GetCountOfUserPosts",
    "/post/CreatePost"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7116/api',
        secure: false
    });
    app.use(appProxy);
};