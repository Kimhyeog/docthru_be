const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");
const notificationService = require("./notification.service");

const getFeedbacks = asyncHandler(async (req, res, next) => {
  const workId = req.params.workId;
  // const { pageSize } = req.query;
  const feedbacks = await prisma.feedback.findMany({
    where: { workId },
    // take: pageSize,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { nickname: true } } },
  });
  const totalCount = await prisma.feedback.count({
    where: { workId },
  });

  res.status(200).send({ feedbacks, totalCount });
});

// challenge의 상태 보고 됬다 안됬다 하게
const createFeedback = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const workId = req.params.workId;
  const challenge = await prisma.challenge.findFirstOrThrow({
    where: { work: { some: { id: workId } } },
    select: { progress: true, title: true },
  });
  if (challenge.progress === "COMPLETED")
    throw new Error("400/challenge not found or challenge already completed");
  const { content } = req.body;
  const feedback = await prisma.feedback.create({
    data: { userId, workId, content },
  });
  notificationService.notifyNewFeedback(challenge.title, userId, workId);
  res.status(200).send(feedback);
});

const updateFeedback = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const feedbackId = req.params.feedbackId;
  const { content } = req.body;

  let feedback = await prisma.feedback.findFirst({
    where: { id: feedbackId },
  });
  const user = await prisma.user.findFirst({ where: { id: userId } });
  if (feedback.userId !== userId && user.role !== "ADMIN")
    throw new Error("401/unathorization");
  const challenge = await prisma.challenge.findFirstOrThrow({
    where: { work: { some: { id: feedback.workId } } },
    select: { progress: true },
  });
  if (!feedback) throw new Error("404/feedback can't found");
  if (user.role !== "ADMIN") {
    if (challenge.progress === "COMPLETED")
      throw new Error("400/challenge not found or challenge already completed");
  }
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
  const user = await prisma.user.findFirst({ where: { id: userId } });
  if (feedback.userId !== userId && user.role !== "ADMIN")
    throw new Error("401/unathorization");
  const challenge = await prisma.challenge.findFirstOrThrow({
    where: { work: { some: { id: feedback.workId } } },
    select: { progress: true },
  });
  if (user.role !== "ADMIN") {
    if (challenge.progress === "COMPLETED")
      throw new Error("400/challenge not found or challenge already completed");
  }

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
