# Blindfolded

A simple web app for blind A/B (or more) voting on audio takes. Each visitor gets a unique link; the order of takes is randomized so they never know which file is which.

## How it works

1. **Home** — Click “Get my voting link” to create a unique session and go to your voting page.
2. **Vote** — Listen to each option (A, B, …). The order is randomized per link. Choose your preferred take and enter your name.
3. **Audio** — Put 2 or more audio files in the `audio_takes` folder (`.mp3`, `.wav`, `.m4a`, `.ogg`, `.webm`). Optionally set `AUDIO_TAKES_DIR` to another path.

Run `pnpm run db:push` once to create the database tables (requires `DATABASE_URL` in `.env`, e.g. `DATABASE_URL=file:./local.db`).

---

_Scaffolding: Svelte project powered by [`sv`](https://github.com/sveltejs/cli)._

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.12.8 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:node" drizzle="database:sqlite+sqlite:better-sqlite3" --install pnpm .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
