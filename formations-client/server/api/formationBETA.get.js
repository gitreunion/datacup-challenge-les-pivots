// import { useFormationsStore } from '../../stores/formations';
// import fs from 'fs';
// import path from 'path';

// export default defineEventHandler(async (event) => {
//   const store = useFormationsStore();

//   try {
//     const response = await fetch('URL_DE_L_API'); // Remplacez par l'URL de l'API
//     const apiData = await response.json();

//     // Parser les données pour correspondre à votre structure
//     const parsedData = apiData.map(item => ({
//       date_validite: item.date_validite,
//       code_rom: item.code_rom,
//       code_rncp: item.code_rncp,
//       nom_certificateur: item.nom_certificateur,
//       france_competence_active: item.france_competence_active,
//       contenu_formation: item.contenu_formation,
//       bloc_competences: item.bloc_competences,
//       titre_formation: item.titre_formation,
//       categorie_formation: item.categorie_formation,
//       competence_demandeur: item.competence_demandeur,
//       metier_vise: item.metier_vise,
//       diplome_deja_fait: item.diplome_deja_fait,
//     }));

//     // Mettre à jour le store avec les données parsées
//     store.setFormations(parsedData);

//     // Écrire les données dans un fichier JSON
//     const jsonFilePath = path.join(process.cwd(), 'data/formations.json'); // Chemin vers le fichier JSON
//     fs.writeFileSync(jsonFilePath, JSON.stringify(parsedData, null, 2)); // Écrire les données dans le fichier

//     return parsedData; // Retourner les formations parsées
//   } catch (error) {
//     console.error("Erreur lors de la récupération des formations:", error);
//     throw createError({ statusCode: 500, statusMessage: "Erreur lors de la récupération des données" });
//   }
// });
