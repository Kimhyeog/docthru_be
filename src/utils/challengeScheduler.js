const cron = require("node-cron");
const prisma = require("../db/prisma/client");

const updateCompletedChallenges = async () => {
  const now = new Date();
  await prisma.challenge.updateMany({
    where: {
      deadline: { lt: now },
      progress: "PROGRESS",
    },
    data: { progress: "COMPLETED" },
  });
};

cron.schedule("0 15 * * *", updateCompletedChallenges);
