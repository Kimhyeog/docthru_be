const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getFeedbacks = asyncHandler(async (req, res, next) => {
  const workId = req.params.workId;
  const { pageSize } = req.query;
  const feedbacks = await prisma.feedback.findMany({
    where: { workId },
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
  res.status(200).send(feedbacks);
});

const createFeedback = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const workId = req.params.workId;
  const { content } = req.body;
  const feedback = await prisma.feedback.create({
    data: { userId, workId, content },
  });
  res.status(200).send(feedback);
});

const updateFeedback = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const feedbackId = req.params.feedbackId;
  const { content } = req.body;
  let feedback = await prisma.feedback.findFirst({
    where: { id: feedbackId },
  });
  if (!feedback) throw new Error("404/feedback can't found");
  if (feedback.userId !== userId) throw new Error("401/unathorization");
  feedback = await prisma.feedback.update({
    where: { id: feedbackId },
    data: {
      content,
      createdAt: new Date(),
    },
  });
  res.status(200).send(feedback);
});

const deleteFeedback = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const feedbackId = req.params.feedbackId;
  let feedback = await prisma.feedback.findFirst({
    where: { id: feedbackId },
  });
  if (!feedback) throw new Error("404/feedback can't found");
  if (feedback.userId !== userId) throw new Error("401/unathorization");
  feedback = await prisma.feedback.delete({
    where: { id: feedbackId },
  });
  res.sendStatus(204);
});

const feedbackService = {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbacks,
};
module.exports = feedbackService;
