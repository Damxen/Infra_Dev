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

if __name__ == '__main__':
    app.run(debug=True)
