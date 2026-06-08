# Peggy - Beauty Clone

This repo contains a Vite + React demo site used for the Peggy booking prototype.

## CI: automatic packaging and Kaggle upload

A GitHub Actions workflow (`.github/workflows/pack_and_release.yml`) builds the site and creates two zip packages:

- `peggy-upload-with-videos.zip` — includes media files
- `peggy-upload-without-videos.zip` — excludes common video extensions (mp4,mov,mkv,avi)

When you push to `main` Actions will run and upload the zips as artifacts. If you add Kaggle credentials as repository secrets the workflow will also upload/version the zips to Kaggle as a dataset.

Required repository secrets (Repository → Settings → Secrets → Actions):

- `KAGGLE_USERNAME` — your Kaggle username
- `KAGGLE_KEY` — your Kaggle API key (the `key` value inside `kaggle.json`)
- Optional: `KAGGLE_DATASET_ID` — e.g. `username/dataset-name` to version an existing dataset instead of creating a new one

How to create a Kaggle API key:

1. Go to https://www.kaggle.com/ and sign in.
2. Settings → API → "Create New API Token" — this downloads `kaggle.json`.
3. Open `kaggle.json` and copy `username` and `key` into the GitHub secrets above.

Triggering the workflow

- Push to `main` (recommended) — workflow runs automatically.
- Or manually run the workflow from the Actions tab (select "Build, package, and release" → Run workflow).

Notes

- The packaging script is `scripts/kaggle_prepare_and_zip.sh`. It excludes `node_modules` and common video types for the smaller zip.
- The workflow only attempts Kaggle upload when `KAGGLE_USERNAME` and `KAGGLE_KEY` secrets are present.
- Do NOT commit secrets into the repo; use GitHub Secrets.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
