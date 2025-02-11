const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getChallenges = asyncHandler(async (req, res, next) => {
  //application 에서 status가 ACCEPTED 추가해야함 신청 상태를 확인도 해야함 나중에 추가
  const { cursor, pageSize, keyword, orderBy, field, docType, progress } =
    req.query;

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
  const { title, field, docType, docUrl, deadLine, maxParticipants, content } =
    req.body;
  const result = await prisma.$transaction(async (prisma) => {
    const newChallenge = await prisma.challenge.create({
      data: {
        title,
        field,
        docType,
        docUrl,
        deadLine,
        maxParticipants,
        content,
      },
    });
    await prisma.participate.create({
      data: { userId, challengeId: newChallenge.id },
    });
    return newChallenge;
  });
  res.status(200).send(result);
});

const participateChallenge = asyncHandler(async (req, res, next) => {
  //1.useId 찾기
  //2.해당 챌린지 찾기기
  //3.해당 챌린지에 남은 인원이 있는지 확인하고 상태도 검사해야함 ACCEPTED 상태인지 //
  //4.남은 인원이 있으면 카운트 올리고 create participate
  //5.검사도 해야함 만약에 이미 존재하면? x
  const userId = req.userId;
  const challengeId = req.params.challengeId;

  const result = await prisma.$transaction(async (prisma) => {
    const challenge = await prisma.challenge.findUniqueOrThrow({
      where: { id: challengeId },
      select: {
        id: true,
        participants: true,
        maxParticipants: true,
        application: { select: { userId: true, status: true } },
      },
    });
    if (!challenge.application || challenge.application.status !== "ACCEPTED") {
      throw new Error("400/The challenge is not open for participation.");
    }
    if (challenge.participants >= challenge.maxParticipants)
      throw new Error("400/the challenge is fully booked");

    if (challenge.application.userId === userId)
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

const challengeService = {
  getChallenges,
  getChallenge,
  createChallenge,
  participateChallenge,
};
module.exports = { challengeService };
