import { ProyectoService } from "./ProyectoService";
import { MaterialService } from "./MaterialService";

import { Ollama } from "ollama";


export class AsistenteIA {

    private static instancia: AsistenteIA;
    private proyectoService = new ProyectoService();
    private materialService = new MaterialService();

    private ollama: Ollama;

    private constructor() {
        this.ollama = new Ollama();
    }

    public static obtenerInstancia(): AsistenteIA {

        if (!AsistenteIA.instancia) {
            AsistenteIA.instancia = new AsistenteIA();
        }

        return AsistenteIA.instancia;
    }

    public async preguntar(pregunta: string, idProyecto?: number): Promise<string> {

        const preguntaNormalizada =
            pregunta
                .toLowerCase()
                .trim();

        let contextoProyecto = "";

        if (idProyecto) {

        const proyecto =
            await this.proyectoService
                .obtenerProyectoPorId(idProyecto);

                contextoProyecto = `
            PROYECTO SELECCIONADO

            Nombre: ${proyecto.nombre}
            Tipo de obra: ${proyecto.tipoObra}
            Descripción: ${proyecto.descripcion ?? "Sin descripción"}
            Ubicación: ${proyecto.ubicacion ?? "Sin ubicación"}
            Alto: ${proyecto.alto} m
            Ancho: ${proyecto.ancho} m
            Largo: ${proyecto.largo} m
            Superficie: ${proyecto.superficie} m²
            `;
            }

            let contextoMateriales = "";

            if (idProyecto) {

                const materiales =
                    await this.materialService
                        .obtenerMateriales();

                const materialesDisponibles =
                    materiales
                        .filter(
                            (material) =>
                                material.estado === "Activo" &&
                                material.disponibilidad !== "Sin stock"
                        )
                        .sort(
                            (a, b) =>
                                Number(a.costoUnitario) -
                                Number(b.costoUnitario)
                        );

                if (materialesDisponibles.length > 0) {

                    contextoMateriales =
                        `
            MATERIALES REGISTRADOS Y DISPONIBLES EN SISCON-Q

            ${materialesDisponibles
                .map(
                    (material, index) => `
            ${index + 1}. ${material.nombre}
            Descripción: ${material.descripcion ?? "Sin descripción"}
            Categoría: ${material.categoria ?? "Sin categoría"}
            Precio: ${material.costoUnitario} USD
            Unidad: ${material.unidad ?? "Sin especificar"}
            Disponibilidad: ${material.disponibilidad}
            `
                )
                .join("\n")}
            `;
                }
            }

        if (
            preguntaNormalizada.includes("qué es siscon-q") ||
            preguntaNormalizada.includes("que es siscon-q") ||
            preguntaNormalizada.includes("qué es sisqon-q") ||
            preguntaNormalizada.includes("que es sisqon-q")
        ) {
            return this.responderQueEsSISCONQ();
        }

        if (
            preguntaNormalizada.includes("cómo funciona siscon-q") ||
            preguntaNormalizada.includes("como funciona siscon-q") ||
            preguntaNormalizada.includes("cómo funciona sisqon-q") ||
            preguntaNormalizada.includes("como funciona sisqon-q")
        ) {
            return this.responderComoFuncionaSISCONQ();
        }

        if (
            preguntaNormalizada.includes("tipos de obra") ||
            preguntaNormalizada.includes("qué obras maneja") ||
            preguntaNormalizada.includes("que obras maneja")
        ) {
            return this.responderTiposDeObra();
        }

        if (
            preguntaNormalizada.includes("qué puedo hacer") ||
            preguntaNormalizada.includes("que puedo hacer") ||
            preguntaNormalizada.includes("qué puedo hacer en siscon-q") ||
            preguntaNormalizada.includes("que puedo hacer en siscon-q")
        ) {
            return this.responderQuePuedoHacer();
        }

        return await this.responderConIA(pregunta, contextoProyecto,  contextoMateriales);
    }

