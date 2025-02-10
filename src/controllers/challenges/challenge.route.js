const express = require("express");
const { challengeService } = require("../../services/challenge.service");

const challengeRouter = express.Router();

challengeRouter.get("/", challengeService.getChallenges);

module.exports = challengeRouter;
