const { application } = require("express");
const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

//option은 status 로 받고 나머지는 orderBy로
//마감기한 -> deadline 챌린지 , 신청기한은 challenge의 application의 appliedAt
const getChallengeByAdmin = asyncHandler(async (req, res, next) => {
  const { cursor, pageSize, keyword, option } = req.query;

  const search = {
    OR: keyword
      ? [{ title: { contains: keyword, mode: "insensitive" } }]
      : undefined,
    ...(["WAITING", "REJECTED", "ACCEPTED"].includes(option) && {
      application: {
        status: option,
      },
    }),
  };
  let orderBy = {};
  switch (option) {
    case "DeadlineDesc":
      orderBy = { deadline: "desc" };
      break;
    case "DeadlineAsc":
      orderBy = { deadline: "asc" };
      break;
    case "ApplyDeadlineDesc":
      orderBy = { application: { appliedAt: "desc" } };
      break;
    case "ApplyDeadlineAsc":
      orderBy = { application: { appliedAt: "asc" } };
      break;
    default:
      orderBy = {};
  }

  const challenges = await prisma.challenge.findMany({
    where: search,
    take: pageSize,
    cursor: cursor ? { id: cursor } : undefined,
    include: { application: { select: { status: true, appliedAt: true } } },
    orderBy,
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
