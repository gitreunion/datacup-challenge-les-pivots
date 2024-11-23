<template>
  <div class="no-result">
    <div class="no-result-icon">
      <i class="fas fa-search"></i>
    </div>
    <h2>Aucun résultat trouvé</h2>
    <p>Essayez de modifier vos critères de recherche</p>
    <button class="btn-reset" @click="$emit('reset-filters')">
      Réinitialiser les filtres
    </button>
  </div>
</template>

<style lang="scss">
.no-result {
  text-align: center;
  padding: $spacing-xl * 2 $spacing-xl;
  background: $white;
  border-radius: 12px;
  @include card-shadow;
}

.no-result-icon {
  font-size: $font-size-2xl * 2;
  color: $medium-gray;
  margin-bottom: $spacing-lg;

  i {
    opacity: 0.7;
  }
}

h2 {
  color: $dark-gray;
  font-size: $font-size-2xl;
  font-family: $font-primary;
  margin-bottom: $spacing-md;
  font-weight: 600;
}

p {
  color: $medium-gray;
  margin-bottom: $spacing-xl;
  font-size: $font-size-lg;
}

.btn-reset {
  @include button-primary;
  padding: $spacing-sm $spacing-xl;
  font-size: $font-size-base;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
