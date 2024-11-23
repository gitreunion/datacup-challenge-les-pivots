<template>
  <div class="secteurs-list">
    <h2 class="secteurs-title">Nos secteurs d'activité</h2>
    <div class="secteurs-accordion">
      <div v-for="secteur in secteurs" 
           :key="secteur.id" 
           class="secteur-item">
        <div class="secteur-header" 
             @click="toggleSecteur(secteur.id)"
             :class="{ 'active': openSecteur === secteur.id }">
          <div class="secteur-main">
            <div class="secteur-icon">
              <i :class="secteur.icon"></i>
            </div>
            <div class="secteur-info">
              <h3>{{ secteur.label }}</h3>
              <span class="formations-count">{{ secteur.formationsCount }} formations</span>
            </div>
          </div>
          <i class="fas fa-chevron-down chevron" 
             :class="{ 'rotated': openSecteur === secteur.id }"></i>
        </div>
        
        <div class="secteur-content" 
             :class="{ 'expanded': openSecteur === secteur.id }">
          <div class="subcategories">
            <div v-for="subcat in secteur.subcategories" 
                 :key="subcat.id"
                 class="subcategory"
                 :class="{ 'active': selectedSubcat === subcat.id }"
                 @click="selectSubcategory(subcat)">
              <div class="subcategory-info">
                <h4>{{ subcat.label }}</h4>
                <p>{{ subcat.description }}</p>
              </div>
              <span class="subcategory-count">{{ subcat.formationsCount }} formations</span>
            </div>
            
            <!-- Timeline pour la sous-catégorie sélectionnée -->
            <div v-if="selectedSubcat" class="timeline-wrapper">
              <FormationTimeline 
                :formation-steps="currentSubcategory?.timeline || []"
                @reset="selectedSubcat = null"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FormationTimeline from './FormationTimeline.vue';

const openSecteur = ref(null);
const selectedSubcat = ref(null);

const toggleSecteur = (secteurId) => {
  openSecteur.value = openSecteur.value === secteurId ? null : secteurId;
  selectedSubcat.value = null; // Reset la sous-catégorie sélectionnée
};

const selectSubcategory = (subcat) => {
  selectedSubcat.value = selectedSubcat.value === subcat.id ? null : subcat.id;
};

const currentSubcategory = computed(() => {
  const allSubcats = secteurs.flatMap(s => s.subcategories);
  return allSubcats.find(s => s.id === selectedSubcat.value);
});

const secteurs = [
  {
    id: 1,
    label: "Développement",
    icon: "fas fa-code",
    formationsCount: 12,
    subcategories: [
      {
        id: 101,
        label: "Front-end",
        description: "HTML, CSS, JavaScript et frameworks modernes",
        formationsCount: 5,
        timeline: [
          {
            level: "Certification",
            title: "RS5837",
            description: "Développeur Web Front-end",
            rncp: "",
            color: "green"
          },
          {
            level: "Niveau 5",
            title: "BAC+2",
            description: "Développeur Web Full Stack",
            rncp: "RNCP31114",
            color: "blue"
          },
          {
            level: "Niveau 6", 
            title: "BAC+3",
            description: "Concepteur Développeur d'Applications",
            rncp: "RNCP31678",
            color: "navy"
          }
        ]
      },
      {
        id: 102,
        label: "Back-end",
        description: "PHP, Node.js, Python et bases de données",
        formationsCount: 4
      },
      {
        id: 103,
        label: "Mobile",
        description: "Développement iOS et Android",
        formationsCount: 3
      }
    ]
  },
  {
    id: 2,
    label: "Systèmes & Réseaux",
    icon: "fas fa-network-wired", 
    formationsCount: 8,
    subcategories: [
      {
        id: 201,
        label: "Administration système",
        description: "Linux, Windows Server",
        formationsCount: 3
      },
      {
        id: 202,
        label: "Cloud Computing",
        description: "AWS, Azure, Google Cloud",
        formationsCount: 3
      },
      {
        id: 203,
        label: "Virtualisation",
        description: "VMware, Docker, Kubernetes",
        formationsCount: 2
      }
    ]
  }
];
</script>

