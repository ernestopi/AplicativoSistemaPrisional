import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarUsuario() {
  const { id } = useParams();
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("agente");
  const [ativo, setAtivo] = useState(true);
  const [presidioId, setPresidioId] = useState("");

  const [presidios, setPresidios] = useState([]);

  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function carregar() {
    const ref = doc(db, "usuarios", id);
    const snap = await getDoc(ref);
    const d = snap.data();

    setNome(d.nome);
    setEmail(d.email);
    setRole(d.role);
    setAtivo(d.ativo);
    setPresidioId(d.presidioId || "");
  }

  async function salvar(e) {
    e.preventDefault();

    await updateDoc(doc(db, "usuarios", id), {
      nome,
      email,
      role,
      ativo,
      presidioId: presidioId || null
    });

    nav("/usuarios");
  }

  useEffect(() => {
    carregarPresidios();
    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>

      <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

        <input
          className="p-2 border rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />

        <input
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <select
          className="p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Administrador</option>
          <option value="diretor">Diretor</option>
          <option value="agente">Agente</option>
        </select>

        <select
          className="p-2 border rounded"
          value={presidioId}
          onChange={(e) => setPresidioId(e.target.value)}
        >
          <option value="">Nenhum</option>
          {presidios.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
          />
          Ativo
        </label>

        <button className="bg-blue-600 text-white p-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
}
