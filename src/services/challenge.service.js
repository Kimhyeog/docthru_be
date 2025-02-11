const { DocType } = require("@prisma/client");
const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getChallenges = asyncHandler(async (req, res, next) => {
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

const challengeService = { getChallenges, getChallenge };
module.exports = { challengeService };
