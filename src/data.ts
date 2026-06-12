import { Solicitud, SerialLote, StockReport, Distribucion, Cliente, Alerta, Gestion, CustomerUpload, CustomerGoal, CustomerNotification } from './types';

export const INITIAL_CLIENTES: Cliente[] = [
  { id: 'CLI-001', codigoAfiliado: 'AF-1001', nombre: 'Comercial La Esquina', rif: 'J-12345678-9', vendedorAsignado: 'Carlos Pérez', bancoAsignado: '201', agenteAutorizado: 'Directo', supervisorAsignado: 'María Gómez', region: 'Centro', serialPOS: 'VX01-000123', modeloPOS: 'VX-01', diasSinTransar: 15, estadoCartera: 'En recuperación' },
  { id: 'CLI-002', codigoAfiliado: 'AF-1002', nombre: 'Farmacia Centro', rif: 'J-23456789-0', vendedorAsignado: 'Carlos Pérez', bancoAsignado: '201', agenteAutorizado: 'Directo', supervisorAsignado: 'María Gómez', region: 'Centro', serialPOS: 'VX02-000222', modeloPOS: 'VX-02', diasSinTransar: 3, estadoCartera: 'Activo' },
  { id: 'CLI-003', codigoAfiliado: 'AF-1003', nombre: 'Panadería El Trigal', rif: 'J-34567890-1', vendedorAsignado: 'Carlos Pérez', bancoAsignado: '201', agenteAutorizado: 'Directo', supervisorAsignado: 'María Gómez', region: 'Oeste', serialPOS: 'VX01-000345', modeloPOS: 'VX-01', diasSinTransar: 22, estadoCartera: 'En recuperación' },
  { id: 'CLI-004', codigoAfiliado: 'AF-1004', nombre: 'Repuestos Los Andes', rif: 'J-45678901-2', vendedorAsignado: 'Ana Torres', bancoAsignado: '201', agenteAutorizado: 'Directo', supervisorAsignado: 'María Gómez', region: 'Oeste', serialPOS: 'VX02-000456', modeloPOS: 'VX-02', diasSinTransar: 8, estadoCartera: 'Activo' },
  { id: 'CLI-005', codigoAfiliado: 'AF-1005', nombre: 'Bodegón Plaza', rif: 'J-56789012-3', vendedorAsignado: 'Carlos Pérez', bancoAsignado: '201', agenteAutorizado: 'Directo', supervisorAsignado: 'María Gómez', region: 'Este', serialPOS: 'VX01-000567', modeloPOS: 'VX-01', diasSinTransar: 45, estadoCartera: 'Inactivo' },
  { id: 'CLI-006', codigoAfiliado: 'AF-1006', nombre: 'Ferretería San José', rif: 'J-67890123-4', vendedorAsignado: 'Ana Torres', bancoAsignado: '201', agenteAutorizado: 'Directo', supervisorAsignado: 'María Gómez', region: 'Centro', serialPOS: 'VX02-000678', modeloPOS: 'VX-02', diasSinTransar: 0, estadoCartera: 'Activo' },
  { id: 'CLI-007', codigoAfiliado: 'AF-1007', nombre: 'Supermercado La Unión', rif: 'J-78901234-5', vendedorAsignado: 'Carlos Pérez', bancoAsignado: '201', agenteAutorizado: 'Banco 201', supervisorAsignado: 'María Gómez', region: 'Norte', serialPOS: 'VX01-000789', modeloPOS: 'VX-01', diasSinTransar: 12, estadoCartera: 'En recuperación' },
  { id: 'CLI-008', codigoAfiliado: 'AF-1008', nombre: 'Restaurante Vista Norte', rif: 'J-89012345-6', vendedorAsignado: 'Ana Torres', bancoAsignado: '201', agenteAutorizado: 'Directo', supervisorAsignado: 'María Gómez', region: 'Norte', serialPOS: 'VX02-000890', modeloPOS: 'VX-02', diasSinTransar: 30, estadoCartera: 'Inactivo' },
];
export const INITIAL_ALERTAS: Alerta[] = [
  { id: 'AL-001', clienteId: 'CLI-001', afiliado: 'Comercial La Esquina', diasSinTransar: 15, estado: 'En gestión', responsable: 'Carlos Pérez', umbral: 10, ultimaGestion: '2026-06-05', ultimaTransaccion: '2026-05-26' },
  { id: 'AL-002', clienteId: 'CLI-003', afiliado: 'Panadería El Trigal', diasSinTransar: 22, estado: 'Nueva', responsable: 'Carlos Pérez', umbral: 15, ultimaGestion: null, ultimaTransaccion: '2026-05-19' },
  { id: 'AL-003', clienteId: 'CLI-005', afiliado: 'Bodegón Plaza', diasSinTransar: 45, estado: 'Pendiente de visita', responsable: 'Carlos Pérez', umbral: 30, ultimaGestion: '2026-05-20', ultimaTransaccion: '2026-04-27' },
  { id: 'AL-004', clienteId: 'CLI-007', afiliado: 'Supermercado La Unión', diasSinTransar: 12, estado: 'Nueva', responsable: 'Carlos Pérez', umbral: 10, ultimaGestion: null, ultimaTransaccion: '2026-05-29' },
  { id: 'AL-005', clienteId: 'CLI-008', afiliado: 'Restaurante Vista Norte', diasSinTransar: 30, estado: 'Notificada', responsable: 'Ana Torres', umbral: 15, ultimaGestion: '2026-05-25', ultimaTransaccion: '2026-05-11' },
];

