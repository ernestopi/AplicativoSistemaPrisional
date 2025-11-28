import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarUsuario() {
  const { id } = useParams();
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [presidioId, setPresidioId] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [presidios, setPresidios] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function carregarDados() {
    const ref = doc(db, "usuarios", id);
    const snap = await getDoc(ref);
    const d = snap.data();

    setNome(d.nome || "");
    setEmail(d.email || "");
    setRole(d.role || "");
    setPresidioId(d.presidioId || "");
    setAtivo(d.ativo ?? true);
    setLoading(false);
  }

  async function salvar(e) {
    e.preventDefault();

    const presidio = presidios.find(p => p.id === presidioId);

    await updateDoc(doc(db, "usuarios", id), {
      nome,
      role,
      presidioId: presidioId || null,
      presidioNome: presidio?.nome || null,
      ativo,
    });

    nav("/usuarios");
  }

  useEffect(() => {
    carregarPresidios();
    carregarDados();
  }, []);

  const roles = [
    { value: "admin", label: "Administrador", icon: "👑", description: "Acesso total ao sistema" },
    { value: "diretor", label: "Diretor", icon: "👔", description: "Gerencia presídios e Presos" },
    { value: "agente", label: "Agente", icon: "👮", description: "Acesso limitado ao seu presídio" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Usuário</h1>
        <p className="text-gray-600 mt-1">Atualize as informações do usuário</p>
      </div>

      <div className="max-w-3xl">
        {/* Card Ilustrativo */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-5xl">✏️</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Editar Usuário</h2>
              <p className="text-blue-100">
                Atualize os dados e permissões do usuário
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={salvar}>
          {/* Card de Informações Básicas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              Informações Básicas
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Digite o nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                  value={email}
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  O email não pode ser alterado
                </p>
              </div>
            </div>
          </div>

          {/* Card de Função */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎭</span>
              Função no Sistema
            </h2>
            
            <div className="space-y-3">
              {roles.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    role === r.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="text-3xl">{r.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{r.label}</p>
                    <p className="text-sm text-gray-600">{r.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Card de Presídio (apenas se não for admin) */}
          {role !== "admin" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🏢</span>
                Presídio
              </h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selecione o Presídio {role === "agente" && "*"}
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  value={presidioId}
                  onChange={(e) => setPresidioId(e.target.value)}
                  required={role === "agente"}
                >
                  <option value="">Nenhum presídio</option>
                  {presidios.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
                {role === "agente" && (
                  <p className="text-sm text-gray-600 mt-2">
                    Agentes devem estar vinculados a um presídio
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Card de Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔐</span>
              Status do Usuário
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <div className="text-2xl">✓</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Usuário Ativo</p>
                  <p className="text-sm text-gray-600">
                    {ativo 
                      ? "Este usuário pode acessar o sistema normalmente" 
                      : "Este usuário NÃO pode acessar o sistema"
                    }
                  </p>
                </div>
              </label>
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
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Alterar a função do usuário pode modificar suas permissões</li>
                  <li>• O email não pode ser alterado após o cadastro</li>
                  <li>• Usuários inativos não conseguem fazer login</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
            >
              ✓ Salvar Alterações
            </button>
            <button
              type="button"
              onClick={() => nav("/usuarios")}
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
// import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditarUsuario() {
//   const { id } = useParams();
//   const nav = useNavigate();

//   const [nome, setNome] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("agente");
//   const [ativo, setAtivo] = useState(true);
//   const [presidioId, setPresidioId] = useState("");

//   const [presidios, setPresidios] = useState([]);

//   async function carregarPresidios() {
//     const snap = await getDocs(collection(db, "presidios"));
//     setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   }

//   async function carregar() {
//     const ref = doc(db, "usuarios", id);
//     const snap = await getDoc(ref);
//     const d = snap.data();

//     setNome(d.nome);
//     setEmail(d.email);
//     setRole(d.role);
//     setAtivo(d.ativo);
//     setPresidioId(d.presidioId || "");
//   }

//   async function salvar(e) {
//     e.preventDefault();

//     await updateDoc(doc(db, "usuarios", id), {
//       nome,
//       email,
//       role,
//       ativo,
//       presidioId: presidioId || null
//     });

//     nav("/usuarios");
//   }

//   useEffect(() => {
//     carregarPresidios();
//     carregar();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>

//       <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

//         <input
//           className="p-2 border rounded"
//           value={nome}
//           onChange={(e) => setNome(e.target.value)}
//           placeholder="Nome"
//         />

//         <input
//           className="p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />

//         <select
//           className="p-2 border rounded"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="admin">Administrador</option>
//           <option value="diretor">Diretor</option>
//           <option value="agente">Agente</option>
//         </select>

//         <select
//           className="p-2 border rounded"
//           value={presidioId}
//           onChange={(e) => setPresidioId(e.target.value)}
//         >
//           <option value="">Nenhum</option>
//           {presidios.map((p) => (
//             <option key={p.id} value={p.id}>{p.nome}</option>
//           ))}
//         </select>

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={ativo}
//             onChange={(e) => setAtivo(e.target.checked)}
//           />
//           Ativo
//         </label>

//         <button className="bg-blue-600 text-white p-2 rounded">
//           Salvar
//         </button>
//       </form>
//     </div>
//   );
// }
