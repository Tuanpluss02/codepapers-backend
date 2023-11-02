const { validator } = require("../utils/validator");
const HTTPStatusCode = new (require("../common/constants/HttpStatusCode"))();
const { v4: uuidv4 } = require("uuid");
// Middleware kiểm tra body request
exports.validateReqBody = (req, res, next) => {
  const { email, password, full_name } = req.body;
  if (!email || !password) {
    return res.status(HTTPStatusCode.BadRequest).json({
      message: "Missing required fields",
    });
  }
  req.body.email = email ? email.toLowerCase() : email;
  if (!validator.isValidEmail(email)) {
    return res.status(HTTPStatusCode.BadRequest).json({
      message: "Invalid email",
    });
  }
  if (!validator.isValidPassword(password)) {
    return res.status(HTTPStatusCode.BadRequest).json({
      message:
        "Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter and 1 number",
    });
  }
  if (full_name && !validator.isValidName(full_name)) {
    return res.status(HTTPStatusCode.BadRequest).json({
      message: "Invalid full_name",
    });
  }
  return next();
};

exports.isValidID = (req, res, next) => {
  const id = req.body.id;
  if (isNaN(id)) {
    return res.status(HTTPStatusCode.BadRequest).json({
      message: "ID must be a number",
    });
  }
  req.body.id = id;
  return next();
};

exports.generateUserID = async (req, res, next) => { 
  const user_id = uuidv4();
  req.body.user_id = user_id;
  return next();
}