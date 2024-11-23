<template>
    <div class="data-page">
        <h1>Secteur : {{ sectorData.title }}</h1>

        <div class="sector-summary">
            <div class="summary-card">
                <h2>Formations disponibles</h2>
                <div class="formations-list">
                    <div v-for="(formation, index) in sectorData.formations" :key="formation.id" class="formation-item">
                        <h3>{{ formation.intitule }}</h3>
                        <p>Date limite: {{ formation.date_limite || '15/12/2027' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useFormationsStore } from '@/stores/formations';
import { onMounted, ref, watch } from 'vue';

const route = useRoute();
const formationsStore = useFormationsStore();

const sectorData = ref({
    title: '',
    formations: [],
    jobs: []
});

const loadSectorData = async () => {
    const sector = route.query.sector;
    const keywords = route.query.keywords?.split(',') || [];

    await formationsStore.fetchFormations();

    sectorData.value = {
        title: sector,
        formations: formationsStore.getAllFormations.filter(formation =>
            formation.formacodes?.some(code =>
                keywords.some(keyword =>
                    code.libelle.toLowerCase().includes(keyword.toLowerCase())
                )
            )
        ),
        jobs: formationsStore.getAllJobs.filter(job =>
            keywords.some(keyword =>
                job.libelle.toLowerCase().includes(keyword.toLowerCase())
            )
        )
    };
};

onMounted(loadSectorData);
watch(() => route.query, loadSectorData);
</script>

<style lang="scss" scoped>
.data-page {
    padding: $spacing-xl;
    max-width: 1400px;
    margin: 0 auto;
    background-color: $white;
    min-height: 100vh;

    h1 {
        text-align: center;
        margin-bottom: $spacing-xl;
        color: $primary-blue;
        font-size: 2.5rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 600;
    }

    .sector-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: $spacing-xl;
        padding: $spacing-xl;

        .summary-card {
            background: $white;
            padding: $spacing-xl;
            border-radius: $border-radius-lg;
            box-shadow: 0 4px 12px rgba($dark-gray, 0.1);

            h2 {
                color: $dark-gray;
                margin-bottom: $spacing-xl;
                font-size: $font-size-2xl;
                padding-bottom: $spacing-md;
                font-weight: 600;
                border-bottom: 3px solid $primary-blue;
            }

            .formations-list {
                max-height: 700px;
                overflow-y: auto;
                padding-right: $spacing-lg;

                .formation-item {
                    padding: $spacing-lg;
                    border-radius: $border-radius;
                    margin-bottom: $spacing-md;
                    background: $white;
                    border: 1px solid $light-gray;
                    transition: box-shadow 0.3s ease;

                    &:hover {
                        box-shadow: 0 2px 8px rgba($dark-gray, 0.1);
                    }

                    h3 {
                        font-size: $font-size-xl;
                        color: $primary-blue;
                        margin-bottom: $spacing-sm;
                        font-weight: 500;
                    }

                    p {
                        color: $dark-gray;
                        font-size: $font-size-base;
                    }
                }
            }
        }
    }
}
</style>