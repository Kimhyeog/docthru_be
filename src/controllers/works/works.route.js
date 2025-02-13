const express = require("express");
const workService = require("../../services/work.service");
const { validateCreateWork } = require("../../validate/work.validate");

const workRouter = express.Router();

workRouter.get("/");
// 챌린지 생성성
workRouter.post("/:challengeId", validateCreateWork, workService.createWork);

module.exports = workRouter;
