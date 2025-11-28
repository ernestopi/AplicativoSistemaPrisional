import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import UploadFoto from "../../components/UploadFoto";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarPreso() {
  const { id } = useParams();
  const nav = useNavigate();

  const [presidios, setPresidios] = useState([]);

  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState(null);
  const [matricula, setMatricula] = useState("");
  const [pavilhao, setPavilhao] = useState("");
  const [cela, setCela] = useState("");
  const [situacao, setSituacao] = useState("");
  const [presidioId, setPresidioId] = useState("");

  const [loading, setLoading] = useState(true);

  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function carregarDados() {
    if (!id) return;

    const ref = doc(db, "presos", id);   // ✔ corrigido
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("Preso não encontrado.");
      nav("/presos");
      return;
    }

    const d = snap.data();

    setNome(d.nome || "");
    setMatricula(d.matricula || "");
    setPavilhao(d.pavilhao || "");
    setCela(d.cela || "");
    setSituacao(d.situacao || "");
    setPresidioId(d.presidioId || "");
    setFoto(d.foto || null);

    setLoading(false);
  }

  async function salvar(e) {
    e.preventDefault();

    await updateDoc(doc(db, "presos", id), {   // ✔ corrigido
      nome,
      matricula,
      pavilhao,
      cela,
      situacao,
      presidioId,
      foto,
    });

    alert("Preso atualizado com sucesso!");
    nav("/presos");    // ✔ corrigido
  }

  useEffect(() => {
    carregarPresidios();
    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Preso</h1>

      <form onSubmit={salvar} className="space-y-4 bg-white p-6 rounded-xl shadow">

        {foto && (
          <img
            src={foto}
            alt="Foto"
            className="w-24 h-24 rounded-full border object-cover"
          />
        )}

        <UploadFoto onUpload={setFoto} />

        <div>
          <label>Nome</label>
          <input
            className="w-full border p-2 rounded"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Matrícula</label>
          <input
            className="w-full border p-2 rounded"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
        </div>

        <div>
          <label>Pavilhão</label>
          <input
            className="w-full border p-2 rounded"
            value={pavilhao}
            onChange={(e) => setPavilhao(e.target.value)}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Salvar Alterações
        </button>

      </form>
    </div>
  );
}
