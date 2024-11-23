<template>
  <div class="filter-sidebar">
    <h2>Filtres</h2>
    
    <div class="filter-section">
      <h3>Secteurs</h3>
      <div class="checkbox-group">
        <label v-for="sector in sectors" :key="sector.id">
          <input type="checkbox" v-model="selectedSectors" :value="sector.id">
          {{ sector.name }}
        </label>
      </div>
    </div>

    <div class="filter-section">
      <h3>Niveau</h3>
      <div class="radio-group">
        <label v-for="level in levels" :key="level.id">
          <input type="radio" v-model="selectedLevel" :value="level.id">
          {{ level.name }}
        </label>
      </div>
    </div>

    <div class="filter-section">
      <h3>Localisation</h3>
      <input type="text" v-model="location" placeholder="Ville ou région...">
    </div>

    <div class="filter-actions">
      <button class="btn-reset" @click="resetFilters">Réinitialiser</button>
      <button class="btn-apply" @click="applyFilters">Appliquer</button>
    </div>
  </div>
</template>

<style lang="scss">
.filter-sidebar {
  background: $white;
  padding: $spacing-lg;
  border-radius: 12px;
  @include card-shadow;
}

h2 {
  color: $dark-gray;
  font-size: $font-size-2xl;
  font-family: $font-primary;
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-sm;
  border-bottom: 2px solid $light-gray;
}

.filter-section {
  margin-bottom: $spacing-lg;
}

h3 {
  color: $medium-gray;
  font-size: $font-size-lg;
  margin-bottom: $spacing-md;
  font-family: $font-primary;
}

.checkbox-group, .radio-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

label {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  color: $medium-gray;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: $primary-blue;
  }
}

input[type="text"] {
  width: 100%;
  padding: $spacing-sm;
  border: 1px solid $light-gray;
  border-radius: 6px;
  font-size: $font-size-base;
  
  &:focus {
    outline: none;
    border-color: $primary-blue;
    box-shadow: 0 0 0 3px rgba($primary-blue, 0.1);
  }
}

.filter-actions {
  @include flex-between;
  margin-top: $spacing-xl;
}

.btn-reset {
  @include button-primary;
  background: $light-gray;
  color: $medium-gray;

  &:hover {
    background: darken($light-gray, 5%);
  }
}

.btn-apply {
  @include button-primary;
}
</style>

<script setup>
import { ref } from 'vue'

const selectedSectors = ref([])
const selectedLevel = ref(null)
const location = ref('')

const sectors = [
  { id: 1, name: 'Développement Web' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'Marketing Digital' },
  { id: 4, name: 'Data Science' }
]

const levels = [
  { id: 1, name: 'Débutant' },
  { id: 2, name: 'Intermédiaire' },
  { id: 3, name: 'Avancé' }
]

const resetFilters = () => {
  selectedSectors.value = []
  selectedLevel.value = null
  location.value = ''
}

const applyFilters = () => {
  const filters = {
    sectors: selectedSectors.value,
    level: selectedLevel.value,
    location: location.value
  }
  emit('apply-filters', filters)
}
</script>