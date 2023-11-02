const express = require("express");
const chatRouter = express.Router();

const { chatController } = require("../controllers/chat.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

chatRouter.post(
  "/create",
  authenticateAccessToken,
  chatController.createConversation
);
chatRouter.post(
  "/join",
  authenticateAccessToken,
  chatController.joinConversation
);
chatRouter.post(
  "/leave",
  authenticateAccessToken,
  chatController.leaveConversation
);
chatRouter.post("/send", authenticateAccessToken, chatController.sendMessage);

chatRouter.get(
  "/getConversations",
  authenticateAccessToken,
  chatController.getConversations
);

chatRouter.get(
  "/getMessages",
  authenticateAccessToken,
  chatController.getMessages
);

module.exports = chatRouter;
