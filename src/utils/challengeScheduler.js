const cron = require("node-cron");
const prisma = require("../db/prisma/client");

const updateCompletedChallenges = async () => {
  try {
    const now = new Date();
    await prisma.challenge.updateMany({
      where: {
        deadline: { lt: now },
        progress: "PROGRESS",
      },
      data: { progress: "COMPLETED" },
    });
  } catch (e) {
    console.log(e);
  }
};
updateCompletedChallenges();
cron.schedule("0 0 * * *", updateCompletedChallenges);
