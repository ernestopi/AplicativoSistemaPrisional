import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function PresosIndex() {
  const [presos, setPresos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtro por presídio
  const [presidioFiltro, setPresidioFiltro] = useState("");
  const [presidios, setPresidios] = useState([]);

  // Carregar presos
  async function carregar() {
    setLoading(true);
    const snap = await getDocs(collection(db, "presos"));
    const lista = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setPresos(lista);
    setLoading(false);
  }

  // Carregar presídios
  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  // Excluir preso
  async function excluir(id) {
    if (!confirm("Deseja realmente excluir este preso?")) return;
    await deleteDoc(doc(db, "presos", id));
    carregar();
  }

  useEffect(() => {
    carregar();
    carregarPresidios();
  }, []);

  // Aplicar filtro
  const presosFiltrados =
    presidioFiltro === ""
      ? presos
      : presos.filter((p) => p.presidioId === presidioFiltro);

  return (
    <div className="p-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gestão de Presos</h1>

        <Link
          to="/presos/novo"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold shadow"
        >
          + Novo Preso
        </Link>
      </div>

      {/* Filtro por presídio */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecionar Presídio
        </label>

        <select
          value={presidioFiltro}
          onChange={(e) => setPresidioFiltro(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Todos os presídios</option>

          {presidios.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {loading ? (
          <div className="py-20 text-center text-gray-500">Carregando...</div>
        ) : presosFiltrados.length === 0 ? (
          <div className="py-20 text-center text-gray-500 text-lg">
            Nenhum preso encontrado.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Foto</th>
                <th className="px-4 py-3 text-left font-semibold">Nome</th>
                <th className="px-4 py-3 text-left font-semibold">Matrícula</th>
                <th className="px-4 py-3 text-left font-semibold">Presídio</th>
                <th className="px-4 py-3 text-left font-semibold">Localização</th>
                <th className="px-4 py-3 text-left font-semibold">Situação</th>
                <th className="px-4 py-3 text-left font-semibold">Visita</th>
                <th className="px-4 py-3 text-left font-semibold">Itens</th>
                <th className="px-4 py-3 text-center font-semibold">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {presosFiltrados.map((preso) => (
                <tr key={preso.id} className="hover:bg-gray-50">

                  {/* FOTO REDONDA */}
                  <td className="px-4 py-3">
                    <img
                      src={preso.foto || "https://via.placeholder.com/80?text=Foto"}
                      alt="foto"
                      className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                    />
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {preso.nome}
                  </td>

                  <td className="px-4 py-3">
                    <span className="bg-gray-100 px-2 py-1 rounded border text-xs">
                      {preso.matricula || "-"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-700">{preso.presidioNome}</td>

                  <td className="px-4 py-3 text-gray-600">
                    {preso.pavilhao ? `Pav. ${preso.pavilhao}` : "-"}
                    {preso.cela && <span> • Cela {preso.cela}</span>}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`
                      px-2 py-1 text-xs font-semibold rounded-full border
                      ${
                        preso.situacao === "Condenado"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : preso.situacao === "Provisório"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : preso.situacao === "Fuga"
                          ? "bg-purple-100 text-purple-700 border-purple-300"
                          : preso.situacao === "Hospitalizado"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-gray-100 text-gray-700 border-gray-300"
                      }
                    `}
                    >
                      {preso.situacao}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {preso.diaVisita || "-"}
                  </td>

                  {/* ITENS */}
                  <td className="px-4 py-3 flex gap-1 text-sm">
                    {preso.ventilador && <span>🌀</span>}
                    {preso.colchao && <span>🛏️</span>}
                    {preso.tv && <span>📺</span>}
                    {preso.radio && <span>📻</span>}
                    {!preso.ventilador &&
                      !preso.colchao &&
                      !preso.tv &&
                      !preso.radio && <span className="text-gray-400">-</span>}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link
                        to={`/presos/editar/${preso.id}`}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                      >
                        Editar
                      </Link>

                      <button
                        onClick={() => excluir(preso.id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
