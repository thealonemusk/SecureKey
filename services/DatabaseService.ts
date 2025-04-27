import * as SQLite from 'expo-sqlite';

interface Password {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  note: string;
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private dbInitPromise: Promise<void>;

  constructor() {
    this.dbInitPromise = this.initialize();
  }

  private async initialize() {
    try {
      this.db = await SQLite.openDatabaseAsync('myapp.db');
      await this.initDatabase();
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  private async initDatabase() {
    if (!this.db) return;
    
    try {
      // execAsync SQL
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS passwords (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          email TEXT,
          note TEXT,
          createdAt TEXT NOT NULL
        );
      `);
    } catch (error) {
      console.error('Database table creation failed:', error);
    }
  }

  private async ensureDb() {
    await this.dbInitPromise;
    if (!this.db) {
      throw new Error('The database is not initialized');
    }
    return this.db;
  }

  async addPassword(password: Omit<Password, 'id' | 'createdAt'>): Promise<number> {
    const db = await this.ensureDb();
    const createdAt = new Date().toISOString();

    try {
      const result = await db.runAsync(
        `INSERT INTO passwords (name, username, password, email, note, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [password.name, password.username, password.password, password.email || '', password.note || '', createdAt]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Failed to add password:', error);
      throw error;
    }
  }

  async getAllPasswords(): Promise<Password[]> {
    const db = await this.ensureDb();
    
    try {
      return await db.getAllAsync<Password>(
        'SELECT * FROM passwords ORDER BY createdAt ASC'
      );
    } catch (error) {
      console.error('Failed to get the password list:', error);
      throw error;
    }
  }

  async searchPasswords(query: string): Promise<Password[]> {
    const db = await this.ensureDb();
    
    try {
      return await db.getAllAsync<Password>(
        'SELECT * FROM passwords WHERE name LIKE ? ORDER BY createdAt ASC',
        [`%${query}%`]
      );
    } catch (error) {
      console.error('Password search failed:', error);
      throw error;
    }
  }

  async deletePassword(id: number): Promise<void> {
    const db = await this.ensureDb();
    
    try {
      await db.runAsync(
        'DELETE FROM passwords WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Failed to delete password:', error);
      throw error;
    }
  }

  async updatePassword(id: number, password: Omit<Password, 'id' | 'createdAt'>): Promise<void> {
    const db = await this.ensureDb();
    
    try {
      await db.runAsync(
        `UPDATE passwords 
         SET name = ?, username = ?, password = ?, email = ?, note = ?
         WHERE id = ?`,
        [password.name, password.username, password.password, password.email || '', password.note || '', id]
      );
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
export type { Password }; 