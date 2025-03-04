const { z } = require("zod");

const fieldEnum = z.enum(["NEXTJS", "CAREER", "MODERNJS", "WEB", "API"]);
const docTypeEnum = z.enum(["BLOG", "OFFICIAL"]);
const progressEnum = z.enum(["PROGRESS", "COMPLETED"]);

const searchSchema = z.object({
  page: z.number().int().optional(),
  pageSize: z.number().int().optional(),
  keyword: z.string().optional(),
  field: z.array(fieldEnum).optional(),
  docType: docTypeEnum.optional(),
  progress: progressEnum.optional(),
});

const createChallengeSchema = z.object({
  title: z.string(),
  field: fieldEnum,
  docType: docTypeEnum,
  docUrl: z.string().url({ message: "docUrl does not invalid " }),
  deadline: z.coerce.date().refine((data) => data > new Date(), {
    message: "The deadline must be in the future.",
  }),
  maxParticipants: z.coerce.number().int().positive(),
  content: z.string(),
});

const updateChallengeSchema = createChallengeSchema.partial().extend({
  deadline: z.coerce.date(),
});

function validateGetChallenges(req, res, next) {
  try {
    const { page, pageSize, keyword, field, docType, progress } = req.query;
    const parsedOption = searchSchema.safeParse({
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 5,
      keyword: keyword,
      field: field ? field.split(",") : undefined, // 여기를 수정
      docType: docType,
      progress: progress,
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
