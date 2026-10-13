export type PublicationFileType = 'pdf' | 'image' | 'word' | 'powerpoint' | 'excel';

const formats: { extensions: string[]; mimeType: string; fileType: PublicationFileType }[] = [
  { extensions: ['pdf'], mimeType: 'application/pdf', fileType: 'pdf' },
  { extensions: ['jpg', 'jpeg'], mimeType: 'image/jpeg', fileType: 'image' },
  { extensions: ['png'], mimeType: 'image/png', fileType: 'image' },
  { extensions: ['webp'], mimeType: 'image/webp', fileType: 'image' },
  { extensions: ['doc'], mimeType: 'application/msword', fileType: 'word' },
  { extensions: ['docx'], mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileType: 'word' },
  { extensions: ['ppt'], mimeType: 'application/vnd.ms-powerpoint', fileType: 'powerpoint' },
  { extensions: ['pptx'], mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', fileType: 'powerpoint' },
  { extensions: ['xls'], mimeType: 'application/vnd.ms-excel', fileType: 'excel' },
  { extensions: ['xlsx'], mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileType: 'excel' },
];

export const publicationFileAccept = formats
  .flatMap(({ extensions, mimeType }) => [...extensions.map((extension) => `.${extension}`), mimeType])
  .join(',');

export const publicationFileFormatDescription = 'PDF, JPG, PNG, WEBP, Word (DOC/DOCX), PowerPoint (PPT/PPTX) ou Excel (XLS/XLSX)';

export const publicationFileTypeLabels: Record<PublicationFileType, string> = {
  pdf: 'PDF',
  image: 'Imagem',
  word: 'Word',
  powerpoint: 'PowerPoint',
  excel: 'Excel',
};

export const getPublicationFileFormat = (fileName: string, mimeType: string) => {
  const normalizedMimeType = mimeType.trim().toLowerCase();
  const format = formats.find((item) => item.mimeType === normalizedMimeType);
  if (format) return format;

  // Some browsers provide no MIME type (or a generic one) for Office files.
  if (normalizedMimeType && normalizedMimeType !== 'application/octet-stream') return undefined;
  const extension = fileName.split('.').pop()?.toLowerCase();
  return formats.find((item) => item.extensions.includes(extension || ''));
};
