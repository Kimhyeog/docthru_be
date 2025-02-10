function errorHandler(err, req, res, next) {
  console.error("error는 ", err);

  const [statusCodeText, message] = err.message.split("/");
  const statusCode = Number(statusCodeText);

  if (isNaN(statusCode)) return res.status(500).send("unknown error");

  res.status(statusCode).send(message);
  res.status(500).send({ message: e.message });
}

function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (e) {
      if (
        e.name === "StructError" ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  };
}

module.exports = { errorHandler, asyncHandler };
