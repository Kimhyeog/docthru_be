const express = require("express");
const meRouter = require("./me/me.route");
const usersMeService = require("../../services/userme.service");

const usersRouter = express.Router();

usersRouter.get("/:userId", usersMeService.getUserData);
usersRouter.use("/me", meRouter);

module.exports = usersRouter;
