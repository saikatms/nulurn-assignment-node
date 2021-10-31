const { sign } = require("jsonwebtoken");
// const { client } = require("./init_redis");

module.exports = {
  // Create tokens
  createAccessToken: (userId) => {
    return sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "43200m", // 30 days
    });
  },

  createRefreshToken: (userId) => {
    return sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  },
  // Send tokens
  sendAccessToken: (res, req, accesstoken) => {
    res.send({
      accesstoken,
      email: req.body.email,
    });
  },

  sendRefreshToken: (res, token) => {
    res.cookie("refreshtoken", token, {
      httpOnly: true,
      // path: '/refresh_token',
      path: "/",
    });
  },
  // verifyRefreshToken: (refreshToken) => {
  //   return new Promise((resolve, reject) => {
  //     JWT.verify(
  //       refreshToken,
  //       process.env.REFRESH_TOKEN_SECRET,
  //       (err, payload) => {
  //         if (err) return reject(createError.Unauthorized());
  //         const userId = payload.aud;
  //         client.GET(userId, (err, result) => {
  //           if (err) {
  //             console.log(err.message);
  //             reject(createError.InternalServerError());
  //             return;
  //           }
  //           if (refreshToken === result) return resolve(userId);
  //           reject(createError.Unauthorized());
  //         });
  //       }
  //     );
  //   });
  // },
};
