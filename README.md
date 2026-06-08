# 🎙️ Conf Notes

Application mobile de prise de notes vocales pour conférences secteur transport public.

## Fonctionnalités

- Dictée vocale en français
- Analyse automatique par Claude (nom, société, rôle, résumé, next steps)
- Sauvegarde locale des contacts
- Export Excel pour mise à jour Salesforce
- Multi-utilisateur (changement de profil en 1 clic)

## Stack

- React + TypeScript + Vite (frontend)
- Express + Node.js (proxy backend pour l'API Claude)
- Web Speech API (dictée vocale native)
- SheetJS (export Excel)

## Installation

### Prérequis
- Node.js 18+
- Une clé API Claude (https://console.anthropic.com)

### Setup

```bash
# Cloner le repo
git clone https://github.com/TON_USERNAME/conference_notes.git
cd conference_notes

# Installer les dépendances
npm install

# Créer les fichiers d'environnement
cp .env.example .env
cp .env.local.example .env.local
```

Remplis `.env` avec ta clé Claude :
CLAUDE_API_KEY=sk-ant-xxxxxxxx

### Lancer l'app

Terminal 1 — backend :
```bash
npx tsx --env-file=.env server.ts
```

Terminal 2 — frontend :
```bash
npm run dev
```

Ouvre http://localhost:5173

### Accès mobile (même WiFi)

```bash
# Récupère ton IP locale
ipconfig getifaddr en0

# Lance Vite en mode réseau
npm run dev -- --host
```

Remplace `localhost` par ton IP dans `src/services/ai.ts`, puis ouvre `http://TON_IP:5173` sur ton téléphone.

## Utilisation

1. Entre ton prénom au premier lancement
2. Clique **Démarrer la dictée** et parle
3. Clique **Arrêter et analyser** — Claude structure automatiquement l'échange
4. Vérifie la fiche dans l'onglet **Contacts**
5. En fin de journée, clique **Exporter Excel**

## Sécurité

- Ne jamais commiter `.env` ou `.env.local`
- La clé API reste uniquement sur ton Mac (serveur proxy local)