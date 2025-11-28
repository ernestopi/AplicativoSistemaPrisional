import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function PresidiosIndex() {
  const [presidios, setPresidios] = useState([]);
  const [Presos, setPresos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

  async function carregar() {
    setLoading(true);
    
    // Carregar presídios
    const presSnap = await getDocs(collection(db, "presidios"));
    const listaPresidios = presSnap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));
    
    // Carregar Presos
    const PresosSnap = await getDocs(collection(db, "Presos"));
    const listaPresos = PresosSnap.docs.map((d) => d.data());
    
    setPresidios(listaPresidios);
    setPresos(listaPresos);
    setLoading(false);
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente excluir este presídio?")) return;
    await deleteDoc(doc(db, "presidios", id));
    carregar();
  }

  // Função para contar Presos por presídio
  function contarPresos(presidioId) {
    return Presos.filter(p => p.presidioId === presidioId).length;
  }

  useEffect(() => {
    carregar();
  }, []);

  // Filtrar presídios
  const presidiosFiltrados = presidios.filter((p) =>
    p.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.cidade?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.estado?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Estatísticas
  const totalPresidios = presidios.length;
  const totalPresos = Presos.length;
  const estados = [...new Set(presidios.map(p => p.estado))].length;
  const cidades = [...new Set(presidios.map(p => p.cidade))].length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Presídios</h1>
            <p className="text-gray-600 mt-1">Gerenciamento de unidades prisionais</p>
          </div>
          <Link
            to="/presidios/novo"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
          >
            <span className="text-xl">+</span>
            <span>Novo Presídio</span>
          </Link>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total de Presídios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPresidios}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🏢</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total de Presos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPresos}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Estados</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{estados}</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🗺️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Cidades</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{cidades}</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🏙️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Pesquisar Presídio
            </label>
            <input
              type="text"
              placeholder="Digite o nome, cidade ou estado..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          {filtro && (
            <div className="text-center pt-6">
              <p className="text-2xl font-bold text-gray-900">{presidiosFiltrados.length}</p>
              <p className="text-sm text-gray-600">resultado(s)</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabela/Cards de Presídios */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Carregando presídios...</p>
            </div>
          </div>
        ) : presidiosFiltrados.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="text-7xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {filtro ? "Nenhum resultado" : "Nenhum presídio cadastrado"}
              </h3>
              <p className="text-gray-600 mb-6">
                {filtro 
                  ? `Não encontramos presídios com "${filtro}"`
                  : "Comece cadastrando o primeiro presídio do sistema"
                }
              </p>
              {!filtro && (
                <Link
                  to="/presidios/novo"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <span>+</span>
                  <span>Cadastrar Primeiro Presídio</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {presidiosFiltrados.map((presidio) => {
              const totalPresos = contarPresos(presidio.id);
              
              return (
                <div
                  key={presidio.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden"
                >
                  {/* Header do Card */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {presidio.nome}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-5 space-y-3">
                    {/* Localização */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">📍</span>
                      <span className="font-medium">{presidio.cidade}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">🗺️</span>
                      <span className="font-medium">{presidio.estado}</span>
                    </div>

                    {/* Total de Presos - NOVO */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👥</span>
                        <span className="font-semibold text-gray-700">Total de Presos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-emerald-700">{totalPresos}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      {/* Ações */}
                      <div className="flex gap-2">
                        <Link
                          to={`/presidios/editar/${presidio.id}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-center transition-colors shadow-sm"
                        >
                          ✏️ Editar
                        </Link>
                        <button
                          onClick={() => excluir(presidio.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer com total */}
      {presidiosFiltrados.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          Exibindo {presidiosFiltrados.length} de {totalPresidios} presídio(s)
        </div>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { Link } from "react-router-dom";

// export default function PresidiosIndex() {
//   const [presidios, setPresidios] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filtro, setFiltro] = useState("");

//   async function carregar() {
//     setLoading(true);
//     const snap = await getDocs(collection(db, "presidios"));
//     const lista = snap.docs.map((d) => ({
//       id: d.id,
//       ...d.data()
//     }));
//     setPresidios(lista);
//     setLoading(false);
//   }

//   async function excluir(id) {
//     if (!confirm("Deseja realmente excluir este presídio?")) return;
//     await deleteDoc(doc(db, "presidios", id));
//     carregar();
//   }

//   useEffect(() => {
//     carregar();
//   }, []);

//   // Filtrar presídios
//   const presidiosFiltrados = presidios.filter((p) =>
//     p.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
//     p.cidade?.toLowerCase().includes(filtro.toLowerCase()) ||
//     p.estado?.toLowerCase().includes(filtro.toLowerCase())
//   );

//   // Estatísticas
//   const totalPresidios = presidios.length;
//   const estados = [...new Set(presidios.map(p => p.estado))].length;
//   const cidades = [...new Set(presidios.map(p => p.cidade))].length;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Gestão de Presídios</h1>
//             <p className="text-gray-600 mt-1">Gerenciamento de unidades prisionais</p>
//           </div>
//           <Link
//             to="/presidios/novo"
//             className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
//           >
//             <span className="text-xl">+</span>
//             <span>Novo Presídio</span>
//           </Link>
//         </div>
//       </div>

//       {/* Cards de Estatísticas */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 font-medium">Total de Presídios</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{totalPresidios}</p>
//             </div>
//             <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
//               <span className="text-3xl">🏢</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 font-medium">Estados</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{estados}</p>
//             </div>
//             <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
//               <span className="text-3xl">🗺️</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 font-medium">Cidades</p>
//               <p className="text-3xl font-bold text-gray-900 mt-2">{cidades}</p>
//             </div>
//             <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
//               <span className="text-3xl">🏙️</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Barra de Busca */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//         <div className="flex items-center gap-4">
//           <div className="flex-1">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               🔍 Pesquisar Presídio
//             </label>
//             <input
//               type="text"
//               placeholder="Digite o nome, cidade ou estado..."
//               className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base"
//               value={filtro}
//               onChange={(e) => setFiltro(e.target.value)}
//             />
//           </div>
//           {filtro && (
//             <div className="text-center pt-6">
//               <p className="text-2xl font-bold text-gray-900">{presidiosFiltrados.length}</p>
//               <p className="text-sm text-gray-600">resultado(s)</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tabela/Cards de Presídios */}
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600 font-medium">Carregando presídios...</p>
//             </div>
//           </div>
//         ) : presidiosFiltrados.length === 0 ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center max-w-md">
//               <div className="text-7xl mb-4">🏢</div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                 {filtro ? "Nenhum resultado" : "Nenhum presídio cadastrado"}
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 {filtro 
//                   ? `Não encontramos presídios com "${filtro}"`
//                   : "Comece cadastrando o primeiro presídio do sistema"
//                 }
//               </p>
//               {!filtro && (
//                 <Link
//                   to="/presidios/novo"
//                   className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
//                 >
//                   <span>+</span>
//                   <span>Cadastrar Primeiro Presídio</span>
//                 </Link>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//             {presidiosFiltrados.map((presidio) => (
//               <div
//                 key={presidio.id}
//                 className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden"
//               >
//                 {/* Header do Card */}
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                       <span className="text-2xl">🏢</span>
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-white font-bold text-lg leading-tight">
//                         {presidio.nome}
//                       </h3>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Conteúdo do Card */}
//                 <div className="p-5 space-y-3">
//                   {/* Localização */}
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <span className="text-xl">📍</span>
//                     <span className="font-medium">{presidio.cidade}</span>
//                   </div>

//                   <div className="flex items-center gap-2 text-gray-700">
//                     <span className="text-xl">🗺️</span>
//                     <span className="font-medium">{presidio.estado}</span>
//                   </div>

//                   {/* Divider */}
//                   <div className="border-t border-gray-200 pt-3 mt-3">
//                     {/* Ações */}
//                     <div className="flex gap-2">
//                       <Link
//                         to={`/presidios/editar/${presidio.id}`}
//                         className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-center transition-colors shadow-sm"
//                       >
//                         ✏️ Editar
//                       </Link>
//                       <button
//                         onClick={() => excluir(presidio.id)}
//                         className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
//                       >
//                         🗑️ Excluir
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Footer com total */}
//       {presidiosFiltrados.length > 0 && (
//         <div className="mt-6 text-center text-gray-600">
//           Exibindo {presidiosFiltrados.length} de {totalPresidios} presídio(s)
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { Link } from "react-router-dom";

// export default function PresidioIndex() {
//   const [presidios, setPresidios] = useState([]);

//   async function carregar() {
//     const snap = await getDocs(collection(db, "presidios"));
//     const lista = snap.docs.map((d) => ({
//       id: d.id,
//       ...d.data()
//     }));

//     setPresidios(lista);
//   }

//   async function excluir(id) {
//     if (!confirm("Deseja realmente excluir este presídio?")) return;
//     await deleteDoc(doc(db, "presidios", id));
//     carregar();
//   }

//   useEffect(() => {
//     carregar();
//   }, []);

//   return (
//     <div>
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">Presídios</h1>
//         <Link
//           to="/presidios/novo"
//           className="bg-emerald-600 text-white px-4 py-2 rounded"
//         >
//           Novo Presídio
//         </Link>
//       </div>

//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">Nome</th>
//             <th className="border p-2">Cidade</th>
//             <th className="border p-2">Estado</th>
//             <th className="border p-2">Ações</th>
//           </tr>
//         </thead>

//         <tbody>
//           {presidios.map((p) => (
//             <tr key={p.id}>
//               <td className="border p-2">{p.nome}</td>
//               <td className="border p-2">{p.cidade}</td>
//               <td className="border p-2">{p.estado}</td>
//               <td className="border p-2 flex gap-2">
//                 <Link
//                   to={`/presidios/editar/${p.id}`}
//                   className="px-3 py-1 bg-blue-500 text-white rounded"
//                 >
//                   Editar
//                 </Link>

//                 <button
//                   onClick={() => excluir(p.id)}
//                   className="px-3 py-1 bg-red-600 text-white rounded"
//                 >
//                   Excluir
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
