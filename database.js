const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./car_management.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    db.serialize(() => {
      // Create CARS table
      db.run(`CREATE TABLE IF NOT EXISTS CARS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ano INTEGER,
        chassi TEXT,
        marca TEXT,
        modelo TEXT,
        placa TEXT,
        renavam TEXT
      )`);

      // Create BRANDS table
      db.run(`CREATE TABLE IF NOT EXISTS BRANDS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marca TEXT
      )`);

      // Create MODELS table
      db.run(`CREATE TABLE IF NOT EXISTS MODELS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idmarca INTEGER,
        modelo TEXT,
        FOREIGN KEY(idmarca) REFERENCES BRANDS(id)
      )`);
    });
  }
});

module.exports = db;
