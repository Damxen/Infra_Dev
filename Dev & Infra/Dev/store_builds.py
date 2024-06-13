#Creation table builds
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
CREATE TABLE IF NOT EXISTS builds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    items JSON NOT NULL,
    runes JSON NOT NULL,
    champion_id INT,
    champion_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
cursor.close()
conn.close()

print("Builds table created successfully.")
