import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface Password {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  note: string;
  url: string;
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private dbInitPromise: Promise<void>;
  private isWeb: boolean;

  constructor() {
    this.isWeb = Platform.OS === 'web';
    this.dbInitPromise = this.initialize();
  }

  private async initialize() {
    if (this.isWeb) {
      // For web, we'll use AsyncStorage
      return;
    }
    
    try {
      this.db = await SQLite.openDatabaseAsync('myapp.db');
      await this.initDatabase();
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  private async initDatabase() {
    if (this.isWeb || !this.db) return;
    
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
          url TEXT,
          createdAt TEXT NOT NULL
        );
      `);
    } catch (error) {
      console.error('Database table creation failed:', error);
    }
  }

  private async ensureDb() {
    if (this.isWeb) {
      return null;
    }
    
    await this.dbInitPromise;
    if (!this.db) {
      throw new Error('The database is not initialized');
    }
    return this.db;
  }

  // Web storage helpers
  private async getWebPasswords(): Promise<Password[]> {
    try {
      const passwordsJson = await AsyncStorage.getItem('passwords');
      return passwordsJson ? JSON.parse(passwordsJson) : [];
    } catch (error) {
      console.error('Failed to get passwords from AsyncStorage:', error);
      return [];
    }
  }

  private async saveWebPasswords(passwords: Password[]): Promise<void> {
    try {
      await AsyncStorage.setItem('passwords', JSON.stringify(passwords));
    } catch (error) {
      console.error('Failed to save passwords to AsyncStorage:', error);
    }
  }

  async addPassword(password: Omit<Password, 'id' | 'createdAt'>): Promise<number> {
    if (this.isWeb) {
      const passwords = await this.getWebPasswords();
      const newId = passwords.length > 0 ? Math.max(...passwords.map(p => p.id)) + 1 : 1;
      const newPassword: Password = {
        ...password,
        id: newId,
        createdAt: new Date().toISOString()
      };
      await this.saveWebPasswords([...passwords, newPassword]);
      return newId;
    }
    
    const db = await this.ensureDb();
    if (!db) throw new Error('Database not available');
    
    const createdAt = new Date().toISOString();

    try {
      const result = await db.runAsync(
        `INSERT INTO passwords (name, username, password, email, note, url, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [password.name, password.username, password.password, password.email || '', password.note || '', password.url || '', createdAt]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Failed to add password:', error);
      throw error;
    }
  }

  async getAllPasswords(): Promise<Password[]> {
    if (this.isWeb) {
      return this.getWebPasswords();
    }
    
    const db = await this.ensureDb();
    if (!db) throw new Error('Database not available');
    
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
    if (this.isWeb) {
      const passwords = await this.getWebPasswords();
      const searchQuery = query.toLowerCase();
      return passwords.filter(password => 
        password.name.toLowerCase().includes(searchQuery)
      );
    }
    
    const db = await this.ensureDb();
    if (!db) throw new Error('Database not available');
    
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
    if (this.isWeb) {
      const passwords = await this.getWebPasswords();
      const filteredPasswords = passwords.filter(p => p.id !== id);
      await this.saveWebPasswords(filteredPasswords);
      return;
    }
    
    const db = await this.ensureDb();
    if (!db) throw new Error('Database not available');
    
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
    if (this.isWeb) {
      const passwords = await this.getWebPasswords();
      const updatedPasswords = passwords.map(p => 
        p.id === id ? { ...p, ...password } : p
      );
      await this.saveWebPasswords(updatedPasswords);
      return;
    }
    
    const db = await this.ensureDb();
    if (!db) throw new Error('Database not available');
    
    try {
      await db.runAsync(
        `UPDATE passwords 
         SET name = ?, username = ?, password = ?, email = ?, note = ?, url = ?
         WHERE id = ?`,
        [password.name, password.username, password.password, password.email || '', password.note || '', password.url || '', id]
      );
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
export type { Password }; 