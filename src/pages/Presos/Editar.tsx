import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import UploadFoto from "../../components/UploadFoto";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarPreso() {
  const { id } = useParams();
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [situacao, setSituacao] = useState("");
  const [foto, setFoto] = useState("");
  const [presidioId, setPresidioId] = useState("");
  const [presidios, setPresidios] = useState([]);

  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function carregarDados() {
    const snap = await getDoc(doc(db, "presos", id));
    const dados = snap.data();

    setNome(dados.nome);
    setSituacao(dados.situacao);
    setFoto(dados.foto ?? ""); // <- CORRIGIDO
    setPresidioId(dados.presídio);
  }

  async function salvar(e) {
    e.preventDefault();

    const pres = presidios.find((p) => p.id === presidioId);

    await updateDoc(doc(db, "presos", id), {
      nome,
      situacao,
      foto,
      presídio: presidioId,
      presidioNome: pres.nome
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

        <img src={foto} className="w-32 h-32 rounded border object-cover" />

        <UploadFoto onUpload={setFoto} />
        {foto && (
            <img 
                src={foto} 
                className="w-32 h-32 rounded border object-cover"
            />
        )}
            

        <input
          className="border p-2 rounded"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
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
          {presidios.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <button className="bg-blue-600 p-2 rounded text-white">
          Atualizar
        </button>
      </form>
    </div>
  );
}
