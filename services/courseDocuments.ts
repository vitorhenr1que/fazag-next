export const COURSE_DOCUMENT_CATEGORIES = {
  GRADE_DOCENTE: 'cursos/horarios',
  MATRIZ_CURRICULAR: 'cursos/matrizes',
  OUTRO: 'cursos/outros',
} as const;

export type CourseDocumentCategory = keyof typeof COURSE_DOCUMENT_CATEGORIES;

export const isCourseDocumentCategory = (value: string): value is CourseDocumentCategory =>
  Object.prototype.hasOwnProperty.call(COURSE_DOCUMENT_CATEGORIES, value);

export const getCourseDocumentFolder = (category: string) => {
  if (!isCourseDocumentCategory(category)) {
    throw new Error('Categoria de documento inválida.');
  }
  return COURSE_DOCUMENT_CATEGORIES[category];
};
