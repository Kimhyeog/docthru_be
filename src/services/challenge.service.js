const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getChallenges = asyncHandler(async (req, res, next) => {
  const { cursor, pageSize, keyword, orderBy } = req.query;

  //   const sortOption

  const search = keyword
    ? {
        OR: [{ title: { contains: keyword, mode: "insensitive" } }],
      }
    : {};

  const challenges = await prisma.challenge.findMany({
    where: search,
    take: pageSize,
    cursor: cursor ? { id: cursor } : undefined,
    // orderBy:sortOption,
  });

  res.status(200).send(challenges);
});

const challengeService = { getChallenges };
module.exports = { challengeService };
