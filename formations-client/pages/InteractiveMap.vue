<template>
  <div class="map-page">
    <div class="map-container">
      <!-- En-tête de la carte -->
      <div class="map-header">
        <h1>Carte Interactive des Métiers à La Réunion</h1>
        <p>Découvrez les formations et opportunités près de chez vous</p>
      </div>

      <!-- Conteneur de la carte -->
      <div id="map" class="map"></div>

      <!-- Légende de la carte -->
      <div class="map-legend">
        <h3>Légende</h3>
        <!-- La légende sera ajoutée ici -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Coordonnées du centre de La Réunion
const reunionCenter = [-21.115141, 55.536384];

// Exemple de données des organismes de formation
const organismes = [
  { name: "CCI", lat: -21.115, lng: 55.536, address: "Adresse A" },
  { name: "SIMPLON", lat: -21.120, lng: 55.540, address: "Adresse B" },
  // Ajoutez d'autres organismes ici
];

onMounted(() => {
  // Initialisation de la carte
  const map = L.map("map").setView(reunionCenter, 10);

  // Ajout du fond de carte OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Correction pour les icônes Leaflet
  const iconRetinaUrl = "leaflet/dist/images/marker-icon-2x.png";
  const iconUrl = "leaflet/dist/images/marker-icon.png";
  const shadowUrl = "leaflet/dist/images/marker-shadow.png";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });

  // Ajout des marqueurs pour chaque organisme
  organismes.forEach(org => {
    const marker = L.marker([org.lat, org.lng]).addTo(map);
    marker.bindPopup(`<b>${org.name}</b><br>${org.address}`);
  });
});
</script>

<style lang="scss">
.map-page {
  padding: $spacing-lg;

  .map-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .map-header {
    text-align: center;
    margin-bottom: $spacing-lg;

    h1 {
      font-family: $font-primary;
      font-size: $font-size-2xl;
      color: $dark-gray;
      margin-bottom: $spacing-sm;
    }

    p {
      color: $medium-gray;
      font-size: $font-size-lg;
    }
  }

  .map {
    height: 600px;
    width: 100%;
    border-radius: 8px;
    @include card-shadow;
  }

  .map-legend {
    margin-top: $spacing-md;
    padding: $spacing-md;
    background-color: $white;
    border-radius: 8px;
    @include card-shadow;

    h3 {
      font-family: $font-primary;
      font-size: $font-size-lg;
      color: $dark-gray;
      margin-bottom: $spacing-sm;
    }
  }
}
:deep(.leaflet-container) {
  z-index: 1;
  font-family: $font-secondary;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  @include card-shadow;
}

:deep(.leaflet-popup-content) {
  margin: 8px 12px;
  line-height: 1.4;
  font-size: $font-size-base;
  color: $dark-gray;
}

:deep(.leaflet-popup-close-button) {
  color: $primary-blue;

  &:hover {
    color: $secondary-blue;
  }
}

:deep(.leaflet-control-zoom) {
  border: none !important;
  @include card-shadow;

  a {
    color: $dark-gray !important;

    &:hover {
      color: $primary-blue !important;
    }
  }
}

:deep(.leaflet-control-attribution) {
  font-family: $font-secondary;
  font-size: $font-size-xs;
}
</style>
