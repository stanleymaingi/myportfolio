# Stanley Maingi — Portfolio Website

A responsive, multi-page portfolio built with HTML, CSS and vanilla JavaScript. The homepage recreates the supplied teal-and-gold reference, using the bundled graduation portrait, a glass-style navigation bar, technology tiles, skill highlights and a curved footer treatment.

## Pages

- `index.html` — Main homepage and hero landing page (the default deployment entry point).
- `about.html` — Background, interests and approach.
- `projects.html` — Featured projects and screenshot galleries.
- `skills.html` — Technical foundations and collaboration skills.
- `contact.html` — Contact information and contact call to action.
- `home.html` — Compatibility copy of the homepage for older bookmarks.

## Run locally

1. Extract the ZIP archive.
2. Open the extracted folder in VS Code or a terminal.
3. Start a local web server:

   ```bash
   python -m http.server 8000
   ```

4. Visit http://localhost:8000.

The site uses Google Fonts when an internet connection is available and falls back to system fonts otherwise.

## Before publishing

- The homepage Download CV button expects a file named `Stanley-Maingi-CV.pdf` in the project root. Add your approved CV under that exact filename to enable the download.
- The contact action currently uses `hello@example.com` as a placeholder. Replace `contactEmail` in `script.js` with your public email address.
- The supplied archive includes the homepage portrait. Add the other page/gallery images listed in `IMAGE-PATHS.txt` if you want all secondary-page photo and project-gallery areas to display their intended imagery.

Upload the contents of this folder, including the `assets/` directory, to the root of your static hosting project. Keep `index.html` at the root.
