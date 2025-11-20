import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarPresidio() {
  const { id } = useParams();
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  async function carregar() {
    const snap = await getDoc(doc(db, "presidios", id));
    const dados = snap.data();

    setNome(dados.nome);
    setCidade(dados.cidade);
    setEstado(dados.estado);
  }

  async function salvar(e) {
    e.preventDefault();

    await updateDoc(doc(db, "presidios", id), {
      nome,
      cidade,
      estado
    });

    nav("/presidios");
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Presídio</h1>

      <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

        <input
          value={nome}
          className="border p-2 rounded"
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          value={cidade}
          className="border p-2 rounded"
          onChange={(e) => setCidade(e.target.value)}
        />

        <input
          value={estado}
          className="border p-2 rounded"
          onChange={(e) => setEstado(e.target.value)}
        />

        <button className="bg-blue-600 text-white p-2 rounded">
          Atualizar
        </button>
      </form>
    </div>
  );
}
