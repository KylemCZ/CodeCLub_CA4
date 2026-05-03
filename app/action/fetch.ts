"use server";
import { Technology } from '@/app/lib/definitions';
import { Projects } from '@/app/lib/definitions';
import sql from '@/app/lib/db';


export async function fetchAllTechs() : Promise <Technology[]> {
    const res = await sql`SELECT * FROM technologies ORDER BY sort_order`;
    if (res.length === 0) {
        return [];
}

const technologies: Technology[] = res.map(
    (row) => ({
    id: row.id,
    description: row.description,
    image: row.image,
    bgColor: row.bg_color,
    buttonColor: row.button_color,
    sort_order: row.sort_order,
    isActive: row.is_active,
}));
return technologies;
}

export async function fetchAllProjects() : Promise <Projects[]> {
    const res = await sql`  SELECT * FROM projects ORDER BY sort_order`;
  if (res.length === 0) {
    return [];
  }

  const projects: Projects[] = res.map((row) => ({
    id: row.id,
    description: row.description,
    image: row.image,
    bgColor: row.bg_color,
    buttonColor: row.button_color,
    sort_order: row.sort_order,
  }));

  return projects;

}

export async function fetchProjectsByTech(techId: string) : Promise <Projects[]> {
  const res = await sql`SELECT * FROM projects WHERE technology_id = ${techId} ORDER BY sort_order`;
  
  if (res.length === 0) {
    return [];
  }

  const projects: Projects[] = res.map((row) => ({
    id: row.id,
    description: row.description,
    image: row.image,
    bgColor: row.bg_color,
    buttonColor: row.button_color,
    sort_order: row.sort_order,
  }));

  return projects;
}