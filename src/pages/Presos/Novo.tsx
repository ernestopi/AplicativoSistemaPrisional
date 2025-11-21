import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import UploadFoto from "../../components/UploadFoto";
import { useNavigate } from "react-router-dom";


export default function NovoPreso() {
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [situacao, setSituacao] = useState("Provisório");
  const [foto, setFoto] = useState(null);
  const [presidioId, setPresidioId] = useState("");
  const [presidios, setPresidios] = useState([]);

  // Carregar lista de presídios
  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function salvar(e) {
    e.preventDefault();

    const p = presidios.find((x) => x.id === presidioId);

    await addDoc(collection(db, "presos"), {
      nome,
      situacao,
      foto: foto || null,
      presidioId: presidioId || null,
      presidioNome: p?.nome ?? "",
      criadoEm: new Date(),
    });

    nav("/presos");
  }

  useEffect(() => {
    carregarPresidios();
  }, []);

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">Novo Preso</h1>

      <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

        {/* upload */}
        <UploadFoto onUpload={setFoto} />

        {/* preview */}
        {foto && (
          <img
            src={foto}
            className="w-32 h-32 rounded border object-cover"
          />
        )}

        <input
          className="border p-2 rounded"
          placeholder="Nome completo"
          onChange={(e) => setNome(e.target.value)}
        />

        <select
          className="border p-2 rounded"
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
          onChange={(e) => setPresidioId(e.target.value)}
        >
          <option value="">Selecione o presídio</option>
          {presidios.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <button className="bg-emerald-600 p-2 rounded text-white">
          Salvar
        </button>
      </form>
    </div>
  );
}
