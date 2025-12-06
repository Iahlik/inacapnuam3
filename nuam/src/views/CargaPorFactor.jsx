import { useState } from "react";
import Papa from "papaparse";
import {
  existeCalificacion,
  crearCalificacion,
  actualizarCalificacion
} from "../services/CalificacionesService";

import {
  validarFormatoFactor,
  validarSumaFactores
} from "../services/Validadores";

export default function CargaPorFactor() {
  const [archivo, setArchivo] = useState(null);

  function handleFile(e) {
    setArchivo(e.target.files[0]);
  }

  async function procesar() {
    if (!archivo) {
      alert("Seleccione un archivo CSV.");
      return;
    }

    Papa.parse(archivo, {
      header: true,
      dynamicTyping: false,
      complete: async (result) => {
        const registros = result.data;

        for (const reg of registros) {
          // validar formato de factor
          for (let i = 8; i <= 19; i++) {
            const key = `factor${i}`;
            if (reg[key] && !validarFormatoFactor(reg[key])) {
              console.warn(`Factor inválido en fila`, reg);
              continue;
            }
          }

          // validar suma de factores
          if (!validarSumaFactores(reg)) {
            console.warn(`Suma de factores excede 1`, reg);
            continue;
          }

          const existe = await existeCalificacion(reg.rut);

          if (existe) {
            await actualizarCalificacion(reg.rut, reg);
          } else {
            await crearCalificacion(reg);
          }
        }

        alert("Carga masiva de factores completada.");
      }
    });
  }

  return (
    <div>
      <h3>Carga Masiva por Factor</h3>

      <input type="file" accept=".csv" onChange={handleFile} />
      <button onClick={procesar}>Procesar</button>
    </div>
  );
}
