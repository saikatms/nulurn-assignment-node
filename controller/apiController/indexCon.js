const bcrypt = require("bcryptjs");

const tokens = require("../../config/tokens");
const { admin } = require("../../config/fbConfig");
const Users = require("../../model/users");
// var redis = require("redis");
// var JWTR = require("jwt-redis").default;
// var redisClient = redis.createClient();
// var jwtr = new JWTR(redisClient);

module.exports = {
  idTokenVerify: async (req, res) => {
    try {
      const { idToken } = req.body;
      if (idToken && idToken !== "" && idToken !== undefined) {
        admin
          .auth()
          .verifyIdToken(idToken)
          .then((decodedToken) => {
            const uid = decodedToken.uid;
            console.log(decodedToken);
            return res
              .status(200)
              .json({ status: "success", data: decodedToken });
          })
          .catch((error) => {
            return res
              .status(203)
              .json({ status: "error", error: error.message });
          });
      } else {
        return res
          .status(203)
          .json({ status: "error", error: "Sorry! Something went wrong." });
      }
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  },

  getNewTokens: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        let payload = null;
        payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (payload !== null) {
          const whereCon = { id: payload.userId, is_deleted: "0" };
          const checkResult = await dbFunction.fetchData(
            USER_MASTER,
            "",
            "",
            "",
            whereCon
          );
          if (checkResult.length > 0) {
            if (checkResult[0].refresh_token === refreshToken) {
              const accessToken = tokens.createAccessToken(checkResult[0].id);
              const newRefreshToken = tokens.createRefreshToken(
                checkResult[0].id
              );
              const editData = {
                refresh_token: newRefreshToken,
              };
              const updatewhereCon = { id: payload.userId };
              await dbFunction.update(USER_MASTER, editData, updatewhereCon);
              return res.status(200).json({
                status: "success",
                accessToken: `Bearer ${accessToken}`,
                refreshToken: newRefreshToken,
              });
            } else {
              return res
                .status(203)
                .json({ status: "error", message: "Invalid refresh token" });
            }
          } else {
            return res
              .status(203)
              .json({ status: "error", message: "Invalid refresh token" });
          }
        } else {
          return res
            .status(203)
            .json({ status: "error", message: "Invalid refresh token" });
        }
      } else {
        return res
          .status(203)
          .json({ status: "error", message: "Invalid refresh token" });
      }
    } catch (error) {
      return res.status(400).json({ status: "error", message: error.message });
    }
  },

  userRegistration: async (req, res) => {
    try {
      const { name, phone, country, address, gender, password } = req.body;
      if (
        name &&
        name !== "" &&
        country &&
        country !== "" &&
        phone &&
        phone !== "" &&
        address &&
        address !== "" &&
        gender &&
        gender !== "" &&
        password &&
        password !== ""
      ) {
        const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

        if (regex.test(phone)) {
          const checkUser = await Users.find({ phone: phone });
          if (checkUser.length === 0) {
            const user = new Users({
              name,
              phone,
              address,
              country,
              gender,
              password: await bcrypt.hash(password, 10),
              country,
            });
            const userResult = await user.save();

            const accesstoken = tokens.createAccessToken(userResult._id);
            const refreshToken = tokens.createRefreshToken(userResult._id);
            await Users.findByIdAndUpdate(
              userResult._id,
              {
                refreshToken: refreshToken,
                updatedAt: Date.now(),
              },
              { new: true }
            );
            return res.status(200).json({
              status: "success",
              data: userResult,
              accessToken: accesstoken,
              refreshToken: refreshToken,
            });
          } else {
            return res.status(400).json({
              status: "error",
              error: "Phone No already exists",
            });
          }
        } else {
          return res
            .status(400)
            .json({ status: "error", error: "Invalid Phone no" });
        }
      } else {
        return res
          .status(400)
          .json({ status: "error", error: "Sorry! Parameter missing." });
      }
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  },

  userLogin: async (req, res) => {
    try {
      const { phone, password } = req.body;
      if (phone && phone !== "" && password && password !== "") {
        const result = await Users.findOne({
          phone: phone,
        });
        if (result) {
          const matchResult = await bcrypt.compare(password, result.password);
          if (matchResult === true) {
            const accesstoken = tokens.createAccessToken(result._id);
            const refreshToken = tokens.createRefreshToken(result._id);

            const resultUsers = await Users.findByIdAndUpdate(
              result._id,
              {
                refreshToken: refreshToken,
                updatedAt: Date.now(),
              },
              { new: true }
            );

            return res.status(200).json({
              status: "success",
              data: resultUsers,
              accessToken: accesstoken,
              refreshToken: refreshToken,
            });
          } else {
            return res.status(400).json({
              status: "error",
              error: "Incorrect Username Or Password.",
            });
          }
        } else {
          return res
            .status(400)
            .json({ status: "error", error: "Sorry! No accounts found." });
        }
      } else {
        return res.status(400).json({
          status: "error",
          error: "Sorry! Enter your registered phone no and Password",
        });
      }
    } catch (error) {
      return res.status(400).json({ status: "error", error: error.message });
    }
  },
  searchUser: async (req, res) => {
    try {
      const { query } = req.body;
      let userPattern = new RegExp(query, "i");
      const searchResult = await Users.find({
        $or: [
          { phone: { $regex: userPattern } },
          { name: { $regex: userPattern } },
        ],
      });
      if (searchResult) {
        return res.status(200).json({
          status: "success",
          data: searchResult,
        });
      } else {
        return res.status(200).json({
          status: "success",
          error: "No matched items",
        });
      }
    } catch (error) {
      return res.status(400).json({ status: "error", error: error.message });
    }
  },
  userLogout: async (req, res) => {
    try {
      // const token = req.headers.authorization.split(" ")[1];
      // const { userId } = req.body;
      // redisClient.get(userId, (error, data) => {
      //   if (error) {
      //     response.send({ error });
      //   }
      //   if (data !== null) {
      //     const parsedData = JSON.parse(data);
      //     parsedData[userId].push(token);
      //     client.setex(userId, 3600, JSON.stringify(parsedData));
      //     return response.send({
      //       status: "Success",
      //       message: "Logout successful",
      //     });
      //   }
      //   const blacklistData = {
      //     [userId]: [token],
      //   };
      //   console.log(blacklistData);
      //   client.setex(userId, 3600, JSON.stringify(blacklistData));
      //   return response.send({
      //     status: "Success",
      //     message: "Logout successful",
      //   });
      // });
      let randomNumberToAppend = toString(Math.floor(Math.random() * 1000 + 1));
      let randomIndex = Math.floor(Math.random() * 10 + 1);
      let hashedRandomNumberToAppend = await bcrypt.hash(
        randomNumberToAppend,
        10
      );
      req.token = req.token + hashedRandomNumberToAppend;
      return res.status(200).json({ message: "logout" });
    } catch (error) {
      return res.status(400).json({ status: "error", error: error.message });
    }
  },
};
