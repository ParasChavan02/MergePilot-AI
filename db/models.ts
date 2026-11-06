import type { ObjectId } from "mongodb";

export type UserRole = "owner" | "admin" | "member";
export type PullRequestState = "open" | "closed" | "merged" | "draft";
export type AnalysisStatus = "pending" | "processing" | "complete" | "failed";
export type ReleaseNoteType = "bugfix" | "feature" | "breaking" | "misc";

export interface UserDoc {
  _id?: ObjectId | string;
  id?: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountDoc {
  _id?: ObjectId | string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface SessionDoc {
  _id?: ObjectId | string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface VerificationTokenDoc {
  _id?: ObjectId | string;
  identifier: string;
  token: string;
  expires: Date;
}

export interface RepositoryDoc {
  _id?: ObjectId | string;
  id: string; // unique identifier (UUID/string)
  ownerId: string;
  githubId: number;
  name: string;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  description?: string | null;
  htmlUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PullRequestDoc {
  _id?: ObjectId | string;
  id: string; // unique identifier (UUID/string)
  repositoryId: string;
  githubId: number;
  number: number;
  title: string;
  body?: string | null;
  authorLogin: string;
  state: PullRequestState;
  isDraft: boolean;
  headSha: string;
  baseSha: string;
  headRef: string;
  baseRef: string;
  mergeable?: boolean | null;
  mergedAt?: Date | null;
  closedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisDoc {
  _id?: ObjectId | string;
  id: string; // unique identifier (UUID/string)
  pullRequestId: string;
  userId?: string | null;
  repositoryId?: string | null;
  status: AnalysisStatus;
  summary?: string | null;
  riskLevel: string;
  riskScore: number;
  breakingChangeDetected: boolean;
  keyChanges: string[];
  breakingChanges: {
    detected: boolean;
    severity?: string;
    items: Array<{ area: string; reason: string; potentialImpact: string }>;
  };
  testGaps: Array<{
    test: string;
    reason: string;
    suggestedVerification?: string;
  }>;
  recommendations: string[];
  releaseNotes?: string | null;
  testSuggestions: string[];
  releaseNotesDraft?: string | null;
  modelVersion?: string | null;
  metadata: Record<string, unknown>;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReleaseNoteDoc {
  _id?: ObjectId | string;
  id: string; // unique identifier (UUID/string)
  analysisId: string;
  repositoryId: string;
  title: string;
  body: string;
  type: ReleaseNoteType;
  isPublished: boolean;
  createdAt: Date;
}
