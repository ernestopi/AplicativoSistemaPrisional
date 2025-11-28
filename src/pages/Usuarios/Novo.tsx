import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function NovoUsuario() {
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("agente");
  const [presidioId, setPresidioId] = useState("");
  const [presidios, setPresidios] = useState([]);
  const [erro, setErro] = useState("");

  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    carregarPresidios();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro("");

    try {
      const senhaPadrao = "123456";

      // 1. Criar usuário no Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, senhaPadrao);

      // 2. Obter nome do presídio
      const presidio = presidios.find(p => p.id === presidioId);

      // 3. Criar documento no Firestore
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nome,
        email,
        role,
        presidioId: presidioId || null,
        presidioNome: presidio?.nome || null,
        ativo: true,
        criadoEm: serverTimestamp(),
      });

      nav("/usuarios");
    } catch (err) {
      setErro("Erro ao cadastrar usuário. Talvez o email já exista.");
      console.error(err);
    }
  }

  const roles = [
    { value: "admin", label: "Administrador", icon: "👑", description: "Acesso total ao sistema" },
    { value: "diretor", label: "Diretor", icon: "👔", description: "Gerencia presídios e Presos" },
    { value: "agente", label: "Agente", icon: "👮", description: "Acesso limitado ao seu presídio" }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Usuário</h1>
        <p className="text-gray-600 mt-1">Crie um novo usuário para acessar o sistema</p>
      </div>

      <div className="max-w-3xl">
        {/* Card Ilustrativo */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-5xl">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Novo Usuário</h2>
              <p className="text-purple-100">
                Cadastre um novo usuário e defina suas permissões de acesso
              </p>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <p className="text-red-800 font-semibold">{erro}</p>
            </div>
          </div>
        )}

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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  placeholder="Digite o nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  placeholder="usuario@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-5 h-5 text-purple-600"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
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

          {/* Card de Informações */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">ℹ️</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Informações Importantes</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• A senha padrão será: <strong>123456</strong></li>
                  <li>• O usuário deve alterar a senha no primeiro acesso</li>
                  <li>• O email não pode estar cadastrado no sistema</li>
                  <li>• Administradores têm acesso total ao sistema</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all transform hover:scale-105"
            >
              ✓ Cadastrar Usuário
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
// import { auth, db } from "../../lib/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function NovoUsuario() {
//   const nav = useNavigate();

//   const [nome, setNome] = useState("");
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("agente");
//   const [presidioId, setPresidioId] = useState("");
//   const [presidios, setPresidios] = useState([]);
//   const [erro, setErro] = useState("");

//   async function carregarPresidios() {
//     const snap = await getDocs(collection(db, "presidios"));
//     setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   }

//   useEffect(() => {
//     carregarPresidios();
//   }, []);

//   async function salvar(e) {
//     e.preventDefault();
//     setErro("");

//     try {
//       const senhaPadrao = "123456";

//       // 1. Criar usuário no Firebase Auth
//       const cred = await createUserWithEmailAndPassword(auth, email, senhaPadrao);

//       // 2. Criar documento no Firestore
//       await setDoc(doc(db, "usuarios", cred.user.uid), {
//         nome,
//         email,
//         role,
//         presidioId: presidioId || null,
//         ativo: true,
//         criadoEm: serverTimestamp(),
//       });

//       nav("/usuarios");
//     } catch (err) {
//       setErro("Erro ao cadastrar usuário. Talvez o email já exista.");
//       console.error(err);
//     }
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Novo Usuário</h1>

//       {erro && (
//         <div className="p-2 bg-red-200 text-red-800 rounded mb-2">
//           {erro}
//         </div>
//       )}

//       <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

//         <input
//           className="border p-2 rounded"
//           placeholder="Nome completo"
//           onChange={(e) => setNome(e.target.value)}
//         />

//         <input
//           className="border p-2 rounded"
//           placeholder="E-mail"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <select
//           className="border p-2 rounded"
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="admin">Administrador</option>
//           <option value="diretor">Diretor</option>
//           <option value="agente">Agente</option>
//         </select>

//         <select
//           className="border p-2 rounded"
//           onChange={(e) => setPresidioId(e.target.value)}
//         >
//           <option value="">Nenhum presídio</option>
//           {presidios.map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.nome}
//             </option>
//           ))}
//         </select>

//         <button className="bg-emerald-600 text-white p-2 rounded">
//           Salvar
//         </button>
//       </form>
//     </div>
//   );
// }
