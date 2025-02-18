const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getUserData = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { nickname: true, grade: true, role: true },
  });
  if (!user) throw new Error("400/user not found");
  res.status(200).send(user);
});

const getUserMe = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: { nickname: true, grade: true, role: true },
  });
  if (!user) throw new Error("400/user not found");
  res.status(200).send(user);
});

const getOngoingChallenges = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { cursor, pageSize, keyword } = req.query;

  const search = {
    OR: keyword
      ? [{ title: { contains: keyword, mode: "insensitive" } }]
      : undefined,
    progress: "PROGRESS",
    participate: {
      some: {
        userId,
      },
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
  if (!challenges) throw new Error("400/challenges not found");
  res.status(200).send({ challenges, nextCursor });
});

const getCompletedChallenges = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { cursor, pageSize, keyword } = req.query;

  const search = {
    OR: keyword
      ? [{ title: { contains: keyword, mode: "insensitive" } }]
      : undefined,
    progress: "COMPLETED",
    participate: {
      some: {
        userId,
      },
    },
  };

  const challenges = await prisma.challenge.findMany({
    where: search,
    take: pageSize,
    cursor: cursor ? { id: cursor } : undefined,
  });
  if (!challenges) throw new Error("400/challenges not found");
  const nextCursor =
    challenges.length === pageSize
      ? challenges[challenges.length - 1].id
      : null;
  res.status(200).send({ challenges, nextCursor });
});

const getApplicaitonChallenges = asyncHandler(async (req, res, next) => {
  //option 추가해야함
  const userId = req.userId;
  const { cursor, pageSize, keyword, option } = req.query;

  const search = {
    OR: keyword
      ? [{ title: { contains: keyword, mode: "insensitive" } }]
      : undefined,
    application: {
      userId,
    },
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
  if (!challenges) throw new Error("400/challenges not found");
  const nextCursor =
    challenges.length === pageSize
      ? challenges[challenges.length - 1].id
      : null;
  res.status(200).send({ challenges, nextCursor });
});

const usersMeService = {
  getUserMe,
  getOngoingChallenges,
  getCompletedChallenges,
  getApplicaitonChallenges,
  getUserData,
};
module.exports = usersMeService;
