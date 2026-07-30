import { prisma } from './prisma';
import { OrganizationChartData, OrganizationNodeType } from '../types/organizationChart';

export const getOrganizationChart = async (includeInactive = false): Promise<OrganizationChartData> => {
  const [nodes, courses] = await Promise.all([
    prisma.organizationNode.findMany({
      where: includeInactive ? undefined : { active: true },
      select: {
        id: true,
        title: true,
        personName: true,
        description: true,
        type: true,
        parentId: true,
        order: true,
        active: true,
      },
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
    }),
    prisma.course.findMany({
      where: includeInactive
        ? { coordinator: { not: null } }
        : { active: true, coordinator: { not: null } },
      select: {
        id: true,
        name: true,
        slug: true,
        coordinator: true,
        degree: true,
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    }),
  ]);

  return {
    nodes: nodes.map((node) => ({
      ...node,
      type: node.type as OrganizationNodeType,
    })),
    courses: courses
      .filter((course): course is typeof course & { coordinator: string } =>
        Boolean(course.coordinator?.trim())
      )
      .map((course) => ({ ...course, coordinator: course.coordinator.trim() })),
  };
};