export const INITIAL_GESTIONES: Gestion[] = [
  { id: 'GES-001', alertaId: 'AL-001', clienteId: 'CLI-001', tipo: 'Llamada', estadoResultante: 'Cliente contactado', comentario: 'Cliente informado sobre inactividad, promete realizar compra esta semana.', proximaAccion: 'Llamada de seguimiento', fechaProximaAccion: '2026-06-12', fecha: '2026-06-05', usuario: 'Carlos Pérez' },
  { id: 'GES-002', alertaId: 'AL-003', clienteId: 'CLI-005', tipo: 'Visita', estadoResultante: 'Pendiente de visita', comentario: 'Dueño no estaba, se dejó mensaje con empleada.', proximaAccion: 'Visita', fechaProximaAccion: '2026-06-11', fecha: '2026-05-20', usuario: 'Carlos Pérez' },
  { id: 'GES-003', alertaId: 'AL-005', clienteId: 'CLI-008', tipo: 'WhatsApp', estadoResultante: 'Falla técnica', comentario: 'Cliente reporta que el POS no enciende desde hace 3 semanas.', proximaAccion: 'Escalamiento técnico', fechaProximaAccion: '2026-06-10', fecha: '2026-05-25', usuario: 'Ana Torres' },
];

export const INITIAL_CUSTOMER_UPLOADS: CustomerUpload[] = [
  {
    id: 'UPLOAD-001',
    titulo: 'Carga TX-0001',
    archivo: 'Colocacion_afiliado.xlsx',
    fechaOperacion: '2026-06-03',
    banco: '201',
    registrosLeidos: 500,
    afiliadosUnicos: 498,
    duplicadosInternos: 2,
    estado: 'Procesado',
    alertasGeneradas: 36,
    alertasActualizadas: 112,
    notificacionesSimuladas: 36,
    hash: 'SHA256-TX0001-20260603'
  },
  {
    id: 'UPLOAD-002',
    titulo: 'Carga TX-0001 (dup)',
    archivo: 'Colocacion_afiliado.xlsx',
    fechaOperacion: '2026-06-04',
    banco: '201',
    registrosLeidos: 500,
    afiliadosUnicos: 0,
    duplicadosInternos: 0,
    estado: 'Duplicado',
    alertasGeneradas: 0,
    alertasActualizadas: 0,
    notificacionesSimuladas: 0,
    hash: 'SHA256-TX0001-20260603'
  },
  {
    id: 'UPLOAD-003',
    titulo: 'Carga TX-0002',
    archivo: 'Colocacion_afiliado_jun04.xlsx',
    fechaOperacion: '2026-06-04',
    banco: '201',
    registrosLeidos: 485,
    afiliadosUnicos: 483,
    duplicadosInternos: 2,
    estado: 'Borrador',
    alertasGeneradas: 0,
    alertasActualizadas: 0,
    notificacionesSimuladas: 0,
    hash: 'SHA256-TX0002-20260604'
  },
];

