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

      // 2. Criar documento no Firestore
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nome,
        email,
        role,
        presidioId: presidioId || null,
        ativo: true,
        criadoEm: serverTimestamp(),
      });

      nav("/usuarios");
    } catch (err) {
      setErro("Erro ao cadastrar usuário. Talvez o email já exista.");
      console.error(err);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Novo Usuário</h1>

      {erro && (
        <div className="p-2 bg-red-200 text-red-800 rounded mb-2">
          {erro}
        </div>
      )}

      <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

        <input
          className="border p-2 rounded"
          placeholder="Nome completo"
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Administrador</option>
          <option value="diretor">Diretor</option>
          <option value="agente">Agente</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setPresidioId(e.target.value)}
        >
          <option value="">Nenhum presídio</option>
          {presidios.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <button className="bg-emerald-600 text-white p-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
}
