<template>
    <div class="loading-container">
      <div class="loading-content">
        <div class="spinner"></div>
        <h3 class="loading-text">{{ message || 'Chargement en cours...' }}</h3>
        <p class="loading-subtext">{{ subMessage || 'Veuillez patienter quelques instants' }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    message: {
      type: String,
      default: ''
    },
    subMessage: {
      type: String,
      default: ''
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .loading-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($white, 0.9);
    backdrop-filter: blur(5px);
    z-index: 1000;
    @include flex-center;
  }
  
  .loading-content {
    text-align: center;
    padding: $spacing-xl;
  }
  
  .spinner {
    width: 60px;
    height: 60px;
    margin: 0 auto $spacing-lg;
    border: 4px solid rgba($primary-blue, 0.1);
    border-left-color: $primary-blue;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .loading-text {
    color: $dark-gray;
    font-family: $font-primary;
    font-size: $font-size-xl;
    margin-bottom: $spacing-sm;
  }
  
  .loading-subtext {
    color: $medium-gray;
    font-size: $font-size-base;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>