export const INITIAL_CUSTOMER_GOALS: CustomerGoal[] = [
  { id: 'META-001', usuarioId: 'USR-CP', usuario: 'Carlos Pérez', rol: 'Vendedor', metaMensual: 25, recuperadosConfirmados: 12, cumplimiento: 48 },
  { id: 'META-002', usuarioId: 'USR-B201', usuario: 'Banco 201', rol: 'Banco / Agente autorizado', metaMensual: 80, recuperadosConfirmados: 35, cumplimiento: 44 },
  { id: 'META-003', usuarioId: 'USR-MG', usuario: 'María Gómez', rol: 'Vendedora + Supervisora', metaMensual: 20, recuperadosConfirmados: 10, cumplimiento: 50, supervisa: ['Carlos Pérez', 'Ana Torres'] },
  { id: 'META-004', usuarioId: 'USR-AT', usuario: 'Ana Torres', rol: 'Vendedora', metaMensual: 15, recuperadosConfirmados: 6, cumplimiento: 40 },
];

export const INITIAL_CUSTOMER_NOTIFICATIONS: CustomerNotification[] = [
  { id: 'NOTIF-001', tipo: 'carga', mensaje: 'Carga TX-0001 procesada. 36 alertas generadas y 112 actualizadas.', fecha: '2026-06-03 09:15', leida: false },
  { id: 'NOTIF-002', tipo: 'duplicado', mensaje: 'Archivo duplicado detectado. Colocacion_afiliado.xlsx ya fue cargado. No se procesó nuevamente.', fecha: '2026-06-04 08:30', leida: false },
  { id: 'NOTIF-003', tipo: 'alerta', mensaje: 'Cliente Bodegón Plaza lleva 45 días sin transar. Requiere visita urgente.', fecha: '2026-06-03 10:00', leida: true },
  { id: 'NOTIF-004', tipo: 'gestion', mensaje: 'Gestión registrada: Llamada a Comercial La Esquina. Estado: Cliente contactado.', fecha: '2026-06-05 14:22', leida: true },
  { id: 'NOTIF-005', tipo: 'recuperacion', mensaje: 'Recuperación confirmada: Farmacia Centro volvió a transar. Meta actualizada.', fecha: '2026-06-04 16:00', leida: false },
];

export const INITIAL_SOLICITUDES: Solicitud[] = [
  {
    id: 'SOL-0001',
    solicitante: 'Carlos Pérez',
    producto: 'POS Android VX-01',
    cantidad: 5,
    operadora: 'Movistar',
    formaRetiro: 'Retiro en almacén',
    puntoRetiro: 'Almacén Principal Caracas',
    comentario: 'Requerido para nueva jornada de afiliación en Banco Aliado.',
    estado: 'Pendiente por aprobación',
    fecha: '2026-06-08 09:00',
    ultimaActualizacion: '2026-06-08 09:00',
    almacenOrigen: 'Almacén Principal Caracas',
    almacenDestino: 'Almacén Supervisor CCR',
    creadoComoNuevoDesarrollo: true,
    equipos: [
      { producto: 'POS Android VX-01', cantidadSolicitada: 5, cantidadAprobada: 5 }
    ],
    sims: [
      { operadora: 'Movistar', cantidadSolicitada: 10, cantidadAprobada: 10 }
    ],
    historial: [
      {
        fecha: '2026-06-08 09:00',
        usuario: 'Carlos Pérez',
        accion: 'Creación de solicitud',
        detalle: 'Solicitud SOL-0001 creada desde Aplicación Móvil de Ventas.'
      }
    ]
  },
  {
    id: 'SOL-0002',
    solicitante: 'Carlos Pérez',
    producto: 'SIM Card Digitel',
    cantidad: 0,
    operadora: 'Digitel',
    formaRetiro: 'Envío a dirección',
    direccionEnvio: 'Av. Francisco de Miranda, Edif. Parque Cristal, Piso 8, Ofic. 8B',
    comentario: 'SIMs para pos-vendedores de la Región Centro.',
    estado: 'Aprobada',
    fecha: '2026-06-07 14:30',
    ultimaActualizacion: '2026-06-07 16:00',
    almacenOrigen: 'Almacén Principal Caracas',
    almacenDestino: 'Almacén Región Centro',
    creadoComoNuevoDesarrollo: true,
    movimientoOdooId: 'WH/OUT/00342',
    movimientoEstado: 'Hecho',
    serialesAsignados: ['SIM-DIG-99881', 'SIM-DIG-99882'],
    equipos: [],
    sims: [
      { operadora: 'Digitel', cantidadSolicitada: 20, cantidadAprobada: 20 }
    ],
    historial: [
      {
        fecha: '2026-06-07 14:30',
        usuario: 'Carlos Pérez',
        accion: 'Creación de solicitud',
        detalle: 'Solicitud SOL-0002 enviada.'
      },
      {
        fecha: '2026-06-07 16:00',
        usuario: 'María Gómez',
        accion: 'Aprobación Comercial',
        detalle: 'Aprobada comercialmente. Se genera transferencia interna WH/OUT/00342 en Odoo.'
      }
    ]
  },
  {
    id: 'SOL-0003',
    solicitante: 'Carlos Pérez',
    producto: 'POS Android VX-02',
    cantidad: 3,
    operadora: 'Movilnet',
    formaRetiro: 'Retiro en almacén',
    puntoRetiro: 'Almacén Principal Caracas',
    comentario: 'Solicitud urgente para contingencia comercial.',
    estado: 'Rechazada',
    motivoRechazo: 'Stock insuficiente en almacén seleccionado y sin cobertura logística inmediata.',
    fecha: '2026-06-06 11:15',
    ultimaActualizacion: '2026-06-06 13:45',
    almacenOrigen: 'Almacén Principal Caracas',
    almacenDestino: 'Almacén Región Occidente',
    creadoComoNuevoDesarrollo: true,
    equipos: [
      { producto: 'POS Android VX-02', cantidadSolicitada: 3, cantidadAprobada: 0 }
    ],
    sims: [
      { operadora: 'Movilnet', cantidadSolicitada: 5, cantidadAprobada: 0 }
    ],
    historial: [
      {
        fecha: '2026-06-06 11:15',
        usuario: 'Carlos Pérez',
        accion: 'Creación de solicitud',
        detalle: 'Solicitud SOL-0003 enviada.'
      },
      {
        fecha: '2026-06-06 13:45',
        usuario: 'María Gómez',
        accion: 'Rechazo Comercial',
        detalle: 'Rechazada. Motivo: Stock insuficiente en almacén seleccionado y sin cobertura logística inmediata.'
      }
    ]
  },
  {
    id: 'SOL-0004',
    solicitante: 'Luis Mora',
    producto: 'POS Android VX-01',
    cantidad: 3,
    operadora: 'Movistar',
    formaRetiro: 'Retiro en almacén',
    puntoRetiro: 'Almacén Principal Caracas',
    comentario: 'URGENTE: Equipos de reemplazo para taquilla comercial.',
    estado: 'Sin aprobador asignado',
    fecha: '2026-06-08 10:15',
    ultimaActualizacion: '2026-06-08 10:15',
    almacenOrigen: 'Almacén Principal Caracas',
    almacenDestino: 'Almacén Supervisor CCR',
    creadoComoNuevoDesarrollo: true,
    aprobadorAsignado: '',
    equipos: [
      { producto: 'POS Android VX-01', cantidadSolicitada: 3, cantidadAprobada: 3 }
    ],
    sims: [
      { operadora: 'Movistar', cantidadSolicitada: 3, cantidadAprobada: 3 }
    ],
    historial: [
      {
        fecha: '2026-06-08 10:15',
        usuario: 'Luis Mora',
        accion: 'Creación de solicitud',
        detalle: 'Solicitud SOL-0004 enviada. Odoo no detectó aprobador configurado en la matriz comercial para Luis Mora.'
      }
    ]
  },
  {
    id: 'SOL-0005',
    solicitante: 'Ana Rivas',
    producto: 'SIM Card Digitel',
    cantidad: 15,
    operadora: 'Digitel',
    formaRetiro: 'Envío a dirección',
    direccionEnvio: 'Av. Las Delicias, CC Las Américas, Piso 2, Local 45, Maracay',
    comentario: 'Requerido de urgencia para cierre de ventas corporativas.',
    estado: 'Pendiente por aprobación',
    fecha: '2026-06-08 11:30',
    ultimaActualizacion: '2026-06-08 11:30',
    almacenOrigen: 'Almacén Principal Caracas',
    almacenDestino: 'Almacén Región Centro',
    creadoComoNuevoDesarrollo: true,
    aprobadorAsignado: 'Pedro López',
    esUrgente: true,
    equipos: [],
    sims: [
      { operadora: 'Digitel', cantidadSolicitada: 15, cantidadAprobada: 15 }
    ],
    historial: [
      {
        fecha: '2026-06-08 11:30',
        usuario: 'Ana Rivas',
        accion: 'Creación de solicitud',
        detalle: 'Solicitud SOL-0005 enviada y asignada a Pedro López.'
      }
    ]
  },
  {
    id: 'SOL-0006',
    solicitante: 'Carlos Pérez',
    producto: 'POS Android VX-02',
    cantidad: 10,
    operadora: 'Movilnet',
    formaRetiro: 'Retiro en almacén',
    puntoRetiro: 'Almacén Principal Caracas',
    comentario: 'Solicitud para la ferias de tecnología del fin de semana.',
    estado: 'Pendiente por aprobación',
    fecha: '2026-06-08 12:45',
    ultimaActualizacion: '2026-06-08 12:45',
    almacenOrigen: 'Almacén Principal Caracas',
    almacenDestino: 'Almacén Región Occidente',
    creadoComoNuevoDesarrollo: true,
    aprobadorAsignado: 'María Gómez',
    esBloqueado: true,
    equipos: [
      { producto: 'POS Android VX-02', cantidadSolicitada: 10, cantidadAprobada: 10 }
    ],
    sims: [
      { operadora: 'Movilnet', cantidadSolicitada: 10, cantidadAprobada: 10 }
    ],
    historial: [
      {
        fecha: '2026-06-08 12:45',
        usuario: 'Carlos Pérez',
        accion: 'Creación de solicitud',
        detalle: 'Solicitud SOL-0006 enviada. Bloqueado automáticamente en Odoo por sobregasto o límite alcanzado para validación comercial extra.'
      }
    ]
  }
];

