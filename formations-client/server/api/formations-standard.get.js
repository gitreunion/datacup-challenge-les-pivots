import { readFileSync } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const filePath = resolve('./data/formations_standard.json');
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const query = getQuery(event);

    // Si un tableau de numéros est fourni, retourner uniquement ces formations
    if (query.numero) {
      const numeros = Array.isArray(query.numero) ? query.numero : [query.numero];
      const formations = numeros.map(num => data[num]).filter(Boolean);
      return formations;
    }

    // Sinon retourner toutes les formations
    return Object.values(data);
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier formations_standard.json:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des formations"
    });
  }
});
