const express = require("express");
const { authenticatedOnly } = require("../../middlewares/auth.middleeware");
const feedbackService = require("../../services/feedback.service");
const { validateFeedback } = require("../../validate/feedback.validate");

const feedbackRouter = express.Router();

feedbackRouter.put(
  "/:feedbackId",
  validateFeedback,
  authenticatedOnly,
  feedbackService.updateFeedback
);
feedbackRouter.delete(
  "/:feedbackId",
  authenticatedOnly,
  feedbackService.deleteFeedback
);
module.exports = feedbackRouter;
