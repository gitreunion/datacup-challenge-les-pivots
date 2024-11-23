<template>
    <div v-if="isComplete" class="metiers-results">
        <h4>Métiers recommandés :</h4>
        <div class="metiers-grid">
            <div v-for="metier in metiers" :key="metier.id" class="metier-card">
                <div class="metier-header">
                    <i class="fas fa-briefcase"></i>
                    <h5>{{ metier.titre }}</h5>
                </div>
                <div class="metier-content">
                    <div class="info-row">
                        <i class="fas fa-building"></i>
                        <p><strong>Secteur :</strong> {{ metier.secteurActivite }}</p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-tools"></i>
                        <p><strong>Compétences requises :</strong></p>
                        <ul class="competences-list">
                            <li v-for="competence in metier.competences" :key="competence.id">
                                {{ competence.libelle }}
                            </li>
                        </ul>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-chart-line"></i>
                        <p>
                            <strong>Niveau d'expérience :</strong> {{ metier.niveauExperience }}
                        </p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <p>
                            <strong>Localisation :</strong>
                            {{ metier.localisation }}
                        </p>
                    </div>
                </div>
                <div class="metier-footer">
                    <button class="details-btn">
                        Voir les détails
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Competence {
    id: number
    libelle: string
    type: string
}

interface Metier {
    id: number
    titre: string
    secteurActivite: string
    competences: Competence[]
    niveauExperience: string
    localisation: string
}

defineProps<{
    metiers: Metier[]
    isComplete: boolean
}>()
</script>

<style lang="scss" scoped>
.metiers-results {
    margin-top: $spacing-xl;

    h4 {
        font-family: $font-primary;
        font-size: $font-size-xl;
        color: $dark-gray;
        margin-bottom: $spacing-lg;
    }

    .metiers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: $spacing-lg;
        margin-top: $spacing-md;
    }

    .metier-card {
        background-color: $white;
        border-radius: 12px;
        @include card-shadow;
        transition: all 0.3s ease;
        border: 1px solid rgba(0, 0, 0, 0.1);
        overflow: hidden;
        display: flex;
        flex-direction: column;

        &:hover {
            transform: translateY(-4px);
            @include card-shadow-hover;
        }

        .metier-header {
            background-color: $primary-blue;
            color: $white;
            padding: $spacing-md;
            display: flex;
            align-items: center;
            gap: $spacing-sm;

            i {
                font-size: $font-size-xl;
            }

            h5 {
                font-size: $font-size-lg;
                margin: 0;
                font-weight: 600;
                line-height: 1.3;
            }
        }

        .metier-content {
            padding: $spacing-md;
            flex: 1;

            .info-row {
                display: flex;
                align-items: flex-start;
                gap: $spacing-sm;
                margin-bottom: $spacing-sm;

                i {
                    color: $primary-blue;
                    margin-top: 4px;
                }

                p {
                    margin: 0;
                    line-height: 1.5;
                    flex: 1;
                }

                strong {
                    color: $dark-gray;
                }
            }

            .competences-list {
                list-style: none;
                padding-left: $spacing-md;
                margin: $spacing-xs 0;

                li {
                    position: relative;
                    padding: $spacing-xs 0;
                    
                    &:before {
                        content: "•";
                        color: $primary-blue;
                        position: absolute;
                        left: -$spacing-md;
                    }
                }
            }
        }

        .metier-footer {
            padding: $spacing-md;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: flex-end;
            margin-top: auto;

            .details-btn {
                background-color: transparent;
                color: $primary-blue;
                border: 2px solid $primary-blue;
                padding: $spacing-sm $spacing-md;
                border-radius: 25px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: $spacing-sm;
                transition: all 0.3s ease;
                cursor: pointer;

                &:hover {
                    background-color: $primary-blue;
                    color: $white;
                    transform: translateX(4px);
                }

                i {
                    transition: transform 0.3s ease;
                }

                &:hover i {
                    transform: translateX(4px);
                }
            }
        }
    }
}
</style>