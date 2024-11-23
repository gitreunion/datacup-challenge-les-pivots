<template>
  <div class="home-page">
    <Accueil_HeroBanner />
    <section class="search-path">
      <h2>Trouvez votre formation idéale</h2>
      <Accueil_SearchPath />
    </section>
    <section class="sectors">
      <h2>Découvrez nos secteurs</h2>
      <Accueil_SectorCards />
    </section>
    <section class="resources">
      <h2>Ressources utiles</h2>
      <Accueil_DownloadInfographics />
    </section>
  </div>
</template>

<script setup>
</script>

<style lang="scss">
.home-page {
  section {
    padding: $spacing-xl 0;

    h2 {
      font-family: $font-primary;
      font-size: $font-size-2xl;
      color: $dark-gray;
      text-align: center;
      margin-bottom: $spacing-lg;
    }
  }

  .search-path {
    @include flex-center;
    flex-direction: column;
    background-color: $white;
  }

  .sectors {
    background-color: $light-gray;
  }

  .popular-courses {
    @include flex-center;
    flex-direction: column;
  }

  .resources {
    background-color: $light-gray;
    @include flex-center;
    flex-direction: column;
  }
}
</style>
