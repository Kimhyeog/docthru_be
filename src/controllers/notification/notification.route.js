const express = require("express");
const { authenticatedOnly } = require("../../middlewares/auth.middleeware");
const { notification } = require("../../db/prisma/client");
const notificationService = require("../../services/notification.service");

const notificationRouter = express.Router();

notificationRouter.get(
  "/",
  authenticatedOnly,
  notificationService.getUserNotifications
);
module.exports = notificationRouter;
