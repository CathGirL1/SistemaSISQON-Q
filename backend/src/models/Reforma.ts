import { Proyecto } from "./Proyecto";
import { ITipoObraStrategy } from "../interfaces/ITipoObraStrategy";

export class Reforma implements ITipoObraStrategy {

    public calcularManoDeObra(proyecto: Proyecto): number {

        return 0;

    }

}