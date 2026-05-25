// ============================================
// DATA FETCHERS - PHASE 1 (Static JSON)
// ============================================
// This file is the SINGLE SOURCE OF TRUTH for data fetching.
// In Phase 2, we'll replace the imports with API calls here,
// and NO OTHER FILES will need to change!

import centerInfoData from '@/data/center-info.json';
import schedulesData from '@/data/schedules.json';
import resultsData from '@/data/results.json';
import testimonialsData from '@/data/testimonials.json';

import type {
  CenterInfo,
  ScheduleData,
  ResultsData,
  TestimonialData,
  ClassSchedule,
  Batch,
  AcademicYear,
} from './types';

// ============================================
// Center Information
// ============================================

/**
 * Fetches basic information about the coaching center.
 * Phase 1: Returns static JSON data.
 * Phase 2: Will fetch from Supabase/Firebase.
 */
export async function getCenterInfo(): Promise<CenterInfo> {
  // Phase 1: Static JSON
  return centerInfoData as CenterInfo;

  // Phase 2: Replace with API call
  // const { data, error } = await supabase
  //   .from('center_info')
  //   .select('*')
  //   .single();
  // if (error) throw error;
  // return data;
}

// ============================================
// Schedules & Fees
// ============================================

/**
 * Fetches all class schedules, batches, and fee information.
 */
export async function getAllSchedules(): Promise<ScheduleData> {
  return schedulesData as ScheduleData;
}

/**
 * Fetches schedules for a specific class.
 * @param classId - The class ID (e.g., "class-10")
 */
export async function getScheduleByClass(
  classId: string
): Promise<ClassSchedule | undefined> {
  const data = await getAllSchedules();
  return data.classes.find((cls) => cls.id === classId);
}

/**
 * Gets unique class names for filter dropdowns.
 */
export async function getClassList(): Promise<Array<{ id: string; name: string }>> {
  const data = await getAllSchedules();
  return data.classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
  }));
}

/**
 * Searches batches across all classes.
 * Useful for "Find a batch by teacher name" feature.
 */
export async function searchBatches(query: string): Promise<Batch[]> {
  const data = await getAllSchedules();
  const allBatches: Batch[] = [];

  data.classes.forEach((cls) => {
    cls.batches.forEach((batch) => {
      if (
        batch.name.toLowerCase().includes(query.toLowerCase()) ||
        batch.teacher.name.toLowerCase().includes(query.toLowerCase())
      ) {
        allBatches.push(batch);
      }
    });
  });

  return allBatches;
}

// ============================================
// Results & Achievements
// ============================================

/**
 * Fetches all academic year results.
 */
export async function getAllResults(): Promise<ResultsData> {
  return resultsData as ResultsData;
}

/**
 * Fetches results for a specific academic year.
 * @param year - Academic year (e.g., "2023-2024")
 */
export async function getResultsByYear(
  year: string
): Promise<AcademicYear | undefined> {
  const data = await getAllResults();
  return data.academicYears.find((ay) => ay.year === year);
}

/**
 * Gets list of available academic years for filter.
 */
export async function getAcademicYearList(): Promise<string[]> {
  const data = await getAllResults();
  return data.academicYears.map((ay) => ay.year);
}

/**
 * Fetches Hall of Fame achievements.
 */
export async function getHallOfFame() {
  const data = await getAllResults();
  return data.hallOfFame;
}

// ============================================
// Testimonials
// ============================================

/**
 * Fetches all testimonials.
 */
export async function getAllTestimonials(): Promise<TestimonialData> {
  return testimonialsData as TestimonialData;
}

/**
 * Fetches recent testimonials (last N testimonials).
 */
export async function getRecentTestimonials(limit: number = 6) {
  const data = await getAllTestimonials();
  return data.testimonials
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
}

// ============================================
// PHASE 2: Student Marks Lookup (Preview)
// ============================================
// When we add student portal, we'll add this function:

/**
 * Looks up student marks by Roll Number (no password required).
 * This is the Phase 2 addition - a public lookup system.
 * 
 * @param rollNumber - Student's unique roll number
 * @returns Student results or null if not found
 */
export async function lookupStudentResults(rollNumber: string) {
  // Phase 2: Replace with database query
  // const { data, error } = await supabase
  //   .from('student_results')
  //   .select('*')
  //   .eq('roll_number', rollNumber.toUpperCase())
  //   .single();
  // 
  // if (error || !data) return null;
  // return data;

  return null; // Phase 1: Not implemented yet
}

// ============================================
// Utility Functions
// ============================================

/**
 * Formats Indian Rupee currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates WhatsApp inquiry link.
 */
export function getWhatsAppLink(
  phoneNumber: string,
  message: string = 'Hello! I would like to inquire about admissions.'
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
}
