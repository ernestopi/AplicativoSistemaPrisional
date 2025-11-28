import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    {
      title: "PRINCIPAL",
      items: [
        { 
          icon: "📊", 
          label: "Relatórios", 
          path: "/relatorios",
          active: isActive("/relatorios")
        },
      ]
    },
    {
      title: "GESTÃO",
      items: [
        { 
          icon: "🏢", 
          label: "Presídios", 
          path: "/presidios",
          active: isActive("/presidios")
        },
        { 
          icon: "👤", 
          label: "Presos", 
          path: "/Presos",
          active: isActive("/Presos")
        },
        { 
          icon: "👥", 
          label: "Usuários", 
          path: "/usuarios",
          active: isActive("/usuarios")
        },
      ]
    },
  ];

  return (
    <aside className="w-64 min-h-screen h-full bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-2xl fixed left-0 top-0 bottom-0 overflow-y-auto">

      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-xl">
            🔒
          </div>
          <div>
            <h1 className="text-lg font-bold">SEAP</h1>
            <p className="text-xs text-slate-400">Sistema Prisional</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">

            {/* Título da Seção */}
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              {section.title}
            </h3>

            {/* Itens */}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${item.active 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>

                  {item.active && (
                    <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Versão do Sistema</p>
          <p className="text-sm font-semibold">v2.0.0</p>
        </div>
      </div>

    </aside>
  );
}