export const INITIAL_SERIALES: SerialLote[] = [
  { producto: 'POS Android VX-01', numeroSerie: 'VX01-000123', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'POS Android VX-01', numeroSerie: 'VX01-000124', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'POS Android VX-01', numeroSerie: 'VX01-000125', almacenActual: 'Almacén Principal Caracas', estado: 'Reservado' },
  { producto: 'POS Android VX-01', numeroSerie: 'VX01-000126', almacenActual: 'Almacén Región Centro', estado: 'Disponible' },
  { producto: 'POS Android VX-01', numeroSerie: 'VX01-000127', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'POS Android VX-02', numeroSerie: 'VX02-000221', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'POS Android VX-02', numeroSerie: 'VX02-000222', almacenActual: 'Almacén Supervisor CCR', estado: 'Disponible' },
  { producto: 'POS Android VX-02', numeroSerie: 'VX02-000223', almacenActual: 'Almacén Principal Caracas', estado: 'Reservado' },
  { producto: 'SIM Card Digitel', numeroSerie: 'SIM-DIG-99881', almacenActual: 'Almacén Región Centro', estado: 'Vendido' },
  { producto: 'SIM Card Digitel', numeroSerie: 'SIM-DIG-99882', almacenActual: 'Almacén Región Centro', estado: 'Vendido' },
  { producto: 'SIM Card Digitel', numeroSerie: 'SIM-DIG-99883', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'SIM Card Digitel', numeroSerie: 'SIM-DIG-99884', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'SIM Card Digitel', numeroSerie: 'SIM-DIG-99885', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'SIM Card Movistar', numeroSerie: 'SIM-MOV-11221', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'SIM Card Movistar', numeroSerie: 'SIM-MOV-11222', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'SIM Card Movistar', numeroSerie: 'SIM-MOV-11223', almacenActual: 'Almacén Región Centro', estado: 'Disponible' },
  { producto: 'SIM Card Movilnet', numeroSerie: 'SIM-NET-77661', almacenActual: 'Almacén Principal Caracas', estado: 'Disponible' },
  { producto: 'SIM Card Movilnet', numeroSerie: 'SIM-NET-77662', almacenActual: 'Almacén Región Occidente', estado: 'Disponible' }
];

