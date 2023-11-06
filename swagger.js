const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./app/routes/auth.route.js",
  "./app/routes/post.route.js",
  "./app/routes/comment.route.js",
  "./app/routes/follow.route.js",
  "./app/routes/chat.route.js",
];

const doc = {
  info: {
    version: "1.0.0",
    title: "Social Media API",
    description: "API Documentation for Social Media App",
  },
  servers: [
    {
      url: "http://localhost:3000",
      
    },
    {
      url: "https://glowing-xylophone-6q9pwww977h449p-3000.app.github.dev/",
    }
  ],

  tags: [
    {
      name: "Auth",
      description: "API for authentication",
    },
    {
      name: "Post",
      description: "API for post",
    },
    {
      name: "Comment",
      description: "API for comment",
    },
  ],
  schemes: ["http", "https"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      }
    },
    schemas: {
      SignUp: {
        $full_name: "Nguyen Van A",
        $email: "example@gmail.com",
        $password: "Uppercase, lowercase, number, special character",
        $date_of_birth: "yyyy-mm-dd",
        avatar: "avatar.jpg"
      },
      SignIn: {
        $email: "example@gmail.com",
        $password: "Abc123!@#",
      },
      ResetPassword: {
        $email: "example@gmail.com",
      },
      Post: {
        $title: "Hello World!",
        $body: "This is my post",
      },
      Comment: {
        $content: "This is example comment",
      },
      Follow: {
        $followed_id: "2r18541285412654",
      },
      Chat: {
        $conversation_id: "1324664821581",
        $content: "This is example chat",
      },
    },
  },
};
const options = {
  multipart: true,
};

swaggerAutogen(outputFile, endpointsFiles, doc, options);
