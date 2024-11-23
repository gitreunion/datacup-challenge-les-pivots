<template>
  <div class="formations-page">
    <div class="formations-container">
      <!-- Section latérale avec filtres -->
      <aside class="filters-sidebar">
        <FilterSidebar
          @apply-filters="applyFilters"
          @reset-filters="resetFilters"
        />
      </aside>

      <!-- Section principale des résultats -->
      <main class="results-section">
        <!-- En-tête des résultats -->
        <div class="results-header">
          <h1>Nos Formations</h1>
          <div class="view-options">
            <button
              @click="viewMode = 'grid'"
              :class="{ active: viewMode === 'grid' }"
            >
              <i class="fas fa-th-large"></i>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="{ active: viewMode === 'list' }"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>

        <!-- État de chargement -->
        <div v-if="isLoading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          Chargement des formations...
        </div>

        <!-- Liste des résultats -->
        <template v-else-if="formations && formations.length > 0">
          <ResultList :view-mode="viewMode" />
          <Pagination
            :total-pages="totalPages"
            :current-page="currentPage"
            @page-changed="handlePageChange"
          />
        </template>

        <!-- Message si aucun résultat -->
        <NoResultMessage
          v-else
          @reset-filters="resetFilters"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useFormationsStore } from "@/stores/formations";
import FilterSidebar from "@/components/recherche/FilterSidebar.vue";
import ResultList from "@/components/recherche/ResultList.vue";
import Pagination from "@/components/recherche/Pagination.vue";
import NoResultMessage from "@/components/recherche/NoResultMessage.vue";

// Store
const formationsStore = useFormationsStore();
const { formations, isLoading } = storeToRefs(formationsStore);

// État local
const currentPage = ref(1);
const totalPages = ref(1);
const viewMode = ref("grid");

// Méthodes
const applyFilters = async (filters) => {
  try {
    await formationsStore.fetchFormations(filters);
    currentPage.value = 1;
  } catch (error) {
    console.error("Erreur lors de l'application des filtres:", error);
  }
};

const resetFilters = async () => {
  try {
    await formationsStore.fetchFormations();
    currentPage.value = 1;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation:", error);
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  // Ici vous pourriez ajouter la logique de pagination avec le store
};

// Initialisation
onMounted(async () => {
  await formationsStore.fetchFormations();
});
</script>

<style lang="scss" scoped>
.formations-page {
  padding: $spacing-xl;
  background-color: $light-gray;
  min-height: 100vh;
}

.formations-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: $spacing-xl;
  max-width: 1400px;
  margin: 0 auto;
}

.filters-sidebar {
  position: sticky;
  top: $spacing-xl;
  height: fit-content;
}

.results-section {
  h1 {
    color: $dark-gray;
    font-size: $font-size-2xl;
    font-family: $font-primary;
    font-weight: 600;
  }
}

.results-header {
  @include flex-between;
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid darken($light-gray, 5%);
}

.view-options {
  display: flex;
  gap: $spacing-xs;

  button {
    padding: $spacing-sm;
    border: 1px solid $light-gray;
    background: $white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: $medium-gray;

    &:hover {
      background: darken($white, 5%);
    }

    &.active {
      background: $primary-blue;
      color: $white;
      border-color: $primary-blue;

      &:hover {
        background: darken($primary-blue, 5%);
      }
    }

    i {
      font-size: $font-size-lg;
    }
  }
}

@media screen and (max-width: $breakpoint-md) {
  .formations-page {
    padding: $spacing-md;
  }

  .formations-container {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
    margin-bottom: $spacing-lg;
  }

  .results-header {
    flex-direction: column;
    gap: $spacing-md;
    align-items: flex-start;

    h1 {
      font-size: $font-size-xl;
    }
  }

  .view-options {
    width: 100%;
    justify-content: flex-end;
  }
}

.loading-state {
  @include flex-center;
  gap: $spacing-md;
  color: $medium-gray;
  font-size: $font-size-lg;
  padding: $spacing-xl;
  
  i {
    font-size: $font-size-xl;
    color: $primary-blue;
  }
}
</style>
