import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function PresosIndex() {
  const [presos, setPresos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    const snap = await getDocs(collection(db, "presos"));
    const lista = snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));
    setPresos(lista);
    setLoading(false);
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente excluir este preso?")) return;
    await deleteDoc(doc(db, "presos", id));
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  // Filtrar presos
  const presosFiltrados = filtro.trim() === "" 
    ? [] 
    : presos.filter((p) =>
        p.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
        p.matricula?.toLowerCase().includes(filtro.toLowerCase()) ||
        p.presidioNome?.toLowerCase().includes(filtro.toLowerCase()) ||
        p.cela?.toLowerCase().includes(filtro.toLowerCase()) ||
        p.pavilhao?.toLowerCase().includes(filtro.toLowerCase())
      );

  // Estatísticas
  const stats = {
    total: presos.length,
    provisorios: presos.filter(p => p.situacao === "Provisório").length,
    condenados: presos.filter(p => p.situacao === "Condenado").length,
    fugitivos: presos.filter(p => p.situacao === "Fuga").length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Presos</h1>
            <p className="text-gray-600 mt-1">Gerenciamento completo de internos</p>
          </div>
          <Link
            to="/presos/novo"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105"
          >
            <span className="text-xl">+</span>
            <span>Novo Preso</span>
          </Link>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total de Presos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Provisórios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.provisorios}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Sentenciados</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.condenados}</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">⚖️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Em Fuga</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.fugitivos}</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🚨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Busca */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Pesquisar Interno
            </label>
            <input
              type="text"
              placeholder="Digite o nome, matrícula, presídio, cela ou pavilhão..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              autoFocus
            />
          </div>
          {filtro && (
            <div className="text-center pt-6">
              <p className="text-2xl font-bold text-gray-900">{presosFiltrados.length}</p>
              <p className="text-sm text-gray-600">resultado(s)</p>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Carregando dados...</p>
            </div>
          </div>
        ) : filtro.trim() === "" ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="text-7xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Digite para pesquisar
              </h3>
              <p className="text-gray-600">
                Use o campo de pesquisa acima para localizar internos por nome, matrícula, presídio, cela ou pavilhão.
              </p>
            </div>
          </div>
        ) : presosFiltrados.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="text-7xl mb-4">❌</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Nenhum resultado
              </h3>
              <p className="text-gray-600">
                Não encontramos nenhum interno com <strong>"{filtro}"</strong>.
                <br />
                Tente outro termo de busca.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Foto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Matrícula</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Presídio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Localização</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Situação</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Visita</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Pertences</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {presosFiltrados.map((preso) => (
                  <tr key={preso.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={preso.foto || "https://via.placeholder.com/80?text=Sem+Foto"}
                        alt={preso.nome}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{preso.nome}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
                        {preso.matricula || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{preso.presidioNome || "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-blue-700">
                          {preso.pavilhao ? `Pavilhão ${preso.pavilhao}` : "-"}
                        </p>
                        <p className="text-gray-600">
                          {preso.cela ? `Cela ${preso.cela}` : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-block ${
                          preso.situacao === "Condenado"
                            ? "bg-red-100 text-red-700"
                            : preso.situacao === "Provisório"
                            ? "bg-yellow-100 text-yellow-700"
                            : preso.situacao === "Fuga"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {preso.situacao}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{preso.diaVisita || "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {preso.ventilador && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-medium">
                            🌀 Vent
                          </span>
                        )}
                        {preso.colchao && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-medium">
                            🛏️ Col
                          </span>
                        )}
                        {preso.tv && (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md font-medium">
                            📺 TV
                          </span>
                        )}
                        {preso.radio && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md font-medium">
                            📻 Rádio
                          </span>
                        )}
                        {!preso.ventilador && !preso.colchao && !preso.tv && !preso.radio && (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <Link
                          to={`/presos/editar/${preso.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                          ✏️ Editar
                        </Link>
                        <button
                          onClick={() => excluir(preso.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { Link } from "react-router-dom";

// export default function PresosIndex() {
//   const [presos, setPresos] = useState([]);
//   const [filtro, setFiltro] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function carregar() {
//     setLoading(true);
//     const snap = await getDocs(collection(db, "presos"));
//     const lista = snap.docs.map((d) => ({
//       id: d.id,
//       ...d.data()
//     }));
//     setPresos(lista);
//     setLoading(false);
//   }

//   async function excluir(id) {
//     if (!confirm("Deseja realmente excluir este preso?")) return;
//     await deleteDoc(doc(db, "presos", id));
//     carregar();
//   }

//   useEffect(() => {
//     carregar();
//   }, []);

//   // Filtrar presos apenas se houver texto no filtro
//   const presosFiltrados = filtro.trim() === "" 
//     ? [] 
//     : presos.filter((p) =>
//         p.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
//         p.matricula?.toLowerCase().includes(filtro.toLowerCase()) ||
//         p.presidioNome?.toLowerCase().includes(filtro.toLowerCase()) ||
//         p.cela?.toLowerCase().includes(filtro.toLowerCase()) ||
//         p.pavilhao?.toLowerCase().includes(filtro.toLowerCase())
//       );

//   return (
//     <div className="h-full flex flex-col">
//       {/* Cabeçalho */}
//       <div className="bg-white border-b border-gray-300 p-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Gestão de Presos</h1>
//           <p className="text-sm text-gray-500">Total cadastrado: {presos.length} internos</p>
//         </div>
//         <Link
//           to="/presos/novo"
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-md font-semibold shadow-sm transition-colors"
//         >
//           + Novo Preso
//         </Link>
//       </div>

//       {/* Barra de Pesquisa */}
//       <div className="bg-gray-50 border-b border-gray-300 p-4">
//         <div className="max-w-2xl">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             🔍 Pesquisar Interno
//           </label>
//           <input
//             type="text"
//             placeholder="Digite o nome, matrícula, presídio, cela ou pavilhão para buscar..."
//             className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
//             value={filtro}
//             onChange={(e) => setFiltro(e.target.value)}
//             autoFocus
//           />
//           {filtro && (
//             <p className="text-sm text-gray-600 mt-2">
//               {presosFiltrados.length} resultado(s) encontrado(s)
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Área de Conteúdo */}
//       <div className="flex-1 overflow-auto bg-white">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Carregando dados...</p>
//             </div>
//           </div>
//         ) : filtro.trim() === "" ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center max-w-md">
//               <div className="text-6xl mb-4">🔍</div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                 Digite para pesquisar
//               </h3>
//               <p className="text-gray-500">
//                 Use o campo de pesquisa acima para localizar internos por nome, matrícula, presídio, cela ou pavilhão.
//               </p>
//             </div>
//           </div>
//         ) : presosFiltrados.length === 0 ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center max-w-md">
//               <div className="text-6xl mb-4">❌</div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                 Nenhum resultado encontrado
//               </h3>
//               <p className="text-gray-500">
//                 Não encontramos nenhum interno com "{filtro}".
//                 <br />
//                 Tente outro termo de busca.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             {/* Tabela estilo Excel */}
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-blue-600 text-white">
//                   <th className="border border-gray-400 p-3 text-left font-semibold w-20">
//                     #
//                   </th>
//                   <th className="border border-gray-400 p-3 text-left font-semibold w-24">
//                     Foto
//                   </th>
//                   <th className="border border-gray-400 p-3 text-left font-semibold min-w-[200px]">
//                     Nome Completo
//                   </th>
//                   <th className="border border-gray-400 p-3 text-left font-semibold w-32">
//                     Matrícula
//                   </th>
//                   <th className="border border-gray-400 p-3 text-left font-semibold min-w-[180px]">
//                     Presídio
//                   </th>
//                   <th className="border border-gray-400 p-3 text-left font-semibold w-28">
//                     Pavilhão
//                   </th>
//                   <th className="border border-gray-400 p-3 text-left font-semibold w-24">
//                     Cela
//                   </th>
//                   <th className="border border-gray-400 p-3 text-left font-semibold w-32">
//                     Situação
//                   </th>
//                   <th className="border border-gray-400 p-3 text-left font-semibold w-32">
//                     Dia Visita
//                   </th>
//                   <th className="border border-gray-400 p-3 text-center font-semibold w-40">
//                     Pertences
//                   </th>
//                   <th className="border border-gray-400 p-3 text-center font-semibold w-48">
//                     Ações
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {presosFiltrados.map((preso, index) => (
//                   <tr
//                     key={preso.id}
//                     className="hover:bg-blue-50 transition-colors"
//                   >
//                     {/* Número */}
//                     <td className="border border-gray-300 p-2 text-center text-gray-600 font-medium bg-gray-50">
//                       {index + 1}
//                     </td>

//                     {/* Foto */}
//                     <td className="border border-gray-300 p-2 text-center bg-white">
//                       <img
//                         src={preso.foto || "https://via.placeholder.com/80?text=Sem+Foto"}
//                         alt={preso.nome}
//                         className="w-16 h-16 rounded-md object-cover mx-auto border-2 border-gray-200"
//                       />
//                     </td>

//                     {/* Nome */}
//                     <td className="border border-gray-300 p-2 bg-white">
//                       <span className="font-semibold text-gray-800">
//                         {preso.nome}
//                       </span>
//                     </td>

//                     {/* Matrícula */}
//                     <td className="border border-gray-300 p-2 text-center bg-white">
//                       <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded border border-gray-300">
//                         {preso.matricula || "-"}
//                       </span>
//                     </td>

//                     {/* Presídio */}
//                     <td className="border border-gray-300 p-2 bg-white">
//                       <span className="text-gray-700">
//                         {preso.presidioNome || "-"}
//                       </span>
//                     </td>

//                     {/* Pavilhão */}
//                     <td className="border border-gray-300 p-2 text-center bg-white">
//                       <span className="font-semibold text-blue-700">
//                         {preso.pavilhao || "-"}
//                       </span>
//                     </td>

//                     {/* Cela */}
//                     <td className="border border-gray-300 p-2 text-center bg-white">
//                       <span className="font-semibold text-blue-700">
//                         {preso.cela || "-"}
//                       </span>
//                     </td>

//                     {/* Situação */}
//                     <td className="border border-gray-300 p-2 bg-white">
//                       <span
//                         className={`px-2 py-1 rounded-md text-xs font-bold inline-block w-full text-center ${
//                           preso.situacao === "Condenado"
//                             ? "bg-red-100 text-red-800 border border-red-300"
//                             : preso.situacao === "Provisório"
//                             ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
//                             : preso.situacao === "Fuga"
//                             ? "bg-purple-100 text-purple-800 border border-purple-300"
//                             : "bg-blue-100 text-blue-800 border border-blue-300"
//                         }`}
//                       >
//                         {preso.situacao}
//                       </span>
//                     </td>

//                     {/* Dia de Visita */}
//                     <td className="border border-gray-300 p-2 text-center bg-white">
//                       <span className="text-sm text-gray-700">
//                         {preso.diaVisita || "-"}
//                       </span>
//                     </td>

//                     {/* Pertences */}
//                     <td className="border border-gray-300 p-2 bg-white">
//                       <div className="flex flex-wrap gap-1 justify-center">
//                         {preso.ventilador && (
//                           <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded border border-green-300 font-medium">
//                             Vent
//                           </span>
//                         )}
//                         {preso.colchao && (
//                           <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded border border-blue-300 font-medium">
//                             Col
//                           </span>
//                         )}
//                         {preso.tv && (
//                           <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded border border-purple-300 font-medium">
//                             TV
//                           </span>
//                         )}
//                         {preso.radio && (
//                           <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded border border-orange-300 font-medium">
//                             Rádio
//                           </span>
//                         )}
//                         {!preso.ventilador && !preso.colchao && !preso.tv && !preso.radio && (
//                           <span className="text-gray-400 text-xs">-</span>
//                         )}
//                       </div>
//                     </td>

//                     {/* Ações */}
//                     <td className="border border-gray-300 p-2 bg-white">
//                       <div className="flex gap-1 justify-center">
//                         <Link
//                           to={`/presos/editar/${preso.id}`}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors"
//                         >
//                           ✏️ Editar
//                         </Link>
//                         <button
//                           onClick={() => excluir(preso.id)}
//                           className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors"
//                         >
//                           🗑️ Excluir
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// atuializada 21/11
// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { Link } from "react-router-dom";

// export default function PresosIndex() {
//   const [presos, setPresos] = useState([]);
//   const [filtro, setFiltro] = useState("");

//   async function carregar() {
//     const snap = await getDocs(collection(db, "presos"));
//     const lista = snap.docs.map((d) => ({
//       id: d.id,
//       ...d.data()
//     }));

//     setPresos(lista);
//   }

//   async function excluir(id) {
//     if (!confirm("Deseja realmente excluir este preso?")) return;
//     await deleteDoc(doc(db, "presos", id));
//     carregar();
//   }

//   useEffect(() => {
//     carregar();
//   }, []);

//   // Filtrar presos
//   const presosFiltrados = presos.filter((p) =>
//     p.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
//     p.matricula?.toLowerCase().includes(filtro.toLowerCase()) ||
//     p.presidioNome?.toLowerCase().includes(filtro.toLowerCase())
//   );

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Presos</h1>
//         <div className="flex gap-3">
//           <input
//             type="text"
//             placeholder="Buscar por nome, matrícula ou presídio..."
//             className="border px-3 py-2 rounded w-80"
//             value={filtro}
//             onChange={(e) => setFiltro(e.target.value)}
//           />
//           <Link
//             to="/presos/novo"
//             className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
//           >
//             Novo Preso
//           </Link>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full border bg-white">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Foto</th>
//               <th className="border p-2">Nome</th>
//               <th className="border p-2">Matrícula</th>
//               <th className="border p-2">Presídio</th>
//               <th className="border p-2">Pavilhão</th>
//               <th className="border p-2">Cela</th>
//               <th className="border p-2">Situação</th>
//               <th className="border p-2">Dia Visita</th>
//               <th className="border p-2">Pertences</th>
//               <th className="border p-2">Ações</th>
//             </tr>
//           </thead>

//           <tbody>
//             {presosFiltrados.map((p) => (
//               <tr key={p.id} className="hover:bg-gray-50">
//                 <td className="border p-2">
//                   <img
//                     src={p.foto || "https://via.placeholder.com/48"}
//                     alt=""
//                     className="w-12 h-12 rounded object-cover mx-auto"
//                   />
//                 </td>
//                 <td className="border p-2">{p.nome}</td>
//                 <td className="border p-2 text-center">
//                   <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
//                     {p.matricula || "-"}
//                   </span>
//                 </td>
//                 <td className="border p-2">{p.presidioNome || "-"}</td>
//                 <td className="border p-2 text-center">{p.pavilhao || "-"}</td>
//                 <td className="border p-2 text-center">{p.cela || "-"}</td>
//                 <td className="border p-2">
//                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                     p.situacao === "Condenado" ? "bg-red-100 text-red-800" :
//                     p.situacao === "Provisório" ? "bg-yellow-100 text-yellow-800" :
//                     p.situacao === "Fuga" ? "bg-purple-100 text-purple-800" :
//                     "bg-blue-100 text-blue-800"
//                   }`}>
//                     {p.situacao}
//                   </span>
//                 </td>
//                 <td className="border p-2 text-center text-sm">{p.diaVisita || "-"}</td>
//                 <td className="border p-2">
//                   <div className="flex gap-1 justify-center flex-wrap">
//                     {p.ventilador && (
//                       <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
//                         Vent.
//                       </span>
//                     )}
//                     {p.colchao && (
//                       <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                         Col.
//                       </span>
//                     )}
//                     {p.tv && (
//                       <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
//                         TV
//                       </span>
//                     )}
//                     {p.radio && (
//                       <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
//                         Rádio
//                       </span>
//                     )}
//                     {!p.ventilador && !p.colchao && !p.tv && !p.radio && (
//                       <span className="text-gray-400 text-xs">-</span>
//                     )}
//                   </div>
//                 </td>
//                 <td className="border p-2">
//                   <div className="flex gap-2 justify-center">
//                     <Link
//                       to={`/presos/editar/${p.id}`}
//                       className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
//                     >
//                       Editar
//                     </Link>

//                     <button
//                       onClick={() => excluir(p.id)}
//                       className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
//                     >
//                       Excluir
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {presosFiltrados.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             Nenhum preso encontrado.
//           </div>
//         )}
//       </div>

//       <div className="mt-4 text-sm text-gray-600">
//         Total: {presosFiltrados.length} preso(s)
//       </div>
//     </div>
//   );
// }

// //codigo antigo
// // import { useEffect, useState } from "react";
// // import { db } from "../../lib/firebase";
// // import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// // import { Link } from "react-router-dom";

// // export default function PresosIndex() {
// //   const [presos, setPresos] = useState([]);

// //   async function carregar() {
// //     const snap = await getDocs(collection(db, "presos"));
// //     const lista = snap.docs.map((d) => ({
// //       id: d.id,
// //       ...d.data()
// //     }));

// //     setPresos(lista);
// //   }

// //   async function excluir(id) {
// //     if (!confirm("Deseja realmente excluir este preso?")) return;
// //     await deleteDoc(doc(db, "presos", id));
// //     carregar();
// //   }

// //   useEffect(() => {
// //     carregar();
// //   }, []);

// //   return (
// //     <div>
// //       <div className="flex justify-between mb-4">
// //         <h1 className="text-2xl font-bold">Presos</h1>
// //         <Link
// //           to="/presos/novo"
// //           className="bg-emerald-600 text-white px-4 py-2 rounded"
// //         >
// //           Novo Preso
// //         </Link>
// //       </div>

// //       <table className="w-full border">
// //         <thead>
// //           <tr className="bg-gray-100">
// //             <th className="border p-2">Foto</th>
// //             <th className="border p-2">Nome</th>
// //             <th className="border p-2">Presídio</th>
// //             <th className="border p-2">Situação</th>
// //             <th className="border p-2">Ações</th>
// //           </tr>
// //         </thead>

// //         <tbody>
// //           {presos.map((p) => (
// //             <tr key={p.id}>
// //               <td className="border p-2">
// //                 <img
// //                   src={p.foto}
// //                   alt=""
// //                   className="w-12 h-12 rounded object-cover"
// //                 />
// //               </td>
// //               <td className="border p-2">{p.nome}</td>
// //               <td className="border p-2">{p.presidioNome}</td>
// //               <td className="border p-2">{p.situacao}</td>
// //               <td className="border p-2">
// //                 <div className="flex gap-2">
// //                   <Link
// //                     to={`/presos/editar/${p.id}`}
// //                     className="px-3 py-1 rounded bg-blue-600 text-white"
// //                   >
// //                     Editar
// //                   </Link>

// //                   <button
// //                     onClick={() => excluir(p.id)}
// //                     className="px-3 py-1 rounded bg-red-600 text-white"
// //                   >
// //                     Excluir
// //                   </button>
// //                 </div>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }

