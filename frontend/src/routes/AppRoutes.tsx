import { BrowserRouter, Routes, Route } from "react-router-dom";

import Informacion from "../pages/Informacion";
import Home from "../pages/Home";
import Login from "../pages/Login"
import Register from "../pages/Register";
import PanelCliente from "../pages/PanelCliente";
import PanelEmpresa from "../pages/PanelEmpresa";


import RecuperarContrasenia from "../pages/RecuperarContrasenia";
import DashboardEmpresa from "../pages/DashboardEmpresa";
import MiPerfilEmpresa from "../pages/MiPerfilEmpresa";
import CotizacionesEmpresa from "../pages/CotizacionesEmpresa";
import ClientesEmpresa from "../pages/ClientesEmpresa";
import MaterialesEmpresa from "../pages/MaterialesEmpresa";
import TiposObraEmpresa from "../pages/TiposObraEmpresa";
import ManoObraEmpresa from "../pages/ManoObraEmpresa";



import MisProyectos from "../pages/cliente/MisProyectos";
import MisCotizaciones from "../pages/cliente/MisCotizaciones";
import CatalogoMateriales from "../pages/cliente/CatalogoMateriales";
import Comparador from "../pages/cliente/Comparador";
import Empresas from "../pages/cliente/Empresas";


import RegistroProyecto from "../pages/cliente/gestionProyecto/RegistroProyecto";



import EmpresasFavoritas from "../pages/cliente/EmpresasFavoritas";
import AsistenteIA from "../pages/cliente/AsistenteIA";
import CrearProyecto from "../pages/cliente/CrearProyecto";
import DetalleProyecto from "../pages/cliente/DetalleProyecto"
import DetalleCotizacion from "../pages/cliente/DetalleCotizacion";



export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/panel-cliente" element={<PanelCliente />}/>

          <Route path="/registro-proyecto" element={<RegistroProyecto />}
/>

          <Route path="/panel-empresa" element={<PanelEmpresa />}/>
          <Route path="/recuperar-password" element={<RecuperarContrasenia />}/>
          <Route path="/informacion" element={<Informacion />} />
          <Route path="/empresa/dashboard" element={<DashboardEmpresa />} />
          <Route path="/empresa/perfil" element={<MiPerfilEmpresa />} />
          <Route path="/empresa/cotizaciones" element={<CotizacionesEmpresa />} />
          <Route path="/empresa/clientes" element={<ClientesEmpresa />} />
          <Route path="/empresa/materiales" element={<MaterialesEmpresa />} />
          <Route path="/empresa/tipos-obra" element={<TiposObraEmpresa />} />
          <Route path="/empresa/mano-obra"  element={<ManoObraEmpresa />}
/>

          <Route path="/panel-cliente/cotizaciones" element={<MisCotizaciones />} />
          <Route path="/panel-cliente/materiales" element={<CatalogoMateriales />} />
          <Route path="/panel-cliente/comparador" element={<Comparador />} />
          <Route path="/panel-cliente/empresas" element={<Empresas />} />
          <Route path="/panel-cliente/asistente" element={<AsistenteIA />} />
       

          <Route path="/panel-cliente/proyectos" element={<MisProyectos />} />
          <Route path="/panel-cliente/proyectos/crear" element={<CrearProyecto />} />
          <Route path="/panel-cliente/proyectos/:idProyecto" element={<DetalleProyecto />}/>
          <Route path="/panel-cliente/cotizaciones/:idCotizacion" element={<DetalleCotizacion />} />
          <Route path="/panel-cliente/favoritas" element={<EmpresasFavoritas />} />
          <Route path="/panel-cliente/asistente" element={<AsistenteIA />} />

        </Routes>
      </BrowserRouter>
    </>
   
  );
}