const HTTPStatusCode = new (require("../common/constants/HttpStatusCode.js"))();
const chatQuery = require("../modules/chat.query");
const { v4: uuidv4 } = require("uuid");
const { getNow } = require("../utils/convertDate.js");

exports.chatController = {
  joinConversation: async (req, res, next) => {
    /*
      #swagger.tags = ['Chat']
      #swagger.summary = 'Join conversation'
      #swagger.description = 'Endpoint to join conversation'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.requestBody = {
        "content": {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                "conversation_id": {
                  type: "string"
                }
              },
              required: ["conversation_id"]
            }
          }
        }
      }
    */
    try {
      const { conversation_id } = req.body;
      const isJoined = await chatQuery.checkUserInConversation(
        conversation_id,
        req.user.user_id
      );
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
      error.message = "Join conversation failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  createConversation: async (req, res, next) => {
    /*
      #swagger.tags = ['Chat']
      #swagger.summary = 'Create conversation'
      #swagger.description = 'Endpoint to create conversation'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.requestBody = {
        "content": {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                "conversation_name": {
                  type: "string",
                  description: "Conversation name",
                  example: "Group 1"
                  
                }
              },
              required: ["conversation_name"]
            }
          }
        }
      }
    */
    try {
      const { conversation_name } = req.body;
      const conversation_id = uuidv4();
      const participant_id = uuidv4();
      const created_at = getNow();
      const result = await chatQuery.createConversation(
        conversation_id,
        conversation_name,
        created_at
      );
      await chatQuery.joinConversation(
        participant_id,
        conversation_id,
        req.user.user_id
      );
      return res.status(HTTPStatusCode.OK).json({
        message: "Create conversation successfully",
        conversation_id: conversation_id,
        data: result,
      });
    } catch (error) {
      error.message = "Create conversation failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  leaveConversation: async (req, res, next) => {
    /*
      #swagger.tags = ['Chat']
      #swagger.summary = 'Leave conversation'
      #swagger.description = 'Endpoint to leave conversation'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.requestBody = {
        "content": {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                "conversation_id": {
                  type: "string"
                }
              },
              required: ["conversation_id"]
            }
          }
        }
      }
    */
    try {
      const { conversation_id } = req.body;
      const isJoined = await chatQuery.checkUserInConversation(
        conversation_id,
        req.user.user_id
      );
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
      error.message = "Leave conversation failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  sendMessage: async (req, res, next) => {
    /*
      #swagger.tags = ['Chat']
      #swagger.summary = 'Send message'
      #swagger.description = 'Endpoint to send message'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.requestBody = {
        "content": {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                "conversation_id": {
                  type: "string"
                },
                "content": {
                  type: "string"
                }
              },
              required: ["conversation_id", "content"]
            }
          }
        }
      }
    */
    try {
      const { conversation_id, content } = req.body;
      const isJoined = await chatQuery.checkUserInConversation(
        conversation_id,
        req.user.user_id
      );
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
      error.message = "Send message failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  getConversations: async (req, res, next) => {
    /*
      #swagger.tags = ['Chat']
      #swagger.summary = 'Get conversations'
      #swagger.description = 'Endpoint to get conversations'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
    */
    try {
      const result = await chatQuery.getConversations(req.user.user_id);
      console.log(result);
      return res.status(HTTPStatusCode.OK).json({
        message: "Get conversations successfully",
        data: result,
      });
    } catch (error) {
      error.message = "Get conversations failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
  getMessages: async (req, res, next) => {
    /*
      #swagger.tags = ['Chat']
      #swagger.summary = 'Get all messages in conversation'
      #swagger.description = 'Endpoint to get messages'
      #swagger.security = [{
        "bearerAuth": []
      }]
      #swagger.parameters['authorization'] = {
        in: 'header',
        description: 'Access token (not required if you lock authorize)',
        required: false,
        type: 'string',
      }
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Conversation id',
        required: true,
        type: 'string',
      }
    */
    try {
      const conversation_id = req.params.id;
      const result = await chatQuery.getMessages(conversation_id);
      return res.status(HTTPStatusCode.OK).json({
        message: "Get messages successfully",
        data: result,
      });
    } catch (error) {
      error.message = "Get messages failed";
      error.status = HTTPStatusCode.InternalServerError;
      next(error);
    }
  },
};
