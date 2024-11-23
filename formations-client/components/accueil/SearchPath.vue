<template>
  <div class="search-path-container container">
    <!-- Ajout du LoadingSpinner -->
    <LoadingSpinner
      v-if="isLoading"
      message="Changement des données"
      sub-message="Nous préparons des options personnalisées.."
    />

    <div v-else class="search-path-layout">
      <!-- Colonne de gauche avec les questions -->
      <div class="questions-column">
        <div class="path-steps">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step"
            :class="{
              active: currentStep === index,
              completed: index < currentStep,
            }"
          >
            <div class="step-content">
              <h3>{{ step.question }}</h3>
              <div class="options" v-if="currentStep === index || isComplete">
                <div v-if="step.options.length > 10" class="search-filter">
                  <div class="search-input">
                    <i class="fas fa-search"></i>
                    <input
                      type="text"
                      v-model="searchQuery"
                      :placeholder="`Rechercher ${
                        index === 1 ? 'une compétence' : 'un métier'
                      }...`"
                    />
                  </div>
                  <div class="selection-counter" v-if="step.multiple">
                    {{ selections[index].length }} sélection(s)
                  </div>
                </div>

                <div
                  class="options-list"
                  :class="{ scrollable: step.options.length > 10 }"
                >
                  <button
                    v-for="option in filteredOptions(step.options, index)"
                    :key="option.id"
                    @click="selectOption(option, index)"
                    class="option-btn"
                    :class="{
                      selected: isOptionSelected(option, index),
                      'option-with-description': option.description,
                    }"
                  >
                    <div class="option-content">
                      <div class="option-header">
                        <i :class="option.icon"></i>
                        <span class="option-label">{{ option.label }}</span>
                      </div>
                      <p v-if="option.description" class="option-description">
                        {{ option.description }}
                      </p>
                    </div>
                    <i
                      v-if="isOptionSelected(option, index)"
                      class="fas fa-check check-icon"
                    ></i>
                  </button>
                </div>

                <div v-if="step.options.length > 20" class="pagination">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="pagination-btn"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <span>{{ currentPage }} / {{ totalPages }}</span>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="pagination-btn"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              <!-- Remplacer le bouton suivant par le bouton valider à la dernière étape -->
              <div
                v-if="showActionButton(index) && !isLastStep"
                class="next-button-container"
              >
                <button
                  @click="handleActionButton"
                  class="next-btn"
                  :disabled="!canProceed(index)"
                >
                  Suivant
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne de droite avec la sélection -->
      <div class="selection-column">
        <div class="selected-path">
          <h4>Votre sélection :</h4>
          <div class="tags">
            <span
              v-for="selection in filteredSelections"
              :key="`${selection.stepIndex}-${selection.id}`"
              class="tag"
            >
              <div class="tag-content">
                <div class="tag-question">{{ selection.question }}</div>
                <div class="tag-value">
                  <i :class="selection.icon"></i>
                  {{ selection.label }}
                </div>
              </div>
              <button class="delete-btn" @click="removeSelection(selection)">
                <i class="fas fa-times"></i>
              </button>
            </span>
            <div v-if="isLastStep" class="final-btn">
              <button
                @click="handleActionButton"
                class="validate-btn"
                :disabled="!canProceed(currentStep)"
              >
                Valider
                <i class="fas fa-check"></i>
              </button>
              <button @click="reset" class="reset-btn">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isFormationTimeline" class="formations-results">
      <ParcoursFormationTimeline
        v-if="timelineData"
        :selected-data="timelineData"
      />
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
const jobs = ref([]);
const formations = ref([]);
const selections = ref({
  0: null, // Secteur d'activité (sélection unique)
  1: [], // Compétences (sélection multiple)
  2: [], // Métiers (sélection multiple)
  3: [], // Objectif (sélection multiple)
});

const isFormationTimeline = ref(false);

const steps = ref([
  {
    question: "Dans quel secteur d'activité souhaitez-vous travailler ?",
    options: [
      { id: "inf", label: "Informartique", icon: "fas fa-code" },
      { id: "hot", label: "Hôtellerie", icon: "fas fa-network-wired" },
      { id: "bat", label: "Gros Œuvre", icon: "fas fa-shield-alt" },
      { id: "com", label: "Commerce", icon: "fas fa-brain" },
    ],
    multiple: false,
  },
  {
    question: "Quelles sont vos compétences actuelles ?",
    options: computed(() => {
      if (!selections.value[0]) {
        return [
          {
            id: "no_skills",
            label: "Je n'ai aucune compétence",
            icon: "fas fa-star-half-alt",
          },
        ];
      }

      if (
        !store.getAllJobsWithSkills ||
        store.getAllJobsWithSkills.length === 0
      ) {
          ("Pas de données de jobs disponibles");
        return [
          {
            id: "no_skills",
            label: "Je n'ai aucune compétence",
            icon: "fas fa-star-half-alt",
          },
        ];
      }

      const filteredJobs = store.getAllJobsWithSkills.filter((job) => {
        switch (selections.value[0].id) {
          case "inf":
            return job.secteursActivites.some(
              (secteur) => secteur.libelle === "Informatique"
            );
          case "hot":
            return job.secteursActivites.some(
              (secteur) =>
                secteur.libelle === "Hôtellerie" ||
                secteur.libelle === "Restauration"
            );
          case "bat":
            return job.secteursActivites.some(
              (secteur) => secteur.libelle === "Gros Œuvre"
            );
          case "com":
            return job.secteursActivites.some(
              (secteur) =>
                secteur.libelle === "Commerce de détail" ||
                secteur.libelle === "Commerce de gros"
            );
          default:
            return false;
        }
      });

        (
        `Jobs filtrés pour le secteur ${selections.value[0].id}:`,
        filteredJobs.length
      );

      const competences = filteredJobs
        .flatMap((job) => job.competences || [])
        .filter(
          (comp) =>
            comp.type === "SAVOIR" || comp.type === "COMPETENCE-DETAILLEE"
        );

      const uniqueCompetences = [
        ...new Map(
          competences.map((comp) => [
            comp.id,
            {
              id: comp.id,
              label: comp.libelle,
              icon: getCompetenceIcon(comp.type),
            },
          ])
        ).values(),
      ];

        (`Compétences uniques trouvées: ${uniqueCompetences.length}`);

      return [
        {
          id: "no_skills",
          label: "Je n'ai aucune compétence",
          icon: "fas fa-star-half-alt",
        },
        ...uniqueCompetences,
      ];
    }),
    multiple: true,
  },
  {
    question: "Quels métiers vous intéressent ?",
    options: computed(() => {
      if (!selections.value[0]) return [];

      return store.getAllJobsWithSkills
        .filter((job) => {
          switch (selections.value[0].id) {
            case "inf":
              return job.secteursActivites.some(
                (secteur) => secteur.libelle === "Informatique"
              );
            case "hot":
              return job.secteursActivites.some(
                (secteur) =>
                  secteur.libelle === "Hôtellerie" ||
                  secteur.libelle === "Restauration"
              );
            case "bat":
              return job.secteursActivites.some(
                (secteur) => secteur.libelle === "Gros Œuvre"
              );
            case "com":
              return job.secteursActivites.some(
                (secteur) =>
                  secteur.libelle === "Commerce de détail" ||
                  secteur.libelle === "Commerce de gros"
              );
            default:
              return false;
          }
        })
        .map((job) => ({
          id: job.id,
          label: job.titre,
          icon: "fas fa-briefcase",
        }));
    }),
    multiple: true,
  },
  {
    question: "Quel est votre objectif ?",
    options: [
      { id: "train", label: "Je me forme", icon: "fas fa-graduation-cap" },
    ],
    multiple: true,
  },
]);

const selectOption = (option, stepIndex) => {
  if (stepIndex === 0) {
    // Sélection unique pour le secteur d'activité
    selections.value[0] = option;
  } else if (stepIndex === 1 && option.id === "no_skills") {
    selections.value[1] = [option];
    selections.value[2] = [];
    currentStep.value = 3;
  } else if (steps.value[stepIndex].multiple) {
    // Gestion de la sélection multiple pour les compétences, métiers et objectifs
    const currentSelections = selections.value[stepIndex];
    const index = currentSelections.findIndex((s) => s.id === option.id);

    if (index === -1) {
      // Si l'option n'est pas déjà sélectionnée, on l'ajoute
      selections.value[stepIndex] = [...currentSelections, option];
    } else {
      // Si l'option est déjà sélectionnée, on la retire
      selections.value[stepIndex] = currentSelections.filter(
        (s) => s.id !== option.id
      );
    }
  }
};

const isOptionSelected = (option, stepIndex) => {
  if (stepIndex === 0) {
    return selections.value[0]?.id === option.id;
  }
  // Pour toutes les autres étapes (y compris la dernière)
  return selections.value[stepIndex].some((s) => s.id === option.id);
};

const canProceed = (stepIndex) => {
  if (
    stepIndex === 1 &&
    selections.value[1].some((opt) => opt.id === "no_skills")
  ) {
    return true;
  }
  if (steps.value[stepIndex].multiple) {
    return selections.value[stepIndex].length > 0;
  }
  return selections.value[stepIndex] !== null;
};

const isLastStep = computed(() => currentStep.value === steps.value.length - 1);

const showActionButton = (stepIndex) => {
  return currentStep.value === stepIndex && stepIndex < steps.value.length;
};

const handleActionButton = async () => {
  isLoading.value = true;
  try {
    if (isLastStep.value) {
      const selectedJobs = selections.value[2].map((job) => ({
        id: job.id,
        label: job.label,
        icon: job.icon,
      }));

      if (selections.value[3].some((s) => s.id === "train")) {
          ("Préparation des données pour la timeline");
        isFormationTimeline.value = true;

        // S'assurer que les jobs ont bien leur ID

          ("Jobs sélectionnés:", selectedJobs);

        // Préparation des données
        const selectedData = {
          jobs: selectedJobs,
          skills: selections.value[1]
            .filter((skill) => skill.id !== "no_skills")
            .map((skill) => ({
              id: skill.id,
              label: skill.label,
              type: skill.type || "COMPETENCE-DETAILLEE",
            })),
          sector: selections.value[0],
        };

          ("Données timeline complètes:", selectedData);
        timelineData.value = selectedData;
      } else {
        isComplete.value = true;
          ("SLEELCROP ", selectedJobs);
        jobs.value = selectedJobs;
      }
    } else {
      currentStep.value++;
    }
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    isLoading.value = false;
  }
};

const filteredSelections = computed(() => {
  const result = [];
  if (selections.value[0]) {
    result.push({
      ...selections.value[0],
      stepIndex: 0,
      question: steps.value[0].question,
    });
  }
  selections.value[1].forEach((comp) => {
    result.push({
      ...comp,
      stepIndex: 1,
      question: steps.value[1].question,
    });
  });
  selections.value[2].forEach((job) => {
    result.push({
      ...job,
      stepIndex: 2,
      question: steps.value[2].question,
    });
  });
  selections.value[3].forEach((obj) => {
    result.push({
      ...obj,
      stepIndex: 3,
      question: steps.value[3].question,
    });
  });
  return result;
});

const goToNextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++;
  }
};

const removeSelection = (selection) => {
  const { stepIndex } = selection;

  if (stepIndex === 0) {
    selections.value = {
      0: null,
      1: [],
      2: [],
      3: [],
    };
    currentStep.value = 0;
  } else if (stepIndex === 1 || stepIndex === 2) {
    const currentSelections = selections.value[stepIndex];
    selections.value[stepIndex] = currentSelections.filter(
      (s) => s.id !== selection.id
    );
  } else {
    selections.value[stepIndex] = selections.value[stepIndex].filter(
      (s) => s.id !== selection.id
    );
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

watch(
  () => selections.value[0],
  async (newSector) => {
    if (newSector) {
        ("Secteur sélectionné:", newSector);
        ("Tous les jobs:", store.getAllJobs);
      const jobs = store.getAllJobs.filter((job) => {
          ("Vérification du job:", job.titre, job.competences);
        return true; // temporairement pour voir tous les jobs
      });
        ("Jobs filtrés:", jobs);
    }
  }
);

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

const reset = () => {
  selections.value = {
    0: null,
    1: [],
    2: [],
    3: [],
  };
  currentStep.value = 0;
  isComplete.value = false;
  isFormationTimeline.value = false;
  searchQuery.value = "";
  currentPage.value = 1;
};

// Ajout de la ref pour les données de la timeline
const timelineData = ref(null);
</script>

<style lang="scss" scoped>
.search-path-container {
  position: relative;
  min-height: 400px; // Hauteur minimale pour éviter les sauts de contenu
  width: 100%;
  padding: $spacing-xl 0;

  @include responsive($breakpoint-md) {
    padding: $spacing-lg $spacing-md;
  }
}

.search-path-layout {
  display: flex;
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;

  @include responsive($breakpoint-md) {
    flex-direction: column;
  }
}

.questions-column {
  flex: 2;
}

.selection-column {
  flex: 1;

  .selected-path {
    position: sticky;
    top: $spacing-lg;
    margin-top: 0;
  }

  @include responsive($breakpoint-md) {
    .selected-path {
      position: static;
    }
  }
}

.path-steps {
  .step {
    margin-bottom: $spacing-md;
    padding: $spacing-lg;
    border-radius: 8px;
    background-color: $light-gray;
    transition: all 0.3s ease;

    &.active {
      background-color: $white;
      @include card-shadow;
    }

    &.completed {
      background-color: lighten($primary-blue, 45%);

      h3 {
        color: $primary-blue;
      }
    }

    h3 {
      font-family: $font-primary;
      font-size: $font-size-lg;
      color: $dark-gray;
      margin-bottom: $spacing-md;
    }
  }
}

.options {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-md;
  flex-wrap: wrap;

  @include responsive($breakpoint-md) {
    gap: $spacing-sm;
  }
}

.option-btn {
  @include button-primary;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  background-color: $white;
  color: $primary-blue;
  border: 1px solid $primary-blue;
  font-size: $font-size-base;

  i {
    font-size: $font-size-lg;
  }

  &:hover {
    background-color: $primary-blue;
    color: $white;
  }

  &.selected {
    background-color: $primary-blue;
    color: $white;
    border-color: $primary-blue;

    &[data-option-id="no_skills"] {
      background-color: #ffc107;
      color: $white;
    }
  }

  &.option-with-description {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    height: auto;
  }

  .option-content {
    flex: 1;
    width: 100%;
  }

  .option-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  .option-description {
    margin-top: $spacing-xs;
    font-size: $font-size-sm;
    color: $gray;
  }

  .check-icon {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    color: white;
  }
}

.selected-path {
  height: fit-content;
  background-color: $white;
  border-radius: 8px;
  @include card-shadow;
  padding: $spacing-lg;

  h4 {
    font-family: $font-primary;
    font-size: $font-size-lg;
    color: $dark-gray;
    margin-bottom: $spacing-md;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: $spacing-sm;
  }

  .tags {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
    max-height: 60vh;
    overflow-y: auto;
  }

  .tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $primary-blue;
    color: $white;
    padding: $spacing-xs $spacing-sm;
    border-radius: 4px;
    font-size: $font-size-sm;
    width: 100%;

    .tag-content {
      flex: 1;

      .tag-question {
        font-size: 0.8em;
        opacity: 0.8;
        margin-bottom: $spacing-xs;
      }

      .tag-value {
        display: flex;
        align-items: center;
        gap: $spacing-xs;

        i {
          font-size: $font-size-base;
        }
      }
    }

    .delete-btn {
      background: none;
      border: none;
      color: $white;
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.next-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: $spacing-lg;
}

.next-btn {
  @include button-primary;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  font-size: $font-size-base;
  background-color: $primary-blue;
  color: $white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateX(4px);
    background-color: darken($primary-blue, 10%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  i {
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) i {
    transform: translateX(4px);
  }
}

.search-filter {
  width: 100%;
  margin-bottom: $spacing-md;
  display: flex;
  gap: $spacing-md;
  align-items: center;

  .search-input {
    flex: 1;
    position: relative;

    i {
      position: absolute;
      left: $spacing-sm;
      top: 50%;
      transform: translateY(-50%);
      color: $gray;
    }

    input {
      width: 100%;
      padding: $spacing-sm $spacing-sm $spacing-sm $spacing-xl;
      border: 1px solid $light-gray;
      border-radius: 25px;
      font-size: $font-size-base;

      &:focus {
        outline: none;
        border-color: $primary-blue;
      }
    }
  }

  .selection-counter {
    padding: $spacing-xs $spacing-sm;
    background-color: $primary-blue;
    color: white;
    border-radius: 15px;
    font-size: $font-size-sm;
  }
}

.options-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-sm;
  width: 100%;

  &.scrollable {
    max-height: 400px;
    overflow-y: auto;
    padding-right: $spacing-sm;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-md;
  margin-top: $spacing-md;

  .pagination-btn {
    @include button-primary;
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.validate-btn {
  --fa-style-family-brands: "Font Awesome 6 Brands";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-style-family-classic: "Font Awesome 6 Free";
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --nuxt-devtools-safe-area-top: env(safe-area-inset-top, 0px);
  --nuxt-devtools-safe-area-right: env(safe-area-inset-right, 0px);
  --nuxt-devtools-safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --nuxt-devtools-safe-area-left: env(safe-area-inset-left, 0px);
  margin-top: 10;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Open Sans", sans-serif;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #0066cc;
  font-size: 1rem;
  background-color: #0066cc;
  color: #ffffff;
  border-color: #0066cc;
}

.final-btn {
  display: flex;
  align-items: center;
  justify-content: center; /* Centre horizontalement */
  gap: 1rem;
  margin: 1.5rem 0;
  width: 100%;
}

/* Style pour le bouton reset */
.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #ffd700;
  border: none;
  border-radius: 4px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background-color: #ffed4a;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reset-btn:active {
  transform: translateY(0);
}

/* Pour ajouter l'icône de reset */
.reset-btn::before {
  content: "\f2f1"; /* Code de l'icône refresh de Font Awesome */
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 0.5rem;
}

/* État désactivé pour les deux boutons */
.reset-btn:disabled,
.validate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Animation au clic */
.reset-btn:active,
.validate-btn:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .final-btn {
    flex-direction: column;
    width: 100%;
  }

  .reset-btn,
  .validate-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
