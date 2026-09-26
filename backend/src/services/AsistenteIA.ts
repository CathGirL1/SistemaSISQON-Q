import { ProyectoService } from "./ProyectoService";
import { MaterialService } from "./MaterialService";
import { CotizacionService } from "./CotizacionService";
import { ConversacionIAService } from "./ConversacionIAService";
import { MensajeIAService } from "./MensajeIAService";
import { Ollama } from "ollama";


export class AsistenteIA {

    private static instancia: AsistenteIA;
    private proyectoService = new ProyectoService();
    private materialService = new MaterialService();
    private cotizacionService = new CotizacionService();
    private conversacionService = new ConversacionIAService();
    private mensajeService = new MensajeIAService();

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

    private async obtenerHistorialConversacion(
        idConversacion?: number
    ): Promise<string> {

        if (!idConversacion) {
            return "";
        }

        const mensajes =
            await this.mensajeService
                .obtenerMensajesPorConversacion(
                    idConversacion
                );

        if (mensajes.length === 0) {
            return "";
        }

        return mensajes
            .map(
                (mensaje) =>
                    `${mensaje.tipo === "usuario" ? "Usuario" : "Asistente"}: ${mensaje.contenido}`
            )
            .join("\n");
    }

    private async guardarRespuestaConversacion(
        idConversacion: number | undefined,
        respuesta: string
    ): Promise<string> {

        if (idConversacion) {
            await this.mensajeService.crearMensaje({
                idConversacion,
                tipo: "asistente",
                contenido: respuesta
            });

            await this.conversacionService
                .actualizarFechaUltimoMensaje(
                    idConversacion
                );
        }

        return respuesta;
    }

