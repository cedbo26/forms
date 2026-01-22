# Nico’Malaya — Pivot Import (Formspree)

## Ouvrir le formulaire
- Ouvre `nico-malaya-import/index.html` dans un navigateur.
- Tout est statique, prêt pour GitHub Pages.

## Publier via GitHub Pages
1. Sur GitHub, ouvre le repo **forms** → **Settings** → **Pages**.
2. **Source**: `Deploy from a branch`.
3. **Branch**: `main` et **folder**: `/` (root). Alternative si besoin: `/docs`.
4. Sauvegarde. GitHub générera l’URL GitHub Pages.

## Tester un POST Formspree
1. Ouvre le formulaire hébergé (ou localement pour test rapide).
2. Remplis l’étape 1 puis va jusqu’à **Envoyer**.
3. Vérifie la redirection vers `thank-you.html`.
4. Dans Formspree, vérifie que la soumission est bien reçue.

## Notes
- Le formulaire POST vers `https://formspree.io/f/xykkrkey`.
- Le champ `_redirect` pointe vers `thank-you.html`.
