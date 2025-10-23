# LimboLimbo — v0.2.105

Lot v0.2.105: ajout d’images (opportunités + catégories), lien “Chronique LeCOQ.Café”, statut ON/OFF, grilles unifiées et ajustements UI.

## 1) Données CSV (obligatoire)

- Fichier opportunités: `/public/data/opp_id.csv`  
  En‑tête EXACT:  
  `opp_ID,Statut,Opportunité,Image,Description de l'opportunité,Lien d'affiliation,ChroniqueURL`  
  Règles:
  - `Statut`: "1" (actif, défaut si vide) / "0" (inactif, masqué partout).
  - `Image`: nom de fichier 400×400 (JPG) ou URL absolue.
  - `ChroniqueURL`: URL de la chronique LeCOQ.Café (laisser vide si aucune).

- Fichier catégories: `/public/data/cat_id.csv`  
  En‑tête EXACT:  
  `cat_ID,Catégorie,Icone,Image,Description de la catégorie`  
  Règles:
  - `Image`: nom de fichier 400×400 (PNG/JPG) ou URL; fallback sur `Icone` (Lucide) si vide.

Encodage: UTF‑8 (LF). Si des virgules sont présentes dans un champ, entourer de guillemets.

## 2) Images et assets

- Opportunités: placer les visuels dans `/public/images/opps/` (ex.: `/images/opps/caddle.jpg`).  
- Catégories: placer les visuels dans `/public/images/categories/` (ex.: `/images/categories/jeux.png`).  
- Placeholder (manquant/erreur): `/public/placeholder.svg`.  
- Marque: `piggy.png` (renommé, casse en minuscules) et `lecoqcafe.png` dans `/src/assets/`.

Convention de nommage: minuscules, tirets `-`, pas d’accents ni d’espaces (ex.: `traff-monetizer.jpg`, `recompenses.png`).

## 3) Interface (comportements principaux)

- Listes (Accueil, Catégorie, Résultats): grilles unifiées 3/4/5/6 colonnes, vignettes 1:1.  
- Cartes opportunités: image 1:1 (object-cover), fallback `placeholder.svg`.  
- Cartes catégories: affiche `Image` si présente, sinon icône Lucide.  
- Page Détails:  
  - En‑tête avec visuel 96 px à gauche du titre.  
  - “Héro” image principale en carré 1:1.  
  - Section “Description”: icône seule (pas de mot).  
  - Lien chronique (si `ChroniqueURL`): icône `lecoqcafe.png` + libellé “Consulter la chronique LeCOQ.Café”, ouverture robuste (nouvel onglet si possible, sinon même onglet en PWA).  
- Header: suppression du mot‑marque dans la barre; mot‑marque visible sous le header sur la page d’accueil.

## 4) Statut ON/OFF

- `Statut = "0"`: l’opportunité est suspendue (absente des listes et de la recherche).  
- Si l’ID est appelée directement et que `Statut = "0"` ou inconnue: “Opportunité non trouvée”.

## 5) Comment ajouter du contenu (procédure rapide)

- Nouvelle opportunité:
  1. Déposer l’image 400×400 dans `/public/images/opps/` (ex. `earnapp.jpg`).
  2. Ajouter une ligne dans `opp_id.csv` en respectant l’en‑tête exact (mettre `Statut=1`).
  3. Optionnel: remplir `ChroniqueURL`.  
- Nouvelle catégorie (visuel):
  1. Déposer l’image 400×400 dans `/public/images/categories/` (ex. `jeux.png`).
  2. Renseigner la colonne `Image` de `cat_id.csv`.  
- Conserver FR + UTF‑8 partout; vérifier que les chemins d’images sont corrects.

## 6) Fichiers modifiés/ajoutés (lot v0.2.105)

- Données: `public/data/opp_id.csv`, `public/data/cat_id.csv`  
- Types/chargement: `src/lib/csvParser.ts`, `src/lib/utils.ts` (openExternal)  
- UI: `src/components/Header.tsx`, `src/components/CategoryCard.tsx`, `src/components/OpportunityCard.tsx`  
- Pages: `src/pages/Home.tsx`, `src/pages/Opportunites.tsx`, `src/pages/OpportunitesPersonnalisees.tsx`, `src/pages/OpportunityDetail.tsx`  
- Assets: `src/assets/piggy.png` (renommé), `src/assets/lecoqcafe.png` (à ajouter)

## 7) Notes

- Le parser force déjà le “no‑cache” pour éviter les artefacts après mise à jour des CSV.  
- Si une image ne charge pas: un placeholder s’affiche automatiquement.  
- Les textes ALT sont systématiquement fournis en FR pour l’accessibilité.
