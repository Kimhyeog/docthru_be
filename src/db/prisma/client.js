const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  omit: { user: { encryptedPassword: true } },
});

module.exports = prisma;
