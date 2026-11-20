import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import world from "world-atlas/countries-110m.json";
import "./App.css";

// Datos sintéticos para practicar. No representan cifras oficiales.
const datos = [
  { pais: "Finlandia", continente: "Europa", codigo: 246, edicion: 2023, felicidad: 7.8, pib: 54000 },
  { pais: "Dinamarca", continente: "Europa", codigo: 208, edicion: 2023, felicidad: 7.6, pib: 62000 },
  { pais: "México", continente: "América", codigo: 484, edicion: 2023, felicidad: 6.3, pib: 19000 },
  { pais: "Estados Unidos", continente: "América", codigo: 840, edicion: 2023, felicidad: 6.9, pib: 76000 },
  { pais: "Japón", continente: "Asia", codigo: 392, edicion: 2023, felicidad: 6.1, pib: 42000 },
  { pais: "Brasil", continente: "América", codigo: 76, edicion: 2023, felicidad: 6.2, pib: 15000 },
  { pais: "Sudáfrica", continente: "África", codigo: 710, edicion: 2023, felicidad: 5.3, pib: 13000 },
  { pais: "Australia", continente: "Oceanía", codigo: 36, edicion: 2023, felicidad: 7.1, pib: 65000 },

  { pais: "Finlandia", continente: "Europa", codigo: 246, edicion: 2024, felicidad: 7.7, pib: 56000 },
  { pais: "Dinamarca", continente: "Europa", codigo: 208, edicion: 2024, felicidad: 7.5, pib: 64000 },
  { pais: "México", continente: "América", codigo: 484, edicion: 2024, felicidad: 6.4, pib: 21000 },
  { pais: "Estados Unidos", continente: "América", codigo: 840, edicion: 2024, felicidad: 6.8, pib: 79000 },
  { pais: "Japón", continente: "Asia", codigo: 392, edicion: 2024, felicidad: 6.2, pib: 44000 },
  { pais: "Brasil", continente: "América", codigo: 76, edicion: 2024, felicidad: 6.4, pib: 16000 },
  { pais: "Sudáfrica", continente: "África", codigo: 710, edicion: 2024, felicidad: 5.4, pib: 14000 },
  { pais: "Australia", continente: "Oceanía", codigo: 36, edicion: 2024, felicidad: 7.2, pib: 68000 },
];

const continentes = ["África", "América", "Asia", "Europa", "Oceanía"];

function promedio(registros) {
  if (!registros.length) return null;

  return (
    registros.reduce((suma, registro) => suma + registro.felicidad, 0) /
    registros.length
  );
}

