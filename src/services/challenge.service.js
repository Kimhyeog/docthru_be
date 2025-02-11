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
    await prisma.application.create({
      data: { userId, challengeId: newChallenge.id },
    });
    return newChallenge;
  });
  res.status(200).send(result);
});

const participateChallenge = asyncHandler(async (req, res, next) => {
  //1.useId 찾기
  //2.해당 챌린지 찾기
  //3.해당 챌린지에 남은 인원이 있는지 확인 //
  //4.남은 인원이 있으면 카운트 올리고 create participate
  //5.끝
});

const challengeService = { getChallenges, getChallenge, createChallenge };
module.exports = { challengeService };
