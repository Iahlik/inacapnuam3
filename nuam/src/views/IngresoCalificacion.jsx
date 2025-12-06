import { useState } from "react";
import { crearCalificacion } from "../services/CalificacionesService";

export default function IngresoCalificacion({ onCreated }) {
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    monto: "",
    factor: "",
    fecha: ""
  });

  async function guardar() {
    await crearCalificacion(form);
    setForm({ rut: "", nombre: "", monto: "", factor: "", fecha: "" });

    if (onCreated) onCreated(); // notificar al listado
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ingresar Calificación</h2>

      <input placeholder="RUT" value={form.rut}
        onChange={(e) => setForm({ ...form, rut: e.target.value })} />

      <input placeholder="Nombre" value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })} />

      <input placeholder="Monto" value={form.monto}
        onChange={(e) => setForm({ ...form, monto: e.target.value })} />

      <input placeholder="Factor" value={form.factor}
        onChange={(e) => setForm({ ...form, factor: e.target.value })} />

      <input type="date" value={form.fecha}
        onChange={(e) => setForm({ ...form, fecha: e.target.value })} />

      <button onClick={guardar}>Guardar</button>
    </div>
  );
}