    private responderQueEsSISCONQ(): string {

        return `
            SISCON-Q significa Sistema de Cotizaciones Inteligentes.

            Es un sistema desarrollado para gestionar cotizaciones de proyectos de construcción.

            El sistema permite gestionar:

            - Clientes.
            - Empresas.
            - Proyectos.
            - Materiales.
            - Cotizaciones.
                    `.trim();
                }

    private responderComoFuncionaSISCONQ(): string {

        return `
            SISCON-Q permite gestionar proyectos de construcción y generar cotizaciones estimadas.

            El sistema utiliza diferentes estrategias de cálculo según el tipo de obra seleccionado.

            De esta forma, el sistema puede realizar una estimación de costos para el proyecto y generar una cotización.

            Las empresas pueden gestionar información relacionada con materiales, precios y cotizaciones dentro del sistema.
                    `.trim();
                }

    private responderTiposDeObra(): string {

        return `
            SISCON-Q contempla los siguientes tipos de obra:

            - Quincho.
            - Requincho.
            - Construcción.
            - Reforma.
                    `.trim();
                }

    private responderQuePuedoHacer(): string {

        return `
            En SISCON-Q podés gestionar proyectos de construcción, consultar materiales, trabajar con empresas y generar cotizaciones.

            El sistema permite:

            - Gestionar proyectos.
            - Consultar materiales.
            - Consultar empresas.
            - Generar cotizaciones.
            - Consultar información relacionada con las cotizaciones.
                    `.trim();
    }

    private async responderConIA(
        pregunta: string,
        contextoProyecto: string,
        contextoMateriales: string
    ): Promise<string> {

        const contexto = `
        Sos el asistente inteligente de SISCON-Q.

        SISCON-Q es un sistema de cotizaciones inteligentes
        orientado a proyectos de construcción.

        ${contextoProyecto}
        ${contextoMateriales}

        El asistente puede responder preguntas técnicas generales
        relacionadas con construcción y quinchos.

        Conceptos que puede explicar:

        - Quincho: espacio destinado principalmente a actividades
        sociales y recreativas, generalmente asociado a una vivienda
        y pensado para reuniones y actividades al aire libre.

        - Requincho: proyecto que consiste en realizar mejoras,
        modificaciones o trabajos sobre un quincho existente.

        - Construcción: proyecto que contempla la realización de una
        nueva construcción.

        - Reforma: proyecto que contempla modificaciones, mejoras o
        cambios sobre una construcción existente.

        - Materiales de construcción: elementos utilizados para
        realizar una obra, cuya elección puede depender de factores
        como las características del proyecto, durabilidad,
        mantenimiento, apariencia y presupuesto.

        - Mano de obra: trabajo realizado por las personas que
        participan en la ejecución de una obra.

        - Jornal: período de trabajo utilizado como unidad para
        representar una jornada laboral.

        INSTRUCCIONES

        - Respondé siempre en español.
        - Utilizá un lenguaje claro y fácil de entender para un cliente.
        - Tené en cuenta el proyecto seleccionado cuando sea relevante.
        - No inventes información específica del proyecto.
        - No inventes precios, costos ni información específica de empresas.
        - No modifiques ni calcules cotizaciones.
        - No reveles reglas internas de cálculo utilizadas por SISCON-Q.
        - Si la pregunta no está relacionada con el proyecto,
        respondé normalmente.
        - Si la información necesaria no está disponible,
        indicá que no disponés de esa información.
        - Cuando el usuario consulte sobre materiales,
        utilizá únicamente los materiales registrados
        y disponibles proporcionados en el contexto.

        - Los materiales están ordenados de menor a mayor
        precio.

        - No inventes materiales, precios, características
        ni disponibilidad.

        - Tené en cuenta las características del proyecto
        seleccionado para explicar qué opciones pueden
        ser adecuadas.

        - Si el usuario solicita una alternativa económica,
        prestá atención a los materiales de menor precio.

        - Si no existe información suficiente para recomendar
        una opción concreta, indicá esa limitación.

        - No modifiques ni calcules la cotización del proyecto.

        Pregunta del usuario:

    ${pregunta}
    `;

        const respuesta =
            await this.ollama.chat({
                model: "gemma4:e2b",
                messages: [
                    {
                        role: "user",
                        content: contexto
                    }
                ]
            });

        return respuesta.message.content;
    }

