const express = require("express");
const workService = require("../../services/work.service");
const { validateCreateWork } = require("../../validate/work.validate");

const workRouter = express.Router();

// 작업물 조회 좋아요 순으로
workRouter.get("/:challengeId/many", workService.getWorks);
// 특정 작업물 조회
workRouter.get("/:workId", workService.getWork);

// 작업물 생성
workRouter.post("/:challengeId", validateCreateWork, workService.createWork);

// 작업물 수정
workRouter.put("/:workId", validateCreateWork, workService.updateWork);

// 작업물 삭제
workRouter.delete("/:challengeId", workService.deleteWork);

module.exports = workRouter;
