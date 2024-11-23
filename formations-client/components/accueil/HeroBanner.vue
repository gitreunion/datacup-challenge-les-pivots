<template>
  <div class="hero-banner">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="hero-slide"
      :class="{ active: currentSlide === index }"
      :style="{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
      }"
    >
      <div class="hero-content">
        <h1>{{ slide.title }}</h1>
        <p>{{ slide.description }}</p>
        <a
          :href="slide.link"
          :target="slide.link.startsWith('http') ? '_blank' : '_self'"
          :rel="slide.link.startsWith('http') ? 'noopener noreferrer' : ''"
          class="cta-button"
        >
          {{ slide.buttonText }}
        </a>
      </div>
    </div>

    <div class="slide-dots">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        class="dot"
        :class="{ active: currentSlide === index }"
        @click="setSlide(index)"
        :aria-label="`Slide ${index + 1}`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const slides = [
  {
    title: "Matinée de l'emploie et de l'insertion",
    description:
      "Explorez vos opportunités et trouvez la formation qui vous correspond",
    buttonText: "Explorez vos opportunités",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80",
    link: "https://mesevenementsemploi.francetravail.fr/mes-evenements-emploi/",
  },
  {
    title: "Forum Emploi Industrie et Services",
    description:
      "Découvrez les opportunités dans l'industrie et les services à Saint-André-de-Cubzac",
    buttonText: "Participer au forum",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80",
    link: "https://labonneboite.francetravail.fr/",
  },
  {
    title: "L'UIMM Mulhouse ouvre ses portes !",
    description: "Des parcours personnalisés pour votre réussite",
    buttonText: "Découvrir maintenant",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80",
    link: "https://mesevenementsemploi.francetravail.fr/mes-evenements-emploi/evenement/345620/l-uimm-mulhouse-ouvre-ses-portes-mulhouse",
  },
];

const currentSlide = ref(0);
let slideInterval;

const setSlide = (index) => {
  currentSlide.value = index;
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  clearInterval(slideInterval);
});
</script>

<style lang="scss">
.hero-banner {
  height: 80vh;
  position: relative;
  overflow: hidden;

  .hero-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
    @include flex-center;

    &.active {
      opacity: 1;
    }
  }

  .hero-content {
    text-align: center;
    color: $white;
    padding: $spacing-xl;
    max-width: 800px;
    z-index: 2;

    h1 {
      font-family: $font-primary;
      font-size: 3.5rem;
      margin-bottom: $spacing-lg;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease-out 0.3s;

      @include responsive($breakpoint-sm) {
        font-size: 2.5rem;
      }
    }

    p {
      font-family: $font-secondary;
      font-size: $font-size-xl;
      margin-bottom: $spacing-xl;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease-out 0.5s;
    }

    .cta-button {
      @include button-primary;
      font-size: $font-size-lg;
      padding: $spacing-md $spacing-xl;
      background-color: $primary-orange;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease-out 0.7s;
      text-decoration: none;
      display: inline-block;
      border: none;
      cursor: pointer;
      color: $white;
      font-weight: 500;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          120deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transition: all 0.6s ease;
      }

      &:hover {
        background-color: $secondary-orange;
        text-decoration: none;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary-orange, 0.2);

        &::before {
          left: 100%;
        }
      }
    }
  }

  .active .hero-content {
    h1,
    p,
    .cta-button {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.slide-dots {
  position: absolute;
  bottom: $spacing-xl;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  z-index: 3;

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba($white, 0.5);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba($white, 0.8);
    }

    &.active {
      background-color: $white;
      transform: scale(1.2);
    }
  }
}
</style>
