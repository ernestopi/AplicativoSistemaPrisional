import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function PresidioIndex() {
  const [presidios, setPresidios] = useState([]);

  async function carregar() {
    const snap = await getDocs(collection(db, "presidios"));
    const lista = snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    setPresidios(lista);
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente excluir este presídio?")) return;
    await deleteDoc(doc(db, "presidios", id));
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Presídios</h1>
        <Link
          to="/presidios/novo"
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Novo Presídio
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nome</th>
            <th className="border p-2">Cidade</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {presidios.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.nome}</td>
              <td className="border p-2">{p.cidade}</td>
              <td className="border p-2">{p.estado}</td>
              <td className="border p-2 flex gap-2">
                <Link
                  to={`/presidios/editar/${p.id}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Editar
                </Link>

                <button
                  onClick={() => excluir(p.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
