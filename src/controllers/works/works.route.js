const express = require("express");
const workService = require("../../services/work.service");
const { validateCreateWork } = require("../../validate/work.validate");
const { authenticatedOnly } = require("../../middlewares/auth.middleeware");
const feedbackService = require("../../services/feedback.service");
const {
  validateGetFeedback,
  validateFeedback,
} = require("../../validate/feedback.validate");

const workRouter = express.Router();

// 작업물 조회 좋아요 순으로
workRouter.get("/:challengeId/many", workService.getWorks);
// 특정 작업물 조회
workRouter.get("/:workId", workService.getWork);
// 좋아요 가장 많은 작품들 조회
workRouter.get("/:challengeId/topLike", workService.getTopLikedWorks);

// 작업물 생성
workRouter.post(
  "/:challengeId",
  validateCreateWork,
  authenticatedOnly,
  workService.createWork
);
// 작업물 삭제
workRouter.delete("/:workId", authenticatedOnly, workService.deleteWork);

//임시저장
workRouter.post(
  "/:challengeId/save",
  validateCreateWork,
  authenticatedOnly,
  workService.saveWork
);
//임시저장 불러오기
workRouter.get(
  "/:challengeId/save",
  authenticatedOnly,
  workService.getSavedWork
);

// 작업물 수정
workRouter.put(
  "/:workId",
  validateCreateWork,
  authenticatedOnly,
  workService.updateWork
);

// 작업물 좋아요
workRouter.post("/:workId/like", authenticatedOnly, workService.workLike);
// 작업물 좋아요 해제
workRouter.delete("/:workId/like", authenticatedOnly, workService.workDislike);

//피드백 조회
workRouter.get(
  "/:workId/feedback",
  validateGetFeedback,
  feedbackService.getFeedbacks
);

//피드백 작성
workRouter.post(
  "/:workId/feedback",
  validateFeedback,
  authenticatedOnly,
  feedbackService.createFeedback
);

module.exports = workRouter;
