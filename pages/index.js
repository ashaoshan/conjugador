// pages/index.js
import { useState } from "react";

const tiempos = [
  "Presente",
  "Pretérito Indefinido",
  "Pretérito Imperfecto",
  "Pretérito Perfecto",
  "Pretérito Pluscuamperfecto",
  "Futuro Simple",
  "Futuro Compuesto",
  "Condicional Simple",
  "Condicional Compuesto",
  "Gerundio",
];

export default function ConjugadorApp() {
  const [verbo, setVerbo] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [conjugaciones, setConjugaciones] = useState(null);
  const [ejemplos, setEjemplos] = useState(null);

  const conjugar = async () => {
    if (!verbo || !tiempo) return;
    try {
      const prompt = `Conjuga el verbo "${verbo}" en español en el tiempo "${tiempo}" para todas las personas del singular y plural. Devuelve solo las formas en formato JSON, con las claves: yo, tú, él/ella, nosotros, vosotros, ellos.`;

      const response = await fetch("/api/openai-conjugador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setConjugaciones(data);
      setEjemplos(null);
    } catch (error) {
      console.error("Error al conjugar:", error);
      setConjugaciones(null);
    }
  };

  const mostrarEjemplos = () => {
    if (!conjugaciones) return;
    const ejemplosGenerados = Object.entries(conjugaciones).map(
      ([persona, forma]) => `${persona} ${forma} en la playa todos los días.`
    );
    setEjemplos(ejemplosGenerados);
  };

  console.log("Enviando prompt:", prompt);
console.log("Respuesta cruda:", await response.text());

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 font-sans">
      <h1 className="text-3xl font-bold text-center">Conjugador de Verbos en Español</h1>

      <div className="bg-white shadow-md rounded p-4 space-y-4">
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Introduce un verbo"
          value={verbo}
          onChange={(e) => setVerbo(e.target.value)}
        />

        <select
          className="w-full border border-gray-300 p-2 rounded"
          value={tiempo}
          onChange={(e) => setTiempo(e.target.value)}
        >
          <option value="">Elige un tiempo verbal</option>
          {tiempos.map((tiempo) => (
            <option key={tiempo} value={tiempo}>{tiempo}</option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={conjugar}
        >
          Conjugar
        </button>
      </div>

      {conjugaciones && (
        <div className="bg-gray-100 rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Conjugaciones ({tiempo}):</h2>
          <ul className="space-y-1">
            {Object.entries(conjugaciones).map(([persona, forma]) => (
              <li key={persona}><strong>{persona}:</strong> {forma}</li>
            ))}
          </ul>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={mostrarEjemplos}
          >
            Ejemplo
          </button>
        </div>
      )}

      {ejemplos && (
        <div className="bg-gray-50 rounded p-4">
          <h3 className="text-lg font-medium mb-2">Ejemplos:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {ejemplos.map((ejemplo, idx) => (
              <li key={idx}>{ejemplo}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
