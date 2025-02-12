const { z } = require("zod");

const searchSchema = z.object({
  cursor: z.string().optional(),
  pageSize: z.number().int().optional(),
  keyword: z.string().optional(),
  option: z.enum([
    "WAITING",
    "REJECTED",
    "ACCEPTED",
    "DeadlineDesc",
    "DeadlineAsc",
    "ApplyDeadlineDesc",
    "ApplyDeadlineAsc",
  ]),
});

function validateGetChallengesByAdmin(req, res, next) {
  try {
    const parsedOption = searchSchema.safeParse({
      cursor: req.query.cursor,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 5,
      keyword: req.query.keyword,
      option: req.query.option,
    });

    if (!parsedOption.success) {
      throw new Error(`400/Validation error: ${parsedOption.error}`);
    }
    req.query = parsedOption.data;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { validateGetChallengesByAdmin };
