const express = require("express");
const authRouter = require("./auth/auth.route");
const { authMiddleware } = require("../middlewares/auth.middleeware");
const challengeRouter = require("./challenges/challenge.route");

const router = express.Router();

router.use(authMiddleware);
router.use("/auth", authRouter);
router.use("/challenges", challengeRouter);

module.exports = router;
