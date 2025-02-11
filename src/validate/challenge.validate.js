const { z } = require("zod");

const fieldEnum = z.enum(["NEXTJS", "CAREER", "MODERNJS", "WEB", "API"]);
const docTypeEnum = z.enum(["BLOG", "DOCS"]);

const searchSchema = z.object({
  cursor: z.string().optional(),
  pageSize: z.number().int().optional(),
  keyword: z.string().optional(),
  field: fieldEnum.optional(),
  docType: docTypeEnum.optional(),
  progress: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "progress must be 'true' or 'flale' ",
    })
    .transform((val) => val === "true")
    .optional(),
});

function validateGetChallenges(req, res, next) {
  try {
    const parsedOption = searchSchema.safeParse({
      cursor: req.query.cursor,
      pageSize: req.query.pageSize ? req.query.pageSize : 5,
      keyword: req.query.keyword,
      field: req.query.field,
      docType: req.query.docType,
      progress: req.query.progress,
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

module.exports = {
  validateGetChallenges,
};
