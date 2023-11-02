const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const userQuery = require("../modules/user.query.js");
const authServices = require("../services/auth.service.js");
const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
  service: "hotmail",
  host: process.env.HOST_RS,
  port: 587,
  auth: {
    user: process.env.EMAIL_RS,
    pass: process.env.PASSWORD_RS,
  },
});
const crypto = require("crypto");

const { v4: uuidv4 } = require("uuid");
const { getPayloadFromToken } = require("../services/auth.service.js");
require("dotenv").config();

exports.authController = {
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

  register: async (req, res) => {
    let { email, full_name, password, date_of_birth } = req.body;
    const avatar = req.file;
    if (!avatar) {
      return res.status(HTTPStatusCode.BadRequest).json({
        message: "Avatar is required",
      });
    }
    const profile_avatar = avatar.path;
    const relativePath = profile_avatar.split("public")[1];
    const profile_avatar_res = relativePath.replace(/\\/g, "/");
    try {
      const userList = await userQuery.getUsers(email);
      if (userList.length > 0) {
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "Email already exists",
        });
      }
      const user_id = req.body.user_id;
      const hashedPassword = await authServices.hashPassword(password);
      password = hashedPassword;
      const createUser = await userQuery.createUser(
        user_id,
        full_name,
        email,
        password,
        profile_avatar_res,
        date_of_birth
      );
      if (!createUser) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Register failed",
        });
      }
      const payloadAccessToken = {
        _id: user_id,
      };
      const accessToken = authServices.generateToken(
        payloadAccessToken,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE.toString()
      );
      return res.status(HTTPStatusCode.OK).json({
        message: "Register successful",
        accessToken,
      });
    } catch (error) {
      console.log(error);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Register failed",
      });
    }
  },

  verify: (req, res) => {
    const token = req.body.token;
    const payload = authServices.verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!payload) {
      return res.status(HTTPStatusCode.Unauthorized).send("Invalid token");
    }
    return res.status(HTTPStatusCode.OK).json({
      message: "Verify successful",
    });
  },

  refresh: async (req, res) => {
    const refreshToken = req.body.refreshToken;
    const user_id = getPayloadFromToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )._id;
    const blacklistToken = await userQuery.getBlacklistToken(user_id);

    if (blacklistToken.includes(refreshToken)) {
      return res
        .status(HTTPStatusCode.Unauthorized)
        .send("Refresh token is blacklisted");
    }

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
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE.toString()
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
      const access_token = req.headers.authorization.split(" ")[1];
      const id = getPayloadFromToken(
        access_token,
        process.env.ACCESS_TOKEN_SECRET
      )._id;
      console.log(id);
      const user = await userQuery.getUserById(id);
      if (!user) {
        return res
          .status(HTTPStatusCode.Unauthorized)
          .send("User not found, check your id");
      }
      if (!user.refresh_token) {
        return res
          .status(HTTPStatusCode.Unauthorized)
          .send("User is not logged in");
      }
      await userQuery.updateBlacklistToken(
        user.user_id,
        access_token,
        user.refresh_token
      );
      await userQuery.updateRefreshToken(id, null);
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

  getTokenReset: async (req, res) => {
    try {
      const host = req.get("host");
      const http = req.protocol;
      const email = req.body.email;
      crypto.randomBytes(20, async (err, buffer) => {
        const token = buffer.toString("hex");
        const user = await userQuery.getUsers(email);
        if (user.length === 0) {
          return res.status(HTTPStatusCode.BadRequest).json({
            message: "Email not found",
          });
        }
        await userQuery.updateResetPasswordToken(user.data[0].user_id, token);
        const expireTime = new Date(Date.now() + 300000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        await userQuery.updateResetPasswordExpires(
          user.data[0].user_id,
          expireTime
        );
        const data = {
          from: process.env.EMAIL_RS,
          to: email,
          subject: "Reset password",
          html:
            `<h1>Reset password</h1>` +
            `<p>Click <a href="${http}://${host}/auth/reset/${token}">here</a> to reset your password</p>`,
        };
        transporter.sendMail(data, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
            return res.status(HTTPStatusCode.OK).json({
              message: "Reset password email sent",
            });
          }
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Server error",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const token = req.params.token;
      const password = req.body.password;
      const user = await userQuery.getUserByResetPasswordToken(token);
      if (!user) {
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "Invalid token",
        });
      }
      if (user.reset_password_expires <= Date.now()) {
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "Token expired",
        });
      }
      const hashedPassword = await authServices.hashPassword(password);
      await userQuery.updatePassword(user.user_id, hashedPassword);
      await userQuery.updateResetPasswordToken(user.user_id, null);
      await userQuery.updateResetPasswordExpires(user.user_id, null);
      return res.status(HTTPStatusCode.OK).json({
        message: "Reset password successful",
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: "Server error",
      });
    }
  },
};
