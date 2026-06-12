
import HomeContenedor from "../layouts/HomeContenedor";
import NavbarDeHome from "../components/NavbarDeHome";
import ContenidoHomeCarousel from "../components/ContenidoHomeCarousel";
import CardsContenidoHome from "../components/CardsContenidoHome";
import FooterHome from "../components/FooterHome";

export default function Home() {
  return (
    <>
        <HomeContenedor>
          <NavbarDeHome/>

          <ContenidoHomeCarousel/>

          <CardsContenidoHome/>

          <FooterHome/>

        </HomeContenedor>

    </>
   
  );
}