import requests
import json
import mysql.connector

db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'league_items'
}

# Connexion à la base de données
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Création de la table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS champions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        title TEXT,
        description TEXT,
        tags VARCHAR(255),
        image VARCHAR(255),
        hp FLOAT,
        hpperlevel FLOAT,
        mana FLOAT,
        manaperlevel FLOAT,
        armor FLOAT,
        armorperlevel FLOAT,
        attack_damage FLOAT,
        attack_damage_perlevel FLOAT,
        attack_speed FLOAT,
        attack_speed_perlevel FLOAT,
        movement_speed FLOAT,
        magic_resist FLOAT,
        magic_resist_perlevel FLOAT,
        hp_regen FLOAT,
        hp_regen_perlevel FLOAT,
        mana_regen FLOAT,
        mana_regen_perlevel FLOAT
    )
""")

url = "https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/champion.json"

response = requests.get(url)
data = response.json()

# Compteur pour les champions insérés
champion_count = 0

for champ_id, champ_data in data['data'].items():
    stats = champ_data['stats']
    tags = ','.join(champ_data['tags'])  # Convertir la liste de tags en chaîne de caractères
    image = champ_data['image']['full']  # Récupérer le nom de l'image

    try:
        cursor.execute('''
        INSERT IGNORE INTO champions (
            id, name, title, description, tags, image,
            hp, hpperlevel, mana, manaperlevel, armor, armorperlevel,
            attack_damage, attack_damage_perlevel, attack_speed, attack_speed_perlevel,
            movement_speed, magic_resist, magic_resist_perlevel,
            hp_regen, hp_regen_perlevel, mana_regen, mana_regen_perlevel
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            champ_data['id'],
            champ_data['name'],
            champ_data['title'],
            champ_data['blurb'],
            tags,
            image,
            stats['hp'],
            stats['hpperlevel'],
            stats['mp'],
            stats['mpperlevel'],
            stats['armor'],
            stats['armorperlevel'],
            stats['attackdamage'],
            stats['attackdamageperlevel'],
            stats['attackspeed'],
            stats['attackspeedperlevel'],
            stats['movespeed'],
            stats['spellblock'],
            stats['spellblockperlevel'],
            stats['hpregen'],
            stats['hpregenperlevel'],
            stats['mpregen'],
            stats['mpregenperlevel']
        ))
        champion_count += 1  # Incrémenter le compteur de champions insérés
        print(f"Inserted {champ_data['name']} successfully.")
    except Exception as e:
        print(f"Failed to insert {champ_data['name']}: {e}")

# Sauvegarder les changements et fermer la connexion
conn.commit()
conn.close()

# Afficher le nombre total de champions insérés
print(f'Total champions inserted: {champion_count}')
