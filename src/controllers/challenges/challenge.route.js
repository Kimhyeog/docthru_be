const express = require("express");
const { challengeService } = require("../../services/challenge.service");
const {
  validateGetChallenges,
  validateCreateChallenge,
} = require("../../validate/challenge.validate");
const { authenticatedOnly } = require("../../middlewares/auth.middleeware");

const challengeRouter = express.Router();

challengeRouter.get("/", validateGetChallenges, challengeService.getChallenges);
challengeRouter.get("/:challengeId", challengeService.getChallenge);
challengeRouter.post(
  "/",
  validateCreateChallenge,
  authenticatedOnly,
  challengeService.createChallenge
);

module.exports = challengeRouter;
