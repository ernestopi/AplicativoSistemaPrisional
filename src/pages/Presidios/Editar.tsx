import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarPresidio() {
  const { id } = useParams();
  const nav = useNavigate();
  
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregar() {
    const ref = doc(db, "presidios", id);
    const snap = await getDoc(ref);
    const d = snap.data();

    setNome(d.nome || "");
    setCidade(d.cidade || "");
    setEstado(d.estado || "");
    setLoading(false);
  }

  async function salvar(e) {
    e.preventDefault();

    await updateDoc(doc(db, "presidios", id), {
      nome,
      cidade,
      estado,
    });

    nav("/presidios");
  }

  useEffect(() => {
    carregar();
  }, []);

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Presídio</h1>
        <p className="text-gray-600 mt-1">Atualize as informações da unidade prisional</p>
      </div>

      <div className="max-w-3xl">
        {/* Card Ilustrativo */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-5xl">🏢</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Editar Unidade Prisional</h2>
              <p className="text-purple-100">
                Atualize as informações do presídio no sistema
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={salvar}>
          {/* Card de Informações */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              Informações do Presídio
            </h2>
            
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Presídio *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base"
                  placeholder="Ex: Presídio Central de Teresina"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base"
                    placeholder="Ex: Teresina"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado (UF) *
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  >
                    <option value="">Selecione o estado</option>
                    {estados.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Aviso */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">⚠️</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Atenção</h3>
                <p className="text-sm text-amber-800">
                  Ao alterar as informações do presídio, os dados serão atualizados para todos os Presos e usuários vinculados a esta unidade.
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all transform hover:scale-105"
            >
              ✓ Salvar Alterações
            </button>
            <button
              type="button"
              onClick={() => nav("/presidios")}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { useParams, useNavigate } from "react-router-dom";

// export default function EditarPresidio() {
//   const { id } = useParams();
//   const nav = useNavigate();

//   const [nome, setNome] = useState("");
//   const [cidade, setCidade] = useState("");
//   const [estado, setEstado] = useState("");

//   async function carregar() {
//     const snap = await getDoc(doc(db, "presidios", id));
//     const dados = snap.data();

//     setNome(dados.nome);
//     setCidade(dados.cidade);
//     setEstado(dados.estado);
//   }

//   async function salvar(e) {
//     e.preventDefault();

//     await updateDoc(doc(db, "presidios", id), {
//       nome,
//       cidade,
//       estado
//     });

//     nav("/presidios");
//   }

//   useEffect(() => {
//     carregar();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Editar Presídio</h1>

//       <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

//         <input
//           value={nome}
//           className="border p-2 rounded"
//           onChange={(e) => setNome(e.target.value)}
//         />

//         <input
//           value={cidade}
//           className="border p-2 rounded"
//           onChange={(e) => setCidade(e.target.value)}
//         />

//         <input
//           value={estado}
//           className="border p-2 rounded"
//           onChange={(e) => setEstado(e.target.value)}
//         />

//         <button className="bg-blue-600 text-white p-2 rounded">
//           Atualizar
//         </button>
//       </form>
//     </div>
//   );
// }
