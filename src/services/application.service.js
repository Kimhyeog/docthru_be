const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

//option은 status 로 받고 나머지는 orderBy로
//마감기한 -> deadline 챌린지 , 신청기한은 challenge의 application의 appliedAt
const getChallengeByAdmin = asyncHandler(async (req, res, next) => {
  const { page, pageSize, keyword, option } = req.query;
  const skip = (page - 1) * pageSize;
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
    skip,
    include: { application: { select: { status: true, appliedAt: true } } },
    orderBy,
  });
  const totalCount = await prisma.challenge.count({ where: search });
  const totalPages = Math.ceil(totalCount / pageSize);

  res.status(200).send({ challenges, totalCount, totalPages });
});

//승인되기 전꺼만? 삭제?
//1 유저 본인이 쓴건지 확인해야함
const deleteNewChallenge = asyncHandler(async (req, res, next) => {
  await prisma.$transaction(async (prisma) => {
    const userId = req.userId;
    const challengeId = req.params.challengeId;
    //1. 아이디가 있있고 WAITING 상태인지 확인, 유저 아이디가 일치하는지도 확인
    const challenge = await prisma.challenge.findFirst({
      where: {
        id: challengeId,
        application: { userId, status: "WAITING" },
      },
    });
    if (!challenge)
      throw new Error("400/challenge cannot be find or unathorization");
    //2.삭제 진행
    await prisma.application.update({
      where: { challengeId },
      data: {
        status: "DELETED",
        invalidatedAt: new Date(),
        invalidationComment: "해당 계정 사용자가 삭제한 챌린지입니다.",
      },
    });
  });
  res.sendStatus(204);
}); //

const updateStatusChallengeByAdmin = asyncHandler(async (req, res, next) => {
  //거절하면 거절 사유랑 거절 시간 업데이트 하기
  const challengeId = req.params.challengeId;
  const { status, invalidationComment } = req.body;
  const result = await prisma.$transaction(async (prisma) => {
    const challenge = await prisma.challenge.findFirst({
      where: { id: challengeId, application: { status: "WAITING" } },
    });
    if (!challenge)
      throw new Error("400/not found challenge or already ACCEPTED");
    let updatedApplication = await prisma.application.update({
      where: { challengeId },
      data: {
        status,
      },
    });
    const challengeOwnerId = updatedApplication.userId;
    if (status === "ACCEPTED") {
      await prisma.participate.create({
        data: { userId: challengeOwnerId, challengeId },
      });
    } else if (status === "REJECTED") {
      updatedApplication = await prisma.application.update({
        where: { challengeId },
        data: {
          invalidatedAt: new Date(),
          invalidationComment,
        },
      });
    }
    return updatedApplication;
  });
  res.status(200).send(result);
});

const applicationService = {
  getChallengeByAdmin,
  deleteNewChallenge,
  updateStatusChallengeByAdmin,
};
module.exports = applicationService;
