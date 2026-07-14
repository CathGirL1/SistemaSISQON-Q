import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "../pages/Home";
import Login from "../pages/Login"
import Register from "../pages/Register";
import PanelCliente from "../pages/PanelCliente";
import PanelEmpresa from "../pages/PanelEmpresa";
import MisProyectos from "../pages/cliente/MisProyectos";
import MisCotizaciones from "../pages/cliente/MisCotizaciones";
import CatalogoMateriales from "../pages/cliente/CatalogoMateriales";
import Comparador from "../pages/cliente/Comparador";
import Empresas from "../pages/cliente/Empresas";
import EmpresasFavoritas from "../pages/cliente/EmpresasFavoritas";
import AsistenteIA from "../pages/cliente/AsistenteIA";

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/panel-cliente" element={<PanelCliente />}/>
          <Route path="/panel-cliente/proyectos" element={<MisProyectos />} />
          <Route path="/panel-cliente/cotizaciones" element={<MisCotizaciones />} />
          <Route path="/panel-cliente/proyectos" element={<MisProyectos />} />
          <Route path="/panel-cliente/materiales" element={<CatalogoMateriales />} />
          <Route path="/panel-cliente/comparador" element={<Comparador />} />
          <Route path="/panel-cliente/empresas" element={<Empresas />} />
          <Route path="/panel-cliente/favoritas" element={<EmpresasFavoritas />} />
          <Route path="/panel-cliente/asistente" element={<AsistenteIA />} />
          <Route path="/panel-empresa" element={<PanelEmpresa />} />
        </Routes>
      </BrowserRouter>
    </>
   
  );
}