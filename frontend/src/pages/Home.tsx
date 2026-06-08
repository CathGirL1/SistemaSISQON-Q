
import HomeContenedor from "../layouts/HomeContenedor";
import NavbarDeHome from "../components/NavbarDeHome";
import ContenidoHomeCarousel from "../components/ContenidoHomeCarousel";
import CardsContenidoHome from "../components/CardsContenidoHome";
import "../styles/Home.css";
export default function Home() {
  return (
    <>
        <HomeContenedor>
          <NavbarDeHome/>

          <ContenidoHomeCarousel/>

          <CardsContenidoHome/>

        </HomeContenedor>

    </>
   
  );
}