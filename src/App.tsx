import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

import "./App.css";

import RequireAuth from "./routes/RequireAuth";

import { useAuthContext } from "./pages/login/context";
import { Login } from "./pages/login/login";
import NotFound from "./pages/notFound/notFound";


import Prospects from "./pages/prospects/prospectsPJ/prospects";
import OrdersRH from "./pages/orders/ordersRH/ordersRH";

import Contacts from "./pages/messages/contacts";
import Users from "./pages/management/users/users";
import UserProfile from "./pages/management/userProfile/userProfile";
import CheckOperadora from "./pages/tools/checkOperadora/checkOperadora";
import CheckAnatel from "./pages/tools/checkAnatel/checkAnatel";
import ZapChecker from "./pages/tools/zapChecker/zapChecker";
import PJChecker from "./pages/tools/pjChecker/pjChecker";
import Base2bSocio from "./pages/tools/base2bSocio/base2bSocio";
import Base2bEmpresa from "./pages/tools/base2bEmpresa/base2bEmpresa";
import { Chats } from "./pages/chats/chats";
import Evolution from "./pages/evolution/evolution";
import AdminLayout from "./layouts/adminLayout";

export default function App() {
  const { user, checkAuth } = useAuthContext();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            user ? (
              <Navigate to="/admin/pedidos-rh" replace />
            ) : (
              <Login />
            )
          }
        />


        <Route element={<RequireAuth user={user} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/evolution" element={<Evolution />} />
            <Route path="/admin/chats" element={<Chats />} />
            <Route path="/admin/check-operadora" element={<CheckOperadora />} />
            <Route path="/admin/check-anatel" element={<CheckAnatel />} />
            <Route path="/admin/zap-checker" element={<ZapChecker />} />
            <Route path="/admin/pj-checker" element={<PJChecker />} />
            <Route path="/admin/base2b-socio" element={<Base2bSocio />} />
            <Route path="/admin/base2b-empresa" element={<Base2bEmpresa />} />

            <Route path="/admin/contatos" element={<Contacts />} />
            <Route path="/admin/prospects-pj" element={<Prospects />} />

            <Route
              path="/admin/pedidos-rh"
              element={<OrdersRH />}
            />


            <Route path="/admin/usuarios" element={<Users />} />
            <Route path="/admin/perfil-usuario/:id" element={<UserProfile />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            user ? (
              <Navigate to="/admin/pedidos-rh" replace />
            ) : (
              <NotFound />
            )
          }
        />
      </Routes>

      {/* componente do Toast. Só aparece quando da import no lugar desejado: "import { toast } from "sonner";" */}
      <Toaster
        duration={5000}
        position="bottom-right"
        richColors
        expand={true}
        visibleToasts={6}
        toastOptions={{
          style: {
            pointerEvents: "auto",
          },
        }}
      />
    </Router>
  );
}
