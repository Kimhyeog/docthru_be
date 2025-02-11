const express = require("express");
const { challengeService } = require("../../services/challenge.service");
const { validateGetChallenges } = require("../../validate/challenge.validate");

const challengeRouter = express.Router();

challengeRouter.get("/", validateGetChallenges, challengeService.getChallenges);
challengeRouter.get("/:challengeId", challengeService.getChallenge);

module.exports = challengeRouter;
