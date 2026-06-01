import { Proyecto } from "../models/Proyecto";

export interface ITipoObraStrategy {

    calcularManoDeObra( proyecto: Proyecto): number;

}