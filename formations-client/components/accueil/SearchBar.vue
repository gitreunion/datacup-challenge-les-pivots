<template>
  <div class="search-container">
    <div class="search-bar">
      <div class="search-input">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          @input="handleInput"
          placeholder="Rechercher une formation..."
        />
      </div>
      <div class="filters">
        <select v-model="sector">
          <option value="">Secteur</option>
          <option value="commerce">Commerce</option>
          <option value="numerique">Numérique</option>
          <option value="restauration">Restauration/Hôtellerie</option>
        </select>
        <select v-model="location">
          <option value="">Localisation</option>
          <option value="paris">Paris</option>
          <option value="lyon">Lyon</option>
          <option value="marseille">Marseille</option>
        </select>
        <select v-model="level">
          <option value="">Niveau</option>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
        </select>
      </div>
    </div>
    <div class="suggestions" v-if="showSuggestions">
      <ul>
        <li v-for="suggestion in suggestions" :key="suggestion.id">
          {{ suggestion.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const searchQuery = ref("");
const sector = ref("");
const location = ref("");
const level = ref("");
const showSuggestions = ref(false);
const suggestions = ref([]);

const handleInput = () => {
  // Simuler l'autocomplétion
  if (searchQuery.value.length > 2) {
    showSuggestions.value = true;
    suggestions.value = [
      { id: 1, title: "Développement Web" },
      { id: 2, title: "Marketing Digital" },
      { id: 3, title: "Commerce International" },
    ];
  } else {
    showSuggestions.value = false;
  }
};
</script>

<style lang="scss">
.search-container {
  position: relative;
  max-width: 1200px;
  margin: -2rem auto 0;
  padding: 0 $spacing-md;
  z-index: 10;

  .search-bar {
    @include card-shadow;
    background-color: $white;
    padding: $spacing-lg;
    border-radius: 8px;

    .search-input {
      position: relative;
      margin-bottom: $spacing-md;

      i {
        position: absolute;
        left: $spacing-sm;
        top: 50%;
        transform: translateY(-50%);
        color: $medium-gray;
      }

      input {
        width: 100%;
        padding: $spacing-sm $spacing-lg $spacing-sm $spacing-xl;
        border: 1px solid $medium-gray;
        border-radius: 4px;
        font-family: $font-secondary;
        font-size: $font-size-base;

        &:focus {
          outline: none;
          border-color: $primary-blue;
        }
      }
    }

    .filters {
      @include flex-between;
      gap: $spacing-sm;
      flex-wrap: wrap;

      select {
        flex: 1;
        min-width: 200px;
        padding: $spacing-sm;
        border: 1px solid $medium-gray;
        border-radius: 4px;
        font-family: $font-secondary;

        &:focus {
          outline: none;
          border-color: $primary-blue;
        }
      }
    }
  }

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: $white;
    border-radius: 0 0 8px 8px;
    @include card-shadow;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: $spacing-sm $spacing-md;
        cursor: pointer;

        &:hover {
          background-color: $light-gray;
        }
      }
    }
  }
}
</style>
