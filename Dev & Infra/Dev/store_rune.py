#Creation table runes

import requests
import json
import mysql.connector

db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'league_items'
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS runes (
        id INT PRIMARY KEY,
        icon VARCHAR(255),
        name VARCHAR(255),
        shortDescription TEXT,
        longDescription TEXT
    )
""")

url = "https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/runesReforged.json"

response = requests.get(url)
data = response.json()

rune_count = 0

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
                rune_count += 1  
                print(f"Inserted rune {rune['name']} successfully.")
            except Exception as e:
                print(f"Failed to insert rune {rune['name']}: {e}")

conn.commit()
conn.close()

print(f'Total runes inserted: {rune_count}')
