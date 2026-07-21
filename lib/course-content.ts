export interface BiText {
  en: string;
  bn: string;
}

export interface WhyCard {
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
}

export interface CurriculumLesson {
  titleEn: string;
  titleBn: string;
  duration: string;
  durationBn: string;
  isLive: boolean;
}

export interface CurriculumSection {
  titleEn: string;
  titleBn: string;
  lessons: CurriculumLesson[];
}

export interface FaqItem {
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
}

export function pickText(locale: string, en?: string | null, bn?: string | null) {
  if (locale === "bn") return bn || en || "";
  return en || bn || "";
}

export function pickBi(locale: string, item: BiText) {
  return pickText(locale, item.en, item.bn);
}

export function getLearnPoints(course: { learnPoints: unknown }): BiText[] {
  return Array.isArray(course.learnPoints) ? (course.learnPoints as unknown as BiText[]) : [];
}

export function getFeatures(course: { features: unknown }): BiText[] {
  return Array.isArray(course.features) ? (course.features as unknown as BiText[]) : [];
}

export function getWhyCards(course: { whyCards: unknown }): WhyCard[] {
  return Array.isArray(course.whyCards) ? (course.whyCards as unknown as WhyCard[]) : [];
}

export function getFaqs(course: { faqs: unknown }): FaqItem[] {
  return Array.isArray(course.faqs) ? (course.faqs as unknown as FaqItem[]) : [];
}

export function getCurriculumSections(course: { curriculum: unknown }): CurriculumSection[] {
  const data = course.curriculum as { sections?: CurriculumSection[]; modules?: string[] } | null;
  if (data?.sections && Array.isArray(data.sections)) return data.sections;
  // Backward compatibility: old shape was { modules: string[] }
  if (data?.modules && Array.isArray(data.modules)) {
    return data.modules.map((m) => ({
      titleEn: m,
      titleBn: m,
      lessons: []
    }));
  }
  return [];
}

export function discountPercent(course: { fee: number; originalFee: number | null }): number | null {
  if (!course.originalFee || course.originalFee <= course.fee) return null;
  return Math.round(((course.originalFee - course.fee) / course.originalFee) * 100);
}
