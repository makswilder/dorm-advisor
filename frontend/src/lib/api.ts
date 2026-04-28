import axios from "axios";
import { getToken } from "./auth";
import type {
  AuthResponseDto,
  DormAnswerCreateDto,
  DormAnswerDto,
  DormCategory,
  DormDto,
  DormQuestionCreateDto,
  DormQuestionDto,
  DormRankingDto,
  ForumPostCreateDto,
  ForumPostDto,
  ForumThreadCreateDto,
  ForumThreadDto,
  ForumThreadType,
  HomeDto,
  ModerationActionDto,
  PhotoDto,
  ReviewCreateDto,
  ReviewDto,
  SchoolDto,
  UserDto,
} from "./types";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const sendMagicLink = (email: string) =>
  client.post("/api/auth/magic-link", { email });

export const verifyToken = (token: string): Promise<{ data: AuthResponseDto }> =>
  client.get(`/api/auth/verify?token=${token}`);

// Users
export const getMe = (): Promise<{ data: UserDto }> =>
  client.get("/api/users/me");

// Schools
export const getHomepage = (): Promise<{ data: HomeDto }> =>
  client.get("/api/public/homepage");

export const getAllSchools = (): Promise<{ data: SchoolDto[] }> =>
  client.get("/api/schools");

export const searchSchools = (q: string): Promise<{ data: SchoolDto[] }> =>
  client.get(`/api/schools/search?q=${encodeURIComponent(q)}`);

export const getSchoolById = (id: string): Promise<{ data: SchoolDto }> =>
  client.get(`/api/schools/${id}`);

export const getSchoolBySlug = (slug: string): Promise<{ data: SchoolDto }> =>
  client.get(`/api/schools/by-slug/${slug}`);

export const createSchool = (data: {
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
}): Promise<{ data: SchoolDto }> => client.post("/api/schools", data);

// Dorms
export const getDormsBySchool = (schoolId: string): Promise<{ data: DormDto[] }> =>
  client.get(`/api/schools/${schoolId}/dorms`);

export const getDormRankings = (
  schoolId: string,
  minReviews = 3,
  category?: DormCategory
): Promise<{ data: DormRankingDto[] }> => {
  const params = new URLSearchParams({ minReviews: String(minReviews) });
  if (category) params.set("category", category);
  return client.get(`/api/schools/${schoolId}/dorms/rankings?${params}`);
};

export const searchDorms = (
  schoolId: string,
  q: string
): Promise<{ data: DormDto[] }> =>
  client.get(`/api/schools/${schoolId}/dorms/search?q=${encodeURIComponent(q)}`);

export const getDormById = (id: string): Promise<{ data: DormDto }> =>
  client.get(`/api/dorms/${id}`);

export const getDormBySlug = (
  schoolId: string,
  slug: string
): Promise<{ data: DormDto }> =>
  client.get(`/api/schools/${schoolId}/dorms/by-slug/${slug}`);

export const createDorm = (
  schoolId: string,
  data: { name: string; slug: string; categories: DormCategory[] }
): Promise<{ data: DormDto }> =>
  client.post(`/api/schools/${schoolId}/dorms`, data);

// Reviews
export const getReviewsForDorm = (dormId: string): Promise<{ data: ReviewDto[] }> =>
  client.get(`/api/dorms/${dormId}/reviews`);

export const createReview = (
  dormId: string,
  data: ReviewCreateDto
): Promise<{ data: ReviewDto }> =>
  client.post(`/api/dorms/${dormId}/reviews`, data);

// Photos
export const getPhotosForDorm = (dormId: string): Promise<{ data: PhotoDto[] }> =>
  client.get(`/api/dorms/${dormId}/photos`);

export const uploadPhoto = (
  dormId: string,
  file: File,
  caption?: string
): Promise<{ data: PhotoDto }> => {
  const form = new FormData();
  form.append("file", file);
  if (caption) form.append("caption", caption);
  return client.post(`/api/dorms/${dormId}/photos`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Q&A
export const getQuestionsForDorm = (dormId: string): Promise<{ data: DormQuestionDto[] }> =>
  client.get(`/api/dorms/${dormId}/questions`);

export const createQuestion = (
  dormId: string,
  data: DormQuestionCreateDto
): Promise<{ data: DormQuestionDto }> =>
  client.post(`/api/dorms/${dormId}/questions`, data);

export const getAnswersForQuestion = (questionId: string): Promise<{ data: DormAnswerDto[] }> =>
  client.get(`/api/questions/${questionId}/answers`);

export const createAnswer = (
  questionId: string,
  data: DormAnswerCreateDto
): Promise<{ data: DormAnswerDto }> =>
  client.post(`/api/questions/${questionId}/answers`, data);

// Forum
export const getForumThreads = (schoolId: string): Promise<{ data: ForumThreadDto[] }> =>
  client.get(`/api/schools/${schoolId}/forum/threads`);

export const getSystemThread = (
  schoolId: string,
  type: ForumThreadType
): Promise<{ data: ForumThreadDto }> =>
  client.get(`/api/schools/${schoolId}/forum/threads/system?type=${type}`);

export const createForumThread = (
  schoolId: string,
  data: ForumThreadCreateDto
): Promise<{ data: ForumThreadDto }> =>
  client.post(`/api/schools/${schoolId}/forum/threads`, data);

export const getForumPosts = (threadId: string): Promise<{ data: ForumPostDto[] }> =>
  client.get(`/api/forum/threads/${threadId}/posts`);

export const createForumPost = (
  threadId: string,
  data: ForumPostCreateDto
): Promise<{ data: ForumPostDto }> =>
  client.post(`/api/forum/threads/${threadId}/posts`, data);

// Admin / moderation
export const getPendingSchools = (): Promise<{ data: SchoolDto[] }> =>
  client.get("/api/admin/schools/pending");

export const approveSchool = (id: string, data: ModerationActionDto) =>
  client.post(`/api/admin/schools/${id}/approve`, data);

export const rejectSchool = (id: string, data: ModerationActionDto) =>
  client.post(`/api/admin/schools/${id}/reject`, data);

export const getPendingDorms = (): Promise<{ data: DormDto[] }> =>
  client.get("/api/admin/dorms/pending");

export const approveDorm = (id: string, data: ModerationActionDto) =>
  client.post(`/api/admin/dorms/${id}/approve`, data);

export const rejectDorm = (id: string, data: ModerationActionDto) =>
  client.post(`/api/admin/dorms/${id}/reject`, data);

export const getPendingReviews = (): Promise<{ data: ReviewDto[] }> =>
  client.get("/api/admin/reviews/pending");

export const approveReview = (id: string, data: ModerationActionDto) =>
  client.post(`/api/admin/reviews/${id}/approve`, data);

export const rejectReview = (id: string, data: ModerationActionDto) =>
  client.post(`/api/admin/reviews/${id}/reject`, data);

export const getPendingQuestions = (): Promise<{ data: DormQuestionDto[] }> =>
  client.get("/api/admin/questions/pending");

export const approveQuestion = (id: string) =>
  client.post(`/api/admin/questions/${id}/approve`);

export const rejectQuestion = (id: string) =>
  client.post(`/api/admin/questions/${id}/reject`);

export const getPendingAnswers = (): Promise<{ data: DormAnswerDto[] }> =>
  client.get("/api/admin/answers/pending");

export const approveAnswer = (id: string) =>
  client.post(`/api/admin/answers/${id}/approve`);

export const rejectAnswer = (id: string) =>
  client.post(`/api/admin/answers/${id}/reject`);
