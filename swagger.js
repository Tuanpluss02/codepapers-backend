const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./app/routes/auth.route.js",
  "./app/routes/post.route.js",
  "./app/routes/comment.route.js",
];

const doc = {
  info: {
    version: "1.0.0",
    title: "Social Media API",
    description: "API Documentation for Social Media App",
  },
  servers: [
    {
      url: "http://localhost:3000/",
    },
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
      bearAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      SignUp: {
        $full_name: "Nguyen Van A",
        $email: "nguyenvana@gmail.com",
        $password: "Abc123!@#",
        $date_of_birth: "1999-01-01",
        avatar: "avatar.jpg"
      },
      SignIn: {
        $email: "nguyenvana@gmail.com",
        $password: "Abc123!@#",
      },
      ResetPassword: {
        $email: "nguyenvana@gmail.com",
      },
      Post: {
        $title: "Hello World!",
        $body: "This is my post",
      },
      Comment: {
        $content: "This is my comment",
      },
    },
  },
};
const options = {
  multipath: true,
};

swaggerAutogen(outputFile, endpointsFiles, doc, options);
