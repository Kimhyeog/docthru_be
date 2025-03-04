const cron = require("node-cron");
const prisma = require("../db/prisma/client");

const updateCompletedChallenges = async () => {
  try {
    const now = new Date();

    //1. 마감된 챌린지인데 아직 PROGRESS 인거 찾기
    const challenges = await prisma.challenge.findMany({
      where: {
        deadline: { lt: now },
        progress: "PROGRESS",
      },
      select: { id: true },
    });
    let selectedUsers = [];
    //2. 챌린지에서 베스트 work 찾기기
    for (const challenge of challenges) {
      const topWork = await prisma.work.findFirst({
        where: { challengeId: challenge.id },
        orderBy: { likeCount: "desc" },
        select: { likeCount: true },
      });
      if (topWork) {
        const topWorks = await prisma.work.findMany({
          where: { challengeId: challenge.id, likeCount: topWork.likeCount },
          select: { userId: true },
        });
        selectedUsers.push(...topWorks.map((work) => work.userId));
      }
    }
    //3. 유저 아이디에서 증가시키기기
    if (selectedUsers.length > 0) {
      await Promise.all(
        selectedUsers.map((userId) =>
          prisma.user.update({
            where: { id: userId },
            data: { recommendedCount: { increment: 1 } },
          })
        )
      );
    }
    //4.progress 변경경
    await prisma.challenge.updateMany({
      where: {
        deadline: { lt: now },
        progress: "PROGRESS",
      },
      data: { progress: "COMPLETED" },
    });
    //grade 업데이트
    await prisma.user.updateMany({
      where: {
        OR: [
          { participateCount: { gte: 10 } },
          { recommendedCount: { gte: 10 } },
          {
            participateCount: { gte: 5 },
            recommendedCount: { gte: 5 },
          },
        ],
        grade: { not: "EXPERT" },
      },
      data: { grade: "EXPERT" },
    });
  } catch (e) {
    console.log(e);
  }
};
updateCompletedChallenges();
cron.schedule("0 0 * * *", updateCompletedChallenges);
