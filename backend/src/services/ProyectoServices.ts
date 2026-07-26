import { Proyecto } from "../models/Proyecto";
import { ProyectoRepository } from "../repositories/ProyectoRepository";

export class ProyectoService {

    private proyectoRepository: ProyectoRepository;

    constructor() {
        this.proyectoRepository = new ProyectoRepository();
    }

    public async crearProyecto(proyecto: Proyecto): Promise<boolean> {

        return await this.proyectoRepository.crearProyecto(proyecto);

    }

}