<style lang="scss" scoped>
.secteurs-list {
  padding: $spacing-xl 0;
}

.secteurs-title {
  text-align: center;
  font-family: $font-primary;
  font-size: $font-size-2xl;
  color: $dark-gray;
  margin-bottom: $spacing-xl;
}

.secteurs-accordion {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 $spacing-md;
}

.secteur-item {
  margin-bottom: $spacing-md;
  border-radius: 8px;
  @include card-shadow;
  background: $white;
}

.secteur-header {
  padding: $spacing-lg;
  @include flex-between;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background: rgba($primary-blue, 0.05);
  }

  .secteur-main {
    @include flex-center;
    gap: $spacing-md;
  }
}

.secteur-icon {
  width: 48px;
  height: 48px;
  @include flex-center;
  background: rgba($primary-blue, 0.1);
  border-radius: 8px;
  
  i {
    color: $primary-blue;
    font-size: $font-size-xl;
  }
}

.secteur-info {
  h3 {
    font-family: $font-primary;
    font-size: $font-size-lg;
    color: $dark-gray;
    margin-bottom: $spacing-xs;
  }
}

.formations-count {
  font-size: $font-size-sm;
  color: $medium-gray;
}

.chevron {
  color: $medium-gray;
  transition: transform 0.3s ease;
  
  &.rotated {
    transform: rotate(180deg);
  }
}

.secteur-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  
  &.expanded {
    max-height: 1000px;
  }
}

.subcategories {
  padding: 0 $spacing-lg $spacing-lg;
}

.subcategory {
  padding: $spacing-md;
  border-radius: 6px;
  margin-bottom: $spacing-sm;
  background: $light-gray;
  @include flex-between;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba($primary-blue, 0.05);
  }

  &.active {
    background: rgba($primary-blue, 0.1);
    border: 1px solid $primary-blue;
  }

  .subcategory-info {
    h4 {
      font-family: $font-primary;
      font-size: $font-size-base;
      color: $dark-gray;
      margin-bottom: $spacing-xs;
    }

    p {
      font-size: $font-size-sm;
      color: $medium-gray;
    }
  }

  .subcategory-count {
    font-size: $font-size-sm;
    color: $medium-gray;
    background: rgba($primary-blue, 0.1);
    padding: $spacing-xs $spacing-sm;
    border-radius: 20px;
  }
}

.timeline-wrapper {
  margin-top: $spacing-lg;
  padding: $spacing-md;
  background: $white;
  border-radius: 8px;
  border: 1px solid rgba($primary-blue, 0.1);
  
  opacity: 0;
  transform: translateY(20px);
  animation: slideIn 0.3s ease forwards;

  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 8px;
    background-color: rgba($primary-blue, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba($primary-blue, 0.2);
    border-radius: 4px;
    
    &:hover {
      background-color: rgba($primary-blue, 0.3);
    }
  }

  scrollbar-width: thin;
  scrollbar-color: rgba($primary-blue, 0.2) rgba($primary-blue, 0.05);

  .formation-timeline {
    min-width: min-content;
    padding: $spacing-md 0;
  }

  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, rgba($white, 0.9), transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, rgba($white, 0.9), transparent);
  }

  &.has-overflow-left::before {
    opacity: 1;
  }

  &.has-overflow-right::after {
    opacity: 1;
  }
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@include responsive($breakpoint-sm) {
  .secteur-header {
    padding: $spacing-md;
  }

  .subcategory {
    flex-direction: column;
    gap: $spacing-sm;
    
    .subcategory-info {
      width: 100%;
    }
  }

  .timeline-wrapper {
    margin: $spacing-md (-$spacing-md);
    border-radius: 0;
    border-left: none;
    border-right: none;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
  }
}
</style>