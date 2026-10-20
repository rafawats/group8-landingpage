# Group 8 × Auramax · landing page

Project page for Group 8's data governance proposal for Auramax Foods Group
(MIS41520 Strategic Data Management, UCD Michael Smurfit Graduate Business School).
Built with React + Vite. It is the page the QR code on our closing slide points to.

## Edit the content

Almost everything you'd want to change is in **`src/content.js`**:

- **Team roles:** replace `[Role in the project]` for each person.
- **Photos:** live in `public/team/`. Replace a file with the same name to change a photo, or delete it to show initials instead.
- **Report and slides buttons:** put the files in `public/downloads/` (create the folder) and set `href`, for example
  `{ label: "Executive report", note: "PDF", href: "downloads/report.pdf" }`. Buttons with an empty `href` are hidden.
- **Texts:** the problem, solution, recommendations and roadmap wording are all in the same file.

Colours and fonts are at the top of `src/styles.css`.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev        # opens a local preview with live reload
npm run build      # production build into dist/
```

## Publish on GitHub Pages

1. Create a GitHub repository (public, for free Pages) and push this folder to the `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` now builds and publishes the site (see `.github/workflows/deploy.yml`).
   The address appears under Settings → Pages, usually `https://<your-user>.github.io/<repo-name>/`.
4. Use that address for the QR code on the closing slide.

The build uses relative paths (`base: "./"` in `vite.config.js`), so it works whatever the repository is called.

## Privacy

The page is public once it's on GitHub Pages. It shows names and photos only; don't add student numbers or the
cover page with student IDs to `public/downloads/`.
