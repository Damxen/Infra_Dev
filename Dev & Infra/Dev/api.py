from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import json

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = mysql.connector.connect(
        user='root',
        password='',
        host='localhost',
        database='league_items'
    )
    return conn

@app.route('/items', methods=['GET'])
def get_items():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM items;")
    items = cur.fetchall()
    cur.close()
    conn.close()

    items_list = []
    for item in items:
        items_list.append({
            'id': item[0],
            'name': item[1],
            'description': item[2],
            'cost': item[3],
            'tags': json.loads(item[4]),
            'image': item[5],
            'health': item[6],
            'mana': item[7],
            'armor': item[8],
            'ability_power': item[9],
            'attack_damage': item[10],
            'attack_speed': item[11],
            'percent_armor_penetration': item[12],
            'percent_magic_penetration': item[13],
            'lethality': item[14],
            'critical_strike': item[15],
            'percent_critical_strike_damage': item[16],
            'movement_speed': item[17],
            'percent_movement_speed': item[18],
            'magic_resist': item[19],
            'ability_haste': item[20],
            'percent_life_steal': item[21]
        })

    return jsonify(items_list)

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item_stats(item_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT health, mana, armor, ability_power, attack_damage, attack_speed, percent_armor_penetration, percent_magic_penetration, lethality, critical_strike, percent_critical_strike_damage, movement_speed, percent_movement_speed, magic_resist, ability_haste, percent_life_steal FROM items WHERE id = %s;", (item_id,))
    item = cur.fetchone()
    cur.close()
    conn.close()

    if item:
        print(f"Fetched item: {item}")  # Débogage: afficher le contenu de `item`
        item_stats = {
            'health': item[0],
            'mana': item[1],
            'armor': item[2],
            'ability_power': item[3],
            'attack_damage': item[4],
            'attack_speed': item[5],
            'percent_armor_penetration': item[6],
            'percent_magic_penetration': item[7],
            'lethality': item[8],
            'critical_strike': item[9],
            'percent_critical_strike_damage': item[10],
            'movement_speed': item[11],
            'percent_movement_speed': item[12],
            'magic_resist': item[13],
            'ability_haste': item[14],
            'percent_life_steal': item[15]
        }
        return jsonify(item_stats)
    else:
        return jsonify({'error': 'Item not found'}), 404


@app.route('/champions', methods=['GET'])
def get_champions():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM champions;")
    champions = cur.fetchall()
    cur.close()
    conn.close()

    champions_list = []
    for champion in champions:
        champions_list.append({
            'id': champion[0],
            'name': champion[1],
            'title': champion[2],
            'description': champion[3],
            'tags': champion[4].split(','),
            'image': f"http://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/{champion[5]}",  # URL complète pour l'image du champion
            'health': champion[6],
            'hpperlevel': champion[7],
            'mana': champion[8],
            'manaperlevel': champion[9],
            'armor': champion[10],
            'armorperlevel': champion[11],
            'attack_damage': champion[12],
            'attack_damage_perlevel': champion[13],
            'attack_speed': champion[14],
            'attack_speed_perlevel': champion[15],
            'movement_speed': champion[16],
            'magic_resist': champion[17],
            'magic_resist_perlevel': champion[18],
            'hp_regen': champion[19],
            'hp_regen_perlevel': champion[20],
            'mana_regen': champion[21],
            'mana_regen_perlevel': champion[22]
        })

    return jsonify(champions_list)

@app.route('/runes', methods=['GET'])
def get_runes():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM runes;")
    runes = cur.fetchall()
    cur.close()
    conn.close()

    runes_list = []
    for rune in runes:
        runes_list.append({
            'id': rune[0],
            'icon': f"http://ddragon.leagueoflegends.com/cdn/img/{rune[1]}",  # URL complète pour l'icône de la rune
            'name': rune[2],
            'shortDescription': rune[3],
            'longDescription': rune[4]
        })

    return jsonify(runes_list)

if __name__ == '__main__':
    app.run(debug=True)
