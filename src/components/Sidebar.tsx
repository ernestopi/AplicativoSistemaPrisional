import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white px-4 py-6">
      <h1 className="text-xl font-bold mb-8">Painel SEAP</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/presidios" className="hover:text-emerald-400">Presídios</Link>
        <Link to="/presos" className="hover:text-emerald-400">Presos</Link>
        <Link to="/usuarios" className="hover:text-emerald-400">Usuários</Link>
      </nav>
    </aside>
  );
}
