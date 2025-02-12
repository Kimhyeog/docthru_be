const { application } = require("express");
const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

//option은 status 로 받고 나머지는 orderBy로 여기는 내일 이어서 해보기힘드네
const getChallengeByAdmin = asyncHandler(async (req, res, next) => {
  const { cursor, pageSize, keyword, orderBy, option } = req.query;

  const search = {
    OR: keyword
      ? [{ title: { contains: keyword, mode: "insensitive" } }]
      : undefined,
    application: {
      status: option,
    },
  };

  const challenges = await prisma.challenge.findMany({
    where: search,
    take: pageSize,
    cursor: cursor ? { id: cursor } : undefined,
    include: { application: { select: { status: true } } },
  });
  const nextCursor =
    challenges.length === pageSize
      ? challenges[challenges.length - 1].id
      : null;

  res.status(200).send({ challenges, nextCursor });
});

//승인되기 전꺼만? 삭제?
const deleteNewChallenge = asyncHandler(async (req, res, next) => {});

const updateNewChallengeByAdmin = asyncHandler(async (req, res, next) => {});

const applicationService = {
  getChallengeByAdmin,
  deleteNewChallenge,
  updateNewChallengeByAdmin,
};
module.exports = applicationService;
