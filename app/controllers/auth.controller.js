const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const query = require("../modules/user.query.js");
const authServices = require("../services/auth.service.js");
const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
  service: "hotmail",
  host: "smtp-mail.outlook.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_RS,
    pass: process.env.PASSWORD_RS,
  },
});
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
  register: async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    // const profileAvatar = req.body.profileAvatar;
    const profileAvatar = req.file;
    console.log(profileAvatar);
    const dateOfBirth = req.body.dateOfBirth;
    try {
      const userList = await query.getUsers(email);
      if (userList.length > 0) {
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "Email already exists",
        });
      }
      const hashedPassword = await authServices.hashPassword(password);
      const createUser = await query.createUser(
        name,
        email,
        hashedPassword,
        profileAvatar,
        dateOfBirth
      );
      if (!createUser) {
        return res.status(HTTPStatusCode.InternalServerError).json({
          message: "Register failed",
        });
      }
      const accessToken = authServices.generateToken(
        {
          id: uuidv4(),
          exp:
            Math.floor(Date.now() / 1000) +
            parseInt(process.env.REFRESH_TOKEN_LIFE),
        },
        process.env.ACCESS_TOKEN_SECRET
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
  getTokenReset: async (req, res) => {
    try {
      const host = req.get("host");
      const http = req.protocol;
      const email = req.body.email;
      const buffer = crypto.randomBytes(20);
      const token = buffer.toString("hex");
      const user = await query.getUsers(email);
      if (user.length === 0) {
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "Email not found",
        });
      }
      await query.updateResetPasswordToken(user[0].id, token);
      await query.updateResetPasswordExpires(user[0].id, Date.now() + 300000);
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
      const user = await query.getUserByResetPasswordToken(token);
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
      await query.updatePassword(user.id, hashedPassword);
      await query.updateResetPasswordToken(user.id, null);
      await query.updateResetPasswordExpires(user.id, null);
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
