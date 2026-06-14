import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import NavbarDeHome from "../components/NavbarDeHome";
import ComoFunciona from "../components/ComoFunciona";
import BeneficiosInformacion from "../components/BeneficiosInformacion";
import ParaEmpresas from "../components/ParaEmpresas";
import AyudaInformacion from "../components/AyudaInformacion";
import FooterHome from "../components/FooterHome";

export default function Informacion() {

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);

            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 100);
            }
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [location]);

    return (
        <>
            <NavbarDeHome />

            <ComoFunciona />

            <BeneficiosInformacion />

            <ParaEmpresas />

            <AyudaInformacion />

            <FooterHome />
        </>
    );
}