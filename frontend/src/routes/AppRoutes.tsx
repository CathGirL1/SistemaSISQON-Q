import { BrowserRouter, Routes, Route } from "react-router-dom";

import Informacion from "../pages/Informacion";
import Home from "../pages/Home";
import Login from "../pages/Login"
import Register from "../pages/Register";

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/" element={<Home />} />
          <Route path="/informacion" element={<Informacion />} />
        </Routes>
      </BrowserRouter>
    </>
   
  );
}