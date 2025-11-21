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

  const [nome, setNome] = useState("");
  const [situacao, setSituacao] = useState("");
  const [foto, setFoto] = useState(null);
  const [presidioId, setPresidioId] = useState("");
  const [presidios, setPresidios] = useState([]);

  // Carregar lista de presídios
  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  // Carregar dados do preso
  async function carregarDados() {
    const ref = doc(db, "presos", id);
    const snap = await getDoc(ref);
    const d = snap.data();

    setNome(d.nome);
    setSituacao(d.situacao);
    setFoto(d.foto ?? null);
    setPresidioId(d.presidioId ?? "");
  }

  async function salvar(e) {
    e.preventDefault();

    const p = presidios.find((x) => x.id === presidioId);

    await updateDoc(doc(db, "presos", id), {
      nome,
      situacao,
      foto,
      presidioId: presidioId || null,
      presidioNome: p?.nome ?? "",
    });

    nav("/presos");
  }

  useEffect(() => {
    carregarPresidios();
    carregarDados();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Preso</h1>

      <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

        {/* preview da foto */}
        {foto && (
          <img
            src={foto}
            className="w-32 h-32 rounded border object-cover"
          />
        )}

        {/* upload da foto */}
        <UploadFoto onUpload={setFoto} />

        <input
          className="border p-2 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
        />

        <select
          className="border p-2 rounded"
          value={situacao}
          onChange={(e) => setSituacao(e.target.value)}
        >
          <option>Provisório</option>
          <option>Condenado</option>
          <option>Saída temporária</option>
          <option>Transferido</option>
          <option>Fuga</option>
        </select>

        <select
          className="border p-2 rounded"
          value={presidioId}
          onChange={(e) => setPresidioId(e.target.value)}
        >
          <option value="">Selecione o presídio</option>
          {presidios.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <button className="bg-blue-600 p-2 rounded text-white">
          Salvar
        </button>
      </form>
    </div>
  );
}
