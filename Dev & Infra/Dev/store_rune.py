import requests
import json
import mysql.connector

# Configuration de la base de données
db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'league_items'
}

# Connexion à la base de données
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Création de la table des runes
cursor.execute("""
    CREATE TABLE IF NOT EXISTS runes (
        id INT PRIMARY KEY,
        icon VARCHAR(255),
        name VARCHAR(255),
        shortDescription TEXT,
        longDescription TEXT
    )
""")

# URL de l'API des runes
url = "https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/runesReforged.json"

response = requests.get(url)
data = response.json()

# Compteur pour les runes insérées
rune_count = 0

# Parcourir les runes dans l'API
for rune_tree in data:
    for slot in rune_tree['slots']:
        for rune in slot['runes']:
            try:
                cursor.execute('''
                INSERT IGNORE INTO runes (
                    id, icon, name, shortDescription, longDescription
                ) VALUES (%s, %s, %s, %s, %s)
                ''', (
                    rune['id'],
                    rune['icon'],
                    rune['name'],
                    rune['shortDesc'],
                    rune['longDesc']
                ))
                rune_count += 1  # Incrémenter le compteur de runes insérées
                print(f"Inserted rune {rune['name']} successfully.")
            except Exception as e:
                print(f"Failed to insert rune {rune['name']}: {e}")

# Sauvegarder les changements et fermer la connexion
conn.commit()
conn.close()

# Afficher le nombre total de runes insérées
print(f'Total runes inserted: {rune_count}')
