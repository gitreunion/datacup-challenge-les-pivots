<template>
  <div>
    <Navbar />
    <slot />
    <Footer />
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.page-content {
  position: relative;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease-in-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
