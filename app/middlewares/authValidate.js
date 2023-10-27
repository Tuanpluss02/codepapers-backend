const userQuery = require("../modules/user.query");
const tokenQuery = require("../modules/token.query");
const { getPayloadFromToken } = require("../services/auth.service.js");
const { comparePassword } = require("../services/auth.service.js");
const { generateToken, verifyToken } = require("../services/auth.service.js");
const HTTPStatusCode = new (require("../common/constants/HttpStatusCode"))();

// Middleware xác thực mật khẩu
exports.authenticatePassword = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const dataQuery = await userQuery.getUsers(email);
  if (
    dataQuery.length === 0 ||
    comparePassword(password, dataQuery.data[0].password) === false
  ) {
    return res
      .status(HTTPStatusCode.Unauthorized)
      .send("Invalid email or password");
  }
  req.user = dataQuery.data[0];
  next();
};

// Middleware tạo access token và refresh token
exports.generateTokens = async (req, res, next) => {
  const user = req.user;
  const payloadAccessToken = {
    _id: user.user_id,
    // exp: parseInt(process.env.ACCESS_TOKEN_LIFE),
    // Math.floor(Date.now() / 1000) + parseInt(process.env.ACCESS_TOKEN_LIFE),
  };
  const payloadRefreshToken = {
    _id: user.user_id,
    // exp: parseInt(process.env.REFRESH_TOKEN_LIFE),
    // Math.floor(Date.now() / 1000) + parseInt(process.env.REFRESH_TOKEN_LIFE),
  };
  const accessToken = generateToken(
    payloadAccessToken,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_LIFE.toString()
  );
  if (!accessToken) {
    return res
      .status(HTTPStatusCode.Unauthorized)
      .send("Login failed, please try again");
  }

  let refreshToken = generateToken(
    payloadRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_LIFE.toString()
  );
  if (!user.refreshToken) {
    await userQuery
      .updateRefreshToken(user.user_id, refreshToken)
      .catch((err) => {
        console.error(err);
        return res
          .status(HTTPStatusCode.Unauthorized)
          .send("Login failed, please try again");
      });
  } else {
    refreshToken = user.refreshToken;
  }

  req.accessToken = accessToken;
  req.refreshToken = refreshToken;
  next();
};

// Middleware kiểm tra refresh token
exports.authenticateRefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  let payload;
  try {
    payload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res
      .status(HTTPStatusCode.Unauthorized)
      .send("Refresh token expired, please login again");
  }
  if (!payload) {
    return res
      .status(HTTPStatusCode.Unauthorized)
      .send("Invalid refresh token");
  }
  const dataQuery = await userQuery.getUsers(payload.id);
  if (
    dataQuery.length === 0 ||
    dataQuery.data[0].refreshToken !== refreshToken
  ) {
    return res
      .status(HTTPStatusCode.Unauthorized)
      .send("Invalid refresh token");
  }
  req.user = dataQuery.data[0];
  next();
};

exports.authenticateAccessToken = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const isNotValidToken = await tokenQuery.isValidToken(accessToken);
  if (isNotValidToken) {
    return res
      .status(HTTPStatusCode.Unauthorized)
      .send("Access token is blacklisted");
  }

  try {
    verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatusCode.Unauthorized).send("Access token expired");
  }
  const id = getPayloadFromToken(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  )._id;

  const dataQuery = await userQuery.getUserById(id);
  if (dataQuery.length === 0) {
    return res.status(HTTPStatusCode.Unauthorized).send("Invalid access token");
  }
  req.user = dataQuery;
  next();
};
