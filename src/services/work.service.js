const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const createWork = asyncHandler(async (req, res, next) => {
  const challengeId = req.params.challengeId;
  const userId = req.userId;
  const { description } = req.body;
  // 챌린지가 있는지 확인
  const challenge = await prisma.challenge.findFirst({
    where: { id: challengeId, application: { status: "ACCEPTED" } },
  });
  if (!challenge) throw new Error("400/challenge not found");
  // 챌린지에 참여했는지 확인
  const participate = await prisma.participate.findFirst({
    where: { userId, challengeId },
  });
  if (!participate)
    throw new Error("400/This is a challenge you have not participated in");

  const existingWork = await prisma.work.findUnique({
    where: { userId_challengeId: { userId, challengeId } },
  });
  if (existingWork) throw new Error("400/you already create work");
  //조건이 만족 되면 만드는데 바디에서 번역문을 받아야함
  const work = await prisma.work.create({
    data: {
      challengeId,
      userId,
      description,
      lastModifiedAt: new Date(),
      submittedAt: new Date(),
      isSubmitted: true,
    },
  });
  res.status(200).send(work);
});

const workService = { createWork };
module.exports = workService;
