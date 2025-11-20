import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function PresosIndex() {
  const [presos, setPresos] = useState([]);

  async function carregar() {
    const snap = await getDocs(collection(db, "presos"));
    const lista = snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    setPresos(lista);
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente excluir este preso?")) return;
    await deleteDoc(doc(db, "presos", id));
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Presos</h1>
        <Link
          to="/presos/novo"
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Novo Preso
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Foto</th>
            <th className="border p-2">Nome</th>
            <th className="border p-2">Presídio</th>
            <th className="border p-2">Situação</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {presos.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">
                <img
                  src={p.foto}
                  alt=""
                  className="w-12 h-12 rounded object-cover"
                />
              </td>
              <td className="border p-2">{p.nome}</td>
              <td className="border p-2">{p.presidioNome}</td>
              <td className="border p-2">{p.situacao}</td>
              <td className="border p-2">
                <div className="flex gap-2">
                  <Link
                    to={`/presos/editar/${p.id}`}
                    className="px-3 py-1 rounded bg-blue-600 text-white"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => excluir(p.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
