const express = require("express");
const meRouter = require("./me/me.route");

const usersRouter = express.Router();

usersRouter.use("/me", meRouter);

module.exports = usersRouter;
