// src/components/Topbar.tsx
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Topbar() {
  const nav = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  async function sair() {
    await signOut(auth);
    nav("/login");
  }

  const notifications = [
    { id: 1, message: "Novo preso cadastrado", time: "5 min atrás", unread: true },
    { id: 2, message: "Conferência realizada", time: "1 hora atrás", unread: true },
    { id: 3, message: "Relatório gerado", time: "2 horas atrás", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm sticky top-0 z-40">
      {/* Esquerda - Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => nav(-1)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span>←</span>
          <span>Voltar</span>
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <h2 className="text-lg font-semibold text-gray-800">Painel Administrativo</h2>
      </div>

      {/* Direita - Ações */}
      <div className="flex items-center gap-3">
        {/* Notificações */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown de Notificações */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                      notif.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {notif.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Exemplo: navegar para uma página de todas as notificações
                    setShowNotifications(false);
                    nav("/notificacoes");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todas
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Perfil */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-expanded={showProfile}
            aria-haspopup="true"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {auth.currentUser?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-900">
                {auth.currentUser?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown de Perfil */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {auth.currentUser?.email}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Admin</p>
              </div>

              <div className="py-1">
                {/* Meu Perfil - navega e fecha dropdown */}
                <button
                  onClick={() => {
                    setShowProfile(false);
                    nav("/usuarios/perfil");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <span>👤</span> Meu Perfil
                </button>

                {/* Configurações - exemplo de navegação */}
                <button
                  onClick={() => {
                    setShowProfile(false);
                    nav("/configuracoes");
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <span>⚙️</span> Configurações
                </button>
              </div>

              <div className="border-t border-gray-200 py-1">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    sair();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <span>🚪</span> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
