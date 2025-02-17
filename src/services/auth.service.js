const prisma = require("../db/prisma/client");
const bcrypt = require("bcrypt");
const { asyncHandler } = require("../middlewares/error.middleware");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

function createToken(data) {
  try {
    const payload = {
      sub: data.id,
      email: data.email,
      nickname: data.nickname,
    };
    const accessToken = jwt.sign(payload, jwtSecretKey, {
      expiresIn: "2h",
    });
    const refreshToken = jwt.sign(payload, jwtSecretKey, {
      expiresIn: "5d",
    });
    return { accessToken, refreshToken };
  } catch (e) {
    throw new Error(e);
  }
}

const signUp = asyncHandler(async (req, res, next) => {
  const { email, password, nickname } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 12);

  let existingUser = await prisma.user.findUnique({
    where: { email },
    omit: { encryptedPassword: true },
  });
  if (existingUser) throw new Error("400/사용중인 이메일입니다.");

  existingUser = await prisma.user.findUnique({
    where: { nickname },
    omit: { encryptedPassword: true },
  });
  if (existingUser) throw new Error("400/사용중인 닉네임입니다.");

  const newUser = await prisma.user.create({
    data: { email, encryptedPassword, nickname },
  });

  res.status(201).send(newUser);
});

const logIn = asyncHandler(async (req, res, next) => {
  const result = await prisma.$transaction(async (prisma) => {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { encryptedPassword: true },
    });
    if (!existingUser) throw new Error("401/user does not exist");
    const passwordCheck = await bcrypt.compare(
      password,
      existingUser.encryptedPassword
    );
    if (!passwordCheck) throw new Error("401/Incorrect password");

    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
    });
    const data = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
    const { accessToken, refreshToken } = createToken(data);
    return { accessToken, refreshToken, user };
  });

  res.status(201).send(result);
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: prevRefreshToken } = req.body;
  const { sub, email, nickname } = jwt.verify(prevRefreshToken, jwtSecretKey);
  const data = {
    id: sub,
    email,
    nickname,
  };
  const { accessToken, refreshToken } = createToken(data);
  res.status(200).send({ accessToken, refreshToken });
});

const authService = { signUp, logIn, refreshToken };

module.exports = authService;