    public async preguntar(pregunta: string, idProyecto?: number, idConversacion?: number): Promise<string> {

        const preguntaNormalizada =
            pregunta
                .toLowerCase()
                .trim();

         const historialConversacion =
            await this.obtenerHistorialConversacion(
                idConversacion
            );

        if (idConversacion) {
            await this.mensajeService.crearMensaje({
                idConversacion,
                tipo: "usuario",
                contenido: pregunta
            });
        }

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

        let contextoCotizacion = "";

        if (idProyecto) {

            const cotizaciones =
                await this.cotizacionService
                    .obtenerCotizacionesPorProyecto(idProyecto);

            if (cotizaciones.length > 0) {

                const cotizacionMasReciente =
                    cotizaciones[0];

                if (cotizacionMasReciente.idCotizacion) {

                    const detalleCotizacion =
                        await this.cotizacionService
                            .obtenerCotizacionPorId(
                                Number(
                                    cotizacionMasReciente.idCotizacion
                                )
                            );

                    contextoCotizacion = `
                        COTIZACIÓN ESTIMADA DEL PROYECTO

                        Código: ${detalleCotizacion.codigo}
                        Estado: ${detalleCotizacion.estado}
                        Versión: ${detalleCotizacion.version}
                        Proyecto:
                        ${detalleCotizacion.nombreProyecto}

                        Tipo de obra:
                        ${detalleCotizacion.tipoObra}

                        Superficie:
                        ${detalleCotizacion.superficie} m²

                        Costo de materiales:
                        USD ${Number(
                            detalleCotizacion.costoMateriales
                        ).toFixed(2)}

                        Costo de mano de obra:
                        USD ${Number(
                            detalleCotizacion.costoManoObra
                        ).toFixed(2)}

                        Costo de construcción:
                        ${
                            detalleCotizacion.monedaCalculo === "UYU"
                                ? `UYU ${Number(
                                    detalleCotizacion.costoConstruccion
                                ).toFixed(2)}`
                                : `USD ${Number(
                                    detalleCotizacion.costoConstruccion
                                ).toFixed(2)}`
                        }

                        Total estimado:
                        USD ${Number(
                            detalleCotizacion.totalCotizacion
                        ).toFixed(2)}

                        Total estimado en pesos uruguayos:
                        UYU ${Number(
                            detalleCotizacion.totalCotizacionUYU
                        ).toFixed(2)}

                        Tipo de cambio utilizado:
                        ${Number(
                            detalleCotizacion.tipoCambio
                        ).toFixed(2)}

                        Moneda utilizada para el cálculo:
                        ${detalleCotizacion.monedaCalculo ?? "USD"}

                        Materiales del proyecto:
                        ${
                            detalleCotizacion.materiales
                                ?.map(
                                    (material: any) =>
                                        `- ${material.nombre}: ${material.cantidad} ${material.unidad ?? ""} — USD ${Number(material.costoUnitario).toFixed(2)}`
                                )
                                .join("\n")
                            ?? "Sin materiales registrados"
                        }
                    `;
                }
            }
        }

        if (
            preguntaNormalizada.includes("qué es siscon-q") ||
            preguntaNormalizada.includes("que es siscon-q") ||
            preguntaNormalizada.includes("qué es sisqon-q") ||
            preguntaNormalizada.includes("que es sisqon-q")
        ) {
            const respuesta = this.responderQueEsSISCONQ();

            return await this.guardarRespuestaConversacion(
                idConversacion,
                respuesta
            );
        }

        if (
            preguntaNormalizada.includes("cómo funciona siscon-q") ||
            preguntaNormalizada.includes("como funciona siscon-q") ||
            preguntaNormalizada.includes("cómo funciona sisqon-q") ||
            preguntaNormalizada.includes("como funciona sisqon-q")
        ) {
            const respuesta = this.responderComoFuncionaSISCONQ();

            return await this.guardarRespuestaConversacion(
                idConversacion,
                respuesta
            );
        }

        if (
            preguntaNormalizada.includes("tipos de obra") ||
            preguntaNormalizada.includes("qué obras maneja") ||
            preguntaNormalizada.includes("que obras maneja")
        ) {
            const respuesta = this.responderTiposDeObra();

            return await this.guardarRespuestaConversacion(
                idConversacion,
                respuesta
            );
        }

        if (
            preguntaNormalizada.includes("qué puedo hacer") ||
            preguntaNormalizada.includes("que puedo hacer") ||
            preguntaNormalizada.includes("qué puedo hacer en siscon-q") ||
            preguntaNormalizada.includes("que puedo hacer en siscon-q")
        ) {
            const respuesta = this.responderQuePuedoHacer();

            return await this.guardarRespuestaConversacion(
                idConversacion,
                respuesta
            );
        }

        if (
            preguntaNormalizada.includes("qué es un jornal") ||
            preguntaNormalizada.includes("que es un jornal")
        ) {
            const respuesta = this.responderQueEsUnJornal();

            return await this.guardarRespuestaConversacion(
                idConversacion,
                respuesta
            );
        }

        const respuesta = await this.responderConIA(
            pregunta,
            contextoProyecto,
            contextoMateriales,
            contextoCotizacion,
            historialConversacion
        );

        if (idConversacion) {
            await this.mensajeService.crearMensaje({
                idConversacion,
                tipo: "asistente",
                contenido: respuesta
            });

            await this.conversacionService
                .actualizarFechaUltimoMensaje(
                    idConversacion
                );
        }

        return respuesta;
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

    private responderQueEsUnJornal(): string {
        return `
            Un jornal es una unidad utilizada para representar una jornada de trabajo.

            En el contexto de una obra, un jornal permite expresar aproximadamente
            cuánto trabajo puede realizar una persona durante una jornada laboral.

            Por ejemplo, si una tarea requiere varios jornales, significa que se
            necesitan varias jornadas de trabajo para realizarla.

            La cantidad de jornales puede depender del tipo de trabajo, la superficie
            y las tareas que se deban realizar.
        `.trim();
    }

    private async responderConIA(
        pregunta: string,
        contextoProyecto: string,
        contextoMateriales: string,
        contextoCotizacion: string,
        historialConversacion: string
    ): Promise<string> {

        const contexto = `
        Sos el asistente inteligente de SISCON-Q.

        SISCON-Q es un sistema de cotizaciones inteligentes
        orientado a proyectos de construcción.

        ${contextoProyecto}
        ${contextoMateriales}
        ${contextoCotizacion}
        ${contextoCotizacion}

        HISTORIAL DE LA CONVERSACIÓN
        ${historialConversacion || "No existen mensajes anteriores."}
        
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
        - Cuando el usuario consulte sobre los costos,
        la cotización o el precio estimado de su proyecto,
        utilizá únicamente los datos de la cotización
        proporcionados en el contexto.

        - Explicá los costos de forma clara, detallada
        y fácil de entender para un cliente.

        - Podés explicar el significado de los diferentes
        componentes de la cotización, como materiales,
        mano de obra y costo de construcción, cuando
        esos datos estén disponibles.

        - Podés mostrar el total estimado en USD y su
        equivalente en pesos uruguayos cuando estén
        disponibles.

        - Podés mencionar los materiales incluidos en la
        cotización cuando esa información esté disponible.

        - No calcules nuevamente los costos.

        - No realices operaciones matemáticas para modificar
        o verificar el total de la cotización.

        - No inventes costos, precios, materiales,
        descuentos ni información adicional.

        - No reveles fórmulas, estrategias, constantes
        ni reglas internas utilizadas por SISCON-Q
        para calcular la cotización.

        - No presentes la cotización como un precio definitivo.
        Explicá que se trata de una estimación cuando
        corresponda.

        - Si no existe una cotización para el proyecto
        seleccionado, indicá claramente que todavía no
        existe una cotización disponible para ese proyecto.

        - Si el usuario pregunta algo que no está disponible
        en los datos de la cotización, indicá que no
        disponés de esa información.
        - Cuando la moneda utilizada para el cálculo sea UYU,
        interpretá el costo de construcción informado como
        parte del costo integral de la estimación y explicalo
        según los datos proporcionados, sin inferir ni revelar
        las reglas internas utilizadas para obtenerlo.


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