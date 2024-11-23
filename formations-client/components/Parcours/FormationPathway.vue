<template>
  <div class="formation-timeline">
    <div class="timeline-container">
      <div class="timeline-track">
        <div v-for="(step, index) in formationSteps" :key="index" class="timeline-step" :class="{ appear: isVisible }"
          :style="{ '--delay': `${index * 0.2}s` }">
          <div class="timeline-content" :class="[getLevelColor(step.formation.niveau_rncp), {
            'has-prerequisites': hasPrerequisites(step),
            'is-required': step.is_alternative
          }]">
            <div class="level-title">
              <div class="certification-level">
                Niveau {{ step.formation.niveau_rncp }}
                <span class="certification-type">{{ getCertificationType(step.formation.niveau_rncp) }}</span>
              </div>
              <div class="rncp-code">{{ step.formation.numero }}</div>
            </div>

            <h3>{{ step.formation.intitule }}</h3>
            <p>{{ getFormationDescription(step) }}</p>

            <!-- Badges pour les informations supplémentaires -->
            <div class="formation-badges">
              <div v-if="step.formation.validation_partielle" class="badge validation-partielle">
                <i class="fas fa-check-circle"></i>
                Validation partielle possible
              </div>
              <div v-if="step.is_alternative" class="badge required">
                <i class="fas fa-star"></i>
                Formation recommandée
              </div>
            </div>

            <!-- Durée estimée -->
            <div class="duration-info">
              <i class="fas fa-clock"></i>
              {{ step.estimated_duration.months }} mois
              <span class="hours">({{ step.estimated_duration.hours }} heures)</span>
            </div>

            <!-- Compétences requises -->
            <div v-if="step.required_skills.length" class="skills-section">
              <h4>Compétences clés :</h4>
              <div class="skills-list">
                <span v-for="(skill, skillIndex) in getDisplayedSkills(step.required_skills)" :key="skillIndex"
                  class="skill-badge">
                  {{ skill.libelle }}
                </span>
              </div>
            </div>

            <!-- Indicateur de prérequis -->
            <div v-if="hasPrerequisites(step)" class="prerequisites-badge">
              <i class="fas fa-check-circle"></i>
              Prérequis validés
            </div>
          </div>

          <div v-if="index < formationSteps.length - 1" class="arrow-connector">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFormationsStore } from '~/stores/formations';

const props = defineProps({
  selectedData: {
    type: Object,
    required: true
  }
});

const store = useFormationsStore();
const isVisible = ref(false);

const formationSteps = computed(() => {
  return store.getRecommendedPath({
    selectedJobs: props.selectedData.jobs,
    currentSkills: props.selectedData.skills
  });
});

// Détermine la couleur en fonction du niveau
const getLevelColor = (niveau) => {
  const level = parseInt(niveau);
  if (level <= 3) return 'green';
  if (level === 4) return 'blue';
  if (level === 5) return 'dark-blue';
  return 'navy';
};

// Retourne le type de certification en fonction du niveau
const getCertificationType = (niveau) => {
  const types = {
    '3': 'CAP/BEP',
    '4': 'BAC',
    '5': 'BAC+2',
    '6': 'LICENCE',
    '7': 'MASTER',
    '8': 'DOCTORAT'
  };
  return types[niveau] || '';
};

// Génère une description pour la formation
const getFormationDescription = (step) => {
  return `Formation ${step.is_alternative ? 'alternative ' : ''}pour le métier de ${step.job.label}`;
};

// Vérifie si les prérequis sont validés
const hasPrerequisites = (step) => {
  const stepLevel = parseInt(step.formation.niveau_rncp);
  return props.selectedData.skills.length > 0 && stepLevel > 3;
};

// Limite le nombre de compétences affichées
const getDisplayedSkills = (skills) => {
  return skills.slice(0, 3);
};

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<style lang="scss" scoped>
// Utiliser le même style que fourni précédemment

// Ajout de styles supplémentaires pour les nouvelles fonctionnalités
.duration-info {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-top: $spacing-sm;
  color: $medium-gray;
  font-size: $font-size-sm;

  .hours {
    opacity: 0.7;
  }
}

