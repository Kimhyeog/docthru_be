const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Docthru",
    version: "1.0.0",
    description: "API documentation for docthru",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  // security: [{ BearerAuth: [] }],
  servers: [
    {
      url: "http://localhost:5000", // 배포 후에는 실제 도메인으로 변경
      description: "Local server",
    },
    {
      url: "https://docthru-be-5u42.onrender.com", // 배포 후에는 실제 도메인으로 변경
      description: "test server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./docs/*.yaml"], // API 문서화할 파일 경로
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
