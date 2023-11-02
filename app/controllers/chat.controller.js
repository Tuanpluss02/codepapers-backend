const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const chatQuery = require("../modules/chat.query");
const { v4: uuidv4 } = require("uuid");
const { getNow } = require("../utils/convertDate.js");

exports.chatController = {
  createConversation: async (req, res) => {
    try {
      const { conversation_name} = req.body;
      const conversation_id = uuidv4();
      const participant_id = uuidv4();
      const created_at = getNow();
      const result = await chatQuery.createConversation(
        conversation_id,
        conversation_name,
        created_at
      );
      await chatQuery.joinConversation(participant_id, conversation_id, req.user.user_id);
      return res.status(HTTPStatusCode.OK).json({
        message: "Create conversation successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
  joinConversation: async (req, res) => {
    try {
      const { conversation_id } = req.body;
      const isJoined = await chatQuery.checkUserInConversation(conversation_id, req.user.user_id);
      if (isJoined) { 
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "User already in conversation",
        });
      }
      const participant_id = uuidv4();
      const result = await chatQuery.joinConversation(
        participant_id,
        conversation_id,
        req.user.user_id
      );
      return res.status(HTTPStatusCode.OK).json({
        message: "Join conversation successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
  leaveConversation: async (req, res) => {
    try {
      const { conversation_id } = req.body;
      const isJoined = await chatQuery.checkUserInConversation(conversation_id, req.user.user_id);
      if (!isJoined) { 
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "User not in conversation",
        });
      }
      const result = await chatQuery.leaveConversation(
        conversation_id,
        req.user.user_id
      );
      return res.status(HTTPStatusCode.OK).json({
        message: "Leave conversation successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
  sendMessage: async (req, res) => {
    try {
      const { conversation_id, content } = req.body;
      const isJoined = await chatQuery.checkUserInConversation(conversation_id, req.user.user_id);
      if (!isJoined) { 
        return res.status(HTTPStatusCode.BadRequest).json({
          message: "User not in conversation",
        });
      }
      const message_id = uuidv4();
      const created_at = getNow();
      const result = await chatQuery.sendMessage(
        conversation_id,
        req.user.user_id,
        message_id,
        content,
        created_at
      );
      return res.status(HTTPStatusCode.OK).json({
        message: "Send message successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
  getConversations: async (req, res) => {
    try {
      const result = await chatQuery.getConversations(req.user.user_id);
      console.log(result);
      return res.status(HTTPStatusCode.OK).json({
        message: "Get conversations successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
  getMessages: async (req, res) => {
    try {
      const { conversation_id } = req.body;
      const result = await chatQuery.getMessages(conversation_id);
      return res.status(HTTPStatusCode.OK).json({
        message: "Get messages successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HTTPStatusCode.InternalServerError).json({
        message: error.message,
      });
    }
  },
};
