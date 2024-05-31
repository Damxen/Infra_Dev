import requests
from bs4 import BeautifulSoup
import mysql.connector
import json

db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'league_items'
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Création de la table (si nécessaire)
cursor.execute("""
    CREATE TABLE IF NOT EXISTS items (
        id INT PRIMARY KEY,
        name VARCHAR(255),
        description TEXT,
        cost INT,
        tags JSON,
        image VARCHAR(255),
        health INT,
        mana INT,
        armor INT,
        ability_power INT,
        attack_damage INT,
        attack_speed FLOAT,
        percent_armor_penetration FLOAT,
        percent_magic_penetration FLOAT,
        lethality INT,
        critical_strike FLOAT,
        percent_critical_strike_damage FLOAT,
        movement_speed FLOAT,
        percent_movement_speed FLOAT,
        magic_resist INT,
        ability_haste INT,
        percent_life_steal FLOAT,
        health_regen FLOAT,
        mana_regen FLOAT
    )
""")

url = "https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/item.json"

response = requests.get(url)
data = response.json()


items = data.get('data', {})

def extract_text_between_tags(raw_html, tag):
    soup = BeautifulSoup(raw_html, 'html.parser')
    tag_content = soup.find(tag)
    return tag_content.get_text() if tag_content else ''

def extract_combined_text(raw_html):
    soup = BeautifulSoup(raw_html, 'html.parser')
    main_text = soup.find('maintext')
    stats_text = soup.find('stats')
    attention_texts = soup.find_all('attention')

    combined_text = ""
    if main_text:
        combined_text += main_text.get_text() + "\n"
    if stats_text:
        combined_text += stats_text.get_text() + "\n"
    if attention_texts:
        for attention in attention_texts:
            combined_text += attention.get_text() + " "

    return combined_text.strip()

# Fonction pour extraire les statistiques de la description
def extract_stats_from_description(description):
    soup = BeautifulSoup(description, 'html.parser')
    stats = {
        'health': 0,
        'mana': 0,
        'armor': 0,
        'ability_power': 0,
        'attack_damage': 0,
        'attack_speed': 0,
        'percent_armor_penetration': 0,
        'percent_magic_penetration': 0,
        'lethality': 0,
        'critical_strike': 0,
        'percent_critical_strike_damage': 0,
        'movement_speed': 0,
        'percent_movement_speed': 0,
        'magic_resist': 0,
        'ability_haste': 0,
        'percent_life_steal': 0,
        'health_regen': 0,
        'mana_regen': 0
    }

    for attention_tag in soup.find_all('attention'):
        try:
            stat_value = attention_tag.get_text().strip()
            stat_value = float(stat_value.replace('%', ''))
            stat_type = attention_tag.find_next_sibling(string=True).strip().lower()

            if 'health regen' in stat_type:
                stats['health_regen'] = stat_value
            elif 'mana regen' in stat_type:
                stats['mana_regen'] = stat_value
            elif 'health' in stat_type:
                stats['health'] = int(stat_value)
            elif 'mana' in stat_type:
                stats['mana'] = int(stat_value)
            elif 'armor' in stat_type:
                stats['armor'] = int(stat_value)
            elif 'ability power' in stat_type:
                stats['ability_power'] = int(stat_value)
            elif 'attack damage' in stat_type:
                stats['attack_damage'] = int(stat_value)
            elif 'attack speed' in stat_type:
                stats['attack_speed'] = stat_value
            elif 'armor penetration' in stat_type:
                stats['percent_armor_penetration'] = stat_value
            elif 'magic penetration' in stat_type:
                stats['percent_magic_penetration'] = stat_value
            elif 'lethality' in stat_type:
                stats['lethality'] = int(stat_value)
            elif 'critical strike' in stat_type:
                stats['critical_strike'] = stat_value
            elif 'critical strike damage' in stat_type:
                stats['percent_critical_strike_damage'] = stat_value
            elif 'movement speed' in stat_type:
                stats['movement_speed'] = stat_value
            elif 'percent movement speed' in stat_type:
                stats['percent_movement_speed'] = stat_value
            elif 'magic resist' in stat_type:
                stats['magic_resist'] = int(stat_value)
            elif 'ability haste' in stat_type:
                stats['ability_haste'] = int(stat_value)
            elif 'life steal' in stat_type:
                stats['percent_life_steal'] = stat_value
        except ValueError:
            continue

    return stats

# Filtr pour avoir seulement les items du mode 5v5
filtered_items = {item_id: item_info for item_id, item_info in items.items()
                  if item_info.get('maps', {}).get("11", False) and item_info.get('inStore', True)}

# Insertion des items dans la BDD
for item_id, item_info in filtered_items.items():
    description_html = item_info.get('description', '')
    stats = extract_stats_from_description(description_html)

    cursor.execute("""
        INSERT INTO items (id, name, description, cost, tags, image, health, mana, armor, ability_power, attack_damage, attack_speed, percent_armor_penetration, percent_magic_penetration, lethality, critical_strike, percent_critical_strike_damage, movement_speed, percent_movement_speed, magic_resist, ability_haste, percent_life_steal, health_regen, mana_regen)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), cost=VALUES(cost), tags=VALUES(tags), image=VALUES(image), health=VALUES(health), mana=VALUES(mana), armor=VALUES(armor), ability_power=VALUES(ability_power), attack_damage=VALUES(attack_damage), attack_speed=VALUES(attack_speed), percent_armor_penetration=VALUES(percent_armor_penetration), percent_magic_penetration=VALUES(percent_magic_penetration), lethality=VALUES(lethality), critical_strike=VALUES(critical_strike), percent_critical_strike_damage=VALUES(percent_critical_strike_damage), movement_speed=VALUES(movement_speed), percent_movement_speed=VALUES(percent_movement_speed), magic_resist=VALUES(magic_resist), ability_haste=VALUES(ability_haste), percent_life_steal=VALUES(percent_life_steal), health_regen=VALUES(health_regen), mana_regen=VALUES(mana_regen)
    """, (
        int(item_id), item_info.get('name'), item_info.get('description'), item_info.get('gold', {}).get('total'),
        json.dumps(item_info.get('tags', [])), f"https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/{item_info.get('image', {}).get('full')}",
        stats['health'], stats['mana'], stats['armor'], stats['ability_power'], stats['attack_damage'], stats['attack_speed'], stats['percent_armor_penetration'], stats['percent_magic_penetration'], stats['lethality'], stats['critical_strike'], stats['percent_critical_strike_damage'], stats['movement_speed'], stats['percent_movement_speed'], stats['magic_resist'], stats['ability_haste'], stats['percent_life_steal'], stats['health_regen'], stats['mana_regen']
    ))


conn.commit()
cursor.close()
conn.close()