        public async recomendarMateriales(
            idProyecto: number,
            detalleUsuario: string
        ): Promise<string> {

            let proyecto;

            try {
                proyecto =
                    await this.proyectoService.obtenerProyectoPorId(
                        idProyecto
                    );
            } catch (error) {

                if (
                    error instanceof Error &&
                    error.message === "Proyecto no encontrado"
                ) {
                    return "No puedo recomendar materiales porque el proyecto seleccionado no existe en SISCON-Q.";
                }

                throw error;
            }

            const materiales =
                await this.materialService.obtenerMateriales();

            const materialesDisponibles =
                materiales
                    .filter(
                        (material) =>
                            material.estado === "Activo" &&
                            material.disponibilidad !== "Sin stock"
                    )
                    .sort(
                        (a, b) =>
                            Number(a.costoUnitario) -
                            Number(b.costoUnitario)
                    );

                if (materialesDisponibles.length === 0) {
                    return "No puedo recomendar materiales porque actualmente no hay materiales disponibles registrados en SISCON-Q.";
                }

            const contextoMateriales =
                materialesDisponibles
                    .map(
                        (material, index) => `
            ${index + 1}. ${material.nombre}
            Descripción: ${material.descripcion ?? "Sin descripción"}
            Categoría: ${material.categoria ?? "Sin categoría"}
            Precio: ${material.costoUnitario} USD
            Unidad: ${material.unidad ?? "Sin especificar"}
            Disponibilidad: ${material.disponibilidad}
            `
                        )
                        .join("\n");

                const contexto = `
            Sos el asistente inteligente de SISCON-Q.

            Tu tarea es recomendar materiales registrados en SISCON-Q
            teniendo en cuenta las características del proyecto y el
            detalle proporcionado por el usuario.

            DATOS DEL PROYECTO

            Nombre: ${proyecto.nombre}
            Tipo de obra: ${proyecto.tipoObra}
            Descripción: ${proyecto.descripcion ?? "Sin descripción"}
            Ubicación: ${proyecto.ubicacion ?? "Sin ubicación"}
            Alto: ${proyecto.alto} m
            Ancho: ${proyecto.ancho} m
            Largo: ${proyecto.largo} m
            Superficie: ${proyecto.superficie} m²

            DETALLE ADICIONAL DEL USUARIO

            ${detalleUsuario}

            MATERIALES REGISTRADOS Y DISPONIBLES

            ${contextoMateriales}

            INSTRUCCIONES

            - Respondé siempre en español.
            - Recomendá únicamente materiales incluidos en la lista.
            - Tené en cuenta el tipo de obra, las características del proyecto
            y el detalle proporcionado por el usuario.
            - Utilizá la descripción y categoría de cada material para establecer
            coincidencias con las necesidades indicadas.
            - Los materiales ya están ordenados de menor a mayor precio.
            - Los materiales fueron ordenados por el sistema
            - desde el menor precio al mayor precio.
            - DEBÉS respetar exactamente ese orden al presentar
            las recomendaciones.
            - NO cambies el orden de los materiales.
            - NO vuelvas a ordenar los materiales según tu criterio.
            - No inventes materiales, precios, características ni disponibilidad.
            - Si la información disponible no permite determinar una ventaja
            concreta de un material, indicá esa limitación.
            - Explicá de forma clara por qué determinadas opciones pueden ser
            adecuadas para el proyecto.
            - No modifiques ni calcules la cotización del proyecto.

            Pregunta o necesidad del usuario:

        ${detalleUsuario}
        `;

            const respuesta =
                await this.ollama.chat({
                    model: "gemma4:e2b",
                    messages: [
                        {
                            role: "user",
                            content: contexto
                        }
                    ]
                });

        return respuesta.message.content;
    }
}