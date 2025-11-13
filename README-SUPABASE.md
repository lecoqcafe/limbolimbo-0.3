# 🔐 Configuration Supabase pour LIMBOLIMBO

Ce guide vous explique comment configurer l'authentification Supabase pour votre application LIMBOLIMBO.

## 📋 Prérequis

- Un compte Supabase (gratuit)
- 5 minutes de votre temps

## 🚀 Étapes de Configuration

### 1. Créer un Compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub, Google ou Email

### 2. Créer un Nouveau Projet

1. Cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `limbolimbo` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la région la plus proche de vos utilisateurs
   - **Pricing Plan** : Sélectionnez **Free** (gratuit)
3. Cliquez sur **"Create new project"**
4. Attendez 1-2 minutes que le projet soit créé

### 3. Récupérer les Clés API

1. Une fois le projet créé, allez dans **Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez deux informations importantes :

   **Project URL** :
   ```
   https://xyzcompany.supabase.co
   ```

   **anon/public key** :
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.abc123...
   ```

4. **Copiez ces deux valeurs** (vous en aurez besoin à l'étape suivante)

### 4. Configurer les Variables d'Environnement

1. À la racine de votre projet LIMBOLIMBO, créez un fichier nommé **`.env.local`**
2. Copiez le contenu de `.env.example` dans `.env.local`
3. Remplacez les valeurs par vos vraies clés :

   ```env
   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Sauvegardez le fichier**

### 5. Configurer l'Authentification Email

1. Dans Supabase, allez dans **Authentication** > **Providers**
2. Assurez-vous que **Email** est activé (il devrait l'être par défaut)
3. Configurez les paramètres (optionnel) :
   - **Enable email confirmations** : Activé (recommandé pour la production)
   - **Secure email change** : Activé (recommandé)

### 6. Configurer les URLs de Redirection (Important !)

1. Dans **Authentication** > **URL Configuration**
2. Ajoutez vos URLs de redirection :

   **Pour le développement local** :
   ```
   http://localhost:5173
   http://localhost:5173/connexion
   http://localhost:5173/reset-password
   ```

   **Pour la production** :
   ```
   https://limbolimbo.app
   https://limbolimbo.app/connexion
   https://limbolimbo.app/reset-password
   ```

3. Cliquez sur **Save**

### 7. Tester la Configuration

1. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Allez sur `http://localhost:5173/connexion`
3. Essayez de créer un compte
4. Vérifiez votre email pour la confirmation (si activée)

## ✅ Configuration Terminée !

Votre application LIMBOLIMBO est maintenant connectée à Supabase ! 🎉

## 🔒 Sécurité

### ⚠️ IMPORTANT : Ne commitez JAMAIS votre fichier `.env.local` !

Le fichier `.env.local` contient vos clés secrètes. Il est déjà dans `.gitignore` pour votre protection.

### Bonnes Pratiques

- ✅ Utilisez des mots de passe forts pour votre base de données
- ✅ Activez la confirmation par email en production
- ✅ Configurez les URLs de redirection correctement
- ✅ Ne partagez jamais vos clés API publiquement
- ✅ Utilisez des variables d'environnement différentes pour dev/prod

## 📊 Limites du Plan Gratuit

Le plan gratuit Supabase inclut :
- ✅ 50,000 utilisateurs actifs par mois
- ✅ 500 MB de stockage base de données
- ✅ 1 GB de stockage fichiers
- ✅ 2 GB de bande passante

**C'est largement suffisant pour démarrer !**

## 🆘 Besoin d'Aide ?

- [Documentation Supabase](https://supabase.com/docs)
- [Guide d'Authentification](https://supabase.com/docs/guides/auth)
- [Support Supabase](https://supabase.com/support)

## 🔄 Prochaines Étapes

Une fois configuré, vous pourrez :
- ✅ Créer des comptes utilisateurs
- ✅ Se connecter / Se déconnecter
- ✅ Réinitialiser les mots de passe
- ✅ Synchroniser les sessions entre appareils
- 🔮 Ajouter OAuth (Google, GitHub, etc.) plus tard
- 🔮 Ajouter l'authentification à deux facteurs (2FA)

---

**Bon développement ! 🚀**