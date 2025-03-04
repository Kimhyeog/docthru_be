const express = require("express");
const meRouter = require("./me/me.route");
const usersMeService = require("../../services/userme.service");

const usersRouter = express.Router();

usersRouter.use("/me", meRouter);
usersRouter.get("/:userId", usersMeService.getUserData);

module.exports = usersRouter;