function MapaMundial({ registros }) {
  const registrosPorCodigo = new Map(
    registros.map((registro) => [String(registro.codigo), registro])
  );

  function colorDelPais(registro) {
    if (!registro) return "#e8edf1";
    if (registro.felicidad >= 7.5) return "#16324F";
    if (registro.felicidad >= 7) return "#22A6A1";
    if (registro.felicidad >= 6.5) return "#69B7D6";
    if (registro.felicidad >= 6) return "#A9D9E9";
    return "#F2B84B";
  }

  return (
    <div>
      <ComposableMap
        projection="geoEqualEarth"
        width={900}
        height={390}
        style={{ width: "100%", height: "300px" }}
      >
        <Geographies geography={world}>
          {({ geographies }) =>
            geographies.map((geografia) => {
              const registro = registrosPorCodigo.get(String(geografia.id));

              return (
                <Geography
                  key={geografia.rsmKey}
                  geography={geografia}
                  fill={colorDelPais(registro)}
                  stroke="#ffffff"
                  strokeWidth={0.6}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#22A6A1" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="leyenda-mapa">
        <span><i style={{ background: "#16324F" }} /> 7.5 o más</span>
        <span><i style={{ background: "#22A6A1" }} /> 7.0–7.4</span>
        <span><i style={{ background: "#69B7D6" }} /> 6.5–6.9</span>
        <span><i style={{ background: "#A9D9E9" }} /> 6.0–6.4</span>
        <span><i style={{ background: "#F2B84B" }} /> Menos de 6.0</span>
        <span><i style={{ background: "#e8edf1" }} /> Sin dato</span>
      </div>
    </div>
  );
}

function App() {
  const [edicion, setEdicion] = useState("Todas");
  const [continente, setContinente] = useState("Todos");
  const [pais, setPais] = useState("Todos");

  const ediciones = [...new Set(datos.map((registro) => registro.edicion))].sort(
    (a, b) => a - b
  );

  const edicionActual =
    edicion === "Todas" ? ediciones[ediciones.length - 1] : Number(edicion);

  const paisesDisponibles = [
    ...new Set(
      datos
        .filter(
          (registro) =>
            continente === "Todos" || registro.continente === continente
        )
        .map((registro) => registro.pais)
    ),
  ].sort();

  const seleccion = datos.filter(
    (registro) =>
      registro.edicion === edicionActual &&
      (continente === "Todos" || registro.continente === continente) &&
      (pais === "Todos" || registro.pais === pais)
  );

  const ordenados = [...seleccion].sort(
    (a, b) => b.felicidad - a.felicidad
  );

  const mejores = ordenados.slice(0, 4);
  const menores = ordenados
    .slice(-4)
    .reverse()
    .filter((registro) => !mejores.includes(registro));
  const ranking = [...mejores, ...menores];

  const promedioActual = promedio(seleccion);
  const mayor = ordenados[0];
  const menor = ordenados[ordenados.length - 1];

  const pares = seleccion.filter(
    (registro) =>
      Number.isFinite(registro.pib) && Number.isFinite(registro.felicidad)
  );

  let correlacion = null;

  if (pares.length >= 3) {
    const mediaPib =
      pares.reduce((suma, registro) => suma + registro.pib, 0) / pares.length;
    const mediaFelicidad =
      pares.reduce((suma, registro) => suma + registro.felicidad, 0) /
      pares.length;

    const numerador = pares.reduce(
      (suma, registro) =>
        suma +
        (registro.pib - mediaPib) *
          (registro.felicidad - mediaFelicidad),
      0
    );

    const desviacionPib = Math.sqrt(
      pares.reduce(
        (suma, registro) => suma + (registro.pib - mediaPib) ** 2,
        0
      )
    );

    const desviacionFelicidad = Math.sqrt(
      pares.reduce(
        (suma, registro) =>
          suma + (registro.felicidad - mediaFelicidad) ** 2,
        0
      )
    );

    if (desviacionPib && desviacionFelicidad) {
      correlacion = numerador / (desviacionPib * desviacionFelicidad);
    }
  }

  const promediosContinente = continentes
    .map((nombre) => {
      const registros = seleccion.filter(
        (registro) => registro.continente === nombre
      );

      return { continente: nombre, promedio: promedio(registros) };
    })
    .filter((registro) => registro.promedio !== null);

  const tendencia = ediciones.map((anio) => {
    const fila = { edicion: anio };

    continentes.forEach((nombre) => {
      const registros = datos.filter(
        (registro) =>
          registro.edicion === anio &&
          registro.continente === nombre &&
          (continente === "Todos" || registro.continente === continente) &&
          (pais === "Todos" || registro.pais === pais)
      );

      fila[nombre] = promedio(registros);
    });

    return fila;
  });

  const edicionAnterior = ediciones[ediciones.length - 2];

  const registrosAnteriores = datos.filter(
    (registro) =>
      registro.edicion === edicionAnterior &&
      (continente === "Todos" || registro.continente === continente) &&
      (pais === "Todos" || registro.pais === pais)
  );

  const promedioAnterior = promedio(registrosAnteriores);

  const cambio =
    promedioActual !== null && promedioAnterior !== null
      ? promedioActual - promedioAnterior
      : null;

  return (
    <main className="dashboard">
      <header className="encabezado">
        <div>
          <p className="etiqueta">DASHBOARD INTERACTIVO</p>
          <h1>El pulso de la felicidad mundial</h1>
          <p>
            Comparación entre países y ediciones, y su relación con el PIB per
            cápita
          </p>
        </div>

        <div className="filtros">
          <label>
            Edición
            <select
              value={edicion}
              onChange={(evento) => setEdicion(evento.target.value)}
            >
              <option>Todas</option>
              {ediciones.map((anio) => (
                <option key={anio}>{anio}</option>
              ))}
            </select>
          </label>

          <label>
            Continente
            <select
              value={continente}
              onChange={(evento) => {
                setContinente(evento.target.value);
                setPais("Todos");
              }}
            >
              <option>Todos</option>
              {continentes.map((nombre) => (
                <option key={nombre}>{nombre}</option>
              ))}
            </select>
          </label>

          <label>
            País
            <select
              value={pais}
              onChange={(evento) => setPais(evento.target.value)}
            >
              <option>Todos</option>
              {paisesDisponibles.map((nombre) => (
                <option key={nombre}>{nombre}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="indicadores">
        <article className="tarjeta tarjeta-principal">
          <span>Puntuación promedio de felicidad</span>
          <strong>
            {promedioActual === null ? "—" : promedioActual.toFixed(2)}
          </strong>
          <small>
            Edición {edicionActual} · {seleccion.length} países
          </small>
        </article>

        <article className="tarjeta">
          <span>Mayor puntuación</span>
          <strong>{mayor?.pais ?? "—"}</strong>
          <small>{mayor ? `${mayor.felicidad} puntos` : "Sin datos"}</small>
        </article>

        <article className="tarjeta">
          <span>Menor puntuación</span>
          <strong>{menor?.pais ?? "—"}</strong>
          <small>{menor ? `${menor.felicidad} puntos` : "Sin datos"}</small>
        </article>

        <article className="tarjeta">
          <span>Relación PIB y felicidad</span>
          <strong>
            {correlacion === null ? "—" : correlacion.toFixed(2)}
          </strong>
          <small>{pares.length} pares de datos · Pearson</small>
        </article>

        <article className="tarjeta">
          <span>Cambio entre ediciones</span>
          <strong>
            {cambio === null
              ? "—"
              : `${cambio > 0 ? "+" : ""}${cambio.toFixed(2)}`}
          </strong>
          <small>
            {edicionAnterior} → {ediciones[ediciones.length - 1]}
          </small>
        </article>
      </section>

      <section className="graficas">
        <article className="panel" style={{ gridColumn: "1 / -1" }}>
          <h2>Mapa mundial de puntuaciones por país</h2>
          <MapaMundial registros={seleccion} />
        </article>

        <article className="panel">
          <h2>Países con mayor y menor puntuación</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={ranking}
              layout="vertical"
              margin={{ left: 16, right: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 10]} />
              <YAxis type="category" dataKey="pais" width={110} />
              <Tooltip />
              <Bar
                dataKey="felicidad"
                name="Puntuación"
                radius={[0, 5, 5, 0]}
              >
                {ranking.map((registro, indice) => (
                  <Cell
                    key={`${registro.pais}-${indice}`}
                    fill={indice < mejores.length ? "#22A6A1" : "#F2B84B"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="panel">
          <h2>Promedio por continente</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={promediosContinente}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="continente" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="promedio" name="Promedio" fill="#69B7D6" />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="panel">
          <h2>Cambio de puntuación entre ediciones</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={tendencia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="edicion" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line dataKey="Europa" stroke="#16324F" connectNulls />
              <Line dataKey="América" stroke="#22A6A1" connectNulls />
              <Line dataKey="Asia" stroke="#69B7D6" connectNulls />
              <Line dataKey="África" stroke="#F2B84B" connectNulls />
              <Line dataKey="Oceanía" stroke="#A9D9E9" connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <article className="panel">
          <h2>PIB per cápita y felicidad</h2>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis
                dataKey="pib"
                type="number"
                scale="log"
                domain={["dataMin", "dataMax"]}
                name="PIB per cápita"
                tickFormatter={(valor) =>
                  "$" + Math.round(valor / 1000) + " mil"
                }
              />
              <YAxis
                dataKey="felicidad"
                name="Felicidad"
                domain={[0, 10]}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={seleccion} fill="#F2B84B" />
            </ScatterChart>
          </ResponsiveContainer>
        </article>
      </section>

      <p className="aviso">
        Datos de muestra para practicar. No representan cifras oficiales.
      </p>
    </main>
  );
}

export default App;