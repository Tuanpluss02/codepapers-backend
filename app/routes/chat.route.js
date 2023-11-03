const express = require("express");
const chatRouter = express.Router();

const { chatController } = require("../controllers/chat.controller.js");
const { authenticateAccessToken } = require("../middlewares/authValidate.js");

chatRouter.post(
  "/chat/create",
  authenticateAccessToken,
  chatController.createConversation
);

chatRouter.post(
  "/chat/join",
  authenticateAccessToken,
  chatController.joinConversation
);

chatRouter.post(
  "/chat/leave",
  authenticateAccessToken,
  chatController.leaveConversation
);
chatRouter.post("/chat/send", authenticateAccessToken, chatController.sendMessage);

chatRouter.get(
  "/chat/getConversations",
  authenticateAccessToken,
  chatController.getConversations
);

chatRouter.get(
  "/chat/getMessages",
  authenticateAccessToken,
  chatController.getMessages
);

module.exports = chatRouter;
