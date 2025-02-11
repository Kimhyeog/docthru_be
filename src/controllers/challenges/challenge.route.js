const express = require("express");
const { challengeService } = require("../../services/challenge.service");
const {
  validateGetChallenges,
  validateCreateChallenge,
} = require("../../validate/challenge.validate");
const {
  authenticatedOnly,
  adminOnly,
} = require("../../middlewares/auth.middleeware");

const challengeRouter = express.Router();
//챌린지 목록 보기
challengeRouter.get("/", validateGetChallenges, challengeService.getChallenges);
//특정 챌린지 보기
challengeRouter.get("/:challengeId", challengeService.getChallenge);
// 챌린지 생성
challengeRouter.post(
  "/",
  validateCreateChallenge,
  authenticatedOnly,
  challengeService.createChallenge
);
// 챌린지 참여하기
challengeRouter.post(
  "/:challengeId/participation",
  authenticatedOnly,
  challengeService.participateChallenge
);
// 어드민 챌린지 수정
challengeRouter.put("/:challengeId", authenticatedOnly, adminOnly);
// 어드민 챌린지 삭제
challengeRouter.delete("/:challengeId", authenticatedOnly, adminOnly);

module.exports = challengeRouter;
