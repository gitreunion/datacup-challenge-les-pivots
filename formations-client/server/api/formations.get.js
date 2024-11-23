import { readFileSync } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const filePath = resolve('./data/formations_metiers_relations.json');
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const query = getQuery(event);

    // Convertir l'objet formations en tableau
    const formations = query.numero ? data.formations[query.numero] : Object.values(data.formations);

    return formations;
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier formations_metiers_relations.json:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des formations"
    });
  }
});
