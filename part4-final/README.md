# 🌌 HolByNB - Édition Spatiale

Bienvenue sur **HolByNB**, la plateforme ultime de réservation de séjours cosmiques ! Ce projet est une application complète (Full-Stack) développée dans le cadre de la formation Holberton School, clôturant magnifiquement les fondamentaux. Il inclut un backend robuste de type API REST en Python (Flask) et une magnifique interface utilisateur en React.

## ✨ Fonctionnalités Principales

- **Interface Immersive & Glassmorphism** : Thème sombre ultra-moderne avec animations fluides, vidéos d'arrière-plan interactives et particules cosmiques (étoiles, nébuleuses).
- **Destinations Hors du Commun** : Dôme protégé sur Mars, Station Orbitale, habitat sous-marin d'Europe et bien d'autres !
- **Galerie & Vidéos** : Plusieurs photos dynamiques par lieu et possibilité d'intégrer des visites vidéos ou GIFs immersifs.
- **Authentification & Permissions (JWT)** : Différentiation entre Voyageurs, Hôtes et Administrateurs. 
- **Panneau de Modération** : En tant qu'admin, contournez les restrictions de base et supprimez directement les faux avis ou gèrez la suppression des lieux.
- **Easter Eggs** : Des liens partenaires animés dissimulés pour les esprits les plus curieux...

## 🛠️ Stack Technique

- **Backend** : Python 3, Flask, Flask-RESTx (Documentation SWAGGER), SQLAlchemy, Flask-JWT-Extended pour la sécurité.
- **Frontend** : React.js, Vite.js, React Router DOM, Motion (Framer Motion) pour les animations web, Lucide-React pour l'iconographie.

## 🚀 Installation & Lancement

L'application est découpée en deux parties : l'API et l'Interface.

### 1. Démarrer l'API (Backend)
À l'intérieur du dossier `part4-final` :
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Initialiser la base de données spatiale (facultatif si déjà prête)
python seed.py 

# Lancer le serveur
python run.py
```
> L'API tourne par défaut sur `http://localhost:5000` et propose une interface Swagger à sa racine.

### 2. Démarrer l'Interface (Frontend)
Dans un nouveau terminal, depuis le dossier `part4-final/frontend` :
```bash
npm install
npm run dev
```
> Le site vous attendra sur `http://localhost:5173`. Laissez-vous guider !

## 📂 Structure simplifiée

```text
holbertonschool-hbnb/
└── part4-final/
    ├── app/               # Logique Backend (modèles, services de façade, API v1)
    ├── run.py             # Script de démarrage de l'API
    ├── seed.py            # Peuple la BDD avec nos séjours spatiaux
    ├── requirements.txt   # Dépendances Python
    │
    └── frontend/          # Projet Vite / React
        ├── public/images/ # Visuels, vidéos MP4, favicons
        └── src/
            ├── components/# Éléments d'interface (Navbar, Footer, PopularStays...)
            ├── pages/     # Vues principales (Home, PlaceDetail, InfoPage...)
            ├── context/   # État global (AuthContext.jsx)
            └── App.jsx    # Routage principal
```

---
*Projet réalisé dans le cadre du curriculum de Holberton School.* 🌟