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
  try {
    const docRef = await addDoc(collection(db, "presidios"), {
      nome,
      cidade,
      estado
    });
    console.log("Presídio criado, id:", docRef.id);
    alert("Presídio cadastrado! ID: " + docRef.id);
    nav("/presidios");
  } catch (err) {
    console.error("Erro ao salvar presídio:", err);
    alert("Erro ao salvar presídio: " + (err.code || err.message || err));
  }
}

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Novo Presídio</h1>

      <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

        <input
          className="border p-2 rounded"
          placeholder="Nome"
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Cidade"
          onChange={(e) => setCidade(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Estado"
          onChange={(e) => setEstado(e.target.value)}
        />

        <button className="bg-emerald-600 text-white p-2 rounded">
          Salvar
        </button>
      </form>
    </div>
  );
}
