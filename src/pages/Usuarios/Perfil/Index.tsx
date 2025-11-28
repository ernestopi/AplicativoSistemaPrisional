import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function PerfilUsuario() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Campos editáveis
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  const [presidioNome, setPresidioNome] = useState("");

  // -------------------------------------------------------------------
  // Carregar dados do Firestore
  // -------------------------------------------------------------------
  async function carregarDados() {
    if (!user) return;

    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setDados(data);
      setTelefone(data.telefone || "");
      setCargo(data.cargo || "");
      setPresidioNome(data.presidioNome || "");
    }

    setLoading(false);
  }

  // -------------------------------------------------------------------
  // Salvar
  // -------------------------------------------------------------------
  async function salvarPerfil() {
    if (!user) return;

    const ref = doc(db, "usuarios", user.uid);

    await updateDoc(ref, {
      telefone,
      cargo,
      presidioNome,
    });

    alert("Informações atualizadas com sucesso!");

    // 🔥 Voltar automaticamente para a página anterior
    navigate(-1);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Carregando informações...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 text-white 
                          rounded-full flex items-center justify-center text-4xl font-bold shadow">
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          <p className="mt-3 text-lg font-semibold text-gray-800">
            {dados?.nomeCompleto || user?.email?.split("@")[0]}
          </p>

          <p className="text-gray-500 text-sm">{user?.email}</p>

          <span className="mt-1 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
            Administrador
          </span>
        </div>

        {/* Formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(99) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo / Função
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Ex.: Policial Penal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidade / Presídio
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={presidioNome}
              onChange={(e) => setPresidioNome(e.target.value)}
              placeholder="Nome do Presídio"
            />
          </div>
        </div>

        {/* BOTÃO SALVAR */}
        <div className="mt-6">
          <button
            onClick={salvarPerfil}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
