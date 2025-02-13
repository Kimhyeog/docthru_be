const express = require("express");
const authService = require("../../services/auth.service");
const {
  validateSignUpContext,
  validateLogInContext,
} = require("../../validate/auth.validate");

const authRouter = express.Router();

authRouter.post("/signUp", validateSignUpContext, authService.signUp);
authRouter.post("/login", validateLogInContext, authService.logIn);
authRouter.post("/refreshToken", authService.refreshToken);
authRouter.post("/logout", authService.refreshToken);

module.exports = authRouter;
