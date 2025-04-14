
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
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

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Conjugador de Verbos en Español</h1>

      <Card>
        <CardContent className="space-y-4 p-6">
          <Input
            placeholder="Introduce un verbo"
            value={verbo}
            onChange={(e) => setVerbo(e.target.value)}
          />

          <Select onValueChange={setTiempo}>
            <SelectTrigger>
              <SelectValue placeholder="Elige un tiempo verbal" />
            </SelectTrigger>
            <SelectContent>
              {tiempos.map((tiempo) => (
                <SelectItem key={tiempo} value={tiempo}>{tiempo}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={conjugar}>Conjugar</Button>
        </CardContent>
      </Card>

      {conjugaciones && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Conjugaciones ({tiempo}):</h2>
            <ul className="space-y-1">
              {Object.entries(conjugaciones).map(([persona, forma]) => (
                <li key={persona}><strong>{persona}:</strong> {forma}</li>
              ))}
            </ul>
            <Button className="mt-4" onClick={mostrarEjemplos}>Ejemplo</Button>
          </CardContent>
        </Card>
      )}

      {ejemplos && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Ejemplos:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {ejemplos.map((ejemplo, idx) => (
                <li key={idx}>{ejemplo}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
