const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const query = require("../modules/user.query.js");
const db = require("../services/database.service.js");
const authServices = require("../services/auth.service.js");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

exports.auth = {
  login: async (req, res) => {
    const accessToken = req.accessToken;
    const refreshToken = req.refreshToken;
    const user = req.user;
    return res.status(HTTPStatusCode.OK).json({
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    });
  },
  register: (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const profileAvatar = req.body.profileAvatar;
    const dateOfBirth = req.body.dateOfBirth;
    db.query(
      "SELECT * FROM users WHERE email = ?;",
      [email],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(HTTPStatusCode.InternalServerError).json({
            message: "Register failed",
          });
        }
        if (result.length > 0) {
          return res.status(HTTPStatusCode.BadRequest).json({
            message: "Email already exists",
          });
        }
        const hashedPassword = await authServices.hashPassword(password);
        db.query(
          "INSERT INTO users (fullName, email, password, profileAvatar, dateOfBirth) VALUES (?, ?, ?, ?, ?);",
          [
            name,
            email,
            hashedPassword,
            profileAvatar,
            dateOfBirth,
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(HTTPStatusCode.InternalServerError).json({
                message: "Register failed",
              });
            }
            console.log(result);
            const accessToken = authServices.generateToken(
              { _id: uuidv4() },
              process.env.ACCESS_TOKEN_SECRET
            );
            return res.status(HTTPStatusCode.OK).json({
              message: "Register successful",
              accessToken,
            });
          }
        );
      }
    );
  },
  verify: (req, res) => {
    res.status(HTTPStatusCode.OK).json({
      message: "Verify successful",
    });
  },
  refresh: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const payload = authServices.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!payload) {
      return res
        .status(HTTPStatusCode.Unauthorized)
        .send("Invalid refresh token");
    }
    const accessToken = authServices.generateToken(
      payload,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!accessToken) {
      return res
        .status(HTTPStatusCode.Unauthorized)
        .send("Invalid refresh token");
    }
    return res.status(HTTPStatusCode.OK).json({
      message: "Refresh token successful",
      accessToken: accessToken,
    });
  },
  logout: async (req, res) => {
    try {
      const id = req.body.id;
      const user = await query.getUserById(id);
      if (!user) {
        return res
          .status(HTTPStatusCode.Unauthorized)
          .send("User not found, check your id");
      }
      if (!user.refreshToken) {
        return res
          .status(HTTPStatusCode.Unauthorized)
          .send("User is not logged in");
      }
      await query.updateRefreshToken(id, null);
      return res.status(HTTPStatusCode.OK).json({
        message: "Logout successful",
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Logout failed",
      });
    }
  },
};
