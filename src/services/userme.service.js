const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const getUserData = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { nickname: true, grade: true, role: true, id: true },
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
    select: { id: true, nickname: true, grade: true, role: true },
  });
  if (!user) throw new Error("400/user not found");
  res.status(200).send(user);
});

const getOngoingChallenges = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { page, pageSize, keyword } = req.query;
  const skip = (page - 1) * pageSize;
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
    skip,
  });

  const totalCount = await prisma.challenge.count({ where: search });
  const totalPages = Math.ceil(totalCount / pageSize);
  res.status(200).send({ challenges, totalCount, totalPages });
});

const getCompletedChallenges = asyncHandler(async (req, res, next) => {
  const userId = req.userId;
  const { page, pageSize, keyword } = req.query;
  const skip = (page - 1) * pageSize;

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
    skip,
  });
  const totalCount = await prisma.challenge.count({ where: search });
  const totalPages = Math.ceil(totalCount / pageSize);
  res.status(200).send({ challenges, totalCount, totalPages });
});

const getApplicaitonChallenges = asyncHandler(async (req, res, next) => {
  //option 추가해야함
  const userId = req.userId;
  const { page, pageSize, keyword, option } = req.query;
  const skip = (page - 1) * pageSize;
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
    skip,
    include: { application: { select: { status: true, appliedAt: true } } },
    orderBy,
  });
  const totalCount = await prisma.challenge.count({ where: search });
  const totalPages = Math.ceil(totalCount / pageSize);
  res.status(200).send({ challenges, totalCount, totalPages });
});

const usersMeService = {
  getUserMe,
  getOngoingChallenges,
  getCompletedChallenges,
  getApplicaitonChallenges,
  getUserData,
};
module.exports = usersMeService;
