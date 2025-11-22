import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Conteúdo Principal com Margem */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
// import { Outlet } from "react-router-dom";

// export default function Layout() {
//   return (
//     <div className="flex">
//       <Sidebar />

//       <main className="flex-1">
//         <Topbar />
//         <div className="p-6">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }
