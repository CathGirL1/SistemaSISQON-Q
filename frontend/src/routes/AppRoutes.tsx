import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeContenedor from "../pages/HomeContenedor";
import Login from "../pages/Login"

export default function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeContenedor />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
   
  );
}