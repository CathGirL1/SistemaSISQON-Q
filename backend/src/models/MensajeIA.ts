export type TipoMensajeIA =
  | "usuario"
  | "asistente";

export interface MensajeIA {
  idMensaje: number;
  idConversacion: number;
  tipo: TipoMensajeIA;
  contenido: string;
  fecha: Date;
}

export interface CrearMensajeIADTO {
  idConversacion: number;
  tipo: TipoMensajeIA;
  contenido: string;
}