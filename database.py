"""
ResumeCraft – SQLite Database Manager
Provides lightweight, zero-configuration persistent storage for resumes.
"""

import sqlite3
import json
import os
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'resumes.db')

def get_db_connection():
    """Establishes and returns a connection to the SQLite database with row dict support."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema if it doesn't already exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            template_id TEXT DEFAULT 'modern',
            theme_color TEXT DEFAULT '#2563eb',
            data_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_resume(title, template_id, theme_color, data_dict, resume_id=None):
    """
    Saves a resume to the database.
    If resume_id is provided, it updates the existing record.
    Otherwise, it creates a new record.
    Returns the saved resume ID.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    data_json = json.dumps(data_dict)
    now = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

    if resume_id:
        cursor.execute('''
            UPDATE resumes
            SET title = ?, template_id = ?, theme_color = ?, data_json = ?, updated_at = ?
            WHERE id = ?
        ''', (title, template_id, theme_color, data_json, now, resume_id))
        conn.commit()
        saved_id = resume_id
    else:
        cursor.execute('''
            INSERT INTO resumes (title, template_id, theme_color, data_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (title, template_id, theme_color, data_json, now, now))
        conn.commit()
        saved_id = cursor.lastrowid

    conn.close()
    return saved_id

def get_all_resumes():
    """Fetches a list of all saved resumes (summary metadata only)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, title, template_id, theme_color, updated_at
        FROM resumes
        ORDER BY updated_at DESC
    ''')
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_resume_by_id(resume_id):
    """Fetches full resume data by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM resumes WHERE id = ?', (resume_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        res = dict(row)
        res['data'] = json.loads(res['data_json'])
        return res
    return None

def delete_resume_by_id(resume_id):
    """Deletes a resume by its ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM resumes WHERE id = ?', (resume_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted
