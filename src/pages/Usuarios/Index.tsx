import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function UsuariosIndex() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

  async function carregar() {
    setLoading(true);
    const snap = await getDocs(collection(db, "usuarios"));
    const lista = snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));
    setUsuarios(lista);
    setLoading(false);
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente excluir este usuário?")) return;
    await deleteDoc(doc(db, "usuarios", id));
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email?.toLowerCase().includes(filtro.toLowerCase()) ||
    u.role?.toLowerCase().includes(filtro.toLowerCase())
  );

  // Estatísticas
  const totalUsuarios = usuarios.length;
  const admins = usuarios.filter(u => u.role === "admin").length;
  const diretores = usuarios.filter(u => u.role === "diretor").length;
  const agentes = usuarios.filter(u => u.role === "agente").length;

  // Função para obter cor do badge de role
  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: "bg-red-100", text: "text-red-700", label: "Administrador", icon: "👑" },
      diretor: { bg: "bg-purple-100", text: "text-purple-700", label: "Diretor", icon: "👔" },
      agente: { bg: "bg-blue-100", text: "text-blue-700", label: "Agente", icon: "👮" }
    };
    return badges[role] || { bg: "bg-gray-100", text: "text-gray-700", label: role, icon: "👤" };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
            <p className="text-gray-600 mt-1">Gerenciamento de usuários do sistema</p>
          </div>
          <Link
            to="/usuarios/novo"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all transform hover:scale-105"
          >
            <span className="text-xl">+</span>
            <span>Novo Usuário</span>
          </Link>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total de Usuários</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsuarios}</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Administradores</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{admins}</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">👑</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Diretores</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{diretores}</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">👔</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Agentes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{agentes}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">👮</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Pesquisar Usuário
            </label>
            <input
              type="text"
              placeholder="Digite o nome, email ou função..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-base"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          {filtro && (
            <div className="text-center pt-6">
              <p className="text-2xl font-bold text-gray-900">{usuariosFiltrados.length}</p>
              <p className="text-sm text-gray-600">resultado(s)</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Carregando usuários...</p>
            </div>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="text-7xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {filtro ? "Nenhum resultado" : "Nenhum usuário cadastrado"}
              </h3>
              <p className="text-gray-600 mb-6">
                {filtro 
                  ? `Não encontramos usuários com "${filtro}"`
                  : "Comece cadastrando o primeiro usuário do sistema"
                }
              </p>
              {!filtro && (
                <Link
                  to="/usuarios/novo"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <span>+</span>
                  <span>Cadastrar Primeiro Usuário</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Função</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Presídio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => {
                  const badge = getRoleBadge(usuario.role);
                  
                  return (
                    <tr key={usuario.id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {usuario.nome?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="font-semibold text-gray-900">{usuario.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{usuario.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">
                          {usuario.presidioNome || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          usuario.ativo 
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {usuario.ativo ? "✓ Ativo" : "○ Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <Link
                            to={`/usuarios/editar/${usuario.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                          >
                            ✏️ Editar
                          </Link>
                          <button
                            onClick={() => excluir(usuario.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer com total */}
      {usuariosFiltrados.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          Exibindo {usuariosFiltrados.length} de {totalUsuarios} usuário(s)
        </div>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function UsuariosIndex() {
//   const nav = useNavigate();
//   const [usuarios, setUsuarios] = useState([]);

//   async function carregar() {
//     const snap = await getDocs(collection(db, "usuarios"));
//     setUsuarios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//   }

//   async function ativarOuDesativar(id, ativo) {
//     await updateDoc(doc(db, "usuarios", id), { ativo });
//     carregar();
//   }

//   async function excluir(id) {
//     if (!confirm("Tem certeza que deseja excluir?")) return;

//     await deleteDoc(doc(db, "usuarios", id));
//     carregar();
//   }

//   async function resetarSenha(email) {
//     alert(`Para resetar a senha de ${email}, use a função de redefinição no Firebase Auth.`);
//   }

//   useEffect(() => {
//     carregar();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Usuários</h1>

//       <button
//         className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
//         onClick={() => nav("/usuarios/novo")}
//       >
//         Novo Usuário
//       </button>

//       <table className="w-full border">
//         <thead className="bg-gray-100">
//           <tr className="text-left">
//             <th className="p-2 border">Nome</th>
//             <th className="p-2 border">Email</th>
//             <th className="p-2 border">Role</th>
//             <th className="p-2 border">Ativo</th>
//             <th className="p-2 border">Ações</th>
//           </tr>
//         </thead>

//         <tbody>
//           {usuarios.map((u) => (
//             <tr key={u.id} className="border">
//               <td className="p-2 border">{u.nome}</td>
//               <td className="p-2 border">{u.email}</td>
//               <td className="p-2 border">{u.role}</td>
//               <td className="p-2 border">{u.ativo ? "Sim" : "Não"}</td>
//               <td className="p-2 flex gap-2 border">
//                 <button
//                   className="px-2 py-1 bg-blue-600 text-white rounded"
//                   onClick={() => nav(`/usuarios/editar/${u.id}`)}
//                 >
//                   Editar
//                 </button>

//                 <button
//                   className="px-2 py-1 bg-yellow-600 text-white rounded"
//                   onClick={() => ativarOuDesativar(u.id, !u.ativo)}
//                 >
//                   {u.ativo ? "Desativar" : "Ativar"}
//                 </button>

//                 <button
//                   className="px-2 py-1 bg-indigo-600 text-white rounded"
//                   onClick={() => resetarSenha(u.email)}
//                 >
//                   Resetar Senha
//                 </button>

//                 <button
//                   className="px-2 py-1 bg-red-600 text-white rounded"
//                   onClick={() => excluir(u.id)}
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
