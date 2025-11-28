// src/components/Filtros.tsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

type Props = {
  presidio: string;
  setPresidio: (v: string) => void;
  dataInicio: string;
  setDataInicio: (v: string) => void;
  dataFim: string;
  setDataFim: (v: string) => void;
};

export default function Filtros({
  presidio,
  setPresidio,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
}: Props) {
  const [presidios, setPresidios] = useState<Array<{ id: string; nome: string }>>([]);
  const [loading, setLoading] = useState(false);

  async function carregarPresidios() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "presidios"));
      const list = snap.docs.map((d) => ({ id: d.id, nome: (d.data() as any).nome || d.id }));
      setPresidios(list);
    } catch (err) {
      console.error("Erro ao carregar presídios:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarPresidios();
  }, []);

  function aplicarFiltros() {
    // Aqui só atualizamos os states (Index.tsx observa mudanças)
    // Se quiser, pode chamar um callback opcional para forçar recarregar dados.
    // Mantemos comportamento simples: alterar os estados já é suficiente.
    // Você pode colocar validação adicional aqui, se desejar.
  }

  function limparFiltros() {
    setPresidio("");
    setDataInicio("");
    setDataFim("");
  }

  function rangeHoje() {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    setDataInicio(iso);
    setDataFim(iso);
  }

  function range7Dias() {
    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(fim.getDate() - 6);
    setDataInicio(inicio.toISOString().slice(0, 10));
    setDataFim(fim.toISOString().slice(0, 10));
  }

  function rangeMesAtual() {
    const fim = new Date();
    const inicio = new Date(fim.getFullYear(), fim.getMonth(), 1);
    setDataInicio(inicio.toISOString().slice(0, 10));
    setDataFim(fim.toISOString().slice(0, 10));
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Presídio */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Presídio</label>
          <select
            value={presidio}
            onChange={(e) => setPresidio(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Todos os presídios</option>
            {presidios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Data início */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Data fim */}
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              aplicarFiltros();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow"
            title="Aplicar filtros"
          >
            Aplicar
          </button>

          <button
            onClick={limparFiltros}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium border"
            title="Limpar filtros"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Quick ranges */}
      <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
        <span className="font-medium text-gray-700 mr-2">Atalhos:</span>
        <button
          onClick={rangeHoje}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
          title="Hoje"
        >
          Hoje
        </button>
        <button
          onClick={range7Dias}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
          title="Últimos 7 dias"
        >
          Últimos 7 dias
        </button>
        <button
          onClick={rangeMesAtual}
          className="px-3 py-1 rounded-md hover:bg-gray-100"
          title="Este mês"
        >
          Mês atual
        </button>

        {loading && <span className="ml-4 text-xs text-gray-400">Carregando presídios...</span>}
      </div>
    </div>
  );
}
