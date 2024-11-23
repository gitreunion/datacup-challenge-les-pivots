# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.




# Documentation

## Structure des données

``` json
// formations-client/data/formations_metiers_relations.json
{
  formations: {
    [rncpNumber]: {
      numero: String,
      intitule: String,
      niveau: String,
      actif: Boolean,
      formacodes: Array<{code: String, libelle: String}>,
      metiers_rome: Array<String>,
      certificateurs: Array<{siret: String, nom: String}>,
      nouveau_rncp?: String // optionnel, présent si formation inactive
    }
  },
  metiers: {
    [romeCode]: {
      code: String,
      libelle: String,
      formations_rncp: Array<String>
    }
  },
  relations: {
    [romeCode]: Array<String> // liste des RNCP
  }
}
```

## Flux de données

```mermaid
graph TD
    A[fetchData.js] --> B[formations_metiers_relations.json]
    B --> C[API /formations]
    B --> D[API /formations-metiers-relations]
    C --> E[Store formations]
    D --> E
    E --> F[Components]
```

## Analyse des données France Competence

Extraction, et transformation des donnés de France Competence via script js.


## Environnement


```bash

FRANCE_TRAVAIL_API_CLIENT_ID=[FRANCE_TRAVAIL_API_CLIENT_ID]
FRANCE_TRAVAIL_API_CLIENT_SECRET=[FRANCE_TRAVAIL_API_CLIENT_SECRET]

```

