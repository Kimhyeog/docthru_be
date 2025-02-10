const express = require("express");
const authRouter = require("./auth/auth.route");
const { authMiddleware } = require("../middlewares/auth.middleeware");

const router = express.Router();

router.use(authMiddleware);
router.use("/auth", authRouter);

module.exports = router;
