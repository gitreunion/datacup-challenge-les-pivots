<template>
  <div class="pagination">
    <button 
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="$emit('page-changed', currentPage - 1)"
    >
      <i class="fas fa-chevron-left"></i>
    </button>

    <div class="pagination-numbers">
      <button 
        v-for="page in displayedPages"
        :key="page"
        class="page-number"
        :class="{ active: page === currentPage }"
        @click="$emit('page-changed', page)"
      >
        {{ page }}
      </button>
    </div>

    <button 
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="$emit('page-changed', currentPage + 1)"
    >
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<style lang="scss">
.pagination {
  @include flex-center;
  gap: $spacing-xs;
  margin-top: $spacing-xl;
}

.pagination-btn {
  padding: $spacing-xs $spacing-md;
  border: 1px solid $light-gray;
  background: $white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: $light-gray;
  }
}

.pagination-numbers {
  display: flex;
  gap: $spacing-xs;
}

.page-number {
  width: 40px;
  height: 40px;
  @include flex-center;
  border: 1px solid $light-gray;
  background: $white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: $font-primary;

  &:hover {
    background: $light-gray;
  }

  &.active {
    background: $primary-blue;
    color: $white;
    border-color: $primary-blue;
  }
}
</style>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const displayedPages = computed(() => {
  const pages = []
  let start = Math.max(1, props.currentPage - 2)
  let end = Math.min(props.totalPages, start + 4)
  
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>