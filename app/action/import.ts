"use server";
import sql from '@/app/lib/db';
import { getUser } from '@/app/lib/dal';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const user = await getUser()
  if (user?.role !== 'admin') redirect('/technologies')
}

export async function toggleTechActive(techId: string, isActive: boolean) {
  await requireAdmin()
  await sql`UPDATE technologies SET is_active = ${!isActive} WHERE id = ${techId}`
}

export async function addTechnology(formData: FormData) {
  const id = formData.get('id') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as string;
  const bgColor = formData.get('bgColor') as string;
  const buttonColor = formData.get('buttonColor') as string;

  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  await sql`
    INSERT INTO technologies (id, description, image, bg_color, button_color)
    VALUES (${capitalizeFirst(id)}, ${capitalizeFirst(description)}, ${image}, ${bgColor}, ${buttonColor})
  `;
}

export async function addProject(formData: FormData) {
  const id = formData.get('id') as string;
  const technologyId = formData.get('technologyId') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as string;
  const bgColor = formData.get('bgColor') as string;
  const buttonColor = formData.get('buttonColor') as string;
  
  const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  await sql`
  INSERT INTO projects (
    id,
    description,
    image,
    bg_color,
    button_color,
    technology_id
  )
  VALUES (
    ${capitalizeFirst(id)},
    ${description},
    ${image},
    ${bgColor},
    ${buttonColor},
    ${technologyId}              
  )
  `;
}