import sqlite3
import json
import os
from typing import Dict, Any

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'eco_vivah.db')

def get_connection() -> sqlite3.Connection:
    """
    Returns a connection to the SQLite database, ensuring the directory exists.
    
    Returns:
        sqlite3.Connection: The database connection object.
    """
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    return sqlite3.connect(DB_PATH)

def init_db() -> None:
    """
    Initializes the SQLite database with 'weddings' and 'recommendations' tables
    if they do not already exist.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Create weddings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS weddings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                num_guests INTEGER NOT NULL,
                duration_days INTEGER NOT NULL,
                sub_events TEXT NOT NULL,
                budget_inr REAL NOT NULL,
                cultural_preferences TEXT,
                venue_location TEXT NOT NULL,
                user_id TEXT DEFAULT 'anonymous',
                vendor_options TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create recommendations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recommendations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                wedding_id INTEGER NOT NULL,
                food_quantity_kg REAL,
                waste_reduction_tips TEXT,
                vendor_suggestions TEXT,
                carbon_estimate_kg REAL,
                sustainability_score REAL,
                sdg_tags TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (wedding_id) REFERENCES weddings(id)
            )
        ''')
        
        conn.commit()

def save_wedding(data: Dict[str, Any]) -> int:
    """
    Inserts a new wedding record into the 'weddings' table.
    
    Args:
        data (dict): A dictionary containing wedding details.
        
    Returns:
        int: The auto-generated ID of the inserted wedding record.
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Serialize lists/dicts to JSON strings
        sub_events = json.dumps(data.get('sub_events', []))
        cultural_preferences = json.dumps(data.get('cultural_preferences', []))
        vendor_options = json.dumps(data.get('vendor_options', []))
        
        cursor.execute('''
            INSERT INTO weddings (
                num_guests, duration_days, sub_events, budget_inr,
                cultural_preferences, venue_location, vendor_options, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['num_guests'], data['duration_days'],
            json.dumps(data['sub_events']), data['budget_inr'],
            json.dumps(data['cultural_preferences']), data['venue_location'],
            json.dumps(data['vendor_options']),
            data.get('user_id', 'anonymous')
        ))
        
        conn.commit()
        return cursor.lastrowid

def get_wedding(wedding_id: int) -> Dict[str, Any]:
    """
    Retrieves a wedding record by its ID.
    
    Args:
        wedding_id (int): The ID of the wedding to retrieve.
        
    Returns:
        dict: A dictionary containing the wedding details, with JSON fields parsed back to lists/dicts.
              Returns an empty dict if the wedding is not found.
    """
    with get_connection() as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM weddings WHERE id = ?', (wedding_id,))
        row = cursor.fetchone()
        
        if not row:
            return {}
            
        result = dict(row)
        
        # Deserialize JSON fields
        if result.get('sub_events'):
            result['sub_events'] = json.loads(result['sub_events'])
        if result.get('cultural_preferences'):
            result['cultural_preferences'] = json.loads(result['cultural_preferences'])
        if result.get('vendor_options'):
            result['vendor_options'] = json.loads(result['vendor_options'])
            
        return result
