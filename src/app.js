require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const router = require("./controllers/route");
const { errorHandler } = require("./middlewares/error.middleware");
const swaggerSpec = require("../config/swagger");
require("./utils/challengeScheduler");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 미들웨어
app.use(cors());
app.use(express.json());

app.use(router);

app.use(errorHandler);

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
