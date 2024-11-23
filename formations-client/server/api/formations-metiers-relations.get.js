import { readFileSync } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const filePath = resolve('./data/formations_metiers_relations.json');
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));

    return data;
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier formations_metiers_relations.json:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des relations formations-métiers"
    });
  }
});
