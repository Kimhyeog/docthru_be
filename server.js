require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// 미들웨어
app.use(cors());
app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// 사용자 목록 조회
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// 사용자 추가
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({
    data: { name, email },
  });
  res.json(newUser);
});

//테스트

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
