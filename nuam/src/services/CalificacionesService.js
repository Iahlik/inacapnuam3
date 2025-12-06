import { initDB, saveDB } from "../database/db";

// ----------------------------------------------
// CREAR
// ----------------------------------------------
export async function crearCalificacion(data) {
  const db = await initDB();

  const stmt = db.prepare(`
    INSERT INTO calificaciones (rut, nombre, monto, factor, fecha)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run([
    data.rut,
    data.nombre,
    parseFloat(data.monto),
    parseFloat(data.factor || 0),
    data.fecha
  ]);

  stmt.free();

  // Guardamos en localStorage
  saveDB(db);
}

// ----------------------------------------------
// OBTENER LISTADO
// ----------------------------------------------
export async function obtenerCalificaciones() {
  const db = await initDB();

  const res = db.exec(`SELECT * FROM calificaciones ORDER BY id DESC`);

  if (!res[0]) return [];

  const rows = res[0].values;

  return rows.map(row => ({
    id: row[0],
    rut: row[1],
    nombre: row[2],
    monto: row[3],
    factor: row[4],
    fecha: row[5]
  }));
}

// ----------------------------------------------
// ELIMINAR
// ----------------------------------------------
export async function eliminarCalificacion(id) {
  const db = await initDB();

  db.run(`DELETE FROM calificaciones WHERE id = ${id}`);

  // Persistimos cambio
  saveDB(db);
}

// ----------------------------------------------
// ACTUALIZAR
// ----------------------------------------------
export async function actualizarCalificacion(id, data) {
  const db = await initDB();

  const stmt = db.prepare(`
    UPDATE calificaciones
    SET rut = ?, nombre = ?, monto = ?, factor = ?, fecha = ?
    WHERE id = ?
  `);

  stmt.run([
    data.rut,
    data.nombre,
    parseFloat(data.monto),
    parseFloat(data.factor || 0),
    data.fecha,
    id
  ]);

  stmt.free();

  // Persistimos cambio
  saveDB(db);
}
