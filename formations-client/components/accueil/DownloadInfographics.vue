<template>
  <div class="download-infographics">
    <div class="resources-grid">
      <div v-for="resource in resources" :key="resource.id" class="resource-card">
        <div class="resource-icon">
          <i :class="resource.icon"></i>
        </div>
        <div class="resource-content">
          <h3>{{ resource.title }}</h3>
          <p>{{ resource.description }}</p>
          <div class="resource-meta">
            <span class="format">
              <i class="fas fa-globe"></i> {{ resource.format }}
            </span>
            <span class="size">{{ resource.size }}</span>
          </div>
          <button class="download-button" @click="downloadResource(resource)">
            <i class="fas fa-external-link-alt"></i> Ouvrir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const resources = [
  {
    id: 1,
    title: "Guide des métiers du numérique",
    description: "Explorez les opportunités de carrière dans le numérique sur le portail officiel du service public",
    icon: "fas fa-microchip", // Icône de puce électronique pour le numérique
    format: "Site web",
    url: "https://choisirleservicepublic.gouv.fr/metiers/numerique/",
  },
  {
    id: 2,
    title: "Professionnels de l'éducation nationale",
    description: "Consultez la liste complète des diplômes professionnels reconnus par l'Éducation Nationale sur data.gouv.fr",
    icon: "fas fa-graduation-cap", // Icône de diplôme pour l'éducation
    format: "Site web",
    url: "https://www.data.gouv.fr/fr/datasets/liste-des-diplomes-professionnels-de-leducation-nationale/",
  },
  {
    id: 3,
    title: "Guide de reconversion",
    description: "Découvrez les conseils et ressources de France Travail pour votre projet de reconversion professionnelle",
    icon: "fas fa-exchange-alt", // Icône de changement pour la reconversion
    format: "Site web",
    url: "https://www.francetravail.fr/actualites/le-dossier/pratique/orientation/la-reconversion-pour-tous.html",
  },
  {
    id: 4,
    title: "Mon compte personnel de formation (CPF)",
    description: "Accédez à votre espace CPF pour consulter vos droits et financer votre formation",
    icon: "fas fa-wallet", // Icône de portefeuille pour le compte formation
    format: "Site web",
    url: "https://www.moncompteformation.gouv.fr/espace-public/consulter-mes-droits-formation",
  },
];

const downloadResource = (resource) => {
  // Logique de téléchargement à implémenter
    ("Téléchargement de ${resource.title}");
  window.open(resource.url, "_blank");
};
</script>

<style lang="scss">
.download-infographics {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-lg;

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); // Modifié : force 2 colonnes
    gap: $spacing-lg;

    .resource-card {
      @include card-shadow;
      background-color: $white;
      border-radius: 8px;
      padding: $spacing-lg;
      display: flex;
      align-items: flex-start;
      gap: $spacing-md;

      .resource-icon {
        width: 60px;
        height: 60px;
        min-width: 60px;
        background-color: $light-gray;
        border-radius: 12px;
        @include flex-center;

        i {
          font-size: $font-size-xl;
          color: $primary-blue;
        }
      }

      .resource-content {
        flex: 1;

        h3 {
          font-family: $font-primary;
          font-size: $font-size-lg;
          color: $dark-gray;
          margin-bottom: $spacing-xs;
        }

        p {
          color: $dark-gray;
          font-size: $font-size-base;
          margin-bottom: $spacing-sm;
        }

        .resource-meta {
          @include flex-between;
          margin-bottom: $spacing-sm;
          font-size: $font-size-sm;
          color: $dark-gray;

          .format {
            i {
              color: $primary-orange;
              margin-right: $spacing-xs;
            }
          }

          .size {
            color: $medium-gray;
          }
        }

        .download-button {
          @include button-primary;
          width: 100%;
          background-color: $primary-green;

          i {
            margin-right: $spacing-xs;
          }

          &:hover {
            background-color: $secondary-green;
          }
        }
      }
    }
  }
}
</style>
