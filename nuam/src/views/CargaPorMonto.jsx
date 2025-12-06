import { useState } from "react";
import Papa from "papaparse";

import {
  existeCalificacion,
  crearCalificacion,
  actualizarCalificacion,
  obtenerCalificaciones
} from "../services/CalificacionesService";

export default function CargaPorMonto() {
  const [archivo, setArchivo] = useState(null);

  function handleFile(e) {
    setArchivo(e.target.files[0]);
  }

  async function procesar() {
    if (!archivo) {
      alert("Seleccione un archivo CSV primero.");
      return;
    }

    Papa.parse(archivo, {
      header: true,
      skipEmptyLines: true,
      complete: async (resultado) => {
        const filas = resultado.data;

        let procesados = 0;
        let errores = 0;

        for (const fila of filas) {
          const rut = fila.rut?.trim();
          const monto = fila.monto?.trim();

          // Validación RUT
          if (!rut) {
            console.warn("Fila ignorada: RUT vacío", fila);
            errores++;
            continue;
          }

          // Validación de monto
          const montoNum = Number(monto);
          if (isNaN(montoNum)) {
            console.warn("Monto inválido en fila:", fila);
            errores++;
            continue;
          }

          const existe = await existeCalificacion(rut);

          if (existe) {
            // Obtener registro actual para no perder otros campos
            const todos = await obtenerCalificaciones();
            const actual = todos.find(x => x.rut === rut);

            await actualizarCalificacion(rut, {
              ...actual,
              monto: montoNum
            });
          } else {
            // Crear registro mínimo
            await crearCalificacion({
              rut,
              nombre: fila.nombre || "Sin nombre",
              monto: montoNum,
              fecha: fila.fecha || "01-01-2025",
              factor: 0
            });
          }

          procesados++;
        }

        alert(`Carga de montos completada.
Procesados: ${procesados}
Errores: ${errores}`);
      }
    });
  }

  return (
    <div>
      <h3>Carga Masiva de Montos</h3>

      <input type="file" accept=".csv" onChange={handleFile} />
      <button onClick={procesar}>Procesar CSV</button>
    </div>
  );
}
