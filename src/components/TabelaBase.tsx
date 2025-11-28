// src/components/TabelaBase.tsx
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  Presos: any[];
  conferencias: any[];
  loading?: boolean;
};

export default function TabelaBase({ conferencias, loading }: Props) {
  const [agentes, setAgentes] = useState<Record<string, string>>({});

  // Buscar nome do agente no Firestore
  async function buscarAgente(usuarioId: string) {
    try {
      const snap = await getDoc(doc(db, "usuarios", usuarioId));
      if (snap.exists()) {
        const data = snap.data();
        return data.nomeCompleto || data.email || "Agente";
      }
    } catch (e) {
      console.error("Erro ao buscar agente:", e);
    }
    return "Agente";
  }

  // Carregar os nomes dos agentes para todas as conferências listadas
  useEffect(() => {
    async function carregar() {
      const map: Record<string, string> = {};

      for (const conf of conferencias) {
        if (conf.usuarioId && !map[conf.usuarioId]) {
          map[conf.usuarioId] = await buscarAgente(conf.usuarioId);
        }
      }

      setAgentes(map);
    }

    carregar();
  }, [conferencias]);

  if (loading) {
    return <p className="text-gray-500">Carregando conferências...</p>;
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm mt-6 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="px-4 py-3 text-left">Data / Horário</th>
            <th className="px-4 py-3 text-left">Servidor Responsável</th>
            <th className="px-4 py-3 text-left">Total de Presos</th>
          </tr>
        </thead>

        <tbody>
          {conferencias.map((c) => {
            // Formatar data
            let dataFormatada = "-";
            if (c.data?.seconds) {
              dataFormatada = new Date(c.data.seconds * 1000).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              });
            }

            const agente = agentes[c.usuarioId] || "Carregando...";

            return (
              <tr
                key={c.id}
                className="border-t hover:bg-gray-50 text-sm text-gray-800"
              >
                <td className="px-4 py-2">{dataFormatada}</td>
                <td className="px-4 py-2">{agente}</td>
                <td className="px-4 py-2 font-semibold">{c.totalPresos || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
