const { z } = require("zod");

const searchSchema = z.object({
  page: z.number().int().optional(),
  pageSize: z.number().int().optional(),
  keyword: z.string().optional(),
  option: z
    .enum([
      "WAITING",
      "REJECTED",
      "ACCEPTED",
      "DeadlineDesc",
      "DeadlineAsc",
      "ApplyDeadlineDesc",
      "ApplyDeadlineAsc",
    ])
    .optional(),
});

const updateApplicationShema = z.object({
  status: z.enum(["REJECTED", "ACCEPTED"]),
  invalidationComment: z.string().optional(),
});

function validateGetChallengesByAdmin(req, res, next) {
  try {
    const parsedOption = searchSchema.safeParse({
      page: req.query.page ? Number(req.query.page) : 1,
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

function validateUpdateChallengeByAdmin(req, res, next) {
  try {
    const parsedBody = updateApplicationShema.safeParse({
      status: req.body.status,
      invalidationComment: req.body.invalidationComment,
    });
    if (!parsedBody.success)
      throw new Error(`400/Validation error: ${parsedBody.error}`);
    req.body = parsedBody.data;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  validateGetChallengesByAdmin,
  validateUpdateChallengeByAdmin,
};
