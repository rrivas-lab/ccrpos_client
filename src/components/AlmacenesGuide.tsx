import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckSquare,
  ChevronDown,
  Database,
  FileText,
  Filter,
  Layers,
  ShieldCheck,
  Smartphone,
  Truck,
  Workflow,
  X,
  Zap,
} from 'lucide-react';

type Owner = 'App' | 'Odoo' | 'Ambos';

type TableBlock = {
  type: 'table';
  title: string;
  headers: string[];
  rows: string[][];
};

type ListBlock = {
  type: 'list';
  title: string;
  intro?: string;
  items: string[];
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

type CardsBlock = {
  type: 'cards';
  title: string;
  cards: Array<{
    title: string;
    subtitle?: string;
    items: string[];
    tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  }>;
};

type SwimlaneBlock = {
  type: 'swimlane';
  title: string;
  app: string[];
  odoo: string[];
};

type WarningBlock = {
  type: 'warning';
  title: string;
  text: string;
};

type ChecklistBlock = {
  type: 'checklist';
  title: string;
  items: string[];
};

type DataContractBlock = {
  type: 'contract';
  title: string;
  sends: string[];
  receives: string[];
};

type ModelBlock = {
  type: 'model';
  title: string;
  purpose: string;
  fields: string[];
};

type Block =
  | TableBlock
  | ListBlock
  | CardsBlock
  | SwimlaneBlock
  | WarningBlock
  | ChecklistBlock
  | DataContractBlock
  | ModelBlock;

type Section = {
  id: string;
  title: string;
  owner: Owner;
  icon: React.ReactNode;
  summary: string;
  blocks: Block[];
};

const toneClasses = {
  default: 'bg-white border-slate-200 text-slate-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-950',
  danger: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
};

const sections: Section[] = [
  {
    id: 'resumen',
    title: '1. Resumen ejecutivo',
    owner: 'Ambos',
    icon: <BookOpen className="w-4 h-4" />,
    summary:
      'Define el objetivo del módulo Almacenes dentro de CCRPOS y la separación de responsabilidades entre App y Odoo.',
    blocks: [
      {
        type: 'list',
        title: 'Idea central',
        items: [
          'Almacenes es un módulo dentro de CCRPOS, no una app independiente de inventario.',
          'La app debe ser simple y operativa: pedir, consultar, aprobar si tiene permiso y distribuir si tiene permiso.',
          'Odoo 19 Enterprise es el backend maestro y conserva la operación real de inventario.',
          'La app no reemplaza Inventario de Odoo; solo presenta una experiencia móvil simplificada.',
          'Ventas sigue siendo el primer módulo visible al abrir CCRPOS; esta guía solo cubre Almacenes / Inventario.',
        ],
      },
      {
        type: 'cards',
        title: 'Separación de responsabilidades',
        cards: [
          {
            title: 'App CCRPOS',
            subtitle: 'Experiencia operativa',
            tone: 'success',
            items: [
              'Crear solicitudes de equipos y SIM Card.',
              'Consultar mis solicitudes y su tracking.',
              'Aprobar solicitudes si el usuario tiene permiso.',
              'Consultar disponibilidad con seriales visibles.',
              'Crear distribuciones si el usuario tiene permiso Distribuidor.',
            ],
          },
          {
            title: 'Odoo 19 Enterprise',
            subtitle: 'Backend maestro',
            tone: 'info',
            items: [
              'Productos, almacenes, ubicaciones y seriales/lotes.',
              'Stock disponible y reservado.',
              'Solicitudes, aprobaciones, matriz y trazabilidad.',
              'Pickings y transferencias internas nativas.',
              'Chatter, seguridad, auditoría y smart buttons.',
            ],
          },
        ],
      },
      {
        type: 'warning',
        title: 'Regla principal',
        text: 'La app no debe validar pickings ni modificar stock directamente. Las validaciones reales de inventario se hacen desde los pickings nativos de Odoo.',
      },
    ],
  },
  {
    id: 'alcance',
    title: '2. Alcance y fuera de alcance',
    owner: 'Ambos',
    icon: <Layers className="w-4 h-4" />,
    summary:
      'Delimita exactamente qué se construye para Almacenes y qué queda fuera de esta fase.',
    blocks: [
      {
        type: 'cards',
        title: 'Alcance y exclusiones',
        cards: [
          {
            title: 'Alcance App',
            tone: 'success',
            items: [
              'Menú Almacenes según permisos acumulables.',
              'Solicitudes multiproducto con Equipos y SIM Card.',
              'Mis solicitudes con filtros por estado.',
              'Aprobaciones con badge y filtros internos.',
              'Edición individual de cantidad aprobada por línea.',
              'Disponibilidad con cantidades, bajo stock y seriales individuales.',
              'Distribución con selección individual, seleccionar todos y borrador/en proceso.',
              'Tracking simple y mensajes claros de éxito/error.',
            ],
          },
          {
            title: 'Fuera de alcance App',
            tone: 'danger',
            items: [
              'Crear productos, almacenes o ubicaciones.',
              'Configurar aprobadores o permisos.',
              'Validar pickings nativos.',
              'Modificar stock directamente.',
              'Asignar seriales manualmente en solicitudes.',
              'Reemplazar Inventario de Odoo.',
              'Documentar Ventas, Clientes, Facturación o Perfil.',
            ],
          },
          {
            title: 'Alcance Odoo',
            tone: 'info',
            items: [
              'Modelos propios para solicitudes, líneas, matriz y distribución.',
              'Seguridad, grupos, record rules y permisos.',
              'Chatter y auditoría de cambios.',
              'Smart buttons para transferencias/pickings.',
              'Picking único por solicitud aprobada.',
              'Transferencias por almacén origen en distribución.',
              'Disponibilidad, stock real y seriales/lotes nativos.',
            ],
          },
          {
            title: 'Fuera de alcance Odoo por ahora',
            tone: 'warning',
            items: [
              'Integración SAP HANA.',
              'Multiempresa.',
              'Reglas avanzadas por región, banco o canal.',
              'Automatizaciones complejas de reabastecimiento.',
              'Configuración final de almacenes reales hasta que el cliente la entregue.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mapa',
    title: '3. Mapa general del proceso',
    owner: 'Ambos',
    icon: <Workflow className="w-4 h-4" />,
    summary:
      'Vista general de los tres bloques: Solicitudes, Disponibilidad y Distribución.',
    blocks: [
      {
        type: 'swimlane',
        title: 'Bloque 1: Solicitudes',
        app: [
          'Almacenes → Pedir equipos.',
          'Agregar Equipos y SIM Card en una misma solicitud.',
          'Enviar y esperar confirmación de Odoo.',
          'Consultar Mis solicitudes y tracking.',
        ],
        odoo: [
          'Crear Solicitud de Equipos.',
          'Buscar aprobador en matriz.',
          'Aprobar/Rechazar/Aprobar con ajustes.',
          'Generar picking único con líneas aprobadas.',
          'Validar movimiento desde picking nativo.',
        ],
      },
      {
        type: 'swimlane',
        title: 'Bloque 2: Disponibilidad',
        app: [
          'Almacenes → Disponibilidad.',
          'Ver productos por almacén con disponible, reservado, total y mínimo.',
          'Abrir producto para ver todos los seriales individuales.',
          'Seleccionar seriales solo si tiene permiso Distribuidor.',
        ],
        odoo: [
          'Consultar stock real en Odoo.',
          'Exponer productos, ubicaciones, stock y seriales/lotes.',
          'Indicar estado Disponible, Bajo stock o No disponible.',
        ],
      },
      {
        type: 'swimlane',
        title: 'Bloque 3: Distribución',
        app: [
          'Almacenes → Distribución o Disponibilidad → Distribuir seleccionados.',
          'Seleccionar seriales disponibles, uno por uno o seleccionar todos.',
          'Indicar almacén destino.',
          'Generar transferencias en Odoo.',
        ],
        odoo: [
          'Crear Distribución DIST en borrador/en proceso.',
          'Agrupar líneas por almacén origen.',
          'Generar una transferencia interna por cada origen.',
          'Validar cada transferencia desde su picking nativo.',
        ],
      },
      {
        type: 'warning',
        title: 'Advertencia transversal',
        text: 'La app, la solicitud y la distribución no validan pickings. El picking se valida desde el documento nativo de Odoo.',
      },
    ],
  },
  {
    id: 'roles',
    title: '4. Roles y permisos',
    owner: 'Ambos',
    icon: <ShieldCheck className="w-4 h-4" />,
    summary:
      'Define los permisos acumulables que controlan lo que cada usuario ve y puede hacer.',
    blocks: [
      {
        type: 'cards',
        title: 'Permisos funcionales',
        cards: [
          {
            title: 'Solicitante',
            tone: 'success',
            items: [
              'Puede crear solicitudes.',
              'Puede ver sus propias solicitudes y tracking.',
              'Puede ver motivo de rechazo.',
              'Puede cancelar solicitudes pendientes o sin aprobador asignado.',
              'No puede aprobar, distribuir, configurar aprobadores ni validar pickings.',
            ],
          },
          {
            title: 'Aprobador',
            tone: 'info',
            items: [
              'Puede ver solicitudes asignadas.',
              'Puede aprobar, rechazar o aprobar con ajustes.',
              'Puede editar cantidad aprobada por línea.',
              'Puede consultar disponibilidad para decidir.',
              'No puede configurar aprobadores ni aprobar sus propias solicitudes, salvo excepción.',
            ],
          },
          {
            title: 'Super Aprobador',
            tone: 'warning',
            items: [
              'Puede ver solicitudes más allá de la matriz normal.',
              'Puede aprobar casos especiales o urgentes.',
              'Puede aprobar solicitudes sin aprobador asignado.',
              'Puede desbloquear casos urgentes.',
              'No configura matriz salvo que también sea Administrador.',
            ],
          },
          {
            title: 'Administrador de Solicitudes',
            tone: 'danger',
            items: [
              'Puede configurar aprobadores.',
              'Puede ver todo y reasignar solicitudes.',
              'Puede auditar cambios y cancelar casos especiales.',
              'Ve solicitudes sin aprobador.',
              'Controla la configuración funcional del proceso.',
            ],
          },
          {
            title: 'Distribuidor',
            tone: 'default',
            items: [
              'Puede ver el botón Distribución.',
              'Puede seleccionar seriales disponibles.',
              'Puede crear y continuar distribuciones.',
              'Puede generar transferencias internas.',
              'No valida pickings desde distribución ni selecciona seriales reservados/asignados/vendidos.',
            ],
          },
        ],
      },
      {
        type: 'warning',
        title: 'Permisos acumulables',
        text: 'Un usuario no es una sola “persona rol”. María Gómez puede ser Solicitante + Aprobador + Distribuidor y debe ver opciones acumuladas en Almacenes.',
      },
    ],
  },
  {
    id: 'menu',
    title: '5. Menú Almacenes según permisos',
    owner: 'App',
    icon: <Smartphone className="w-4 h-4" />,
    summary:
      'Reglas para mostrar botones dentro del módulo Almacenes según permisos del usuario logueado.',
    blocks: [
      {
        type: 'table',
        title: 'Visibilidad del menú',
        headers: ['Permisos del usuario', 'Debe ver', 'No debe ver'],
        rows: [
          ['Solo Solicitante', 'Pedir equipos, Mis solicitudes, Disponibilidad', 'Aprobaciones, Distribución, Configuración'],
          ['Solicitante + Aprobador', 'Pedir equipos, Mis solicitudes, Aprobaciones, Disponibilidad', 'Distribución si no tiene permiso Distribuidor, Configuración'],
          ['Distribuidor', 'Disponibilidad, Distribución', 'Aprobaciones si no es Aprobador, Configuración si no es Administrador'],
          ['Administrador', 'Todo lo que la configuración permita', 'Nada funcional, salvo restricciones internas del cliente'],
        ],
      },
      {
        type: 'list',
        title: 'Reglas de UI',
        items: [
          'El menú se define por permisos acumulables, no por un selector rígido de “Solicitante/Aprobador”.',
          'Distribución solo aparece para Distribuidor, Super Aprobador o Administrador, según configuración.',
          'Aprobaciones aparece si el usuario tiene permiso Aprobador o Super Aprobador.',
          'El badge de Aprobaciones debe mostrar pendientes reales confirmados desde Odoo.',
          'El badge de Almacenes puede indicar aprobaciones o tareas pendientes, pero no debe forzar navegación automática.',
        ],
      },
    ],
  },
  {
    id: 'solicitudes',
    title: '6. Flujo de Solicitudes',
    owner: 'Ambos',
    icon: <FileText className="w-4 h-4" />,
    summary:
      'Cómo se crea una solicitud multiproducto en app y cómo se registra en Odoo.',
    blocks: [
      {
        type: 'swimlane',
        title: 'Crear solicitud',
        app: [
          'Entrar a Almacenes y tocar Pedir equipos.',
          'Agregar múltiples equipos en sección Equipos.',
          'Agregar múltiples SIM Card en sección separada.',
          'Ver total de equipos y total de SIM Card.',
          'Seleccionar forma de entrega: Retiro, Envío a dirección o Envío interno.',
          'Si es envío, capturar Dirección de envío obligatoria.',
          'Agregar comentario adicional.',
          'Enviar y esperar confirmación de Odoo antes de mostrar éxito.',
        ],
        odoo: [
          'Crear registro ccr.equipment.request.',
          'Guardar líneas de equipos y líneas de SIM Card.',
          'Guardar cantidad solicitada original.',
          'Guardar forma de entrega, dirección/punto de retiro y comentario.',
          'Registrar comentario en chatter.',
          'Buscar aprobador en matriz.',
          'Asignar Pendiente por aprobación o Sin aprobador asignado.',
        ],
      },
      {
        type: 'list',
        title: 'Reglas visuales del formulario',
        items: [
          'Equipos y SIM Card van en la misma solicitud, pero en secciones separadas.',
          'Las líneas se agregan/editan con modal o bottom sheet para no hacer crecer la pantalla de forma desordenada.',
          'Cada sección debe tener totalizador.',
          'El botón Enviar solicitud debe ser claro y no depender de scroll excesivo.',
          'La app no debe usar lenguaje técnico como stock move, picking o backend en esta pantalla.',
        ],
      },
      {
        type: 'warning',
        title: 'Sin aprobador asignado',
        text: 'Si Odoo no encuentra aprobador, la solicitud queda en “Sin aprobador asignado” y la app debe indicar: “No tienes un aprobador asignado. Notifica al administrador para que configure tu aprobación.”',
      },
    ],
  },
  {
    id: 'aprobaciones',
    title: '7. Flujo de Aprobaciones',
    owner: 'Ambos',
    icon: <CheckSquare className="w-4 h-4" />,
    summary:
      'Cómo el aprobador revisa solicitudes completas, edita cantidades por línea y aprueba/rechaza.',
    blocks: [
      {
        type: 'swimlane',
        title: 'Revisión y aprobación',
        app: [
          'Mostrar tarjeta Aprobaciones con badge de pendientes.',
          'Usar filtros internos: Pendientes, Aprobadas, Rechazadas, Modificadas y Todas.',
          'Al abrir una solicitud, mostrarla completa como la ve el solicitante.',
          'Separar Equipos solicitados y SIM Card solicitadas.',
          'Por línea mostrar solicitado, aprobado y diferencia.',
          'Permitir editar cantidad aprobada por línea.',
          'Permitir Aprobar, Aprobar con ajustes o Rechazar con motivo obligatorio.',
        ],
        odoo: [
          'Validar que el usuario pueda aprobar esa solicitud.',
          'Bloquear autoaprobación salvo Super Aprobador o Administrador.',
          'Guardar requested_qty intacto.',
          'Guardar approved_qty, difference_qty, adjusted_by_id y adjustment_comment.',
          'Registrar cambios, aprobación o rechazo en chatter.',
          'Al aprobar, generar el picking único relacionado.',
        ],
      },
      {
        type: 'table',
        title: 'Edición individual por línea',
        headers: ['Campo', 'Comportamiento'],
        rows: [
          ['Producto/SIM', 'Solo lectura en el modal de ajuste.'],
          ['Cantidad solicitada', 'Solo lectura; nunca se sobrescribe.'],
          ['Cantidad aprobada', 'Editable por el aprobador.'],
          ['Comentario de ajuste', 'Opcional, pero recomendado si se reduce cantidad.'],
          ['Resultado', 'Si cambia alguna línea, la solicitud queda Aprobada con ajustes.'],
        ],
      },
      {
        type: 'warning',
        title: 'No sobrescribir',
        text: 'La cantidad solicitada original nunca se reemplaza. La app debe mostrar los cambios de forma simple: “POS Android VX-01: 5 → 3”. Odoo debe guardar trazabilidad completa.',
      },
    ],
  },
  {
    id: 'matriz',
    title: '8. Matriz de aprobadores',
    owner: 'Odoo',
    icon: <Database className="w-4 h-4" />,
    summary:
      'Configuración sencilla y restringida para definir quién aprueba solicitudes de quién.',
    blocks: [
      {
        type: 'list',
        title: 'Ubicación en Odoo',
        items: [
          'Menú: Solicitudes de Equipos → Configuración → Asignación de aprobadores.',
          'Solo visible para Administrador de Solicitudes.',
          'No visible para Solicitantes, Aprobadores comunes ni Distribuidores comunes.',
        ],
      },
      {
        type: 'table',
        title: 'Campos mínimos de ccr.approval.assignment',
        headers: ['Campo', 'Uso'],
        rows: [
          ['Aprobador principal', 'Usuario que aprobará solicitudes de los solicitantes asignados.'],
          ['Solicitantes asignados', 'Usuarios cubiertos por esa regla.'],
          ['Activo', 'Permite activar/desactivar la regla sin perder historial.'],
          ['Compañía', 'Preparado para una sola compañía por ahora.'],
          ['Chatter', 'Auditoría de cambios de configuración.'],
        ],
      },
      {
        type: 'list',
        title: 'Reglas funcionales',
        items: [
          'Cada solicitante debe tener un aprobador principal activo.',
          'No permitir dos aprobadores principales activos para el mismo solicitante.',
          'Si no hay aprobador, la solicitud queda Sin aprobador asignado.',
          'Super Aprobador puede atender casos sin aprobador asignado.',
          'La app no configura aprobadores; solo consume el resultado.',
        ],
      },
      {
        type: 'list',
        title: 'Auditoría obligatoria',
        items: [
          'Quién creó la asignación.',
          'Quién la modificó.',
          'Fecha de modificación.',
          'Aprobador anterior y aprobador nuevo.',
          'Solicitantes agregados o removidos.',
          'Activación o desactivación de reglas.',
        ],
      },
    ],
  },
  {
    id: 'estados-solicitud',
    title: '9. Estados de Solicitud',
    owner: 'Ambos',
    icon: <Zap className="w-4 h-4" />,
    summary:
      'Estados propios del modelo Solicitud; no confundir con estados nativos del picking.',
    blocks: [
      {
        type: 'table',
        title: 'Estados del modelo ccr.equipment.request',
        headers: ['Estado', 'Significado'],
        rows: [
          ['Borrador', 'Solicitud creada pero no enviada.'],
          ['Pendiente por aprobación', 'Solicitud enviada y con aprobador asignado.'],
          ['Sin aprobador asignado', 'No se encontró aprobador en la matriz.'],
          ['Aprobada', 'Aprobador aceptó cantidades solicitadas.'],
          ['Aprobada con ajustes', 'Aprobador modificó cantidades aprobadas.'],
          ['Rechazada', 'Aprobador rechazó con motivo obligatorio.'],
          ['Transferencia generada', 'Odoo generó picking relacionado.'],
          ['En preparación', 'Inventario está preparando el picking.'],
          ['Lista para retirar', 'Picking listo para entrega/retiro.'],
          ['Entregada', 'Picking validado en Odoo.'],
          ['Cancelada', 'Solicitud cancelada según reglas.'],
        ],
      },
      {
        type: 'warning',
        title: 'No confundir estados',
        text: 'Estos estados son funcionales de la solicitud. Los pickings tienen sus propios estados nativos: Confirmado, En espera, Listo, Hecho y Cancelado.',
      },
    ],
  },
  {
    id: 'pickings-solicitudes',
    title: '10. Pickings nativos para Solicitudes',
    owner: 'Odoo',
    icon: <Truck className="w-4 h-4" />,
    summary:
      'Reglas para generar y validar el picking único de una solicitud aprobada.',
    blocks: [
      {
        type: 'warning',
        title: 'Regla fundamental',
        text: 'La solicitud no valida el picking. La solicitud aprueba/rechaza/genera/abre el picking. La validación del inventario ocurre dentro del picking nativo de Odoo.',
      },
      {
        type: 'list',
        title: 'Flujo correcto',
        items: [
          'Solicitud aprobada o aprobada con ajustes.',
          'Odoo genera un único picking con Equipos aprobados y SIM Card aprobadas.',
          'La solicitud muestra smart button “Transferencia 1”.',
          'El usuario entra al picking.',
          'En el picking se asignan seriales/lotes si aplica.',
          'En el picking se comprueba disponibilidad si aplica.',
          'En el picking se valida el movimiento.',
          'El picking pasa a Hecho.',
          'La solicitud se actualiza a Entregada.',
        ],
      },
      {
        type: 'table',
        title: 'Estados nativos permitidos del picking',
        headers: ['Estado', 'Uso'],
        rows: [
          ['Confirmado', 'Transferencia creada y pendiente de operación.'],
          ['En espera', 'Pendiente por disponibilidad u otra condición.'],
          ['Listo', 'Preparada para procesar/validar.'],
          ['Hecho', 'Movimiento validado en Odoo.'],
          ['Cancelado', 'Movimiento cancelado.'],
        ],
      },
      {
        type: 'list',
        title: 'No hacer',
        tone: 'danger',
        items: [
          'No colocar botón “Validar picking” dentro de la solicitud.',
          'No marcar picking como Hecho al aprobar comercialmente.',
          'No asignar seriales desde la aprobación comercial.',
          'No descontar stock directamente desde la app.',
        ],
      },
    ],
  },
  {
    id: 'disponibilidad',
    title: '11. Disponibilidad / Inventario y Stock',
    owner: 'Ambos',
    icon: <Database className="w-4 h-4" />,
    summary:
      'Consulta de stock por producto/almacén con seriales individuales y bajo stock.',
    blocks: [
      {
        type: 'swimlane',
        title: 'Consulta de disponibilidad',
        app: [
          'Mostrar productos agrupados por producto y almacén.',
          'Cada tarjeta muestra Disponible, Reservado, Total y Mínimo.',
          'Mostrar estado: Disponible, Bajo stock o No disponible.',
          'Al tocar producto, mostrar todos los seriales individuales.',
          'Solo permitir selección de seriales si el usuario tiene permiso Distribuidor.',
        ],
        odoo: [
          'Tomar disponibilidad desde stock real de Odoo.',
          'Usar product.product, stock.location, stock.quant y stock.lot/serial.',
          'Exponer reservado, disponible, total y mínimo.',
          'Exponer estado de cada serial.',
        ],
      },
      {
        type: 'table',
        title: 'Reglas de estado de stock',
        headers: ['Condición', 'Estado mostrado'],
        rows: [
          ['Disponible = 0', 'No disponible'],
          ['Disponible <= Mínimo y disponible > 0', 'Bajo stock'],
          ['Disponible > Mínimo', 'Disponible'],
        ],
      },
      {
        type: 'table',
        title: 'Detalle de seriales',
        headers: ['Campo', 'Descripción'],
        rows: [
          ['Serial', 'Número individual del equipo o SIM Card.'],
          ['Producto', 'Producto al que pertenece el serial.'],
          ['Almacén', 'Ubicación actual.'],
          ['Estado', 'Disponible, Reservado, Asignado o Vendido.'],
        ],
      },
      {
        type: 'warning',
        title: 'Fuente de verdad',
        text: 'La app no calcula stock de forma independiente. La disponibilidad debe venir confirmada por Odoo.',
      },
    ],
  },
  {
    id: 'distribucion',
    title: '12. Distribución',
    owner: 'Ambos',
    icon: <Truck className="w-4 h-4" />,
    summary:
      'Proceso para seleccionar seriales disponibles y generar transferencias internas por almacén origen.',
    blocks: [
      {
        type: 'swimlane',
        title: 'Flujo de distribución',
        app: [
          'Botón Distribución visible solo con permiso.',
          'Entrar desde Almacenes → Distribución o desde Disponibilidad → Distribuir seleccionados.',
          'Mostrar seriales disponibles.',
          'Permitir selección individual y Seleccionar todos.',
          'Seleccionar todos solo toma seriales visibles y Disponibles.',
          'Botón Continuar fijo abajo.',
          'Crear/actualizar distribución en borrador o en proceso.',
          'Indicar almacén destino.',
          'Revisar resumen y generar transferencias.',
        ],
        odoo: [
          'Crear ccr.distribution.',
          'Guardar usuario, destino, seriales y líneas seleccionadas.',
          'Mostrar productos a distribuir agrupados por producto.',
          'Generar una transferencia por cada almacén origen.',
          'Mostrar smart button Transferencias con contador.',
          'Conservar chatter e historial.',
        ],
      },
      {
        type: 'table',
        title: 'Reglas de navegación y persistencia',
        headers: ['Caso', 'Resultado esperado'],
        rows: [
          ['Entra desde Almacenes → Distribución y presiona Atrás', 'Vuelve a Almacenes.'],
          ['Entra desde Disponibilidad → Distribuir seleccionados y presiona Atrás', 'Vuelve a Disponibilidad.'],
          ['Selecciona seriales y sale del flujo', 'Distribución queda en Borrador/En proceso.'],
          ['Vuelve luego a Distribución', 'Puede continuar la distribución pendiente.'],
        ],
      },
      {
        type: 'list',
        title: 'Validaciones en app',
        items: [
          'No permitir continuar sin seriales seleccionados.',
          'No permitir generar transferencias sin almacén destino.',
          'No permitir seleccionar seriales Reservados, Asignados o Vendidos.',
          'No permitir distribuir al mismo almacén origen si todos los seriales vienen de ese mismo almacén.',
          'Advertir si algún producto está en Bajo stock, sin bloquear por defecto.',
        ],
      },
    ],
  },
  {
    id: 'pickings-distribucion',
    title: '13. Pickings nativos para Distribución',
    owner: 'Odoo',
    icon: <Truck className="w-4 h-4" />,
    summary:
      'La distribución genera transferencias internas, pero cada picking se valida desde su vista nativa.',
    blocks: [
      {
        type: 'warning',
        title: 'Regla fundamental',
        text: 'La distribución no valida pickings. La distribución genera transferencias internas; cada transferencia se valida desde su propio picking nativo.',
      },
      {
        type: 'list',
        title: 'Regla de generación',
        items: [
          'Una distribución puede contener seriales de uno o varios almacenes origen.',
          'Odoo debe generar una transferencia interna por cada almacén origen.',
          'Todas las transferencias deben tener Documento origen = DIST-XXXX.',
          'Todas deben quedar vinculadas al documento padre de distribución.',
          'El smart button Transferencias debe mostrar el número de pickings generados.',
        ],
      },
      {
        type: 'table',
        title: 'Ejemplo de generación',
        headers: ['Documento', 'Origen', 'Destino', 'Seriales'],
        rows: [
          ['DIST-0001', 'Documento padre', 'Almacén Supervisor CCR', '3 seriales seleccionados'],
          ['WH/INT/00045', 'Almacén Principal Caracas', 'Almacén Supervisor CCR', 'VX01-000123, VX01-000124'],
          ['WH/INT/00046', 'Almacén Región Centro', 'Almacén Supervisor CCR', 'SIM-DIG-99881'],
        ],
      },
      {
        type: 'list',
        title: 'Cada picking debe mostrar',
        items: [
          'Referencia.',
          'Documento origen DIST-XXXX.',
          'Distribución relacionada.',
          'Almacén origen y destino.',
          'Productos y seriales incluidos.',
          'Estado nativo: Confirmado, En espera, Listo, Hecho o Cancelado.',
        ],
      },
    ],
  },
  {
    id: 'tracking',
    title: '14. Tracking en app y chatter en Odoo',
    owner: 'Ambos',
    icon: <Workflow className="w-4 h-4" />,
    summary:
      'Qué eventos ve el usuario en app y qué auditoría queda en Odoo.',
    blocks: [
      {
        type: 'cards',
        title: 'Eventos visibles en app',
        cards: [
          {
            title: 'Solicitudes',
            tone: 'success',
            items: [
              'Solicitud generada.',
              'Solicitud enviada para aprobación.',
              'Sin aprobador asignado.',
              'Solicitud editada.',
              'Solicitud aprobada / aprobada con ajustes.',
              'Solicitud rechazada.',
              'Transferencia generada.',
              'Transferencia lista / validada.',
              'Solicitud entregada / cancelada.',
            ],
          },
          {
            title: 'Distribución',
            tone: 'info',
            items: [
              'Distribución creada.',
              'Seriales seleccionados.',
              'Almacén destino definido.',
              'Transferencias generadas.',
              'Distribución parcial.',
              'Distribución completada.',
              'Distribución cancelada.',
            ],
          },
        ],
      },
      {
        type: 'list',
        title: 'Cada evento en app debe mostrar',
        items: ['Nombre del evento.', 'Usuario que realizó la acción.', 'Fecha y hora.', 'Descripción corta y entendible.'],
      },
      {
        type: 'list',
        title: 'Chatter en Odoo debe registrar',
        items: [
          'Comentarios enviados desde la app.',
          'Creación de solicitudes y distribuciones.',
          'Cambios de cantidades solicitadas/aprobadas.',
          'Aprobaciones, rechazos y motivos.',
          'Pickings generados.',
          'Seriales seleccionados.',
          'Transferencias generadas.',
          'Cambios de matriz de aprobación.',
          'Reasignaciones y cancelaciones.',
        ],
      },
    ],
  },
  {
    id: 'sincronizacion',
    title: '15. Sincronización App - Odoo',
    owner: 'Ambos',
    icon: <Zap className="w-4 h-4" />,
    summary:
      'Reglas para que la app no confirme acciones si Odoo no las confirma primero.',
    blocks: [
      {
        type: 'warning',
        title: 'Regla síncrona',
        text: 'La app no confirma nada hasta que Odoo responda correctamente. Si Odoo falla, la app debe mostrar error y no avanzar el estado visual.',
      },
      {
        type: 'list',
        title: 'Acciones que esperan confirmación',
        items: [
          'Crear solicitud.',
          'Aprobar, rechazar o aprobar con ajustes.',
          'Crear distribución o guardar distribución en proceso.',
          'Generar transferencias.',
          'Consultar disponibilidad.',
          'Consultar seriales.',
          'Consultar tracking.',
          'Consultar permisos del usuario.',
        ],
      },
      {
        type: 'table',
        title: 'Mensajes esperados',
        headers: ['Caso', 'Mensaje app'],
        rows: [
          ['Solicitud creada correctamente', 'Solicitud enviada.'],
          ['Distribución guardada', 'Distribución guardada. Puedes continuarla luego.'],
          ['Transferencias creadas', 'Transferencias generadas en Odoo.'],
          ['Falla general', 'No pudimos completar la acción. Intenta nuevamente.'],
          ['Serial ya no disponible', 'Algunos seriales ya no están disponibles. Actualiza la disponibilidad.'],
          ['Sin permiso', 'No tienes permiso para realizar esta acción.'],
        ],
      },
      {
        type: 'list',
        title: 'No mostrar al usuario final',
        tone: 'danger',
        items: ['API.', 'Endpoint.', 'Backend.', 'JSON.', 'Stock move.', 'Picking, salvo en vista Odoo o guía técnica.'],
      },
    ],
  },
  {
    id: 'modelos',
    title: '16. Modelos Odoo requeridos',
    owner: 'Odoo',
    icon: <Database className="w-4 h-4" />,
    summary:
      'Modelos propios y relaciones nativas necesarias en Odoo.',
    blocks: [
      {
        type: 'model',
        title: 'ccr.equipment.request',
        purpose: 'Documento funcional de solicitud creada desde la app.',
        fields: [
          'name',
          'requester_id',
          'approver_id',
          'state',
          'delivery_type',
          'shipping_address',
          'pickup_location_id',
          'comment',
          'equipment_line_ids',
          'sim_line_ids',
          'picking_id',
          'picking_count',
          'company_id',
          'message_ids',
        ],
      },
      {
        type: 'model',
        title: 'ccr.equipment.request.line',
        purpose: 'Líneas de equipos y SIM Card solicitadas/aprobadas.',
        fields: [
          'request_id',
          'line_type',
          'product_id',
          'operator',
          'requested_qty',
          'approved_qty',
          'difference_qty',
          'adjusted_by_id',
          'adjustment_comment',
          'state',
        ],
      },
      {
        type: 'model',
        title: 'ccr.approval.assignment',
        purpose: 'Matriz simple de aprobadores.',
        fields: ['name', 'approver_id', 'requester_ids', 'active', 'company_id', 'message_ids'],
      },
      {
        type: 'model',
        title: 'ccr.distribution',
        purpose: 'Documento padre de distribución de seriales.',
        fields: [
          'name',
          'user_id',
          'state',
          'destination_location_id',
          'line_ids',
          'picking_ids',
          'picking_count',
          'total_serials',
          'company_id',
          'message_ids',
        ],
      },
      {
        type: 'model',
        title: 'ccr.distribution.line',
        purpose: 'Seriales seleccionados para distribuir.',
        fields: [
          'distribution_id',
          'product_id',
          'lot_id',
          'origin_location_id',
          'destination_location_id',
          'serial_state',
          'picking_id',
        ],
      },
      {
        type: 'list',
        title: 'Relaciones nativas necesarias',
        items: ['stock.picking', 'stock.move', 'stock.move.line', 'stock.lot', 'stock.location', 'product.product', 'res.users'],
      },
    ],
  },
  {
    id: 'contratos',
    title: '17. Contratos de datos App - Odoo',
    owner: 'Ambos',
    icon: <FileText className="w-4 h-4" />,
    summary:
      'Ejemplos de datos que viajan entre la app y Odoo. No son endpoints finales obligatorios.',
    blocks: [
      {
        type: 'contract',
        title: 'Crear solicitud',
        sends: ['requester_id', 'equipment_lines: product_id, quantity', 'sim_lines: operator/product_id, quantity', 'delivery_type', 'shipping_address', 'pickup_location_id', 'comment'],
        receives: ['request_id', 'request_name', 'state', 'approver_id', 'message', 'tracking'],
      },
      {
        type: 'contract',
        title: 'Aprobar con ajustes',
        sends: ['request_id', 'approved_lines: line_id, approved_qty, adjustment_comment', 'action: approve | approve_with_adjustments | reject', 'rejection_reason si aplica'],
        receives: ['state', 'tracking', 'picking_id si aplica', 'message'],
      },
      {
        type: 'contract',
        title: 'Consultar disponibilidad',
        sends: ['user_id', 'product_filter opcional', 'location_filter opcional'],
        receives: ['product_id', 'product_name', 'warehouse/location', 'available_qty', 'reserved_qty', 'total_qty', 'min_qty', 'stock_status', 'serials: lot_id, serial_name, state, location'],
      },
      {
        type: 'contract',
        title: 'Crear distribución',
        sends: ['user_id', 'selected_serials: lot_id, product_id, origin_location_id', 'destination_location_id si ya existe'],
        receives: ['distribution_id', 'distribution_name', 'state', 'total_serials', 'lines'],
      },
      {
        type: 'contract',
        title: 'Generar transferencias',
        sends: ['distribution_id'],
        receives: ['distribution_state', 'pickings: picking_id, picking_name, origin_location, destination_location, state'],
      },
    ],
  },
  {
    id: 'app-responsabilidades',
    title: '18. Responsabilidades del desarrollador App',
    owner: 'App',
    icon: <Smartphone className="w-4 h-4" />,
    summary:
      'Checklist de construcción para el desarrollador de la app móvil dentro de Almacenes.',
    blocks: [
      {
        type: 'checklist',
        title: 'Checklist App',
        items: [
          'Leer permisos del usuario desde Odoo.',
          'Mostrar menú Almacenes según permisos acumulables.',
          'No tratar Solicitante y Aprobador como personas separadas.',
          'Crear formulario multiproducto con Equipos y SIM Card separados.',
          'Mostrar totalizadores de equipos y SIM Card.',
          'Mostrar dirección condicional según forma de entrega.',
          'Enviar comentario adicional a Odoo.',
          'Mostrar Mis solicitudes con filtros por estado.',
          'Mostrar Aprobaciones con badge y filtros internos.',
          'Mostrar vista completa de solicitud al aprobador.',
          'Permitir edición individual por línea.',
          'Mostrar tracking simple.',
          'Mostrar disponibilidad con disponible/reservado/total/mínimo.',
          'Mostrar todos los seriales individuales.',
          'Permitir selección de seriales solo al Distribuidor.',
          'Implementar Distribución con seleccionar todos.',
          'Mantener botón Continuar fijo abajo.',
          'Guardar distribución en borrador/en proceso.',
          'Respetar navegación de regreso según origen.',
          'Manejar errores de Odoo y no confirmar sin respuesta exitosa.',
          'No validar pickings desde la app.',
        ],
      },
    ],
  },
  {
    id: 'odoo-responsabilidades',
    title: '19. Responsabilidades del desarrollador Odoo',
    owner: 'Odoo',
    icon: <Database className="w-4 h-4" />,
    summary:
      'Checklist de construcción para el desarrollador Odoo.',
    blocks: [
      {
        type: 'checklist',
        title: 'Checklist Odoo',
        items: [
          'Crear modelos ccr.equipment.request y ccr.equipment.request.line.',
          'Crear modelo ccr.approval.assignment.',
          'Crear modelos ccr.distribution y ccr.distribution.line.',
          'Crear grupos: Solicitante, Aprobador, Super Aprobador, Administrador de Solicitudes y Distribuidor.',
          'Crear reglas de acceso y record rules.',
          'Implementar matriz de aprobación y auditoría.',
          'Implementar chatter en solicitudes, distribuciones y matriz.',
          'Implementar smart buttons de Transferencia(s).',
          'Generar picking único por solicitud aprobada.',
          'Generar transferencias por almacén origen en distribución.',
          'Relacionar con stock.picking, stock.move, stock.move.line y stock.lot.',
          'Exponer disponibilidad y seriales individuales.',
          'Bloquear acciones no permitidas, incluyendo autoaprobación.',
          'Garantizar validación nativa desde picking.',
          'Auditar cambios, rechazos, ajustes, reasignaciones y cancelaciones.',
        ],
      },
    ],
  },
  {
    id: 'casos-borde',
    title: '20. Casos borde y validaciones',
    owner: 'Ambos',
    icon: <AlertCircle className="w-4 h-4" />,
    summary:
      'Casos que deben controlarse para evitar errores funcionales.',
    blocks: [
      {
        type: 'table',
        title: 'Casos y resultado esperado',
        headers: ['Caso', 'Resultado esperado'],
        rows: [
          ['Usuario no tiene aprobador', 'Solicitud queda Sin aprobador asignado y la app indica notificar al administrador.'],
          ['Aprobador intenta aprobar su propia solicitud', 'Bloquear salvo Super Aprobador o Administrador.'],
          ['Aprobador reduce cantidades', 'Estado Aprobada con ajustes; guardar solicitado vs aprobado.'],
          ['Comentario adicional', 'Viaja al chatter de Odoo.'],
          ['Serial seleccionado deja de estar disponible', 'Odoo rechaza generación y app pide actualizar disponibilidad.'],
          ['Distribuidor sale del flujo', 'Distribución queda Borrador/En proceso y puede continuarse.'],
          ['Distribución con varios almacenes origen', 'Generar una transferencia por almacén origen.'],
          ['Producto bajo stock', 'Mostrar advertencia, no bloquear por defecto.'],
          ['Usuario sin permiso Distribuidor', 'No ve Distribución ni puede seleccionar seriales.'],
          ['Picking generado', 'Mostrar smart button; validar desde picking nativo.'],
          ['Rechazo sin motivo', 'No permitir rechazar hasta capturar motivo obligatorio.'],
        ],
      },
    ],
  },
  {
    id: 'criterios',
    title: '21. Criterios de aceptación',
    owner: 'Ambos',
    icon: <CheckSquare className="w-4 h-4" />,
    summary:
      'Pruebas verificables para confirmar que el desarrollo está completo.',
    blocks: [
      {
        type: 'checklist',
        title: 'Solicitudes',
        items: [
          'Puedo crear solicitud con varios equipos y varias SIM Card.',
          'Equipos y SIM están en la misma solicitud, pero visualmente separados.',
          'Veo total de equipos y total de SIM Card.',
          'Dirección aparece si la entrega es envío.',
          'Comentario llega al chatter de Odoo.',
          'Si no hay aprobador, se informa al usuario y queda Sin aprobador asignado.',
          'Mis solicitudes tiene filtros por etapa.',
          'Aprobador ve solicitud completa.',
          'Aprobador edita líneas individualmente.',
          'Cantidad solicitada no se sobrescribe y cantidad aprobada se guarda aparte.',
          'Se genera un solo picking para equipos y SIM Card.',
          'Picking se valida desde su propia vista nativa.',
        ],
      },
      {
        type: 'checklist',
        title: 'Disponibilidad',
        items: [
          'Veo productos agrupados por almacén.',
          'Veo disponible, reservado, total y mínimo.',
          'Veo estado Disponible, Bajo stock o No disponible.',
          'Al entrar al detalle veo todos los seriales individuales.',
          'Solo seriales disponibles pueden seleccionarse para distribución.',
        ],
      },
      {
        type: 'checklist',
        title: 'Distribución',
        items: [
          'Solo usuarios con permiso ven Distribución.',
          'Puedo seleccionar seriales uno por uno.',
          'Puedo seleccionar todos los seriales disponibles visibles.',
          'No selecciona reservados, asignados o vendidos.',
          'Continuar está fijo abajo.',
          'Si salgo, la distribución queda en proceso.',
          'Puedo continuar una distribución pendiente.',
          'Se genera una transferencia por almacén origen.',
          'Distribución muestra smart button con número de transferencias.',
          'Cada transferencia muestra productos y seriales.',
          'Pickings se validan desde pickings nativos.',
        ],
      },
    ],
  },
  {
    id: 'checklist-final',
    title: '22. Checklist final por desarrollador',
    owner: 'Ambos',
    icon: <CheckSquare className="w-4 h-4" />,
    summary:
      'Lista final de entrega separada para App y Odoo.',
    blocks: [
      {
        type: 'cards',
        title: 'Entrega final',
        cards: [
          {
            title: 'Desarrollador App',
            tone: 'success',
            items: [
              'Menú Almacenes por permisos.',
              'Solicitudes multiproducto con Equipos y SIM separados.',
              'Totalizadores, dirección condicional y comentario.',
              'Mis solicitudes con filtros.',
              'Aprobaciones con badge y edición por línea.',
              'Disponibilidad con cantidades, bajo stock y seriales.',
              'Distribución con selección, seleccionar todos y borrador/en proceso.',
              'Navegación correcta, tracking y manejo de errores Odoo.',
            ],
          },
          {
            title: 'Desarrollador Odoo',
            tone: 'info',
            items: [
              'Modelos propios y seguridad.',
              'Matriz de aprobación y auditoría.',
              'Chatter y smart buttons.',
              'Picking único por solicitud.',
              'Distribución padre y transferencias por origen.',
              'Estados correctos y validación nativa desde picking.',
              'Disponibilidad y seriales reales desde Odoo.',
              'Record rules, permisos y contratos para app.',
            ],
          },
        ],
      },
      {
        type: 'warning',
        title: 'Condición para aprobar la guía',
        text: 'No debe quedar ningún placeholder, “próxima iteración” ni sección vacía. Esta guía debe poder leerse como especificación de implementación del módulo Almacenes.',
      },
    ],
  },
];

function ownerBadge(owner: Owner) {
  const classes: Record<Owner, string> = {
    App: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Odoo: 'bg-blue-100 text-blue-800 border-blue-200',
    Ambos: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${classes[owner]}`}>{owner}</span>;
}

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === 'warning') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <div className="flex items-center gap-2 font-bold mb-1">
          <AlertCircle className="w-4 h-4" />
          {block.title}
        </div>
        <p className="leading-relaxed">{block.text}</p>
      </div>
    );
  }

  if (block.type === 'list') {
    const tone = block.tone ?? 'default';
    return (
      <div className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
        <h4 className="font-bold text-sm mb-2">{block.title}</h4>
        {block.intro && <p className="text-sm mb-2 leading-relaxed">{block.intro}</p>}
        <ul className="space-y-2 text-sm leading-relaxed">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#FF8200] mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.type === 'cards') {
    return (
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-slate-900">{block.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {block.cards.map((card) => {
            const tone = card.tone ?? 'default';
            return (
              <div key={card.title} className={`rounded-xl border p-4 ${toneClasses[tone]}`}>
                <h5 className="font-bold text-sm">{card.title}</h5>
                {card.subtitle && <p className="text-xs opacity-80 mb-2">{card.subtitle}</p>}
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckSquare className="w-3.5 h-3.5 text-[#FF8200] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (block.type === 'swimlane') {
    return (
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <h4 className="font-bold text-sm p-4 border-b bg-slate-50">{block.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-3">
              <Smartphone className="w-4 h-4" /> App CCRPOS
            </div>
            <ol className="space-y-2 text-sm">
              {block.app.map((item, index) => (
                <li key={item} className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 font-bold text-blue-800 text-sm mb-3">
              <Database className="w-4 h-4" /> Odoo 19 Enterprise
            </div>
            <ol className="space-y-2 text-sm">
              {block.odoo.map((item, index) => (
                <li key={item} className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === 'table') {
    return (
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <h4 className="font-bold text-sm p-4 bg-slate-50 border-b">{block.title}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {block.headers.map((header) => (
                  <th key={header} className="text-left p-3 font-bold border-b border-slate-200">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={`${block.title}-${index}`} className="border-b border-slate-100 last:border-b-0">
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`} className="p-3 align-top leading-relaxed">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (block.type === 'checklist') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="font-bold text-sm mb-3">{block.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {block.items.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
              <CheckSquare className="w-4 h-4 text-[#FF8200] shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === 'contract') {
    return (
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <h4 className="font-bold text-sm p-4 bg-slate-50 border-b">{block.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="p-4">
            <h5 className="font-bold text-xs text-emerald-800 uppercase mb-2">App envía</h5>
            <ul className="space-y-1.5 text-sm">
              {block.sends.map((item) => (
                <li key={item} className="font-mono bg-emerald-50 border border-emerald-100 rounded px-2 py-1 text-xs">{item}</li>
              ))}
            </ul>
          </div>
          <div className="p-4">
            <h5 className="font-bold text-xs text-blue-800 uppercase mb-2">Odoo responde</h5>
            <ul className="space-y-1.5 text-sm">
              {block.receives.map((item) => (
                <li key={item} className="font-mono bg-blue-50 border border-blue-100 rounded px-2 py-1 text-xs">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === 'model') {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <h4 className="font-mono font-bold text-sm text-blue-950">{block.title}</h4>
        <p className="text-sm text-blue-900 mt-1 mb-3">{block.purpose}</p>
        <div className="flex flex-wrap gap-2">
          {block.fields.map((field) => (
            <span key={field} className="font-mono text-xs bg-white border border-blue-200 text-blue-900 px-2 py-1 rounded">
              {field}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

function Accordion({ section, isOpen, onToggle }: { section: Section; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF8200] flex items-center justify-center shrink-0">{section.icon}</div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">{section.title}</h3>
              {ownerBadge(section.owner)}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{section.summary}</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="border-t border-slate-100 p-4 space-y-4 bg-slate-50/40">
          {section.blocks.map((block, index) => (
            <BlockRenderer key={`${section.id}-${index}`} block={block} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AlmacenesGuide({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [openSection, setOpenSection] = useState(sections[0].id);
  const [ownerFilter, setOwnerFilter] = useState<'Todos' | Owner>('Todos');

  const visibleSections = useMemo(() => {
    if (ownerFilter === 'Todos') return sections;
    return sections.filter((section) => section.owner === ownerFilter || section.owner === 'Ambos');
  }, [ownerFilter]);

  const currentSection = visibleSections.find((section) => section.id === activeSection) ?? visibleSections[0] ?? sections[0];

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setOpenSection(sectionId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-7xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="text-[#FF8200] w-5 h-5" />
              Guía Dev: Implementación del Módulo Almacenes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Especificación funcional y técnica para desarrollador App CCRPOS y desarrollador Odoo 19 Enterprise.
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center" aria-label="Cerrar guía">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden lg:flex w-72 border-r border-slate-200 bg-slate-50 flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
                <Filter className="w-3.5 h-3.5" /> Filtrar responsable
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['Todos', 'App', 'Odoo', 'Ambos'] as Array<'Todos' | Owner>).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setOwnerFilter(filter);
                      const nextSections = filter === 'Todos' ? sections : sections.filter((section) => section.owner === filter || section.owner === 'Ambos');
                      if (nextSections[0]) handleSelectSection(nextSections[0].id);
                    }}
                    className={`text-xs rounded-lg px-2 py-2 font-bold border ${ownerFilter === filter ? 'bg-[#FF8200] text-white border-[#FF8200]' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSelectSection(section.id)}
                  className={`w-full text-left rounded-xl p-3 text-xs transition-colors border ${currentSection.id === section.id ? 'bg-[#FF8200] text-white border-[#FF8200] shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                >
                  <div className="font-bold leading-tight">{section.title}</div>
                  <div className={`${currentSection.id === section.id ? 'text-white/80' : 'text-slate-500'} mt-1 line-clamp-2`}>{section.summary}</div>
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 overflow-y-auto bg-slate-100/60">
            <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-slate-200 p-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(['Todos', 'App', 'Odoo', 'Ambos'] as Array<'Todos' | Owner>).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOwnerFilter(filter)}
                    className={`text-xs rounded-full px-3 py-1.5 font-bold border whitespace-nowrap ${ownerFilter === filter ? 'bg-[#FF8200] text-white border-[#FF8200]' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <select
                value={currentSection.id}
                onChange={(event) => handleSelectSection(event.target.value)}
                className="w-full border border-slate-200 rounded-lg text-xs p-2 bg-white"
              >
                {visibleSections.map((section) => (
                  <option key={section.id} value={section.id}>{section.title}</option>
                ))}
              </select>
            </div>

            <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF8200] flex items-center justify-center">{currentSection.icon}</span>
                      {ownerBadge(currentSection.owner)}
                    </div>
                    <h1 className="text-xl font-extrabold text-slate-900">{currentSection.title}</h1>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{currentSection.summary}</p>
                  </div>
                </div>
              </div>

              {visibleSections.map((section) => (
                <Accordion
                  key={section.id}
                  section={section}
                  isOpen={openSection === section.id}
                  onToggle={() => {
                    setActiveSection(section.id);
                    setOpenSection(openSection === section.id ? '' : section.id);
                  }}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}