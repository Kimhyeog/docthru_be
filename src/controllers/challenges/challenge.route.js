const express = require("express");
const { challengeService } = require("../../services/challenge.service");
const { validateGetChallenges } = require("../../validate/challenge.validate");

const challengeRouter = express.Router();

challengeRouter.get("/", validateGetChallenges, challengeService.getChallenges);

module.exports = challengeRouter;
