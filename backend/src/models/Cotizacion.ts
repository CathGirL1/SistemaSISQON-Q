export class Cotizacion {
  constructor(
    private idProyecto: number,
    private fechaCreacion?: Date,
    private fechaActualizacion?: Date | null,
    private estado: string = "Borrador",
    private precioEstimado?: number | null,
    private observaciones?: string | null
  ) {}
}