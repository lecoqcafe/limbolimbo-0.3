# PLAN DE TRAVAIL - v0.3.6.212 - Pages Légales

## 🎯 OBJECTIF PRINCIPAL
Créer les pages légales manquantes avec un design cohérent identique à la page `/a-propos`.

---

## 📋 DESCRIPTION DU PROJET

### 🔗 **Problèmes identifiés**
1. **Lien brisé** : Le lien vers `/conditions` dans la page Paramètres ne fonctionne pas
2. **Page manquante** : Politique de confidentialité (lien pointe vers `/a-propos` au lieu d'une page dédiée)

### 🎨 **Solutions à implémenter**
1. Créer la page `/conditions` avec le même design que `/a-propos`
2. Créer la page `/politique-confidentialite`
3. Corriger les liens dans la page Paramètres
4. *Les améliorations de couleurs seront traitées dans les versions futures*

---

## 🏗️ STRUCTURE DES PAGES

### 📄 **Page Conditions d'Utilisation**
- **URL** : `/conditions`
- **Design** : Identique à `/a-propos`
- **Contenu** : Structure en sections avec titres hiérarchiques
- **Navigation** : Retour cohérent vers les autres pages

### 📄 **Page Politique de Confidentialité**
- **URL** : `/politique-confidentialite`
- **Design** : Identique à `/a-propos`
- **Contenu** : Sections claires sur la collecte et utilisation des données
- **Navigation** : Intégration fluide avec le reste du site

---

## 📋 PHASES DE DÉVELOPPEMENT

### 🏁 **PHASE 1: PRÉPARATION (1h)**
- [ ] Cloner le repository
- [ ] Créer la branche `feature/v0.3.6.212-pages-legales`
- [ ] Analyser le design de la page `/a-propos`

### 📝 **PHASE 2: CRÉATION DES PAGES LÉGALES (3h)**
- [ ] Créer `src/pages/Conditions.tsx` (structure identique à APropos.tsx)
- [ ] Créer `src/pages/PolitiqueConfidentialite.tsx` (structure identique à APropos.tsx)
- [ ] Ajouter les routes dans `App.tsx`
- [ ] Rédiger le contenu structuré pour les deux pages
- [ ] Ajouter la navigation vers ces pages dans les composants existants

### 🔧 **PHASE 3: INTÉGRATION ET CORRECTIONS (2h)**
- [ ] Corriger le lien `/conditions` dans la page Paramètres
- [ ] Corriger le lien vers politique de confidentialité dans Paramètres
- [ ] Ajouter les liens dans le header si nécessaire
- [ ] Vérifier la cohérence du design sur toutes les pages

### ✅ **PHASE 4: TESTS & VALIDATION (1h)**
- [ ] Tester la navigation entre toutes les pages
- [ ] Tester la responsivité des nouvelles pages
- [ ] Vérifier tous les liens internes
- [ ] Valider l'accessibilité avec lecteurs d'écran

### 🚀 **PHASE 5: FINALISATION (1h)**
- [ ] Mettre à jour `version.json` vers v0.3.6.212
- [ ] Documenter les changements dans `changelog.txt`
- [ ] Build et vérification finale
- [ ] Commit et push des modifications
- [ ] Créer la Pull Request

---

## 📁 FICHIERS À CRÉER/MODIFIER

### 🆕 **Nouveaux fichiers (2-3)**
```
src/pages/Conditions.tsx
src/pages/PolitiqueConfidentialite.tsx  
src/content/legal-content.ts (optionnel, pour centraliser le contenu)
```

### 📝 **Fichiers à modifier (3)**
```
src/App.tsx (ajouter routes)
src/pages/Parametres.tsx (corriger liens)
src/components/settings/AboutSection.tsx (corriger liens)
```

---

## 🎯 CRITÈRES DE SUCCÈS

### ✅ **Fonctionnels**
- [ ] Les deux pages légales sont créées et accessibles
- [ ] Tous les liens fonctionnent correctement
- [ ] La navigation est cohérente sur tout le site

### 🎨 **Design & UX**
- [ ] Les pages ont le même design que `/a-propos`
- [ ] L'expérience utilisateur est fluide et intuitive
- [ ] Le contenu est bien structuré et lisible

### 📱 **Techniques**
- [ ] Code responsive et accessible
- [ ] Performance optimisée
- [ ] Zéro régression sur les fonctionnalités existantes

---

## ⏱️ ESTIMATION
**Durée totale**: ~8 heures
**Complexité**: Faible
**Risque**: Faible

---

## 🔄 PROCHAINES ÉTAPES APRÈS v0.3.6.212

1. **v0.3.711** - Page Historique (selon plan original)
2. **v0.3.811** - Optimisations Performance + Améliorations de couleurs
3. **v0.3.911** - Finalisation UX/UI et micro-interactions

---

## 💡 NOTES IMPORTANTES

- Le contenu légal devra être révisé par un professionnel du droit
- *Les améliorations de couleurs et contraste sont prévues pour les versions futures*
- Les deux pages suivront exactement le même design pattern que `/a-propos`
- Penser à ajouter les liens dans le footer pour meilleure accessibilité