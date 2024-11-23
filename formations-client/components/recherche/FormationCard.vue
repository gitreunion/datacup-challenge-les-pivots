<template>
  <div class="formation-card" :class="{ 'list-view': viewMode === 'list' }">
    <div class="formation-image">
      <img :src="formation.image" :alt="formation.title">
      <div class="formation-badge">{{ formation.category }}</div>
    </div>
    
    <div class="formation-content">
      <h3>{{ formation.title }}</h3>
      <div class="formation-organisme">
        <img :src="formation.organismeImage" :alt="formation.organisme">
        <span>{{ formation.organisme }}</span>
      </div>
      
      <div class="formation-details">
        <div class="detail">
          <i class="fas fa-clock"></i>
          <span>{{ formation.duration }}</span>
        </div>
        <div class="detail">
          <i class="fas fa-euro-sign"></i>
          <span>{{ formation.price }}€</span>
        </div>
      </div>
      
      <button class="btn-savoir-plus">En savoir plus</button>
    </div>
  </div>
</template>

<style lang="scss">
.formation-card {
  background: $white;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  @include card-shadow;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba($dark-gray, 0.1);
  }
}

.formation-image {
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.formation-badge {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  background: rgba($primary-blue, 0.9);
  color: $white;
  padding: $spacing-xs $spacing-md;
  border-radius: 20px;
  font-size: $font-size-sm;
  font-weight: 500;
}

.formation-content {
  padding: $spacing-lg;

  h3 {
    color: $dark-gray;
    font-size: $font-size-xl;
    font-family: $font-primary;
    margin-bottom: $spacing-md;
    line-height: 1.4;
  }
}

.formation-organisme {
  @include flex-center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
}

.formation-details {
  @include flex-between;
  margin-bottom: $spacing-lg;
}

.detail {
  @include flex-center;
  gap: $spacing-xs;
  color: $medium-gray;
}

.btn-savoir-plus {
  @include button-primary;
  width: 100%;
}

.list-view {
  display: flex;
  max-width: 100%;

  .formation-image {
    width: 300px;
    height: auto;
  }

  .formation-content {
    flex: 1;
  }
}
</style>

<script setup>
defineProps({
  formation: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
  }
})
</script>