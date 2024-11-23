<template>
  <div class="result-list" :class="viewMode">
    <div v-if="isLoading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement des formations...
    </div>
    
    <template v-else>
      <FormationCard
        v-for="formation in formations"
        :key="formation.id"
        :formation="formation"
        :view-mode="viewMode"
      />
    </template>
  </div>
</template>

<script setup>
import FormationCard from './FormationCard.vue'
import { storeToRefs } from 'pinia'
import { useFormationsStore } from '@/stores/formations'

const props = defineProps({
  viewMode: {
    type: String,
    default: 'grid'
  }
})

const formationsStore = useFormationsStore()
const { formations, isLoading } = storeToRefs(formationsStore)
</script>

<style lang="scss" scoped>
.result-list {
  display: grid;
  gap: $spacing-xl;

  &.grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  &.list {
    grid-template-columns: 1fr;
  }
}

.loading-state {
  @include flex-center;
  gap: $spacing-md;
  color: $medium-gray;
  font-size: $font-size-lg;
  padding: $spacing-xl;
  grid-column: 1 / -1;
  
  i {
    font-size: $font-size-xl;
    color: $primary-blue;
  }
}

@media screen and (max-width: $breakpoint-md) {
  .result-list.grid {
    grid-template-columns: 1fr;
  }
}
</style>