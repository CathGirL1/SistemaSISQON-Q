import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "../pages/Home";
import Login from "../pages/Login"
import Register from "../pages/Register";
import PanelCliente from "../pages/PanelCliente";
import PanelEmpresa from "../pages/PanelEmpresa";
import RecuperarContrasenia from "../pages/RecuperarContrasenia";

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
          <Route path="/recuperar-password" element={<RecuperarContrasenia />}/>
        </Routes>
      </BrowserRouter>
    </>
   
  );
}