const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma/client");
const { Role } = require("@prisma/client");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

function authMiddleware(req, res, next) {
  try {
    if (req.url === "/auth/signUp" || req.url === "/auth/logIn") return next();
    const token = req.headers.authorization;
    if (!token) {
      return next();
    }
    const accessToken = token.split("Bearer ")[1];
    const { sub } = jwt.verify(accessToken, jwtSecretKey);
    req.userId = sub;
    next();
  } catch (e) {
    next(e);
  }
}

function authenticatedOnly(req, res, next) {
  try {
    const userId = req.userId;
    const isAuthenticated = !!userId;
    if (!isAuthenticated) throw new Error("401/Unauthenticated");

    next();
  } catch (e) {
    next(e);
  }
}
//어드민인지 확인하는 미들웨어

async function adminOnly(req, res, next) {
  try {
    const userId = req.userId;
    const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
    if (user.role === Role.ADMIN) {
      next();
    } else {
      throw new Error("401/Unauthenticated : admin only");
    }
  } catch (e) {
    next(e);
  }
}

module.exports = { authMiddleware, authenticatedOnly, adminOnly };
