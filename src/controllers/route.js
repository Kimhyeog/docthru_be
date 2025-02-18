const express = require("express");
const authRouter = require("./auth/auth.route");
const { authMiddleware } = require("../middlewares/auth.middleeware");
const challengeRouter = require("./challenges/challenge.route");
const applicationRouter = require("./applications/application.route");
const usersRouter = require("./users/users.route");
const workRouter = require("./works/works.route");
const feedbackRouter = require("./feedback/feedback.route");

const router = express.Router();

router.use(authMiddleware);
router.use("/auth", authRouter);
router.use("/challenges", challengeRouter);
router.use("/application", applicationRouter);
router.use("/users", usersRouter);
router.use("/works", workRouter);
router.use("/feedback", feedbackRouter);
module.exports = router;
