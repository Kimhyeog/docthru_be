const express = require("express");

const authRouter = express.Router();

authRouter.post("/signUp");
authRouter.post("/login");
authRouter.post("/logout");

module.exports = authRouter;
