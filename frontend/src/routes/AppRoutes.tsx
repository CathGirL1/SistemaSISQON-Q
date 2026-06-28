import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "../pages/Home";
import Login from "../pages/Login"
import Register from "../pages/Register";
import PanelCliente from "../pages/PanelCliente";
import PanelEmpresa from "../pages/PanelEmpresa";
import DashboardEmpresa from "../pages/DashboardEmpresa";
import MiPerfilEmpresa from "../pages/MiPerfilEmpresa";
import CotizacionesEmpresa from "../pages/CotizacionesEmpresa";

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/panel-cliente" element={<PanelCliente />}/>
          <Route path="/panel-empresa" element={<PanelEmpresa />}/>
          <Route path="/empresa/dashboard" element={<DashboardEmpresa />} />
          <Route path="/empresa/perfil" element={<MiPerfilEmpresa />} />
          <Route path="/empresa/cotizaciones" element={<CotizacionesEmpresa />} />
          
        </Routes>
      </BrowserRouter>
    </>
   
  );
}