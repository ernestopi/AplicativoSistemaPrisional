import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function UsuariosIndex() {
  const nav = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  async function carregar() {
    const snap = await getDocs(collection(db, "usuarios"));
    setUsuarios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function ativarOuDesativar(id, ativo) {
    await updateDoc(doc(db, "usuarios", id), { ativo });
    carregar();
  }

  async function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    await deleteDoc(doc(db, "usuarios", id));
    carregar();
  }

  async function resetarSenha(email) {
    alert(`Para resetar a senha de ${email}, use a função de redefinição no Firebase Auth.`);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>

      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => nav("/usuarios/novo")}
      >
        Novo Usuário
      </button>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Ativo</th>
            <th className="p-2 border">Ações</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="border">
              <td className="p-2 border">{u.nome}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{u.ativo ? "Sim" : "Não"}</td>
              <td className="p-2 flex gap-2 border">
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                  onClick={() => nav(`/usuarios/editar/${u.id}`)}
                >
                  Editar
                </button>

                <button
                  className="px-2 py-1 bg-yellow-600 text-white rounded"
                  onClick={() => ativarOuDesativar(u.id, !u.ativo)}
                >
                  {u.ativo ? "Desativar" : "Ativar"}
                </button>

                <button
                  className="px-2 py-1 bg-indigo-600 text-white rounded"
                  onClick={() => resetarSenha(u.email)}
                >
                  Resetar Senha
                </button>

                <button
                  className="px-2 py-1 bg-red-600 text-white rounded"
                  onClick={() => excluir(u.id)}
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
