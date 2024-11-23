import { readFileSync } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  try {
      ('READ JOBS WITH SKILLS');
    const filePath = resolve('./data/jobs_with_skills.json');
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));

      ('JOBS WOTH SKILL',data);

    return data;
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier jobs_with_skills.json:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des jobs et compétences"
    });
  }
});
