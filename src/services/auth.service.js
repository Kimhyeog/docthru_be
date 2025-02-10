const prisma = require("../db/prisma/client");
const { asyncHandler } = require("../middlewares/error.middleware");

const signUp = asyncHandler(async (req, res, next) => {});
const authService = { signUp };

module.exports = authService;
