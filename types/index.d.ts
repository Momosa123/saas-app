// type User = {
//   name: string;
//   email: string;
//   image?: string;
//   accountId: string;
// };

enum Subject {
  maths = "maths",
  language = "language",
  science = "science",
  history = "history",
  coding = "coding",
  geography = "geography",
  economics = "economics",
  finance = "finance",
  business = "business",
}

type Companion = Models.DocumentList<Models.Document> & {
  $id: string;
  name: string;
  subject: Subject;
  topic: string;
  duration: number;
  bookmarked: boolean;
};

interface CreateCompanion {
  name: string;
  subject: string;
  topic: string;
  voice: string;
  style: string;
  duration: number;
}

interface GetAllCompanions {
  limit?: number;
  page?: number;
  subject?: string | string[];
  topic?: string | string[];
}

interface BuildClient {
  key?: string;
  sessionToken?: string;
}

interface CreateUser {
  email: string;
  name: string;
  image?: string;
  accountId: string;
}

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface Avatar {
  userName: string;
  width: number;
  height: number;
  className?: string;
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface CompanionComponentProps {
  companionId: string;
  subject: string;
  topic: string;
  name: string;
  userName: string;
  userImage: string;
  voice: string;
  style: string;
}

// =============================================================================
// TYPES POUR LES TABLES SUPABASE
// =============================================================================

// Types pour les rôles utilisateurs
export type UserRole = "student" | "teacher";

// Type pour la table profiles
export interface Profile {
  user_id: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Types pour créer/mettre à jour un profil
export interface CreateProfile {
  user_id: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface UpdateProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: UserRole;
}

// Type pour la table classes
export interface Class {
  class_id: string;
  teacher_id: string;
  class_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Types pour créer/mettre à jour une classe
export interface CreateClass {
  class_name: string;
  description?: string;
}

export interface UpdateClass {
  class_name?: string;
  description?: string;
}

// Type pour la table class_members
export interface ClassMember {
  class_id: string;
  student_id: string;
  joined_at: string;
}

// Type pour la table assignments
export interface Assignment {
  assignment_id: string;
  class_id: string;
  title: string;
  description?: string;
  scenario_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// Types pour créer/mettre à jour un devoir
export interface CreateAssignment {
  class_id: string;
  title: string;
  description?: string;
  scenario_id?: string;
  due_date?: string;
}

// Type pour la table session_reports
export interface SessionReport {
  report_id: string;
  student_id: string;
  assignment_id?: string;
  transcript?: string;
  pronunciation_score?: number;
  fluency_score?: number;
  grammar_feedback?: string;
  audio_url?: string;
  created_at: string;
}

// Type pour créer un rapport de session
export interface CreateSessionReport {
  student_id: string;
  assignment_id?: string;
  transcript?: string;
  pronunciation_score?: number;
  fluency_score?: number;
  grammar_feedback?: string;
  audio_url?: string;
}
