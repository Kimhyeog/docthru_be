const express = require("express");
const {
  authenticatedOnly,
  adminOnly,
} = require("../../middlewares/auth.middleeware");
const applicationService = require("../../services/application.service");

const applicationRouter = express.Router();

//어드민 신청한 신규 챌린지 목록 조회
applicationRouter.get(
  "/",
  authenticatedOnly,
  adminOnly,
  applicationService.getChallengeByAdmin
);
//신규 챌린지 신청 취소 어드민 말고 유저가 직접
applicationRouter.delete("/:applicationId");
//어드민 신청한 신규 챌린지 승인 및 거절
applicationRouter.put("/:applicationId");

module.exports = applicationRouter;
