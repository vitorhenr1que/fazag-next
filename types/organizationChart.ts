export const ORGANIZATION_NODE_TYPES = [
  'ENTITY',
  'LEADERSHIP',
  'ADVISORY',
  'DEPARTMENT',
  'SECTOR',
] as const;

export type OrganizationNodeType = (typeof ORGANIZATION_NODE_TYPES)[number];

export interface OrganizationNodeData {
  id: string;
  title: string;
  personName: string | null;
  description: string | null;
  type: OrganizationNodeType;
  parentId: string | null;
  order: number;
  active: boolean;
}

export interface OrganizationCourseData {
  id: string;
  name: string;
  slug: string;
  coordinator: string;
  degree: string | null;
}

export interface OrganizationChartData {
  nodes: OrganizationNodeData[];
  courses: OrganizationCourseData[];
}

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationNodeType, string> = {
  ENTITY: 'Mantenedora',
  LEADERSHIP: 'Direção',
  ADVISORY: 'Assessoria',
  DEPARTMENT: 'Coordenação ou departamento',
  SECTOR: 'Setor ou núcleo',
};
