import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const nav = useNavigate();

  async function sair() {
    await signOut(auth);
    nav("/login");
  }

  return (
    <header className="w-full h-14 bg-white shadow flex items-center px-6 justify-between">
      <span className="font-semibold">Painel Administrativo</span>

      <button
        onClick={sair}
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Sair
      </button>
    </header>
  );
}
