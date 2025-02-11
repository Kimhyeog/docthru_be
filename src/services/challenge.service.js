const { DocType } = require("@prisma/client");
const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getChallenges = asyncHandler(async (req, res, next) => {
  const { cursor, pageSize, keyword, orderBy, field, docType, progress } =
    req.query;

  // switch (x) {
  //   case "waiting":
  //   const sortOption = {}
  // }

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
    // orderBy:sortOption,
  });
  const nextCursor =
    challenges.length === pageSize
      ? challenges[challenges.length - 1].id
      : null;

  res.status(200).send({ challenges, nextCursor });
});

const challengeService = { getChallenges };
module.exports = { challengeService };