export const INITIAL_STOCK: StockReport[] = [
  { id: 'ST-001', producto: 'POS Android VX-01', almacen: 'Almacén Principal Caracas', disponible: 45, reservado: 5, minimo: 10, maximo: 100, alerta: false },
  { id: 'ST-002', producto: 'POS Android VX-01', almacen: 'Almacén Región Centro', disponible: 8, reservado: 2, minimo: 15, maximo: 50, alerta: true },
  { id: 'ST-003', producto: 'POS Android VX-02', almacen: 'Almacén Principal Caracas', disponible: 15, reservado: 3, minimo: 5, maximo: 30, alerta: false },
  { id: 'ST-004', producto: 'POS Android VX-02', almacen: 'Almacén Supervisor CCR', disponible: 2, reservado: 0, minimo: 5, maximo: 15, alerta: true },
  { id: 'ST-005', producto: 'SIM Card Digitel', almacen: 'Almacén Principal Caracas', disponible: 150, reservado: 20, minimo: 50, maximo: 500, alerta: false },
  { id: 'ST-006', producto: 'SIM Card Digitel', almacen: 'Almacén Región Centro', disponible: 40, reservado: 10, minimo: 30, maximo: 200, alerta: false },
  { id: 'ST-007', producto: 'SIM Card Movistar', almacen: 'Almacén Principal Caracas', disponible: 95, reservado: 5, minimo: 40, maximo: 300, alerta: false },
  { id: 'ST-008', producto: 'SIM Card Movilnet', almacen: 'Almacén Principal Caracas', disponible: 12, reservado: 0, minimo: 20, maximo: 100, alerta: true }
];

export const INITIAL_DISTRIBUCIONES: Distribucion[] = [];

export const PRODUCTOS = [
  'POS Android VX-01',
  'POS Android VX-02',
  'SIM Card Movistar',
  'SIM Card Digitel',
  'SIM Card Movilnet'
];

export const ALMACENES = [
  'Almacén Principal Caracas',
  'Almacén Región Centro',
  'Almacén Región Occidente',
  'Almacén Banco Aliado',
  'Almacén Supervisor CCR'
];

export const OPERADORAS = ['Movistar', 'Digitel', 'Movilnet'];

export const RETIRO_FORMAS = ['Retiro en almacén', 'Envío a dirección', 'Envío interno'];
