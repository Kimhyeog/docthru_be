const prisma = require("../src/db/prisma/client.js");

async function main() {
  try {
    console.log("reset database...");

    // 기존 데이터 삭제
    await prisma.feedback.deleteMany({});
    await prisma.like.deleteMany({});
    await prisma.work.deleteMany({});
    await prisma.participate.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.challenge.deleteMany({});

    // 관련된 Notification 데이터 삭제 (User와 관련된 Notification을 먼저 삭제)
    await prisma.notification.deleteMany({});

    // 마지막으로 User 삭제
    await prisma.user.deleteMany({});

    console.log(" reset complete!");
  } catch (e) {
    console.error("Error reset database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

// 실행
main();
