# Ooredoo UX Assessment Prototype

Interactive mobile web prototype for the **Home screen + Upgrade / Change Plan** assessment.

Prepared by **Jawher Hamdi** for the **iHorizons Senior UX Designer** technical assessment.

## What This Is

This is a deployment-ready static web project. It recreates the redesigned Ooredoo mobile flow as an interactive prototype using HTML, CSS, JavaScript, and exported design assets.

The prototype demonstrates:

- Home screen entry points into plan management
- Manage Plan list with visible plan actions
- Family Pro, Family, and Family Lite detail states
- Entertainment benefits selection limited to two choices
- Review plan change confirmation
- Success and support/failure modal states
- Fixed mobile navigation behavior on the Home screen
- Visible persistent CTAs on detail and review screens

## Project Structure

```text
.
├── index.html
├── 404.html
├── server.mjs
├── package.json
├── vercel.json
├── netlify.toml
├── .nojekyll
├── assets/
│   └── exported prototype screens
└── src/
    ├── main.js
    └── styles.css
```

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:5173/
```

You can also open `index.html` directly in a browser because the project uses relative asset paths.

## Deploy

### Vercel

1. Push this folder to GitHub.
2. Import the repository in Vercel.
3. Keep the build command as `npm run build`.
4. Keep the output directory as the project root.

### Netlify

1. Push this folder to GitHub.
2. Import the repository in Netlify.
3. Use `npm run build` as the build command.
4. Use `.` as the publish directory.

### GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to repository settings.
3. Enable Pages from the `main` branch root.
4. Open the generated GitHub Pages URL.

## Quality Notes

- No external dependencies are required.
- No API keys or environment variables are required.
- No local absolute paths are used by the app.
- The project is intentionally static so it can be reviewed quickly and hosted anywhere.
- The visual base uses the final screen exports, while interaction layers are implemented with real HTML controls.
