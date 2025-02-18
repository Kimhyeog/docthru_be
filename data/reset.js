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
