import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function NovoPresidio() {
  const nav = useNavigate();
  
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  async function salvar(e) {
    e.preventDefault();

    await addDoc(collection(db, "presidios"), {
      nome,
      cidade,
      estado,
      criadoEm: new Date(),
    });

    nav("/presidios");
  }

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Presídio</h1>
        <p className="text-gray-600 mt-1">Preencha as informações da unidade prisional</p>
      </div>

      <div className="max-w-3xl">
        {/* Card Ilustrativo */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 mb-6 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-5xl">🏢</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Nova Unidade Prisional</h2>
              <p className="text-blue-100">
                Cadastre uma nova unidade no sistema para começar a gerenciar Presos
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

          {/* Card de Informações Adicionais */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">ℹ️</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Importante</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Todos os campos marcados com * são obrigatórios</li>
                  <li>• Use nomes completos e oficiais dos presídios</li>
                  <li>• Verifique se o presídio já não está cadastrado</li>
                  <li>• Após cadastrar, você poderá vincular Presos e usuários</li>
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
              ✓ Cadastrar Presídio
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


// import { useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, addDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// export default function NovoPresidio() {
//   const nav = useNavigate();

//   const [nome, setNome] = useState("");
//   const [cidade, setCidade] = useState("");
//   const [estado, setEstado] = useState("");

//   async function salvar(e) {
//   e.preventDefault();
//   try {
//     const docRef = await addDoc(collection(db, "presidios"), {
//       nome,
//       cidade,
//       estado
//     });
//     console.log("Presídio criado, id:", docRef.id);
//     alert("Presídio cadastrado! ID: " + docRef.id);
//     nav("/presidios");
//   } catch (err) {
//     console.error("Erro ao salvar presídio:", err);
//     alert("Erro ao salvar presídio: " + (err.code || err.message || err));
//   }
// }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Novo Presídio</h1>

//       <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

//         <input
//           className="border p-2 rounded"
//           placeholder="Nome"
//           onChange={(e) => setNome(e.target.value)}
//         />

//         <input
//           className="border p-2 rounded"
//           placeholder="Cidade"
//           onChange={(e) => setCidade(e.target.value)}
//         />

//         <input
//           className="border p-2 rounded"
//           placeholder="Estado"
//           onChange={(e) => setEstado(e.target.value)}
//         />

//         <button className="bg-emerald-600 text-white p-2 rounded">
//           Salvar
//         </button>
//       </form>
//     </div>
//   );
// }
