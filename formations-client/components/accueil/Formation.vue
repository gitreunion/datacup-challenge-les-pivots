<template>
    <div v-if="isComplete" class="formations-results">
        <h4>Formations recommandées :</h4>
        <div class="formations-grid">
            <div v-for="formation in formations" :key="formation.numero" class="formation-card">
                <div class="formation-header">
                    <i class="fas fa-graduation-cap"></i>
                    <h5>{{ formation.intitule }}</h5>
                </div>
                <div class="formation-content">
                    <div class="info-row">
                        <i class="fas fa-university"></i>
                        <p><strong>Niveau :</strong> {{ formation.niveau }}</p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-briefcase"></i>
                        <p><strong>Métier visé :</strong> {{ formation.metier_vise }}</p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-tag"></i>
                        <p>
                            <strong>Catégorie :</strong> {{ formation.categorie_formation }}
                        </p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-graduation-cap"></i>
                        <p>
                            <strong>Diplôme requis :</strong>
                            {{ formation.diplome_deja_fait }}
                        </p>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-calendar-alt"></i>
                        <p>
                            <strong>Valide jusqu'au :</strong>
                            {{ formatDate(formation.date_validite) }}
                        </p>
                    </div>
                </div>
                <div class="formation-footer">
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
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Formation {
    numero: number
    intitule: string
    niveau: string
    metier_vise: string
    categorie_formation: string
    diplome_deja_fait: string
    date_validite: string
}

defineProps<{
    formations: Formation[]
    isComplete: boolean
}>()

const formatDate = (date: string): string => {
    if (!date) return ''
    try {
        const parsedDate = new Date(date)
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Date invalide')
        }
        return format(parsedDate, 'dd/MM/yyyy', { locale: fr })
    } catch (error) {
        console.error('Erreur de formatage de date:', error)
        return date
    }
}
</script>

<style lang="scss" scoped>
.formations-results {
    margin-top: $spacing-xl;

    h4 {
        font-family: $font-primary;
        font-size: $font-size-xl;
        color: $dark-gray;
        margin-bottom: $spacing-lg;
    }

    .formations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: $spacing-lg;
        margin-top: $spacing-md;
    }

    .formation-card {
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

        .formation-header {
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

        .formation-content {
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
        }

        .formation-footer {
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
