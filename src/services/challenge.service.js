const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getChallenges = asyncHandler(async (req, res, next) => {
  const { cursor, pageSize, keyword, field, docType, progress } = req.query;

  const search = {
    OR: keyword
      ? [{ title: { contains: keyword, mode: "insensitive" } }]
      : undefined,
    field: field ? field : undefined,
    docType: docType ? docType : undefined,
    progress: progress ? progress : undefined,
    application: {
      status: "ACCEPTED",
    },
    // deadline: {
    //   gte: new Date(),
    // },
  };

  const challenges = await prisma.challenge.findMany({
    where: search,
    take: pageSize,
    cursor: cursor ? { id: cursor } : undefined,
  });
  const nextCursor =
    challenges.length === pageSize
      ? challenges[challenges.length - 1].id
      : null;

  res.status(200).send({ challenges, nextCursor });
});

const getChallenge = asyncHandler(async (req, res, next) => {
  const challengeId = req.params.challengeId;
  const challenge = await prisma.challenge.findFirstOrThrow({
    where: { id: challengeId },
  });
  res.status(200).send(challenge);
});

const createChallenge = asyncHandler(async (req, res, next) => {
  // validation 추가하기
  const userId = req.userId;
  const { title, field, docType, docUrl, deadline, maxParticipants, content } =
    req.body;
  const result = await prisma.$transaction(async (prisma) => {
    const newChallenge = await prisma.challenge.create({
      data: {
        title,
        field,
        docType,
        docUrl,
        deadline,
        maxParticipants,
        content,
      },
    });
    await prisma.application.create({
      data: { userId, challengeId: newChallenge.id },
    });
    return newChallenge;
  });
  res.status(200).send(result);
});

const participateChallenge = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const challengeId = req.params.challengeId;

  const result = await prisma.$transaction(async (prisma) => {
    // 해당 챌린지에 남은 인원이 있는지 확인하고 상태도 검사해야함 ACCEPTED 상태인지 확인인
    const challenge = await prisma.challenge.findUniqueOrThrow({
      where: { id: challengeId },
      select: {
        id: true,
        participants: true,
        maxParticipants: true,
        application: { select: { status: true } },
        participate: { select: { userId: true } },
        deadline: true,
      },
    });

    if (!challenge.application || challenge.application.status !== "ACCEPTED") {
      throw new Error("400/The challenge is not open for participation.");
    }
    // 남은자리 체크
    if (challenge.participants >= challenge.maxParticipants)
      throw new Error("400/the challenge is fully booked");
    // 데드라인이 유효한지 체크

    if (challenge.deadline < new Date())
      throw new Error("400/the deadline has already passed.");
    // 이미 신청한건지 체크
    if (challenge.participate.userId === userId)
      throw new Error("400/already applied");

    const existingParticipation = await prisma.participate.findFirst({
      where: { userId, challengeId },
    });
    if (existingParticipation) throw new Error("400/already applied");

    await prisma.challenge.update({
      where: { id: challengeId },
      data: { participants: { increment: 1 } },
    });

    const participate = await prisma.participate.create({
      data: { userId, challengeId },
    });
    return participate;
  });

  res.status(200).send(result);
});

//데이러를 destructuring 안하고 data에 다 담아도 문제 없을까?
const updateChallengeByAdmin = asyncHandler(async (req, res, next) => {
  const challengeId = req.params.challengeId;
  await prisma.challenge.findFirstOrThrow({ where: { id: challengeId } });
  const updatedChallenge = await prisma.challenge.update({
    where: { id: challengeId },
    data: { ...req.body },
  });
  res.status(200).send(updatedChallenge);
});

const deleteChallengeByAdmin = asyncHandler(async (req, res, next) => {
  const challengeId = req.params.challengeId;
  await prisma.$transaction(async (prisma) => {
    await prisma.challenge.findFirstOrThrow({
      where: { id: challengeId },
    });

    await prisma.application.update({
      where: { challengeId },
      data: {
        status: "DELETED",
      },
    });
    res.sendStatus(204);
  });
});

const challengeService = {
  getChallenges,
  getChallenge,
  createChallenge,
  participateChallenge,
  updateChallengeByAdmin,
  deleteChallengeByAdmin,
};

module.exports = { challengeService };
