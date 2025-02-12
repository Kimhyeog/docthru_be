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

const createChallengeSchema = z.object({
  title: z.string(),
  field: fieldEnum,
  docType: docTypeEnum,
  docUrl: z.string().url({ message: "docUrl does not invalid " }),
  deadline: z.coerce.date(),
  maxParticipants: z.coerce.number().int().positive(),
  content: z.string(),
});

const updateChallengeSchema = createChallengeSchema.partial();

function validateGetChallenges(req, res, next) {
  try {
    const parsedOption = searchSchema.safeParse({
      cursor: req.query.cursor,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 5,
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

function validateCreateChallenge(req, res, next) {
  try {
    const parsedBody = createChallengeSchema.safeParse({
      title: req.body.title,
      field: req.body.field,
      docType: req.body.docType,
      docUrl: req.body.docUrl,
      deadline: req.body.deadline,
      maxParticipants: req.body.maxParticipants,
      content: req.body.content,
    });

    if (!parsedBody.success) {
      throw new Error(`400/Validation error: ${parsedBody.error}`);
    }
    req.query = parsedBody.data;
    next();
  } catch (e) {
    next(e);
  }
}

function validateupdateChallenge(req, res, next) {
  try {
    const parsedBody = updateChallengeSchema.safeParse({
      title: req.body.title,
      field: req.body.field,
      docType: req.body.docType,
      docUrl: req.body.docUrl,
      deadline: req.body.deadline,
      maxParticipants: req.body.maxParticipants,
      content: req.body.content,
    });

    if (!parsedBody.success) {
      throw new Error(`400/Validation error: ${parsedBody.error}`);
    }
    req.query = parsedBody.data;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  validateGetChallenges,
  validateCreateChallenge,
  validateupdateChallenge,
};
