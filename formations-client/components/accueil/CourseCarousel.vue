<template>
  <div class="course-carousel">
    <button class="nav-button prev" @click="prevSlide">
      <i class="fas fa-chevron-left"></i>
    </button>

    <div class="carousel-container" ref="container">
      <div class="carousel-track" :style="trackStyle">
        <div v-for="course in courses" :key="course.id" class="course-card">
          <div
            class="course-image"
            :style="{ backgroundImage: `url(${course.image})` }"
          >
            <span class="category">{{ course.category }}</span>
          </div>
          <div class="course-content">
            <h3>{{ course.title }}</h3>
            <p>{{ course.description }}</p>
            <div class="course-info">
              <span><i class="fas fa-clock"></i> {{ course.duration }}</span>
              <span
                ><i class="fas fa-graduation-cap"></i> {{ course.level }}</span
              >
            </div>
            <button class="details-button">Voir les détails</button>
          </div>
        </div>
      </div>
    </div>

    <button class="nav-button next" @click="nextSlide">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const currentSlide = ref(0);
const container = ref(null);

const courses = [
  {
    id: 1,
    title: "Développement Web Full-Stack",
    description: "Maîtrisez les technologies web modernes",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80",
    category: "Numérique",
    duration: "6 mois",
    level: "Intermédiaire",
  },
  {
    id: 2,
    title: "Marketing Digital",
    description: "Stratégies marketing pour le digital",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80",
    category: "Commerce",
    duration: "3 mois",
    level: "Débutant",
  },
  {
    id: 3,
    title: "Arts Culinaires",
    description: "Techniques professionnelles de cuisine",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80",
    category: "Restauration",
    duration: "9 mois",
    level: "Avancé",
  },
  {
    id: 4,
    title: "Management Hôtelier",
    description: "Gestion d'établissement hôtelier",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80",
    category: "Hôtellerie",
    duration: "12 mois",
    level: "Avancé",
  },
];

const trackStyle = computed(() => ({
  transform: `translateX(-${currentSlide.value * 100}%)`,
}));

const nextSlide = () => {
  if (currentSlide.value < courses.length - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};
</script>

<style lang="scss">
.course-carousel {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-lg;

  .carousel-container {
    overflow: hidden;
    margin: 0 40px;
  }

  .carousel-track {
    display: flex;
    transition: transform 0.5s ease;
  }

  .course-card {
    flex: 0 0 100%;
    max-width: calc(33.333% - 20px);
    margin: 0 10px;
    @include card-shadow;
    border-radius: 8px;
    overflow: hidden;

    @include responsive($breakpoint-md) {
      max-width: calc(50% - 20px);
    }

    @include responsive($breakpoint-sm) {
      max-width: calc(100% - 20px);
    }

    .course-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      position: relative;

      .category {
        position: absolute;
        top: $spacing-sm;
        left: $spacing-sm;
        background-color: rgba($primary-blue, 0.9);
        color: $white;
        padding: $spacing-xs $spacing-sm;
        border-radius: 4px;
        font-size: $font-size-sm;
      }
    }

    .course-content {
      padding: $spacing-md;

      h3 {
        font-family: $font-primary;
        font-size: $font-size-lg;
        margin-bottom: $spacing-sm;
      }

      p {
        color: $dark-gray;
        margin-bottom: $spacing-md;
        font-size: $font-size-base;
      }

      .course-info {
        @include flex-between;
        margin-bottom: $spacing-md;

        span {
          color: $dark-gray;
          font-size: $font-size-sm;

          i {
            color: $primary-blue;
            margin-right: $spacing-xs;
          }
        }
      }

      .details-button {
        @include button-primary;
        width: 100%;
      }
    }
  }

  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: $white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    @include card-shadow;
    cursor: pointer;
    z-index: 1;

    &.prev {
      left: 0;
    }
    &.next {
      right: 0;
    }

    i {
      color: $primary-blue;
    }

    &:hover {
      background-color: $primary-blue;

      i {
        color: $white;
      }
    }
  }
}
</style>
