const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getChallenges = asyncHandler(async (req, res, next) => {
  //application 에서 신청 상태를 확인도 해야함 나중에 추가
  const { cursor, pageSize, keyword, orderBy, field, docType, progress } =
    req.query;

  const search = {
    OR: keyword
      ? [{ title: { contains: keyword, mode: "insensitive" } }]
      : undefined,
    field: field ? field : undefined,
    docType: docType ? docType : undefined,
    progress: progress ? progress : undefined,
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
    await prisma.application.create({
      data: { userId, challengeId: newChallenge.id },
    });
    return newChallenge;
  });
  res.status(200).send(result);
});

const challengeService = { getChallenges, getChallenge, createChallenge };
module.exports = { challengeService };
