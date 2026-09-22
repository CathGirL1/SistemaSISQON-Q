export interface ConversacionIA {
  idConversacion: number;
  idCliente: number;
  idProyecto: number | null;
  titulo: string;
  fechaCreacion: Date;
  fechaUltimoMensaje: Date;
}

export interface CrearConversacionIADTO {
  idCliente: number;
  idProyecto?: number | null;
  titulo: string;
}