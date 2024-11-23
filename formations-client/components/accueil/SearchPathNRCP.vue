<template>
  <div class="search-path-container container">
    <LoadingSpinner v-if="isLoading" message="Chargement des données"
      sub-message="Nous préparons vos options personnalisées..." />

    <div v-else class="search-path-layout">
      <!-- Bloc de questions -->
      <div class="content-block">
        <div class="path-steps">
          <div v-for="(step, index) in steps" :key="index" class="step" :class="{
            active: currentStep === index,
            completed: index < currentStep,
          }">
            <div class="step-content">
              <h3>{{ step.question }}</h3>
              <div class="options" v-if="currentStep === index || isComplete">
                <div v-if="index === 0" class="nrcp-textarea">
                  <textarea v-model="nrcpTitle" placeholder="Entrez votre titre RNCP ici..." rows="3"></textarea>
                </div>
                <div v-if="step.options.length > 10" class="search-filter">
                  <div class="search-input">
                    <i class="fas fa-search"></i>
                    <input type="text" v-model="searchQuery" :placeholder="`Rechercher ${index === 1 ? 'une compétence' : 'un métier'
                      }...`" />
                  </div>
                </div>

                <div v-if="step.options.length > 20" class="pagination">
                  <button @click="previousPage" :disabled="currentPage === 1" class="pagination-btn">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <span>{{ currentPage }} / {{ totalPages }}</span>
                  <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              <div v-if="showActionButton(index) && !isLastStep" class="next-button-container">
                <button @click="handleActionButton" class="next-btn">
                  Chercher
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Métiers NRCP -->
      <div class="content-block">
        <div class="results-section">
          <h4>
            <i class="fas fa-briefcase"></i>
            Métiers disponibles avec le titre RNCP
          </h4>
          <div class="jobs-list">
            <div v-for="job in jobsForNRCP" :key="job.code" class="job-card">
              <div class="job-content">
                <h5>{{ job.libelle }}</h5>
                <span class="job-code">{{ job.code }}</span>
              </div>
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Métiers avec formation unique -->
      <div class="content-block">
        <div class="results-section">
          <h4>
            <i class="fas fa-graduation-cap"></i>
            Métiers possibles avec une seule formation
          </h4>
          <div class="jobs-list">
            <div v-if="possibleJobsWithSingleFormation.length === 0">
              <p>Aucun métier trouvé avec une seule formation</p>
            </div>
            <div v-for="job in possibleJobsWithSingleFormation" :key="job.id" class="job-card">
              <div class="job-content">
                <h5>{{ job.titre }}</h5>
                <span class="job-code">{{ job.formation.intitule }}</span>
              </div>
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useFormationsStore } from "~/stores/formations";
import LoadingSpinner from "~/components/accueil/LoadingSpinner.vue";

const store = useFormationsStore();
const isLoading = ref(false);

// Initialisation des refs
const currentStep = ref(0);
const isComplete = ref(false);
const jobsForNRCP = ref([]);
const possibleJobsWithSingleFormation = ref([]);
const nrcpTitle = ref("");

const steps = ref([
  {
    question: "Titre RNCP possèdé ?",
    options: "",
    multiple: false,
  },
]);

const showActionButton = (stepIndex) => {
  return currentStep.value === stepIndex && stepIndex < steps.value.length;
};

const handleActionButton = async () => {
  isLoading.value = true;
  try {
    // Récupérer les jobs associés à un titre RNCP
    jobsForNRCP.value = store.getJobsForNRCP(nrcpTitle.value);

    // Récupérer les métiers possibles avec une seule formation
    possibleJobsWithSingleFormation.value = await
      store.getPossibleJobsWithSingleFormation(nrcpTitle.value);

      ("POSSIBLE JOBS", possibleJobsWithSingleFormation.value);
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    isLoading.value = false;
  }
};

const goToNextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++;
  }
};

const getStepOptions = (stepIndex) => {
  return steps.value[stepIndex].options;
};

const formatDate = (date) => {
  return date;
};

const getCompetenceIcon = (type) => {
  switch (type) {
    case "SAVOIR":
      return "fas fa-book";
    case "COMPETENCE-DETAILLEE":
      return "fas fa-tools";
    default:
      return "fas fa-star";
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await store.fetchFormations();
      ("Données chargées:", {
      jobsWithSkills: store.getAllJobsWithSkills,
      formationsMetiersRelations: store.formationsMetiersRelations,
    });
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  } finally {
    isLoading.value = false;
  }
});

watch(
  () => store.jobsWithSkills,
  (newValue) => {
    if (newValue) {
        ("Nouvelles données de jobs chargées:", newValue);
    }
  }
);

const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 20;

const filteredOptions = (options, stepIndex) => {
  if (!searchQuery.value) {
    const start = (currentPage.value - 1) * itemsPerPage;
    return options.slice(start, start + itemsPerPage);
  }

  const filtered = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      option.description
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
  );

  return filtered;
};

const totalPages = computed(() => {
  const currentStepOptions = steps.value[currentStep.value].options;
  return Math.ceil(currentStepOptions.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

watch(currentStep, () => {
  currentPage.value = 1;
  searchQuery.value = "";
});

// Ajout de la ref pour les données de la timeline
const timelineData = ref(null);
</script>

<style lang="scss" scoped>
.search-path-container {
  position: relative;
  min-height: 50vh;
  width: 100%;
  padding: 2rem 0;
}

.search-path-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
  margin: 0 auto;
  max-width: 1400px;
  padding: $spacing-lg;
  min-height: calc(100vh - 4rem); // Pour tenir compte du padding de 2rem en haut et en bas

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    max-width: 800px;
  }
}

.path-steps {
  .step {
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    border-radius: $border-radius;
    background: rgba($light-gray, 0.2);
    transition: all 0.3s ease;

    &.active {
      background: rgba($primary-blue, 0.05);
      border-left: 4px solid $primary-blue;
    }

    &.completed {
      background: rgba($primary-green, 0.05);
      border-left: 4px solid $primary-green;
    }

    .step-content {
      h3 {
        color: $dark-gray;
        font-size: $font-size-lg;
        margin-bottom: $spacing-md;
        font-weight: 600;
      }

      .nrcp-textarea {
        margin: $spacing-md 0;

        textarea {
          width: 100%;
          padding: $spacing-md;
          border: 2px solid rgba($primary-blue, 0.2);
          border-radius: $border-radius;
          font-size: $font-size-base;
          resize: vertical;
          transition: all 0.3s ease;

          &:focus {
            border-color: $primary-blue;
            box-shadow: 0 0 0 3px rgba($primary-blue, 0.1);
            outline: none;
          }

          &::placeholder {
            color: rgba($dark-gray, 0.5);
          }
        }
      }

      .next-button-container {
        margin-top: $spacing-md;
        text-align: right;

        .next-btn {
          background: $primary-blue;
          color: $white;
          border: none;
          padding: $spacing-sm $spacing-lg;
          border-radius: $border-radius;
          font-size: $font-size-base;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: $spacing-sm;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: darken($primary-blue, 10%);
            transform: translateX(3px);
          }

          i {
            font-size: $font-size-sm;
          }
        }
      }
    }
  }
}

.results-section {
  background: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  height: auto;
  box-shadow: 0 2px 8px rgba($dark-gray, 0.1);

  h4 {
    color: $dark-gray;
    font-size: $font-size-lg;
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-sm;
    border-bottom: 2px solid $primary-blue;
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    i {
      color: $primary-blue;
    }
  }

  .jobs-list {
    max-height: 600px;
    overflow-y: auto;
    padding-right: $spacing-sm;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: $light-gray;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: $primary-blue;
      border-radius: 3px;
    }
  }

  .job-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md;
    margin-bottom: $spacing-sm;
    background: rgba($light-gray, 0.3);
    border-radius: $border-radius;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba($primary-blue, 0.05);
      transform: translateX(5px);

      .fa-chevron-right {
        transform: translateX(3px);
      }
    }

    .job-content {
      flex: 1;

      h5 {
        color: $dark-gray;
        font-size: $font-size-base;
        margin-bottom: $spacing-xs;
      }

      .job-code {
        font-size: $font-size-sm;
        color: $primary-blue;
        background: rgba($primary-blue, 0.1);
        padding: 2px 8px;
        border-radius: 12px;
      }
    }

    .fa-chevron-right {
      color: $primary-blue;
      font-size: $font-size-sm;
      transition: transform 0.3s ease;
    }
  }
}
</style>
