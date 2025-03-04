const prisma = require("../src/db/prisma/client.js");
const seedData = require("./mock.js");

async function main() {
  try {
    console.log("🌱 Seeding database...");

    const {
      users,
      challenges,
      applications,
      participations,
      works,
      likes,
      feedbacks,
    } = await seedData();

    // 기존 데이터 삭제
    await prisma.feedback.deleteMany({});
    await prisma.like.deleteMany({});
    await prisma.work.deleteMany({});
    await prisma.participate.deleteMany({});
    await prisma.application.deleteMany({});
    await prisma.challenge.deleteMany({});
    await prisma.user.deleteMany({});

    // 새로운 데이터 추가
    await prisma.user.createMany({ data: users, skipDuplicates: true });
    await prisma.challenge.createMany({
      data: challenges,
      skipDuplicates: true,
    });
    await prisma.application.createMany({
      data: applications,
      skipDuplicates: true,
    });
    await prisma.participate.createMany({
      data: participations,
      skipDuplicates: true,
    });
    await prisma.work.createMany({ data: works, skipDuplicates: true });
    await prisma.like.createMany({ data: likes, skipDuplicates: true });
    await prisma.feedback.createMany({ data: feedbacks, skipDuplicates: true });

    console.log(" Seeding complete!");
  } catch (e) {
    console.error("Error seeding database:", e);
  } finally {
    await prisma.$disconnect();
  }
}

// 실행
main();
