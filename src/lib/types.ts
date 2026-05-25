// ============================================
// PHASE 1: Static Data Types
// ============================================
// These types define the structure of our JSON data files.
// In Phase 2, these same types will be used for database schemas.

// Center Information
export interface CenterInfo {
  name: string;
  tagline: string;
  description: string;
  established: number;
  totalStudents: number;
  contact: ContactInfo;
  branches: Branch[]; // Multiple locations
  socialMedia: SocialMedia;
  operatingHours: OperatingHours;
  keyFeatures: Feature[];
}

export interface Branch {
  id: string;
  name: string;
  address: Address;
  isPrimary: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
}

export interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  googleMapsUrl: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface OperatingHours {
  weekdays: string;
  weekends: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

// Schedules & Batches
export interface ScheduleData {
  classes: ClassSchedule[];
}

export interface ClassSchedule {
  id: string;
  name: string; // e.g., "Class 10th"
  board: string; // e.g., "CBSE/ICSE"
  subjects: string[];
  batches: Batch[];
}

export interface Batch {
  id: string;
  name: string; // e.g., "Morning Batch"
  schedule: Schedule;
  teacher: Teacher;
  capacity: number;
  enrolled: number;
  fees: FeeStructure;
}

export interface Schedule {
  days: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  time: string; // e.g., "8:00 AM - 10:00 AM"
}

export interface Teacher {
  name: string;
  qualification: string;
  experience: string;
}

export interface FeeStructure {
  monthly: number;
  quarterly: number;
  halfYearly: number;
  annual: number;
}

// Results & Achievements
export interface ResultsData {
  academicYears: AcademicYear[];
  hallOfFame: HallOfFameCategory[];
}

export interface AcademicYear {
  year: string; // e.g., "2023-2024"
  board: string;
  highlights: YearHighlights;
  toppers: Topper[];
  subjectWiseExcellence?: SubjectPerformance[];
  competitiveExams?: CompetitiveExamResult[];
}

export interface YearHighlights {
  totalStudents: number;
  above90Percent: number;
  above95Percent: number;
  perfectScores: number;
  averagePercentage: number;
}

export interface Topper {
  rollNumber: string; // Future Phase 2: Used for marks lookup
  name: string;
  class: string;
  stream?: string;
  percentage: number;
  subjects: Record<string, number>; // Subject name -> Marks
  achievements: string[];
  testimonial?: string;
}

export interface SubjectPerformance {
  subject: string;
  averageScore: number;
  studentsAbove95: number;
  perfectScores: number;
}

export interface CompetitiveExamResult {
  exam: string; // e.g., "JEE Main", "NEET"
  qualified: number;
  topRank: number;
}

export interface HallOfFameCategory {
  category: string; // e.g., "University Admissions"
  achievements: string[];
}

// Testimonials
export interface TestimonialData {
  testimonials: Testimonial[];
}

export interface Testimonial {
  id: number;
  name: string;
  relation: string; // e.g., "Parent of Class 12th Student"
  rating: number; // 1-5
  comment: string;
  year: number;
}

// ============================================
// PHASE 2: Future Database Types (Preview)
// ============================================
// When we add student portal in Phase 2, we'll add:

export interface StudentLookup {
  rollNumber: string; // Public identifier (no password!)
  studentName: string;
  class: string;
  section?: string;
  results: StudentResult[];
}

export interface StudentResult {
  examName: string; // e.g., "Mid-Term 2024"
  examDate: string;
  subjects: SubjectMark[];
  totalMarks: number;
  percentage: number;
  rank?: number;
}

export interface SubjectMark {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade?: string;
}

// ============================================
// Utility Types
// ============================================

export type FilterOption = {
  label: string;
  value: string;
};

export type SortOption = 'name' | 'percentage' | 'year';
