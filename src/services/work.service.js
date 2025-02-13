const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getWorks = asyncHandler(async (req, res, next) => {
  const { cursor } = req.query;
  const challengeId = req.params.challengeId;
  const works = await prisma.work.findMany({
    where: { challengeId },
    take: 5,
    orderBy: { likeCount: "desc" },
    cursor: cursor ? { id: cursor } : undefined,
  });
  const nextCursor = works.length === 5 ? works[works.length - 1].id : null;
  res.status(200).send({ works, nextCursor });
});

const getWork = asyncHandler(async (req, res, next) => {
  const workId = req.params.workId;
  const work = await prisma.work.findUnique({ where: { id: workId } });
  if (!work) throw new Error("404/work not found");
  res.status(200).send(work);
});

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

  const existingWork = await prisma.work.findFirst({
    where: { userId, challengeId, isSubmitted: true },
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

// 수정 및 삭제에서 완료된 챌린지인지 확인하는 것도 필요함

const updateWork = asyncHandler(async (req, res, next) => {
  const workId = req.params.workId;
  const userId = req.userId;
  const { description } = req.body;
  // work 찾고 유저 아이디 확인
  let work = await prisma.work.findUnique({ where: { id: workId } });
  if (!work) throw new Error("404/work not found");
  if (work.userId !== userId) throw new Error("401/unathorization");

  //조건이 만족 되면 만드는데 바디에서 번역문을 받아야함
  work = await prisma.work.update({
    where: { id: workId },
    data: {
      description,
      lastModifiedAt: new Date(),
    },
  });
  res.status(200).send(work);
});

const deleteWork = asyncHandler(async (req, res, next) => {
  //
  await prisma.$transaction(async (prisma) => {
    const challengeId = req.params.challengeId;
    const userId = req.userId;
    const work = await prisma.work.findFirst({
      where: { challengeId, userId, isSubmitted: true },
    });
    await prisma.participate.delete({
      where: { userId_challengeId: { userId, challengeId } },
    });
    await prisma.challenge.update({
      where: { id: challengeId },
      data: { participants: { decrement: 1 } },
    });

    if (work.userId !== userId) throw new Error("401/unathorization");
    await prisma.work.deleteMany({ where: { userId, challengeId } });
  });

  res.sendStatus(204);
});

const workService = { getWorks, getWork, createWork, updateWork, deleteWork };
module.exports = workService;
