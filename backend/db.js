import path from 'path';
import { fileURLToPath } from 'url';
import { JSONFilePreset } from 'lowdb/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, 'db.json');

// Shape of the database file. lowdb creates db.json automatically the
// first time this runs, right here in the backend folder — no external
// database, no connection string, nothing to install separately.
const defaultData = { posts: [] };

export const db = await JSONFilePreset(dbFile, defaultData);
