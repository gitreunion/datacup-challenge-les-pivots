<template>
  <div class="sector-cards">
    <div v-for="sector in sectors" :key="sector.id" class="sector-card">
      <div class="card-icon">
        <i :class="sector.icon"></i>
      </div>
      <h3>{{ sector.title }}</h3>
      <p>{{ sector.description }}</p>
      <div class="card-stats">
        <div class="stat">
          <span class="number">{{ sector.formations }}</span>
          <span class="label">Formations</span>
        </div>
        <div class="stat">
          <span class="number">{{ sector.companies }}</span>
          <span class="label">Offres d'emplois</span>
        </div>
      </div>
      <button class="explore-button" @click="navigateToSector(sector)">
        Découvrir
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFormationsStore } from '@/stores/formations';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const router = useRouter();
const formationsStore = useFormationsStore();
const sectors = ref([
  {
    id: 1,
    title: "Commerce",
    description: "Développez vos compétences commerciales et managériales",
    icon: "fas fa-store",
    formations: "0",
    companies: "0",
    keywords: ['commerce', 'vente', 'commercial'] // Ajout des mots-clés
  },
  {
    id: 2,
    title: "Numérique",
    description: "Formez-vous aux métiers du digital et de la tech",
    icon: "fas fa-laptop-code",
    formations: "0",
    companies: "0",
    keywords: ['informatique', 'numérique', 'digital', 'développeur'] // Ajout des mots-clés
  },
  {
    id: 3,
    title: "Restauration/Hôtellerie",
    description: "Excellez dans l'art de la gastronomie et de l'accueil",
    icon: "fas fa-utensils",
    formations: "0",
    companies: "0",
    keywords: ['restauration', 'hôtellerie', 'cuisine', 'chef'] // Ajout des mots-clés
  },
]);

const navigateToSector = (sector) => {
  // Utiliser les mêmes mots-clés que ceux utilisés dans le filtrage
  const keywordsMap = {
    'Commerce': ['commerce', 'vente', 'commercial'],
    'Numérique': ['informatique', 'numérique', 'digital', 'développeur'],
    'Restauration/Hôtellerie': ['restauration', 'hôtellerie', 'cuisine', 'chef']
  };

  const keywords = keywordsMap[sector.title] || [];
  
  router.push({
    path: '/data',
    query: { 
      sector: sector.title,
      keywords: keywords.join(',')
    }
  });
};
onMounted(async () => {
  await formationsStore.fetchFormations();
  const commerceFormations = formationsStore.getAllFormations.filter(formation =>
    formation.formacodes?.some(code =>
      code.libelle.toLowerCase().includes('commerce')
    )
  );
  const numeriqueFormations = formationsStore.getAllFormations.filter(formation =>
    formation.formacodes?.some(code =>
      code.libelle.toLowerCase().includes('informatique') ||
      code.libelle.toLowerCase().includes('numérique') ||
      code.libelle.toLowerCase().includes('digital')
    )
  );
  const restaurationFormations = formationsStore.getAllFormations.filter(formation =>
    formation.formacodes?.some(code =>
      code.libelle.toLowerCase().includes('restauration') ||
      code.libelle.toLowerCase().includes('hôtellerie') ||
      code.libelle.toLowerCase().includes('cuisine')
    )
  );
  // Filtrer les jobs par secteur
  const commerceJobs = formationsStore.getAllJobs.filter(job =>
    job.libelle.toLowerCase().includes('commerce') ||
    job.libelle.toLowerCase().includes('vente') ||
    job.libelle.toLowerCase().includes('commercial')
  );

  const numeriqueJobs = formationsStore.getAllJobs.filter(job =>
    job.libelle.toLowerCase().includes('informatique') ||
    job.libelle.toLowerCase().includes('numérique') ||
    job.libelle.toLowerCase().includes('digital') ||
    job.libelle.toLowerCase().includes('développeur')
  );

  const restaurationJobs = formationsStore.getAllJobs.filter(job =>
    job.libelle.toLowerCase().includes('restauration') ||
    job.libelle.toLowerCase().includes('hôtellerie') ||
    job.libelle.toLowerCase().includes('cuisine') ||
    job.libelle.toLowerCase().includes('chef')
  );
  // Mise à jour du nombre de formations
  sectors.value[0].formations = commerceFormations.length.toString();
  sectors.value[1].formations = numeriqueFormations.length.toString();
  sectors.value[2].formations = restaurationFormations.length.toString();

  // Mise à jour des données
  sectors.value[0].formations = commerceFormations.length.toString();
  sectors.value[0].companies = commerceJobs.length.toString();

  sectors.value[1].formations = numeriqueFormations.length.toString();
  sectors.value[1].companies = numeriqueJobs.length.toString();

  sectors.value[2].formations = restaurationFormations.length.toString();
  sectors.value[2].companies = restaurationJobs.length.toString();
});
</script>

<style lang="scss">
.sector-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-lg;
  padding: 0 $spacing-lg;
  max-width: 1200px;
  margin: 0 auto;

  .sector-card {
    @include card-shadow;
    background-color: $white;
    padding: $spacing-lg;
    border-radius: 8px;
    text-align: center;

    .card-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto $spacing-md;
      background-color: $light-gray;
      border-radius: 50%;
      @include flex-center;

      i {
        font-size: $font-size-2xl;
        color: $primary-blue;
      }
    }

    h3 {
      font-family: $font-primary;
      font-size: $font-size-xl;
      color: $dark-gray;
      margin-bottom: $spacing-sm;
    }

    p {
      color: $dark-gray;
      margin-bottom: $spacing-lg;
      font-family: $font-secondary;
    }

    .card-stats {
      @include flex-between;
      margin-bottom: $spacing-lg;
      padding: $spacing-md 0;
      border-top: 1px solid $medium-gray;
      border-bottom: 1px solid $medium-gray;

      .stat {
        text-align: center;
        flex: 1;

        .number {
          display: block;
          font-size: $font-size-xl;
          font-weight: bold;
          color: $primary-blue;
        }

        .label {
          font-size: $font-size-sm;
          color: $dark-gray;
        }
      }
    }

    .explore-button {
      @include button-primary;
      width: 100%;
      margin-top: $spacing-md;
    }
  }
}
</style>
