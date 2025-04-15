export interface AuthContextProps {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (token: string, user: User, role: UserRole) => Promise<void>;
}

export interface User {
  name: string;
  email: string;
  mobileNo: number;
}

export type UserRole = "APPLICANT" | "EMPLOYER";

export interface SignUpSchema {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  mobileNo: string;
}

export interface SignInSchema {
  email: string;
  password: string;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  company: string;
  postedBy: string;
  createdAt: string;
}

interface Status {
  id: string;
  reviewedAt: string;
  reviewerEmail: string;
  state: "PENDING" | "APPROVED" | "REJECTED";
}

export interface JobApplication {
  id: string;
  jobId: string;
  status: Status;
  message: string;
  jobTitle: string;
  resumeUrl: string;
  appliedAt: string;
  applicantName: string;
}

export interface JobPostData {
  title: string;
  description: string;
  company: string;
}
