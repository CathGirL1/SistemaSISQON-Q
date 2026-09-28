export class CotizacionManoObra {
  constructor(
    public id_CotizacionManoObra: number,
    public id_Cotizacion: number,
    public id_ManoObra: number,
    public cantidad: number,
    public nombre: string,
    public unidad: string | null,
    public costoUnitario: number,
    public subtotal: number
  ) {}
}

export interface ManoObraCotizacionInput {
  idManoObra: number;
  cantidad: number;
}

export interface CrearCotizacionManoObraDTO {
  idCotizacion: number;
  idManoObra: number;
  cantidad: number;

  nombre: string;
  unidad: string | null;

  costoUnitario: number;
  subtotal: number;
}

export interface CotizacionManoObraDetalle {
  idCotizacionManoObra: number;
  idCotizacion: number;
  idManoObra: number;

  nombre: string;
  unidad: string | null;

  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}