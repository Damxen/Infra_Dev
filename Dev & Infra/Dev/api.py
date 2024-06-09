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
            'percent_life_steal': item[21],
            'health_regen': item[22],
            'mana_regen': item[23]
        })

    return jsonify(items_list)

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item_stats(item_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT health, mana, armor, ability_power, attack_damage, attack_speed, percent_armor_penetration, percent_magic_penetration, lethality, critical_strike, percent_critical_strike_damage, movement_speed, percent_movement_speed, magic_resist, ability_haste, percent_life_steal, health_regen, mana_regen FROM items WHERE id = %s;", (item_id,))
    item = cur.fetchone()
    cur.close()
    conn.close()

    if item:
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
            'percent_life_steal': item[15],
            'health_regen': item[16],
            'mana_regen': item[17]
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
            'hp': champion[6],
            'hp_perlevel': champion[7],
            'mana': champion[8],
            'mana_perlevel': champion[9],
            'armor': champion[10],
            'armor_perlevel': champion[11],
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

@app.route('/champions/<int:champion_id>', methods=['GET'])
def get_champion_stats(champion_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT name, title, description, tags, image, hp, hp_perlevel, mana, mana_perlevel, armor, armor_perlevel, attack_damage, attack_damage_perlevel, attack_speed, attack_speed_perlevel, movement_speed, magic_resist, magic_resist_perlevel, hp_regen, hp_regen_perlevel, mana_regen, mana_regen_perlevel FROM champions WHERE id = %s;", (champion_id,))
    champion = cur.fetchone()
    cur.close()
    conn.close()

    if champion:
        champion_stats = {
            'name': champion[0],
            'title': champion[1],
            'description': champion[2],
            'tags': champion[3].split(','),
            'image': f"http://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/{champion[4]}",
            'hp': champion[5],
            'hp_perlevel': champion[6],
            'mana': champion[7],
            'mana_perlevel': champion[8],
            'armor': champion[9],
            'armor_perlevel': champion[10],
            'attack_damage': champion[11],
            'attack_damage_perlevel': champion[12],
            'attack_speed': champion[13],
            'attack_speed_perlevel': champion[14],
            'movement_speed': champion[15],
            'magic_resist': champion[16],
            'magic_resist_perlevel': champion[17],
            'hp_regen': champion[18],
            'hp_regen_perlevel': champion[19],
            'mana_regen': champion[20],
            'mana_regen_perlevel': champion[21]
        }
        return jsonify(champion_stats)
    else:
        return jsonify({'error': 'Champion not found'}), 404

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
