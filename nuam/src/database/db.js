import initSqlJs from "sql.js";

let db = null;

export async function initDB() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });

  const saved = localStorage.getItem("db_nuam");

  if (saved) {
    const uint8 = Uint8Array.from(JSON.parse(saved));
    db = new SQL.Database(uint8);
  } else {
    db = new SQL.Database();

    // Crear tabla solo una vez (cuando no existe BD previa)
    db.run(`
      CREATE TABLE IF NOT EXISTS calificaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rut TEXT NOT NULL,
        nombre TEXT NOT NULL,
        monto REAL NOT NULL,
        factor REAL,
        fecha TEXT NOT NULL
      );
    `);

    // Guardamos solo al crear la tabla
    saveDB(db);
  }

  return db;
}

// Guarda la base de datos en localStorage
export function saveDB(db) {
  const data = db.export();
  const bytes = Array.from(data);
  localStorage.setItem("db_nuam", JSON.stringify(bytes));
}
