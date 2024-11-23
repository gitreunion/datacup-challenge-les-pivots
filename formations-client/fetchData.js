import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import AdmZip from 'adm-zip';
import csv from 'csv-parser';
import { createReadStream } from 'fs';

// Fonction utilitaire pour ajouter un délai
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fonction utilitaire pour formater le temps écoulé
function formatDuration(startTime) {
  const duration = Date.now() - startTime;
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

const tokenStartTime = Date.now();

async function fetchBearerToken() {
  const tokenStartTime = Date.now();
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': process.env.FRANCE_TRAVAIL_API_CLIENT_ID,
      'client_secret': process.env.FRANCE_TRAVAIL_API_CLIENT_SECRET,
      'scope': 'api_offresdemploiv2 o2dsoffre api_rome-fiches-metiersv1 nomenclatureRome api_rome-competencesv1 api_rome-metiersv1'
    })
  };

  try {
    const response = await fetch('https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=partenaire', config);
    const data = await response.json();
      (`Token obtenu en ${formatDuration(tokenStartTime)}`);
    return data.access_token;
  } catch (error) {
    console.error("Erreur lors de l'obtention du token :", error);
    throw error;
  }
}

async function fetchWithRetry(url, token, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000);
    }
  }
}

async function fetchJobsAndSkills() {
  const globalStartTime = Date.now();
  let metiersStartTime, detailsStartTime;

  try {
      ("Début du processus de récupération des données...");
    const token = await fetchBearerToken();
    const batchSize = 5;

    // Récupération de la liste des métiers
    metiersStartTime = Date.now();
      ("Récupération de la liste des métiers...");
    const metiersResponse = await fetchWithRetry(
      'https://api.francetravail.io/partenaire/rome-metiers/v1/metiers/metier',
      token
    );
      (`Liste des métiers récupérée en ${formatDuration(metiersStartTime)}`);
      (`${metiersResponse.length} métiers trouvés. Récupération des détails...`);

    // Traitement par lots
    detailsStartTime = Date.now();
    const jobsWithSkills = [];
    for (let i = 0; i < metiersResponse.length; i += batchSize) {
      // for (let i = 0; i < 5; i += batchSize) {
      const batchStartTime = Date.now();
      const batch = metiersResponse.slice(i, i + batchSize);

        (`\nTraitement du lot ${Math.floor(i/batchSize) + 1}/${Math.ceil(metiersResponse.length/batchSize)}`);

      const batchPromises = batch.map(async (job, index) => {
        try {
            (`Traitement du métier ${job.code} (${i + index + 1}/${metiersResponse.length})`);
          await delay(1200 * index);

          const jobDetails = await fetchWithRetry(
            `https://api.francetravail.io/partenaire/rome-metiers/v1/metiers/metier/${job.code}`,
            token
          );

          return {
            id: job.code,
            titre: job.libelle,
            definition: job.definition,
            domaine: job.domaine,
            niveau_qualification: job.niveau_qualification,
            secteursActivites: (jobDetails.secteursActivites || []).map(secteur => ({
              code: secteur.code,
              libelle: secteur.libelle
            })),
            formations: (job.formacodes || []).map(formation => ({
              code: formation.code,
              libelle: formation.libelle
            })),
            salaire_moyen: {
              debutant: job.salaire_debutant,
              confirme: job.salaire_confirme
            },
            competences: (jobDetails.competencesMobilisees || []).map(skill => ({
              id: skill.code,
              libelle: skill.libelle,
              type: skill.type || 'NON_CLASSEE',
              niveau: skill.niveau || [],
              technologies: skill.technologies || []
            }))
          };
        } catch (error) {
          console.error(`Erreur pour le métier ${job.code}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      jobsWithSkills.push(...batchResults.filter(Boolean));

        (`Lot traité en ${formatDuration(batchStartTime)}`);

      if (i + batchSize < metiersResponse.length) {
          ("Pause entre les lots...");
        await delay(2000);
      }
    }

      (`\nRécupération des détails terminée en ${formatDuration(detailsStartTime)}`);

    // Création du dossier data si inexistant
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Écriture des fichiers
    fs.writeFileSync(
      path.join(dataDir, 'jobs_with_skills.json'),
      JSON.stringify({ jobs: jobsWithSkills }, null, 2)
    );

      ("\nRécapitulatif des temps :");
      (`- Obtention du token : ${formatDuration(tokenStartTime)}`);
      (`- Récupération liste des métiers : ${formatDuration(metiersStartTime)}`);
      (`- Récupération des détails : ${formatDuration(detailsStartTime)}`);
      (`- Temps total : ${formatDuration(globalStartTime)}`);

    return jobsWithSkills;

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
      (`Temps écoulé avant l'erreur : ${formatDuration(globalStartTime)}`);
    throw error;
  }
}

async function loadCSVFile(filePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(csv({ separator: ';' })) // Utilisation du point-virgule comme séparateur
      .on('data', (data) => results.push(data))
      .on('end', () => {
          (`Fichier chargé: ${filePath}`);
          (`Nombre de lignes: ${results.length}`);
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
}

async function analyzeFranceCompetenceData(csvData) {
  const result = {
    formations: {}, // Stockage des formations RNCP avec leurs détails
    metiers: {},    // Stockage des métiers ROME avec leurs formations
    relations: {}   // Relations entre RNCP et ROME
  };

  try {
    // 1. Traiter d'abord le fichier Standard pour avoir toutes les formations RNCP
    const standardData = csvData['export_fiches_CSV_Standard_2024_11_22.csv'];

    for (const formation of standardData) {
      const rncpNumber = formation.Numero_Fiche;
      result.formations[rncpNumber] = {
        numero: rncpNumber,
        intitule: formation.Intitule,
        niveau: formation.Nomenclature_Europe_Niveau,
        actif: formation.Actif === 'ACTIVE',
        formacodes: [],
        metiers_rome: [],
        certificateurs: []
      };

      // Si inactif, chercher le nouveau numéro RNCP
      if (!result.formations[rncpNumber].actif) {
        const nouvellesCertifs = csvData['export_fiches_CSV_Ancienne_Nouvelle_Certification_2024_11_22.csv'];
        const nouvelle = nouvellesCertifs.find(cert => cert.Ancienne_Certification === rncpNumber);
        if (nouvelle) {
          result.formations[rncpNumber].nouveau_rncp = nouvelle.Nouvelle_Certification;
        }
      }
    }

    // 2. Ajouter les Formacodes
    const formacodeData = csvData['export_fiches_CSV_Formacode_2024_11_22.csv'];
    for (const formacode of formacodeData) {
      const formation = result.formations[formacode.Numero_Fiche];
      if (formation) {
        formation.formacodes.push({
          code: formacode.Formacode_Code,
          libelle: formacode.Formacode_Libelle
        });
      }
    }

    // 3. Ajouter les certificateurs
    const certificateursData = csvData['export_fiches_CSV_Certificateurs_2024_11_22.csv'];
    for (const cert of certificateursData) {
      const formation = result.formations[cert.Numero_Fiche];
      if (formation) {
        formation.certificateurs.push({
          siret: cert.Siret_Certificateur,
          nom: cert.Nom_Certificateur
        });
      }
    }

    // 4. Créer les relations ROME-RNCP
    const romeData = csvData['export_fiches_CSV_Rome_2024_11_22.csv'];
    for (const rome of romeData) {
      const rncpNumber = rome.Numero_Fiche;
      const romeCode = rome.Codes_Rome_Code;

      // Ajouter le métier s'il n'existe pas
      if (!result.metiers[romeCode]) {
        result.metiers[romeCode] = {
          code: romeCode,
          libelle: rome.Codes_Rome_Libelle,
          formations_rncp: []
        };
      }

      // Créer la relation bidirectionnelle
      if (result.formations[rncpNumber]) {
        result.formations[rncpNumber].metiers_rome.push(romeCode);
        result.metiers[romeCode].formations_rncp.push(rncpNumber);

        // Ajouter dans la table de relations
        if (!result.relations[romeCode]) {
          result.relations[romeCode] = [];
        }
        result.relations[romeCode].push(rncpNumber);
      }
    }

    return result;

  } catch (error) {
    console.error("Erreur lors de l'analyse des données:", error);
    throw error;
  }
}

async function createFormationsStandardJson(csvData) {
  try {
    const standardData = csvData['export_fiches_CSV_Standard_2024_11_22.csv'];
    const formationsMap = {};

    // Traitement des données
    standardData.forEach(formation => {
      const niveau = formation.Nomenclature_Europe_Niveau?.replace('NIV', '') || '';

      formationsMap[formation.Numero_Fiche] = {
        numero: formation.Numero_Fiche,
        intitule: formation.Intitule,
        niveau_rncp: niveau,
        type: formation.Abrege_Libelle,
        date_fin: formation.Date_Fin_Enregistrement,
        actif: formation.Actif === 'ACTIVE',
        validation_partielle: formation.Validation_Partielle === 'Oui',
        type_enregistrement: formation.Type_Enregistrement,
        date_effet: formation.Date_Effet,
        date_decision: formation.Date_Decision
      };
    });

    // Écriture du fichier
    fs.writeFileSync(
      path.join(process.cwd(), 'data/formations_standard.json'),
      JSON.stringify(formationsMap, null, 2)
    );

      ('Fichier formations_standard.json créé avec succès');
    return formationsMap;

  } catch (error) {
    console.error("Erreur lors de la création du JSON des formations standard:", error);
    throw error;
  }
}

async function checkFranceCompetence() {
  const __dirname = path.resolve();
  const dataDir = path.join(__dirname, 'data/francecompetence');
  const exportDir = path.join(dataDir, 'export');

  // Création du dossier export s'il n'existe pas
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  // Recherche du fichier zip
  const files = fs.readdirSync(dataDir);
  const zipFile = files.find(file => file.endsWith('.zip'));

  if (!zipFile) {
      ('Aucun fichier zip trouvé dans le dossier francecompetence');
    return;
  }

  try {
    const zipPath = path.join(dataDir, zipFile);
      ('Extraction du fichier zip:', zipPath);

    // Extraction du zip
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(exportDir, true);

      ('Extraction terminée dans:', exportDir);

    // Liste des fichiers extraits
    const extractedFiles = fs.readdirSync(exportDir);
      ('Fichiers extraits:', extractedFiles);

    // Chargement des fichiers CSV
    const csvData = {};
    for (const file of extractedFiles) {
      if (file.endsWith('.csv')) {
        const filePath = path.join(exportDir, file);
        try {
          csvData[file] = await loadCSVFile(filePath);
          // Affichage des premières lignes pour vérification
            (`\nPremière ligne de ${file}:`, csvData[file][0]);
        } catch (error) {
          console.error(`Erreur lors du chargement de ${file}:`, error);
        }
      }
    }

      ('Création du JSON des formations standard...');
    const formationsStandard = await createFormationsStandardJson(csvData);
      ('JSON des formations standard créé');

    // Analyser les données
    // const analysedData = await analyzeFranceCompetenceData(csvData);

    // // Fusionner les données des formations standard avec les relations
    // Object.keys(analysedData.formations).forEach(rncpNumber => {
    //   if (formationsStandard[rncpNumber]) {
    //     analysedData.formations[rncpNumber] = {
    //       ...formationsStandard[rncpNumber],
    //       ...analysedData.formations[rncpNumber]
    //     };
    //   }
    // });

    // // Sauvegarder le résultat
    // fs.writeFileSync(
    //   path.join(__dirname, 'data/formations_metiers_relations.json'),
    //   JSON.stringify(analysedData, null, 2)
    // );

    return analysedData;

  } catch (error) {
    console.error("Erreur lors de l'extraction ou du chargement des fichiers:", error);
  }
}


checkFranceCompetence();
createFormationsStandardJson();
fetchJobsAndSkills();
