const bcrypt = require("bcrypt");

async function generateUsers() {
  const hashedAdminPassword = await bcrypt.hash("12345678", 10);
  const hashedUserPassword = await bcrypt.hash("12345678", 10);

  return [
    {
      id: "admin-id",
      email: "admin@example.com",
      encryptedPassword: hashedAdminPassword,
      nickname: "admin",
      role: "ADMIN",
    },
    {
      id: "general-id",
      email: "user@example.com",
      encryptedPassword: hashedUserPassword,
      nickname: "user",
      role: "GENERAL",
    },
  ];
}

const challenges = [
  {
    id: "challenge-1",
    title: "Next.js 챌린지",
    field: "NEXTJS",
    docType: "BLOG",
    docUrl: "https://example.com",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxParticipants: 5,
    content: "Next.js 학습 챌린지",
  },
  {
    id: "challenge-2",
    title: "모던 JS 챌린지",
    field: "MODERNJS",
    docType: "BLOG",
    docUrl: "https://example.com",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    maxParticipants: 8,
    content: "최신 자바스크립트 문법 학습",
  },
  {
    id: "challenge-3",
    title: "API 설계 챌린지",
    field: "API",
    docType: "OFFICIAL",
    docUrl: "https://example.com",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    maxParticipants: 6,
    content: "RESTful API 설계 실습",
  },
  {
    id: "challenge-4",
    title: "웹 최적화 챌린지",
    field: "WEB",
    docType: "BLOG",
    docUrl: "https://example.com",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    maxParticipants: 10,
    content: "웹 성능 최적화 실습",
  },
];

const applications = [
  {
    id: "application-1",
    userId: "general-id",
    challengeId: "challenge-1",
    status: "WAITING",
  },
  {
    id: "application-2",
    userId: "general-id",
    challengeId: "challenge-2",
    status: "ACCEPTED",
  },
  {
    id: "application-3",
    userId: "general-id",
    challengeId: "challenge-3",
    status: "REJECTED",
  },
  {
    id: "application-4",
    userId: "general-id",
    challengeId: "challenge-4",
    status: "DELETED",
  },
];

const participations = [
  { id: "participation-1", userId: "general-id", challengeId: "challenge-1" },
  { id: "participation-2", userId: "general-id", challengeId: "challenge-2" },
  { id: "participation-3", userId: "general-id", challengeId: "challenge-3" },
  { id: "participation-4", userId: "general-id", challengeId: "challenge-4" },
];

const works = [
  {
    id: "work-1",
    userId: "general-id",
    challengeId: "challenge-1",
    description: "Next.js 학습 정리 노트",
    submittedAt: new Date(),
    isSubmitted: true,
    likeCount: 1,
  },
  {
    id: "work-2",
    userId: "general-id",
    challengeId: "challenge-2",
    description: "모던 JS 실습 코드",
    submittedAt: new Date(),
    isSubmitted: true,
    likeCount: 1,
  },
  {
    id: "work-3",
    userId: "general-id",
    challengeId: "challenge-3",
    description: "API 설계 문서",
    submittedAt: new Date(),
    isSubmitted: true,
    likeCount: 1,
  },
  {
    id: "work-4",
    userId: "general-id",
    challengeId: "challenge-4",
    description: "웹 최적화 테스트 결과",
    submittedAt: new Date(),
    isSubmitted: true,
    likeCount: 1,
  },
];

const likes = [
  { id: "like-1", userId: "admin-id", workId: "work-1" },
  { id: "like-2", userId: "admin-id", workId: "work-2" },
  { id: "like-3", userId: "admin-id", workId: "work-3" },
  { id: "like-4", userId: "admin-id", workId: "work-4" },
];

const feedbacks = [
  {
    id: "feedback-1",
    userId: "admin-id",
    workId: "work-1",
    content: "잘 정리하셨네요! 👍",
  },
  {
    id: "feedback-2",
    userId: "admin-id",
    workId: "work-2",
    content: "코드가 깔끔하네요!",
  },
  {
    id: "feedback-3",
    userId: "admin-id",
    workId: "work-3",
    content: "API 설계가 체계적이네요!",
  },
  {
    id: "feedback-4",
    userId: "admin-id",
    workId: "work-4",
    content: "웹 최적화 방법이 인상적이에요!",
  },
];

module.exports = async () => {
  return {
    users: await generateUsers(),
    challenges,
    applications,
    participations,
    works,
    likes,
    feedbacks,
  };
};
