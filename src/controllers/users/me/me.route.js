const express = require("express");
const { authenticatedOnly } = require("../../../middlewares/auth.middleeware");
const usersMeService = require("../../../services/userme.service");
const {
  validateGetChallengesByMe,
} = require("../../../validate/users.vaildate");

const meRouter = express.Router();

// 내정보 가져오기
meRouter.get("/", authenticatedOnly, usersMeService.getUserMe);
// 참여 중인 챌린지 목록 조회
meRouter.get(
  "/challenges/ongoing",
  authenticatedOnly,
  validateGetChallengesByMe,
  usersMeService.getOngoingChallenges
);
// 완료한 챌린지 목록
meRouter.get(
  "/challenges/completed",
  validateGetChallengesByMe,
  authenticatedOnly,
  usersMeService.getCompletedChallenges
);
// 내가 신청한 챌린지 목록
meRouter.get(
  "/challenges/application",
  validateGetChallengesByMe,
  authenticatedOnly,
  usersMeService.getApplicaitonChallenges
);

module.exports = meRouter;
