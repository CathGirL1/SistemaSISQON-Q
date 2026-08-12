import { Proyecto } from "./Proyecto";
import { ITipoObraStrategy } from "../interfaces/ITipoObraStrategy";

export class ConstruccionObra
  implements ITipoObraStrategy {

  public calcularManoDeObra(
    proyecto: Proyecto
  ): number {

    const alto = proyecto.alto;
    const ancho = proyecto.ancho;
    const largo = proyecto.largo;

    // Superficie de construcción
    const metrosConstruccion =
      ancho * largo;

    // Costo mínimo de construcción
    const costoPorMetro = 800;

    // Costo mínimo de construcción según
    // los metros cuadrados del proyecto
    const costoConstruccion =
      metrosConstruccion * costoPorMetro;

    // La altura forma parte de las dimensiones
    // disponibles del proyecto y podrá utilizarse
    // para ajustar el cálculo de mano de obra.
    const costoManoDeObra = 300;

    console.log("Alto:", alto);
    console.log("Ancho:", ancho);
    console.log("Largo:", largo);
    console.log(
      "Metros de construcción:",
      metrosConstruccion
    );

    return costoManoDeObra;
  }
}