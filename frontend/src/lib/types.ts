// Mirror of Spring Boot DTOs

export type EntityStatus = "ACTIVE" | "PENDING" | "REJECTED";
export type ContentStatus = "VISIBLE" | "PENDING" | "REMOVED";
export type AuthorType = "USER" | "GUEST";
export type DormCategory = "FRESHMAN" | "SOPHOMORE" | "JUNIOR" | "SENIOR";
export type ForumThreadType = "BEST_DORMS" | "WORST_DORMS" | "GENERAL";

export interface SchoolDto {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  country: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolSummaryDto {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  totalReviews: number;
}

export interface DormDto {
  id: string;
  schoolId: string;
  name: string;
  slug: string;
  status: EntityStatus;
  categories: DormCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface DormRankingDto {
  dormId: string;
  dormName: string;
  dormSlug: string;
  avgOverall: number;
  reviewCount: number;
  avgCleanliness: number | null;
  avgLocation: number | null;
  avgNoise: number | null;
  avgValue: number | null;
  avgSocial: number | null;
  avgRoomQuality: number | null;
  avgBathroom: number | null;
  reviewSnippet: string | null;
}

export interface DormSummaryDto {
  dormId: string;
  dormName: string;
  dormSlug: string;
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
  avgOverall: number;
  reviewCount: number;
}

export interface HomeDto {
  topSchools: SchoolSummaryDto[];
  topDormsByReviews: DormSummaryDto[];
  highestRatedDorms: DormSummaryDto[];
}

export interface ReviewDto {
  id: string;
  dormId: string;
  userId: string | null;
  authorType: AuthorType;
  overall: number;
  cleanliness: number;
  locationRating: number;
  noise: number;
  value: number;
  social: number;
  roomQuality: number;
  bathroomRating: number;
  reviewText: string;
  classYear: number | null;
  yearLived: number | null;
  isVerifiedAtPost: boolean;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreateDto {
  overall: number;
  cleanliness: number;
  locationRating: number;
  noise: number;
  value: number;
  social: number;
  roomQuality: number;
  bathroomRating: number;
  reviewText: string;
  classYear?: number | null;
  yearLived?: number | null;
}

export interface PhotoDto {
  id: string;
  dormId: string;
  url: string;
  thumbUrl: string;
  width: number | null;
  height: number | null;
  caption: string | null;
  status: ContentStatus;
  createdAt: string;
}

export interface UserDto {
  id: string;
  email: string;
  isVerifiedStudent: boolean;
  verifiedSchoolId: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDto {
  token: string;
  verified: boolean;
}

export interface DormQuestionDto {
  id: string;
  dormId: string;
  questionText: string;
  status: ContentStatus;
  createdAt: string;
}

export interface DormAnswerDto {
  id: string;
  questionId: string;
  userId: string | null;
  authorType: AuthorType;
  answerText: string;
  status: ContentStatus;
  createdAt: string;
}

export interface ForumThreadDto {
  id: string;
  schoolId: string;
  title: string;
  type: ForumThreadType | null;
  status: ContentStatus;
  createdAt: string;
}

export interface ForumPostDto {
  id: string;
  threadId: string;
  userId: string | null;
  authorType: AuthorType;
  postText: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DormQuestionCreateDto {
  questionText: string;
}

export interface DormAnswerCreateDto {
  answerText: string;
}

export interface ForumThreadCreateDto {
  title: string;
  type: ForumThreadType;
}

export interface ForumPostCreateDto {
  postText: string;
}

export interface ModerationActionDto {
  reason?: string;
}
