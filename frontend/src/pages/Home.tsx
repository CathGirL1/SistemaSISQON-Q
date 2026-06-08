
import HomeContenedor from "../layouts/HomeContenedor";
import NavbarDeHome from "../components/NavbarDeHome";
import ContenidoHomeCarousel from "../components/ContenidoHomeCarousel";
import "../styles/Home.css";
export default function Home() {
  return (
    <>
        <HomeContenedor>
          <NavbarDeHome/>

          <ContenidoHomeCarousel/>

        </HomeContenedor>

    </>
   
  );
}