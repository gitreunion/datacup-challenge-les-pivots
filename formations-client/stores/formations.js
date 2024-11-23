import { defineStore } from "pinia";

const CACHE_DURATION = 1000 * 60 * 60; // 1 heure
let lastFetchTime = 0;
export const useFormationsStore = defineStore("formations", {
  state: () => ({
    formations: [],
    formationsMetiersRelations: null,
    jobsWithSkills: null,
    isLoading: false,
    error: null,
    isDataLoaded: false,
    isFormationsStandard: null,

  }),

  getters: {
    getFormationById: (state) => (id) => {
      return state.formations.find((formation) => formation.id === id);
    },

    getFormationsByCategory: (state) => (category) => {
      return state.formations.filter(
        (formation) => formation.category === category
      );
    },

    getFormationsForJob: (state) => (jobCode) => {
        ('Getting formations for job:', jobCode);
      if (!state.formationsMetiersRelations?.metiers) {
          ('No metiers data available');
        return [];
      }

      const metier = state.formationsMetiersRelations.metiers[jobCode];
      if (!metier) {
          ('No metier found for code:', jobCode);
        return [];
      }

        ('Found metier:', metier);
      const formations = metier.formations_rncp
        .map(rncpNumber => {
          const formation = state.formationsMetiersRelations.formations[rncpNumber];
          return formation ? { ...formation, numero: rncpNumber } : null;
        })
        .filter(Boolean);

        ('Found formations:', formations);
      return formations;
    },

    getJobsForFormation: (state) => (rncpNumber) => {
      if (!state.formationsMetiersRelations?.formations[rncpNumber]) return [];

      return state.formationsMetiersRelations.formations[rncpNumber].metiers_rome.map(romeCode => ({
        ...state.formationsMetiersRelations.metiers[romeCode],
        code: romeCode
      }));
    },

    getJobsSize: (state) => {
      return state.jobsWithSkills?.jobs.length;
    },

    getAllJobs: (state) => {
      if (!state.formationsMetiersRelations?.metiers) return [];
      return Object.values(state.formationsMetiersRelations.metiers);
    },

    getAllFormations: (state) => {
      if (!state.formationsMetiersRelations?.formations) return [];
      return Object.values(state.formationsMetiersRelations.formations);
    },

    getFormationsSize: (state) => {
      return state.formations.length;
    },

    getAllJobsWithSkills: (state) => {
      return state.jobsWithSkills?.jobs || [];
    },

    getFormationCompetences: (state) => (rncpNumber) => {
      const formation = state.formationsMetiersRelations?.formations[rncpNumber];
      return formation?.competences || [];
    },

    getJobCompetences: (state) => (jobId) => {
      const job = state.jobsWithSkills?.jobs.find(j => j.id === jobId);
      return job?.competences || [];
    },

    getFormationsByLevel: (state) => (level) => {
      return Object.values(state.formationsMetiersRelations?.formations || {})
        .filter(f => f.niveau_rncp === level);
    },

    getFormationSpecialisations: (state) => (rncpNumber) => {
      const formation = state.formationsMetiersRelations?.formations[rncpNumber];
      return formation?.specialisations || [];
    },

    getFormationsForJobByLevel: (state) => (romeCode, level) => {
      if (!state.formationsMetiersRelations?.metiers[romeCode]) return [];

      const formations = state.formationsMetiersRelations.metiers[romeCode].formations_rncp
        .map(rncpNumber => ({
          ...state.formationsMetiersRelations.formations[rncpNumber],
          numero: rncpNumber
        }))
        .filter(formation => formation.niveau_rncp === level.toString());

      return formations;
    },

    getMinLevelForJob: (state) => (romeCode) => {
      if (!state.formationsMetiersRelations?.metiers[romeCode]) return 3;

      const formations = state.formationsMetiersRelations.metiers[romeCode].formations_rncp
        .map(rncpNumber => state.formationsMetiersRelations.formations[rncpNumber]);

      return Math.min(...formations.map(f => parseInt(f.niveau_rncp) || 3));
    },

    getMaxLevelForJob: (state) => (romeCode) => {
      if (!state.formationsMetiersRelations?.metiers[romeCode]) return 7;

      const formations = state.formationsMetiersRelations.metiers[romeCode].formations_rncp
        .map(rncpNumber => state.formationsMetiersRelations.formations[rncpNumber]);

      return Math.max(...formations.map(f => parseInt(f.niveau_rncp) || 7));
    },
    getJobsForNRCP: (state) => (nrcpNumber) => {
      if (!nrcpNumber || !state.formationsMetiersRelations) {
        return [];
      }

      const nrcpNumberTab = nrcpNumber.split(',');
      let jobs = [];

      for (let i = 0; i < nrcpNumberTab.length; i++) {
        const currentNrcp = nrcpNumberTab[i].trim();

        const formation = state.formationsMetiersRelations.formations[currentNrcp];
        if (!formation || !formation.metiers_rome) {
          continue;
        }

        const jobsForNrcp = formation.metiers_rome.map(romeCode => ({
          ...state.formationsMetiersRelations.metiers[romeCode],
          code: romeCode
        }));

        jobs = [...jobs, ...jobsForNrcp];
      }

      return jobs;
    },


    getPossibleJobsWithSingleFormation: (state) => (formationId) => {
      const formation = state.formationsMetiersRelations?.formations[formationId];
      if (!formation) return [];

      const acquiredSkills = formation.competences || [];
      return state.jobsWithSkills?.jobs.map(job => {
        const jobSkills = job.competences || [];
        const isPossible = acquiredSkills.every(skill => jobSkills.some(js => js.id === skill.id));
        return isPossible ? { ...job, formation } : null;
      }).filter(Boolean);
    },

  },

  actions: {


    async getFormationStandard({ numero = [] }) {
      try {
        const formations = await $fetch('/api/formations-standard', {
          query: { numero: Array.isArray(numero) ? numero : [numero] }
        });
        return formations;
      } catch (error) {
        console.error("Erreur lors de la récupération des formations standard:", error);
        return [];
      }
    },

    async fetchFormations(filters = {}) {
        ('FETCH FORMATIONS');
      this.isLoading = true;
      if (Date.now() - lastFetchTime < CACHE_DURATION) {
          ("Using cached data");
        return;
      }
      try {
        const [formationsData, relationsData, jobsData, formationStantdard] = await Promise.all([
          $fetch("/api/formations", { query: filters }),
          $fetch("/api/formations-metiers-relations"),
          $fetch("/api/jobs-with-skills")
        ]);

        if (formationsData) {
          this.formations = formationsData;
        }

        if (relationsData) {
          this.formationsMetiersRelations = relationsData;
        }

        if (jobsData) {
          this.jobsWithSkills = jobsData;
            ("Jobs with skills loaded:", this.jobsWithSkills);
        }

        this.error = null;
        this.isDataLoaded = true;

      } catch (error) {
        this.error = "Erreur lors du chargement des données";
        console.error("Erreur store formations:", error);
        this.formations = [];
        this.formationsMetiersRelations = null;
        this.jobsWithSkills = null;
      } finally {
        this.isLoading = false;
        lastFetchTime = Date.now();
      }
    },

    searchFormations(keyword) {
      if (!keyword) return this.getAllFormations;

      const searchTerm = keyword.toLowerCase();
      return this.getAllFormations.filter(formation =>
        formation.intitule.toLowerCase().includes(searchTerm) ||
        formation.formacodes.some(f => f.libelle.toLowerCase().includes(searchTerm))
      );
    },

    searchJobs(keyword) {
      if (!keyword) return this.getAllJobs;

      const searchTerm = keyword.toLowerCase();
      return this.getAllJobs.filter(job =>
        job.libelle.toLowerCase().includes(searchTerm) ||
        job.code.toLowerCase().includes(searchTerm)
      );
    },

    setFormations(formations) {
      this.formations = formations || [];
      this.isDataLoaded = true;
    },

    resetStore() {
      this.formations = [];
      this.formationsMetiersRelations = null;
      this.jobsWithSkills = null;
      this.isDataLoaded = false;
      this.isFormationsStandard = null;
      this.error = null;
    },

    getRecommendedPath({ selectedJobs, currentSkills }) {
        ('Getting recommended path for:', { selectedJobs, currentSkills });
      const path = [];

      // 1. Identifier le niveau d'entrée
      const startingLevel = this.determineStartingLevel(currentSkills);
        ('Starting level:', startingLevel);
      const targetLevel = 5; // Niveau cible (Bac+2)

      // 2. Pour chaque métier sélectionné
      selectedJobs.forEach(job => {
          ('Processing job:', job);

        // Récupérer les formations pour ce métier
        const jobFormations = this.getFormationsForJob(job.id);
          ('Found formations for job:', jobFormations);

        if (jobFormations.length === 0) {
            ('No formations found for job:', job.id);
          return;
        }

        // Filtrer les formations valides et actives
        const validFormations = jobFormations.filter(f => {
          if (!f.actif) {
              ('Formation inactive:', f.numero);
            return false;
          }

          const niveau = f.niveau?.replace('NIV', '')?.trim();
            ('Checking niveau:', niveau, 'for formation:', f.numero);
          return niveau && !isNaN(parseInt(niveau));
        });

          ('Valid formations:', validFormations);

        // Trier les formations par niveau
        const sortedFormations = validFormations.sort((a, b) => {
          const levelA = parseInt(a.niveau.replace('NIV', ''));
          const levelB = parseInt(b.niveau.replace('NIV', ''));
          return levelA - levelB;
        });

          ('Sorted formations:', sortedFormations);

        // Récupérer les niveaux disponibles
        const availableLevels = [...new Set(sortedFormations.map(f =>
          parseInt(f.niveau.replace('NIV', ''))
        ))];
          ('Available levels:', availableLevels);

        // Si aucun niveau inférieur ou égal à 5 n'est disponible, prendre le niveau minimum disponible
        if (!availableLevels.some(level => level <= 5)) {
          const minLevel = Math.min(...availableLevels);
          const formation = sortedFormations.find(f =>
            parseInt(f.niveau.replace('NIV', '')) === minLevel
          );

          if (formation) {
              (`Using minimum available level (${minLevel}):`, formation);
            path.push({
              job: {
                id: job.id,
                label: job.label,
                icon: job.icon
              },
              formation: {
                ...formation,
                intitule: formation.intitule || "Formation non nommée",
                niveau_rncp: formation.niveau.replace('NIV', '')
              },
              required_skills: this.getRequiredSkills(job.id),
              estimated_duration: this.estimateFormationDuration(formation),
              level_order: 1,
              is_alternative: true // Indique que c'est une alternative au parcours standard
            });
          }
        } else {
          // Parcours normal pour les niveaux disponibles jusqu'à 5
          let currentLevel = startingLevel;
          while (currentLevel <= targetLevel) {
              (`Looking for formation level ${currentLevel}`);

            // Trouver la formation la plus proche pour le niveau actuel
            let levelFormation = sortedFormations.find(f => {
              const formationLevel = parseInt(f.niveau.replace('NIV', ''));
              return formationLevel === currentLevel;
            });

            // Si pas de formation pour ce niveau exact, chercher la plus proche inférieure
            if (!levelFormation && availableLevels.some(level => level <= currentLevel)) {
              const closestLevel = availableLevels
                .filter(level => level <= currentLevel)
                .reduce((a, b) => Math.abs(b - currentLevel) < Math.abs(a - currentLevel) ? b : a);

              levelFormation = sortedFormations.find(f =>
                parseInt(f.niveau.replace('NIV', '')) === closestLevel
              );
            }

            if (levelFormation) {
                (`Found formation for level ${currentLevel}:`, levelFormation);
              path.push({
                job: {
                  id: job.id,
                  label: job.label,
                  icon: job.icon
                },
                formation: {
                  ...levelFormation,
                  intitule: levelFormation.intitule || "Formation non nommée",
                  niveau_rncp: levelFormation.niveau.replace('NIV', '')
                },
                required_skills: this.getRequiredSkills(job.id),
                estimated_duration: this.estimateFormationDuration(levelFormation),
                level_order: currentLevel - startingLevel + 1
              });
            }

            currentLevel++;
          }
        }
      });

      // Trier le parcours par ordre de niveau
      path.sort((a, b) => a.level_order - b.level_order);

        ('Final recommended path:', path);
      return path;
    },

    estimateFormationDuration(formation) {
      const level = parseInt(formation.niveau.replace('NIV', '')) || 3;

      // Durées ajustées par niveau
      const durations = {
        3: { months: 12, hours: 600 },    // CAP/BEP
        4: { months: 24, hours: 1200 },   // BAC
        5: { months: 24, hours: 1500 },   // BAC+2
        6: { months: 12, hours: 800 },    // BAC+3
        7: { months: 24, hours: 1200 },   // BAC+5
        8: { months: 36, hours: 1800 }    // Doctorat
      };

      return durations[level] || {
        months: 12 + (level - 3) * 6,
        hours: 600 + (level - 3) * 300
      };
    },

    determineStartingLevel(currentSkills) {
      if (!currentSkills || currentSkills.length === 0 ||
          currentSkills.some(s => s.id === "no_skills")) {
        return 3; // Niveau CAP/BEP
      }

      // Analyse plus détaillée des compétences
      const skillLevels = currentSkills.map(skill => {
        if (skill.type === "SAVOIR") return 3;  // Niveau CAP/BEP
        if (skill.type === "COMPETENCE-DETAILLEE") return 4;  // Niveau BAC
        return 3;
      });

      return Math.min(Math.max(...skillLevels, 3), 5); // Plafonné à BAC+2
    },

    getRequiredSkills(jobCode) {
        ('Getting required skills for job:', jobCode);
      const job = this.jobsWithSkills?.jobs.find(j => j.id === jobCode);
      if (!job) {
          ('No job found with code:', jobCode);
        return [];
      }
      return job.competences || [];
    }
  },
});
