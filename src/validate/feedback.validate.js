const { z } = require("zod");

const searchSchema = z.object({
  pageSize: z.number().int().optional(),
});

const feedbackSchema = z.object({
  content: z.string(),
});

function validateGetFeedback(req, res, next) {
  try {
    const parsedQuery = searchSchema.safeParse({
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 3,
    });
    if (!parsedQuery.success)
      throw new Error(`400/Validation error: ${parsedQuery.error}`);
    req.query = parsedQuery.data;
    next();
  } catch (e) {
    next(e);
  }
}

function validateFeedback(req, res, next) {
  try {
    const parsedBody = feedbackSchema.safeParse({
      content: req.body.content,
    });
    if (!parsedBody.success)
      throw new Error(`400/Validation error: ${parsedBody.error}`);
    req.body = parsedBody.data;
    next();
  } catch (e) {
    next(e);
  }
}
module.exports = { validateGetFeedback, validateFeedback };
