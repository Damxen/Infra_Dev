# RATUS STATS - Documentation

GITHUB : https://github.com/Damxen/Infra_Dev.git

## Introduction

Bienvenue dans le projet Ratus Stats. Ce projet a pour but de fournir une API permettant de gérer les statistiques des champions, des objets, des runes et des builds personnalisés et pouvoir les tester pour les utilisateurs de League of Legends. Les fonctionnalités principales incluent l'inscription et la connexion des utilisateurs, la création et la sauvegarde de builds personnalisés, ainsi que leur visualisation.

## Fonctionnalités

-Authentification utilisateur : Inscription, connexion et gestion de sessions sécurisées via JWT.
-Gestion des builds : Création, récupération et affichage des builds comprenant des objets, des runes et des champions.
-Base de données : Stockage structuré des données des utilisateurs, des builds, des objets, des runes et des champions.
-3 APIs : /champions , /items , /runes .

## Prérequis

- Python 3.x
- MySQL
- Pip
- Xampp (Pour l'hébergement phpMyAdming et serveur Apache2)

### Pip Install Nécéssaires

Éxecuter le fichier "requirements.txt" en utilisant la commande "pip install -r requirements.txt".
Le fichier "requirements.txt" contient les packages suivants :

- pip install Flask
- pip install Flask-CORS
- pip install Flask-JWT-Extended
- pip install mysql-connector-python
- pip install Werkzeug
- pip install requests

## Structure du Projet

Le projet est structuré comme suit :

- api.py : Contient les routes et la logique de l'API.
- store_item.py : Crée la table items et récupére tous les items de l'API de League Of Legends ainsi que leurs statistiques.
- store_champs.py : Crée la table champions et récupére tous les champions de l'API de League Of Legends ainsi que leurs statistiques.
- store_rune.py : Crée la table runes et récupére toutes les runes de l'API de League Of Legends.
- css/ : Contient les fichiers CSS.
- js/ : Contient les fichiers JavaScript.
- store_builds.py : Crée la table builds afin de sauvegarder les builds faits par nos utilisateurs.
- store_users.py : Crée la table users afin de sauvegarder tous les utilisateurs qui s'enregistrent.

## Configuration de la Base de Données


Pour la création des tables il suffit de run les fichiers suivants :

- store_builds.py
- store_champs.py
- store_item.py
- store_rune.py
- store_users.py

Et au préalable avoir créé une database "league_items".

## Développement de l'API

### Initialisation

Le fichier "api.py" est à utiliser pour initialiser l'application Flask et configurer la connexion à la base de données. On utilise mysql.connector pour gérer les connexions à MySQL et jwt pour l'authentification par jeton (token).

### Enregistrement et Authentification des Utilisateurs

Nous utilisons l'enregistrement et l'Authenification des utilisateurs comme un moyen de sauvegarder leurs builds.
Ils peuvent donc se reconnecter après avoir testés leurs builds et le sauvegarder pour le retrouver.
Pour la sécurité de nos utilisateurs on crypte leurs données.

### Sauvegarde et Récupération des Builds

Pour la sauvegarde nous avons implémenté une route /builds avec la méthode POST pour permettre aux utilisateurs de sauvegarder leurs builds. 
Ainsi qu'une route méthode GET pour permettre aux utilisateurs de récupérer leurs builds sauvegardés.

## Contribuer
Les contributions et les reours sont les bienvenues! Si vous souhaitez contribuer à ce projet, veuillez soumettre une pull request ou ouvrir une issue pour discuter des modifications proposées.
