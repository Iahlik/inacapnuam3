import { useState, useEffect } from "react";
import { actualizarCalificacion, obtenerCalificaciones } from "../services/CalificacionesService";

export default function ModificarCalificacion({ id, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    monto: "",
    factor: "",
    fecha: ""
  });

  // Cargar datos del registro a editar
  useEffect(() => {
    async function cargar() {
      const lista = await obtenerCalificaciones();
      const actual = lista.find(x => x.id === id);

      if (actual) {
        const { rut, nombre, monto, factor, fecha } = actual;

        setForm({
          rut,
          nombre,
          monto: String(monto),
          factor: String(factor ?? ""),
          fecha
        });
      }
    }
    cargar();
  }, [id]);

  async function guardarCambios() {
    await actualizarCalificacion(id, {
      rut: form.rut,
      nombre: form.nombre,
      monto: parseFloat(form.monto),
      factor: parseFloat(form.factor || 0),
      fecha: form.fecha
    });

    if (onUpdated) onUpdated();
  }

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #aaa" }}>
      <h3>Modificar Calificación</h3>

      <input
        placeholder="RUT"
        value={form.rut}
        onChange={e => setForm({ ...form, rut: e.target.value })}
      />

      <input
        placeholder="Nombre"
        value={form.nombre}
        onChange={e => setForm({ ...form, nombre: e.target.value })}
      />

      <input
        placeholder="Monto"
        value={form.monto}
        onChange={e => setForm({ ...form, monto: e.target.value })}
      />

      <input
        placeholder="Factor"
        value={form.factor}
        onChange={e => setForm({ ...form, factor: e.target.value })}
      />

      <input
        type="date"
        value={form.fecha}
        onChange={e => setForm({ ...form, fecha: e.target.value })}
      />

      <button onClick={guardarCambios}>Guardar Cambios</button>
      <button onClick={onCancel} style={{ marginLeft: "10px" }}>
        Cancelar
      </button>
    </div>
  );
}
