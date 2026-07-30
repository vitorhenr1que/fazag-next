import { useEffect, useState } from 'react';

export type PublicCourse = { id: string; name: string; slug: string };

export function usePublicCourses() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/cursos')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (active && Array.isArray(data)) {
          setCourses([...data].sort((first, second) => first.name.localeCompare(second.name, 'pt-BR')));
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return courses;
}
