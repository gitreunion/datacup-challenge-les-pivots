// import { useFormationsStore } from '../../stores/formations';

// export default defineEventHandler(async (event) => {
//   const store = useFormationsStore();
//   const filters = await readBody(event);

//   try {

//     const filteredFormations = store.formations.filter(formation => {
//       return Object.keys(filters).every(key => {
//         return formation[key] === filters[key];
//       });
//     });

//     return filteredFormations;
//   } catch (error) {
//     console.error("Erreur lors du filtrage des formations:", error);
//     throw createError({ statusCode: 500, statusMessage: "Erreur interne du serveur" });
//   }
// });
