import { Request, Response } from "express";

import { Proyecto } from "../models/Proyecto";
import { ProyectoService } from "../services/ProyectoServices";

export class ProyectoController {

    private proyectoService: ProyectoService;

    constructor() {
        this.proyectoService = new ProyectoService();
    }
    
    public crearProyecto = async (req: Request, res: Response): Promise<void> => {
        console.log("BODY:", req.body);
        try {

            const {
               
                idCliente,
                idEmpresa,
                idTipoObra,
                nombre,
                estado,
                alto,
                ancho,
                largo, 
              
            } = req.body;

            const proyecto = new Proyecto(
                null,
                idEmpresa,
                idCliente,
                idTipoObra,
                nombre,
                estado,
                alto,
                ancho,
                largo
            );
            console.log("ID CLIENTE:", proyecto.idCliente);
            const creado = await this.proyectoService.crearProyecto(proyecto);

            if (creado) {

                res.status(201).json({
                    success: true,
                    message: "Proyecto creado correctamente."
                });

                return;
            }

            res.status(400).json({
                success: false,
                message: "No se pudo crear el proyecto."
            });

        } catch (error: any) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    };

}