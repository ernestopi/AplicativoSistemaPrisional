import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Auth/Login";
import PresidioIndex from "./pages/Presidios/Index";
import PresidioNovo from "./pages/Presidios/Novo";
import EditarPresidio from "./pages/Presidios/Editar";
import PresosIndex from "./pages/Presos/Index";
import NovoPreso from "./pages/Presos/Novo";
import EditarPreso from "./pages/Presos/Editar";
import UsuariosIndex from "./pages/Usuarios/Index";
import UsuarioNovo from "./pages/Usuarios/Novo";
import UsuarioEditar from "./pages/Usuarios/Editar";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* ROTAS PROTEGIDAS */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="presidios" element={<PresidioIndex />} />
          <Route path="presidios/novo" element={<PresidioNovo />} />
          <Route path="presidios/editar/:id" element={<EditarPresidio />} />
          <Route path="presos" element={<PresosIndex />} />
          <Route path="presos/novo" element={<NovoPreso />} />
          <Route path="presos/editar/:id" element={<EditarPreso />} />
          <Route path="usuarios" element={<UsuariosIndex />} />
          <Route path="usuarios/novo" element={<UsuarioNovo />} />
          <Route path="usuarios/editar/:id" element={<UsuarioEditar />} />

        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
