const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const createNotification = async (
  userId,
  message,
  challengeId = null,
  workId = null
) => {
  return await prisma.notification.create({
    data: {
      userId,
      message,
      challengeId,
      workId,
    },
  });
};
// 어디민이 승인 혹은 거절 삭제 했을때 /challengeId는 저장했다가 이동할떄 쓰기기
const notifyChallengeStatus = async (challengeId, newStatus) => {
  const challenge = await prisma.challenge.findFirst({
    where: { id: challengeId },
    include: {
      application: {
        include: { user: true },
      },
    },
  });

  const userId = challenge.application.user.id;
  const title = challenge.title;
  const message = `${title} 챌린지가 관리자에 의해 ${newStatus}되었어요`;
  createNotification(userId, message, challengeId);
};

//작업물 추가
const notifyNewWork = async (challengeId, writerId, workId) => {
  const challenge = await prisma.challenge.findFirst({
    where: { id: challengeId },
    include: {
      application: {
        include: { user: true },
      },
    },
  });

  const userId = challenge.application.user.id;
  const title = challenge.title;
  const message = `${title} 칠랜지에 작업물이 추가되었어요`;
  if (writerId !== userId)
    createNotification(userId, message, challengeId, workId);
};

//피드백 추가 userId는 work를 작성한 사람 ,
const notifyNewFeedback = async (title, writerId, workId) => {
  const work = await prisma.work.findFirst({
    where: { id: workId },
    select: { userId: true },
  });
  const message = `${title} 챌린지에 도전한 작업물에 피드백이 추가되었어요`;
  const userId = work.userId;
  if (userId !== writerId) createNotification(userId, message, null, workId);
};

const getUserNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).send(notifications);
});

const deleteUserNotification = asyncHandler(async (req, res, next) => {
  const notificationId = req.params.notificationId;

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    return res.status(404).send({ message: "Notification not found" });
  }

  await prisma.notification.delete({ where: { id: notificationId } });
  res.sendStatus(204);
});

const notificationService = {
  notifyChallengeStatus,
  notifyNewWork,
  notifyNewFeedback,
  getUserNotifications,
  deleteUserNotification,
};

module.exports = notificationService;
