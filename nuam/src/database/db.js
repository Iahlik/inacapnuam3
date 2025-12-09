import initSqlJs from "sql.js";

let db = null;

export async function initDB() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const saved = localStorage.getItem("db_nuam");

  if (saved) {
    const uint8 = Uint8Array.from(JSON.parse(saved));
    db = new SQL.Database(uint8);
  } else {
    db = new SQL.Database();

    // ===============================
    // CREACIÓN DE TABLAS POR PRIMERA VEZ
    // ===============================
    db.run(`
      CREATE TABLE IF NOT EXISTS calificaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rut TEXT NOT NULL,
        nombre TEXT NOT NULL,
        monto REAL NOT NULL,
        fecha TEXT NOT NULL,
        tipoSociedad TEXT,
        mercado TEXT,

        factor8 REAL DEFAULT 0,
        factor9 REAL DEFAULT 0,
        factor10 REAL DEFAULT 0,
        factor11 REAL DEFAULT 0,
        factor12 REAL DEFAULT 0,
        factor13 REAL DEFAULT 0,
        factor14 REAL DEFAULT 0,
        factor15 REAL DEFAULT 0,
        factor16 REAL DEFAULT 0,
        factor17 REAL DEFAULT 0,
        factor18 REAL DEFAULT 0,
        factor19 REAL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS informacion_externa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        ejercicio TEXT,
        instrumento TEXT,
        fechaPago TEXT,
        descripcionDividendo TEXT,
        secuenciaEvento TEXT,
        acogidoIsfut TEXT,
        origen TEXT,
        factorActualizacion REAL,

        factor8 REAL DEFAULT 0,
        factor9 REAL DEFAULT 0,
        factor10 REAL DEFAULT 0,
        factor11 REAL DEFAULT 0,
        factor12 REAL DEFAULT 0,
        factor13 REAL DEFAULT 0,
        factor14 REAL DEFAULT 0,
        factor15 REAL DEFAULT 0,
        factor16 REAL DEFAULT 0,
        factor17 REAL DEFAULT 0,
        factor18 REAL DEFAULT 0,
        factor19 REAL DEFAULT 0,
        factor20 REAL DEFAULT 0,
        factor21 REAL DEFAULT 0,
        factor22 REAL DEFAULT 0,
        factor23 REAL DEFAULT 0,
        factor24 REAL DEFAULT 0,
        factor25 REAL DEFAULT 0,
        factor26 REAL DEFAULT 0,
        factor27 REAL DEFAULT 0,
        factor28 REAL DEFAULT 0,
        factor29 REAL DEFAULT 0,
        factor30 REAL DEFAULT 0,
        factor31 REAL DEFAULT 0,
        factor32 REAL DEFAULT 0,
        factor33 REAL DEFAULT 0,
        factor34 REAL DEFAULT 0,
        factor35 REAL DEFAULT 0,
        factor36 REAL DEFAULT 0,
        factor37 REAL DEFAULT 0
      );
    `);

    // Guardamos BD inicial
    saveDB(db);
  }

  return db;
}

// ===============================
// GUARDAR LA BD EN LOCAL STORAGE
// ===============================
export function saveDB(db) {
  const data = db.export();
  const bytes = Array.from(data);
  localStorage.setItem("db_nuam", JSON.stringify(bytes));
}
