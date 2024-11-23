<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-section">
        <h3>À propos</h3>
        <ul>
          <li>
            <NuxtLink to="/about">Notre histoire</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact">Contact</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/careers">Carrières</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Formations</h3>
        <ul>
          <li>
            <NuxtLink to="/search">Catalogue</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/sectors">Secteurs</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/certifications">Certifications</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Ressources</h3>
        <ul>
          <li>
            <NuxtLink to="/blog">Blog</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/faq">FAQ</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/support">Support</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="footer-section social">
        <h3>Suivez-nous</h3>
        <div class="social-links">
          <a href="#" target="_blank" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" target="_blank" aria-label="Twitter">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" target="_blank" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
          </a>
          <a href="#" target="_blank" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Formation Platform. Tous droits réservés.</p>
        <div class="legal-links">
          <NuxtLink to="/privacy">Confidentialité</NuxtLink>
          <NuxtLink to="/terms">Conditions d'utilisation</NuxtLink>
          <NuxtLink to="/legal">Mentions légales</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: $dark-gray;
  color: $white;
  padding-top: $spacing-xl;
  width: 100%;
  min-height: auto;
  margin-top: auto;
  position: relative; // Changé de sticky à relative
  bottom: 0;
  left: 0;
  z-index: 10;

  .footer-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-xl;
    padding-bottom: $spacing-xl;

    @include responsive($breakpoint-md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include responsive($breakpoint-sm) {
      grid-template-columns: 1fr;
    }
  }

  .footer-section {
    h3 {
      font-family: $font-primary;
      font-size: $font-size-lg;
      margin-bottom: $spacing-md;
      color: $white;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: $spacing-sm;

        a {
          color: $light-gray;
          transition: color 0.3s ease;

          &:hover {
            color: $primary-blue;
          }
        }
      }
    }

    &.social {
      .social-links {
        display: flex;
        gap: $spacing-md;

        a {
          color: $white;
          font-size: $font-size-xl;
          transition: color 0.3s ease;

          &:hover {
            color: $primary-blue;
          }
        }
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba($white, 0.1);
    padding: $spacing-md 0;

    .container {
      @include flex-between;

      @include responsive($breakpoint-md) {
        flex-direction: column;
        align-items: center;
        gap: $spacing-md;
        text-align: center;
      }
    }

    p {
      color: $medium-gray;
    }

    .legal-links {
      display: flex;
      gap: $spacing-md;

      a {
        color: $medium-gray;
        font-size: $font-size-sm;
        transition: color 0.3s ease;

        &:hover {
          color: $white;
        }
      }
    }
  }
}
</style>