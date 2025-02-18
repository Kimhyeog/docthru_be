const { z } = require("zod");

const createWorkSchema = z.object({
  description: z.string(),
});

function validateCreateWork(req, res, next) {
  try {
    const parsedBody = createWorkSchema.safeParse({
      description: req.body.description,
    });
    if (!parsedBody.success) {
      throw new Error(`400/Validation error: ${parsedOption.error}`);
    }
    req.body = parsedBody.data;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { validateCreateWork };
