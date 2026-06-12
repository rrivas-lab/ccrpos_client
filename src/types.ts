export type RequestStatus =
  | 'Borrador'
  | 'Pendiente por aprobación'
  | 'Sin aprobador asignado'
  | 'Aprobada'
  | 'Aprobada con ajustes'
  | 'Rechazada'
  | 'Transferencia generada'
  | 'En preparación'
  | 'Lista para retiro'
  | 'Entregada'
  | 'Cancelada';

export type DistributionStatus =
  | 'Borrador'
  | 'Validada'
  | 'Parcial'
  | 'Completada'
  | 'Cancelada'
  | 'Error';

export type TransferStatus =
  | 'Confirmado'
  | 'En espera'
  | 'Listo'
  | 'Hecho'
  | 'Cancelado';

// --- NUEVOS TIPOS PARA GESTIÓN DE CLIENTE ---

export type AlertaEstado =
  | 'Nueva'
  | 'Notificada'
  | 'Asignada'
  | 'En gestión'
  | 'Pendiente de llamada'
  | 'Pendiente de visita'
  | 'Falla técnica'
  | 'Problema resuelto'
  | 'Recuperada por transacción'
  | 'Cerrada'
  | 'Descartada';

export interface Cliente {
  id: string;
  codigoAfiliado: string;
  nombre: string;
  rif: string;
  vendedorAsignado: string;
  bancoAsignado: string;
  agenteAutorizado: string;
  supervisorAsignado: string;
  region: string;
  serialPOS: string;
  modeloPOS: string;
  diasSinTransar: number;
  estadoCartera: 'Activo' | 'Inactivo' | 'En recuperación';
}

export interface Alerta {
  id: string;
  clienteId: string;
  afiliado: string;
  diasSinTransar: number;
  estado: AlertaEstado;
  ultimaGestion?: string | null;
  ultimaTransaccion?: string;
  responsable: string;
  umbral?: number;
}

export interface Gestion {
  id: string;
  alertaId?: string;
  clienteId: string;
  tipo: 'Llamada' | 'Visita' | 'WhatsApp' | 'SMS' | 'Correo' | 'Gestión interna' | 'Escalamiento técnico';
  estadoResultante: string;
  comentario: string;
  fecha: string;
  usuario?: string;
  proximaAccion?: string;
  fechaProximaAccion?: string;
}

// --- TIPOS EXISTENTES ---

export interface LineaSolicitudEquipo {
  producto: string;
  cantidadSolicitada: number;
  cantidadAprobada: number;
  estado?: 'Pendiente' | 'Aprobado' | 'Rechazado';
  diferencia?: number;
  usuarioModifico?: string;
  fechaModificacion?: string;
  comentarioAjuste?: string;
}

export interface LineaSolicitudSim {
  operadora: string;
  cantidadSolicitada: number;
  cantidadAprobada: number;
  estado?: 'Pendiente' | 'Aprobado' | 'Rechazado';
  diferencia?: number;
  usuarioModifico?: string;
  fechaModificacion?: string;
  comentarioAjuste?: string;
}

export interface Solicitud {
  id: string;
  solicitante: string;
  producto: string;
  cantidad: number;
  operadora: string;
  formaRetiro: string;
  direccionEnvio?: string;
  puntoRetiro?: string;
  comentario: string;
  estado: RequestStatus;
  motivoRechazo?: string;
  fecha: string;
  ultimaActualizacion: string;
  almacenOrigen: string;
  almacenDestino: string;
  creadoComoNuevoDesarrollo: boolean;
  movimientoOdooId?: string;
  movimientoEstado?: 'Confirmado' | 'En espera' | 'Listo' | 'Hecho' | 'Cancelado';
  serialesAsignados?: string[];
  equipos?: LineaSolicitudEquipo[];
  sims?: LineaSolicitudSim[];
  historial: {
    fecha: string;
    usuario: string;
    accion: string;
    detalle: string;
  }[];
  revisada?: boolean;
  aprobadorAsignado?: string;
  esUrgente?: boolean;
  esBloqueado?: boolean;
}

export interface SerialLote {
  producto: string;
  numeroSerie: string;
  almacenActual: string;
  estado: 'Disponible' | 'Reservado' | 'Vendido' | 'Asignado';
}

export interface StockReport {
  id: string;
  producto: string;
  almacen: string;
  disponible: number;
  reservado: number;
  minimo: number;
  maximo: number;
  alerta: boolean;
}

export interface UserSession {
  nombre: string;
  perfil: 'Solicitante' | 'Aprobador' | 'Logistica';
}

export interface MatrixRule {
  id: string;
  aprobador: string;
  solicitantes: string[];
  activo: boolean;
}

export interface MatrixHistory {
  id: string;
  fecha: string;
  usuario: string;
  detalle: string;
}

export interface LineaDistribucion {
  producto: string;
  numeroSerie: string;
  almacenOrigen: string;
  almacenDestino: string;
  estadoSerial: string;
}

export interface TransferenciaDistribucion {
  id: string;
  almacenOrigen: string;
  almacenDestino: string;
  estado: TransferStatus;
  seriales: string[];
  documentoOrigen: string;
}

export interface Distribucion {
  id: string;
  usuario: string;
  fecha: string;
  almacenDestino: string;
  totalSeriales: number;
  estado: DistributionStatus;
  lineas: LineaDistribucion[];
  transferencias: TransferenciaDistribucion[];
  historial: {
    fecha: string;
    usuario: string;
    accion: string;
    detalle: string;
  }[];
}

// --- TIPOS ADICIONALES GESTIÓN DE CLIENTE ---

export type CustomerUploadStatus = 
  | 'Borrador'
  | 'Validado' 
  | 'Procesando'
  | 'Procesado'
  | 'Duplicado'
  | 'Con errores';

export type CustomerManagementType =
  | 'Llamada'
  | 'Visita'
  | 'WhatsApp'
  | 'SMS'
  | 'Correo'
  | 'Gestión interna'
  | 'Escalamiento técnico';

export type CustomerManagementResult =
  | 'Pendiente de llamada'
  | 'Pendiente de visita'
  | 'Cliente contactado'
  | 'No contactado'
  | 'Falla técnica'
  | 'Falta de uso'
  | 'Cambio de ramo comercial'
  | 'Problema resuelto'
  | 'Cliente no interesado'
  | 'Requiere soporte'
  | 'Cerrado';

export interface CustomerUpload {
  id: string;
  titulo: string;
  archivo: string;
  fechaOperacion: string;
  banco: string;
  registrosLeidos: number;
  afiliadosUnicos: number;
  duplicadosInternos: number;
  estado: CustomerUploadStatus;
  alertasGeneradas: number;
  alertasActualizadas: number;
  notificacionesSimuladas: number;
  hash?: string;
}

export interface CustomerGoal {
  id: string;
  usuarioId: string;
  usuario: string;
  rol: string;
  metaMensual: number;
  recuperadosConfirmados: number;
  cumplimiento: number;
  supervisa?: string[];
}

export interface CustomerNotification {
  id: string;
  tipo: 'alerta' | 'recuperacion' | 'gestion' | 'carga' | 'duplicado';
  mensaje: string;
  fecha: string;
  leida: boolean;
  clienteId?: string;
  alertaId?: string;
}
