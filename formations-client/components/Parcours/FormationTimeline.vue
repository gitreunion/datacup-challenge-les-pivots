<template>
  <div class="formation-timeline">
    <FormationPathway
      v-if="selectedData"
      :selected-data="selectedData"
    />
  </div>
</template>

<script setup>
import FormationPathway from './FormationPathway.vue';

defineProps({
  selectedData: {
    type: Object,
    required: true
  }
});
</script>