.skills-section {
  margin-top: $spacing-md;

  h4 {
    font-size: $font-size-sm;
    color: $dark-gray;
    margin-bottom: $spacing-xs;
  }

  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  .skill-badge {
    font-size: $font-size-sm;
    padding: 2px 8px;
    background-color: rgba($primary-blue, 0.1);
    color: $primary-blue;
    border-radius: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
}

.formation-timeline {
  padding: $spacing-xl;
  background-color: $white;

  .timeline-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .back-button {
    margin-bottom: $spacing-lg;

    .return-btn {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-sm $spacing-md;
      background-color: $white;
      border: 1px solid rgba($dark-gray, 0.1);
      border-radius: 8px;
      color: $dark-gray;
      font-size: $font-size-sm;
      cursor: pointer;
      transition: all 0.2s ease;

      i {
        font-size: $font-size-base;
      }

      &:hover {
        background-color: rgba($dark-gray, 0.05);
        transform: translateX(-2px);
      }
    }
  }

  .timeline-track {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    padding: $spacing-xl 0;
  }

  .timeline-step {
    display: flex;
    align-items: center;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;

    &.appear {
      opacity: 1;
      transform: translateY(0);
      transition-delay: var(--delay);
    }
  }

  .timeline-content {
    padding: $spacing-lg;
    border-radius: 12px;
    width: 300px;
    background-color: $white;
    box-shadow: 0 4px 20px rgba($dark-gray, 0.08);
    transition: all 0.3s ease;
    border: 1px solid rgba($dark-gray, 0.1);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba($dark-gray, 0.12);
    }

    .level-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-sm;

      .certification-level {
        color: $primary-blue;
        font-weight: 600;
        font-size: $font-size-sm;
      }

      .rncp-code {
        color: $medium-gray;
        font-size: $font-size-sm;
      }
    }

    h3 {
      color: $dark-gray;
      font-size: $font-size-lg;
      margin-bottom: $spacing-sm;
      font-weight: 600;
    }

    p {
      color: $medium-gray;
      font-size: $font-size-base;
      line-height: 1.5;
    }

    .options-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-xs;
      margin-top: $spacing-md;
      padding-top: $spacing-sm;
      border-top: 1px solid rgba($dark-gray, 0.1);
    }

    .option-btn {
      padding: 4px 8px;
      font-size: 0.75rem;
      background-color: rgba($primary-blue, 0.1);
      color: $primary-blue;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 150px;

      &:hover {
        background-color: rgba($primary-blue, 0.15);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &.green {
      .certification-level {
        color: #36B37E;
      }

      .option-btn {
        background-color: rgba(#36B37E, 0.1);
        color: #36B37E;

        &:hover {
          background-color: rgba(#36B37E, 0.15);
        }
      }
    }

    &.blue {
      .certification-level {
        color: #2684FF;
      }

      .option-btn {
        background-color: rgba(#2684FF, 0.1);
        color: #2684FF;

        &:hover {
          background-color: rgba(#2684FF, 0.15);
        }
      }
    }

    &.dark-blue {
      .certification-level {
        color: #0052CC;
      }

      .option-btn {
        background-color: rgba(#0052CC, 0.1);
        color: #0052CC;

        &:hover {
          background-color: rgba(#0052CC, 0.15);
        }
      }
    }

    &.navy {
      .certification-level {
        color: #0747A6;
      }

      .option-btn {
        background-color: rgba(#0747A6, 0.1);
        color: #0747A6;

        &:hover {
          background-color: rgba(#0747A6, 0.15);
        }
      }
    }
  }

  .arrow-connector {
    margin: 0 $spacing-md;
    color: $primary-blue;
    font-size: $font-size-xl;
    flex-shrink: 0;
    opacity: 0.7;
  }

  @include responsive($breakpoint-lg) {
    .timeline-track {
      overflow-x: auto;
      padding-bottom: $spacing-xl;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x mandatory;
    }

    .timeline-step {
      flex: 0 0 300px;
      scroll-snap-align: start;
    }
  }

  @include responsive($breakpoint-sm) {
    padding: $spacing-md;

    .timeline-content {
      padding: $spacing-md;
    }

    .arrow-connector {
      margin: 0 $spacing-sm;
    }
  }
}
</style>
