<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <NuxtLink to="/" class="logo">
        <img src="/logo.svg" alt="Logo Formations" />
      </NuxtLink>

      <div class="nav-links">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: route.path === link.path }"
        >
          {{ link.name }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute();

const navLinks = [
  { name: "Accueil", path: "/" },
  // { name: "Recherche", path: "/Search" },
  { name: "Je postule (Bêta)", path: "/Interface" },
  { name: "Carte Interactive", path: "/InteractiveMap" },
];
</script>

<style lang="scss" scoped>
.navbar {
  padding: $spacing-md 0;
  background-color: $white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .navbar-content {
    @include flex-between;
  }

  .logo {
    img {
      height: 40px;
      width: auto;
    }
  }

  .nav-links {
    display: flex;
    gap: $spacing-lg;

    .nav-link {
      color: $dark-gray;
      font-family: $font-primary;
      font-size: $font-size-base;
      transition: color 0.3s ease;
      padding-bottom: $spacing-xs;
      border-bottom: 2px solid transparent;

      &:hover {
        color: $primary-blue;
      }

      &.active {
        color: $primary-blue;
        border-bottom-color: $primary-blue;
      }
    }
  }
}
</style>
