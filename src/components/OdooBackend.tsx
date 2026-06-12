import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface CargaTX { id: string; archivo: string; fechaOp: string; banco: string; registros: number; afiliados: number; dupli: number; estado: string; usuario: string; fechaCarga: string; alertas: number; notifs: number; }
interface ClienteCCR { id: string; nombre: string; rif: string; afiliado: string; banco: string; vendedor: string; dias: number; estado: string; ultima: string; tel: string; correo: string; }
interface AlertaCCR { id: string; cliente: string; afiliado: string; dias: number; nivel: string; vendedor: string; banco: string; notif: string; gestion: string; }
interface MetaRec { id: string; vendedor: string; meta: number; avance: number; banco: string; periodo: string; }
interface GestionCom { id: string; fecha: string; cliente: string; afiliado: string; vendedor: string; tipo: string; estado: string; notas: string; proxima: string; resultado: string; }
interface NotifCCR { id: string; fecha: string; destinatario: string; canal: string; plantilla: string; estado: string; carga: string; }

// ─── Style System ─────────────────────────────────────────────────────────────
const S = {
  bar: { background: '#714B67', color: 'white', padding: '0 16px', height: '48px', display: 'flex', alignItems: 'center', gap: '16px' } as React.CSSProperties,
  menuBtn: (active: boolean) => ({ padding: '8px 14px', cursor: 'pointer', borderRadius: '6px', background: active ? '#5c3d54' : 'transparent', color: 'white', fontSize: '12px', fontWeight: active ? 600 : 400, border: 'none', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' as const }) as React.CSSProperties,
  badge: (c: string) => ({ background: c, color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, display: 'inline-block' }) as React.CSSProperties,
  btn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#714B67', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 } as React.CSSProperties,
  btnSm: (c: string) => ({ background: c, color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }) as React.CSSProperties,
  btnOut: { background: 'white', color: '#714B67', border: '1px solid #714B67', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' } as React.CSSProperties,
  tag: (c: string) => ({ background: c + '22', color: c, border: '1px solid ' + c + '55', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 600 }) as React.CSSProperties,
  th: { background: '#f8f8f8', fontWeight: 600, fontSize: '12px', color: '#555', padding: '10px 14px', borderBottom: '2px solid #e0e0e0', textAlign: 'left' as const } as React.CSSProperties,
  td: { padding: '10px 14px', borderBottom: '1px solid #f0f0f0', fontSize: '13px', color: '#333' } as React.CSSProperties,
  kpiCard: (accent: string) => ({ background: 'white', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: '4px solid ' + accent }) as React.CSSProperties,
  warn: { background: '#fff3e0', border: '1px solid #FF9800', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: '#E65100', borderLeft: '3px solid #FF9800' } as React.CSSProperties,
  section: { background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' } as React.CSSProperties,
};

const estCol = (e: string): string => (({ 'Borrador': '#888', 'Validado': '#2196F3', 'Procesando': '#FF9800', 'Procesado': '#4CAF50', 'Procesado con advertencias': '#FF9800', 'Duplicado': '#F44336', 'Con errores': '#F44336', 'Cancelado': '#999' } as Record<string, string>)[e] || '#888');

// ═══════════════════════════ DASHBOARD ═══════════════════════════
function Dashboard({ user, kpis, syncEvents }: { user?: any; kpis?: any; syncEvents?: any[] }) {
  const k = kpis || { cargas: 3, clientes: 498, sinTransar: 142, alertasNuevas: 36, criticas: 8, recuperados: 35, cumplimiento: 73, gestiones: 89 };
  const ev = syncEvents || [];
  const isV = user?.rol === 'vendedor';
  const isB = user?.rol === 'banco';
  const isSup = user?.rol === 'supervisor';
  const factor = isV ? 3 : isB ? 4 : 1;
  const cards = [
    ...(isV || isB ? [] : [{ l: 'Cargas del mes', v: k.cargas, u: 'archivos', c: '#714B67', icon: '📁' }]),
    { l: 'Afiliados en cartera', v: Math.floor(k.clientes / factor), u: 'activos', c: '#2196F3', icon: '🏪' },
    { l: 'Sin transar', v: Math.floor(k.sinTransar / factor), u: 'POS', c: '#FF9800', icon: '⚠️' },
    { l: 'Alertas nuevas', v: Math.floor(k.alertasNuevas / factor), u: 'hoy', c: '#F44336', icon: '🔔' },
    { l: 'Recuperados', v: Math.floor(k.recuperados / factor), u: 'este mes', c: '#4CAF50', icon: '✅' },
    { l: 'Cumplimiento', v: isV ? k.cumplimiento - 5 : k.cumplimiento, u: '%', c: k.cumplimiento >= 70 ? '#4CAF50' : k.cumplimiento >= 50 ? '#FF9800' : '#F44336', icon: '🎯' },
  ];
  const defEvents = [
    { tiempo: 'Hace 3 min', descripcion: 'TX-0001 procesada · 498 afiliados actualizados', origen: 'odoo' },
    { tiempo: 'Hace 8 min', descripcion: '36 nuevas alertas de inactividad generadas', origen: 'odoo' },
    { tiempo: 'Hace 15 min', descripcion: 'Gestión registrada por Carlos Pérez en app móvil', origen: 'app' },
    { tiempo: 'Hace 32 min', descripcion: 'TX-0002 procesada · 484 afiliados · 3 duplicados', origen: 'odoo' },
  ];
  const displayEvents = ev.length > 0 ? ev : defEvents;
  return (
    <div>
      <div style={{ marginBottom: '20px', background: 'linear-gradient(135deg,#714B67,#9c6b8e)', borderRadius: '10px', padding: '20px', color: 'white' }}>
        <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.8 }}>Gestión de Clientes CCR — Módulo 2</p>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800 }}>Bienvenido, {user?.nombre || 'Usuario'}</h2>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
          {isV ? 'Vendedor · Solo tu cartera asignada' : isB ? 'Banco/Agente · Cartera de tu institución' : isSup ? 'Supervisor · Cartera de tu equipo' : 'Usuario CCR · Acceso total al módulo'}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
        {cards.map((it, i) => (
          <div key={i} style={S.kpiCard(it.c)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#888', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>{it.l}</p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: it.c, margin: '0 0 2px' }}>{it.v}</p>
                <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>{it.u}</p>
              </div>
              <span style={{ fontSize: '24px' }}>{it.icon}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={S.section}>
          <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 12px', color: '#555' }}>🔄 Sincronización reciente</p>
          {displayEvents.slice(0, 4).map((e: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '10px', color: '#888', whiteSpace: 'nowrap', flexShrink: 0, marginTop: '3px' }}>{e.tiempo}</span>
              <div>
                <p style={{ fontSize: '12px', color: '#333', margin: '0 0 3px' }}>{e.descripcion}</p>
                <span style={S.badge(e.origen === 'odoo' ? '#714B67' : '#2196F3') as React.CSSProperties}>{e.origen === 'odoo' ? 'Odoo' : 'App'}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={S.section}>
          <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 12px', color: '#555' }}>📋 Acciones rápidas</p>
          {[
            ...((isV || isB) ? [] : [{ l: 'Cargar nuevo Excel', d: 'Transacciones de afiliados', c: '#714B67', icon: '📤' }]),
            { l: 'Ver sin transar', d: `${Math.floor(k.sinTransar / factor)} afiliados pendientes`, c: '#FF9800', icon: '⚡' },
            { l: 'Alertas críticas', d: `${Math.ceil(k.criticas / factor)} requieren atención`, c: '#F44336', icon: '🚨' },
            { l: 'Registrar gestión', d: 'Actualizar estado de cliente', c: '#4CAF50', icon: '✏️' },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '6px', marginBottom: '6px', background: '#fafafa', cursor: 'pointer', border: '1px solid #eee' }}>
              <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: it.c + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{it.icon}</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 1px', color: '#333' }}>{it.l}</p>
                <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{it.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════ KPIS CREDICARD ═══════════════════════════
function KpisScreen({ user }: { user?: any }) {
  const isV = user?.rol === 'vendedor';
  const isB = user?.rol === 'banco';
  const isSup = user?.rol === 'supervisor';
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre'>('mes');
  const [vendedorFil, setVendedorFil] = useState('todos');

  const factor = isV ? 3 : isB ? 4 : 1;

  // KPI Groups
  const groups = [
    {
      titulo: 'Cartera y Transaccionalidad',
      icon: '🏪',
      color: '#2196F3',
      show: true,
      items: [
        { l: 'Afiliados en cartera', v: Math.floor(498 / factor), u: 'total', semaforo: '#4CAF50', desc: 'POS activos registrados en el período' },
        { l: 'Sin transar', v: Math.floor(142 / factor), u: 'POS', semaforo: '#FF9800', desc: 'Sin transacciones en los últimos 30 días' },
        { l: '% Sin transar', v: Math.round((142 / 498) * 100), u: '%', semaforo: '#FF9800', desc: 'Porcentaje de cartera inactiva' },
        { l: 'Días prom. inactividad', v: 23, u: 'días', semaforo: '#FF9800', desc: 'Promedio de días sin transacción' },
        ...(isV || isB ? [] : [{ l: 'Clientes sin responsable', v: 8, u: 'sin asignar', semaforo: '#F44336', desc: 'Afiliados sin vendedor o banco asignado' }]),
      ],
    },
    {
      titulo: 'Alertas de Inactividad',
      icon: '🔔',
      color: '#F44336',
      show: true,
      items: [
        { l: 'Alertas activas', v: Math.floor(36 / factor), u: 'total', semaforo: '#FF9800', desc: 'Alertas sin resolver en cartera propia' },
        { l: 'Críticas (≥60 días)', v: Math.ceil(8 / factor), u: 'urgentes', semaforo: '#F44336', desc: 'Umbral 60 días — acción inmediata' },
        { l: 'Alta (45–59 días)', v: Math.ceil(12 / factor), u: 'alta', semaforo: '#FF5722', desc: 'Umbral 45 días — gestión prioritaria' },
        { l: 'Media (30–44 días)', v: Math.ceil(10 / factor), u: 'media', semaforo: '#FF9800', desc: 'Umbral 30 días — seguimiento activo' },
        { l: 'Nuevas (10–29 días)', v: Math.floor(6 / factor), u: 'nuevas', semaforo: '#FFC107', desc: 'Umbral 10 días — monitoreo' },
        { l: 'Recuperadas este mes', v: Math.floor(35 / factor), u: 'confirmadas', semaforo: '#4CAF50', desc: 'Afiliados que volvieron a transar en Excel' },
      ],
    },
    {
      titulo: 'Metas de Recuperación',
      icon: '🎯',
      color: '#4CAF50',
      show: true,
      items: [
        { l: 'Cumplimiento general', v: isV ? 68 : 73, u: '%', semaforo: (isV ? 68 : 73) >= 80 ? '#4CAF50' : (isV ? 68 : 73) >= 60 ? '#FF9800' : '#F44336', desc: 'Meta de recuperación del período' },
        { l: 'Meta asignada', v: Math.ceil(48 / factor), u: 'afiliados', semaforo: '#2196F3', desc: 'Objetivo de afiliados a recuperar' },
        { l: 'Recuperados confirmados', v: Math.floor(35 / factor), u: 'afiliados', semaforo: '#4CAF50', desc: 'Confirmados en Excel posterior (R: recuperación real)' },
        { l: 'Pendientes de recuperar', v: Math.ceil(13 / factor), u: 'restantes', semaforo: '#FF9800', desc: 'Para alcanzar la meta del período' },
        ...(isV || isB ? [] : [{ l: 'Vendedores en meta (≥80%)', v: 2, u: 'de 4', semaforo: '#4CAF50', desc: 'Equipo alcanzando o superando meta' }]),
        ...(isV || isB ? [] : [{ l: 'Vendedores por debajo (≤50%)', v: 1, u: 'de 4', semaforo: '#F44336', desc: 'Requieren intervención de supervisor' }]),
      ],
    },
    {
      titulo: 'Gestiones Comerciales',
      icon: '📞',
      color: '#9C27B0',
      show: true,
      items: [
        { l: 'Gestiones registradas', v: Math.floor(89 / factor), u: 'este mes', semaforo: '#4CAF50', desc: 'Gestiones en app móvil y Odoo' },
        { l: 'Resueltas', v: Math.floor(34 / factor), u: 'cerradas', semaforo: '#4CAF50', desc: 'Gestiones marcadas como resueltas' },
        { l: 'En seguimiento', v: Math.floor(41 / factor), u: 'activas', semaforo: '#2196F3', desc: 'Pendientes de cierre' },
        { l: 'Sin respuesta', v: Math.floor(14 / factor), u: 'sin contacto', semaforo: '#FF9800', desc: 'Cliente no responde después de 3 intentos' },
      ],
    },
    {
      titulo: 'Cargas y Procesamiento',
      icon: '📁',
      color: '#714B67',
      show: !(isV || isB),
      items: [
        { l: 'Cargas del mes', v: 3, u: 'archivos', semaforo: '#2196F3', desc: 'Excel procesados en el período' },
        { l: 'Afiliados procesados', v: 1480, u: 'registros', semaforo: '#4CAF50', desc: 'Total de líneas de transacción procesadas' },
        { l: 'Duplicados detectados', v: 7, u: 'rechazados', semaforo: '#FF9800', desc: 'Archivos marcados como carga duplicada' },
        { l: 'Alertas generadas', v: 95, u: 'por cargas', semaforo: '#FF9800', desc: 'Nuevas alertas generadas automáticamente' },
        { l: 'Notificaciones enviadas', v: 91, u: 'simuladas', semaforo: '#4CAF50', desc: 'SMS + WhatsApp + Correo + Push' },
      ],
    },
  ].filter(g => g.show);

  const semaforo = (c: string) => ({ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: c, marginRight: '6px', flexShrink: 0 });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>KPIs Credicard — Gestión de Clientes</h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>
            {isV ? `Solo tu cartera · ${user?.nombre}` : isB ? `Banco ${user?.banco} · Cartera asociada` : isSup ? 'Tu equipo de vendedores asignados' : 'Vista global · Todos los vendedores y bancos'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!isV && !isB && (
            <select style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '12px' }}
              value={vendedorFil} onChange={e => setVendedorFil(e.target.value)}>
              <option value="todos">Todos los vendedores</option>
              <option value="carlos">Carlos Pérez</option>
              <option value="maria">María Gómez</option>
              <option value="ana">Ana Torres</option>
              <option value="banco201">Banco 201</option>
            </select>
          )}
          {['mes', 'trimestre'].map(p => (
            <button key={p} style={S.menuBtn(periodo === p) as React.CSSProperties}
              onClick={() => setPeriodo(p as any)}>
              {p === 'mes' ? 'Este mes' : 'Trimestre'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff8e1', border: '1px solid #FFC107', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#795548', display: 'flex', gap: '8px' }}>
        <span style={{ flexShrink: 0 }}>⚠️</span>
        <span><strong>Regla de recuperación real (R):</strong> Un afiliado solo se confirma recuperado cuando vuelve a aparecer transando en un archivo Excel posterior. Marcar &quot;Problema resuelto&quot; en app no confirma recuperación.</span>
      </div>

      {groups.map((g, gi) => (
        <div key={gi} style={{ ...S.section, marginBottom: '16px' }}>
          <p style={{ fontWeight: 700, fontSize: '15px', margin: '0 0 12px', color: g.color, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {g.icon} {g.titulo}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
            {g.items.map((it, ii) => (
              <div key={ii} style={{ background: '#fafafa', borderRadius: '8px', padding: '12px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={semaforo(it.semaforo)} />
                  <p style={{ fontSize: '11px', color: '#666', margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>{it.l}</p>
                </div>
                <p style={{ fontSize: '24px', fontWeight: 800, color: g.color, margin: '0 0 2px' }}>{it.v}</p>
                <p style={{ fontSize: '10px', color: '#aaa', margin: '0 0 4px' }}>{it.u}</p>
                <p style={{ fontSize: '10px', color: '#888', margin: 0, lineHeight: 1.3 }}>{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!isV && !isB && (
        <div style={S.section}>
          <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 12px', color: '#555' }}>🏆 Ranking de vendedores — {periodo === 'mes' ? 'Este mes' : 'Trimestre'}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              {['#', 'Vendedor / Banco', 'Cartera', 'Recuperados', 'Cumplimiento', 'Gestiones', 'Estado'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                { r: 1, n: 'María Gómez', c: 166, rec: 14, cum: 88, gest: 32, est: '#4CAF50' },
                { r: 2, n: 'Ana Torres', c: 124, rec: 11, cum: 79, gest: 27, est: '#4CAF50' },
                { r: 3, n: 'Banco 201', c: 125, rec: 7, cum: 68, gest: 18, est: '#FF9800' },
                { r: 4, n: 'Carlos Pérez', c: 83, rec: 3, cum: 52, gest: 12, est: '#FF9800' },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ ...S.td, fontWeight: 700, color: row.r === 1 ? '#FFD700' : '#555' }}>{row.r === 1 ? '🥇' : row.r === 2 ? '🥈' : row.r === 3 ? '🥉' : row.r}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{row.n}</td>
                  <td style={S.td}>{row.c}</td>
                  <td style={S.td}>{row.rec}</td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#eee', borderRadius: '3px' }}>
                        <div style={{ width: row.cum + '%', height: '100%', background: row.est, borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontWeight: 700, color: row.est }}>{row.cum}%</span>
                    </div>
                  </td>
                  <td style={S.td}>{row.gest}</td>
                  <td style={S.td}><span style={S.tag(row.est) as React.CSSProperties}>{row.cum >= 80 ? 'En meta' : row.cum >= 60 ? 'En progreso' : 'Por debajo'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════ CARGAS DE TRANSACCIONES ═══════════════════════════
function CargasScreen({ notify, onAction }: { notify: (m: string, t?: string) => void; onAction?: (a: string, p?: any) => void }) {
  const HIST_INIT: CargaTX[] = [
    { id: 'TX-0003', archivo: 'Cierre_Abril_2026.xlsx', fechaOp: '25/04/2026', banco: 'Banco 201', registros: 520, afiliados: 518, dupli: 2, estado: 'Procesado', usuario: 'Sandra CCR', fechaCarga: '26/04/2026 09:15', alertas: 28, notifs: 28 },
    { id: 'TX-0002', archivo: 'Colocacion_Mayo_2026.xlsx', fechaOp: '27/05/2026', banco: 'Banco 201', registros: 487, afiliados: 484, dupli: 3, estado: 'Procesado con advertencias', usuario: 'Sandra CCR', fechaCarga: '28/05/2026 10:30', alertas: 31, notifs: 29 },
    { id: 'TX-0001', archivo: 'Colocacion de afiliado.xlsx', fechaOp: '03/06/2026', banco: 'Banco 201', registros: 500, afiliados: 498, dupli: 2, estado: 'Borrador', usuario: 'Sandra CCR', fechaCarga: '03/06/2026 14:00', alertas: 0, notifs: 0 },
  ];
  const TRAZ_INIT = [
    { t: '26/04/2026 09:30', acc: 'Procesar archivo', user: 'Sandra CCR', antes: 'Validado', despues: 'Procesado', res: '518 afiliados · 28 alertas · 28 notificaciones' },
    { t: '28/05/2026 10:45', acc: 'Procesar archivo', user: 'Sandra CCR', antes: 'Validado', despues: 'Procesado con advertencias', res: '484 afiliados · 31 alertas · RIF J-20441209-0 duplicado' },
  ];

  const [cargas, setCargas] = useState<CargaTX[]>(HIST_INIT);
  const [sel, setSel] = useState('TX-0001');
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [traz, setTraz] = useState<any[]>(TRAZ_INIT);

  const c = cargas.find(x => x.id === sel) || cargas[0];

  const logEntry = (acc: string, antes: string, desp: string, res: string) =>
    setTraz(l => [{ t: new Date().toLocaleString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), acc, user: 'Sandra CCR', antes, despues: desp, res }, ...l]);

  const doValidar = () => {
    const antes = c.estado;
    setCargas(cs => cs.map(x => x.id === sel ? { ...x, estado: 'Validado' } : x));
    logEntry('Validar archivo', antes, 'Validado', 'Columnas FECHA, CODBANCO, MANEJADOR, AFILIADO (texto ⚠), TRANSACCION, RESPUESTA, CANTIDAD ✓ · 500 registros · 498 afiliados únicos · 2 duplicados internos');
    notify('✅ TX-0001 validada: 498 afiliados únicos · 2 duplicados internos · Columnas correctas');
    if (onAction) onAction('validateUpload', { id: sel });
  };

  const doProcesar = () => {
    const antes = c.estado;
    setCargas(cs => cs.map(x => x.id === sel ? { ...x, estado: 'Procesado', alertas: 36, notifs: 34 } : x));
    logEntry('Procesar archivo', antes, 'Procesado', '498 afiliados actualizados · 36 alertas inactividad · 34 notificaciones (14 SMS · 12 WhatsApp · 8 Correo) · KPIs actualizados · Cartera y metas refrescadas');
    notify('✅ TX-0001 procesada: 498 afiliados · 36 alertas · 34 notificaciones. KPIs actualizados.');
    if (onAction) onAction('processUpload', { id: sel, afiliados: 498, alertas: 36, notifs: 34 });
  };

  const doDuplicado = () => {
    const antes = c.estado;
    setCargas(cs => cs.map(x => x.id === sel ? { ...x, estado: 'Duplicado' } : x));
    logEntry('Simular duplicado', antes, 'Duplicado', 'Archivo ya cargado anteriormente · No procesado · Cartera, metas, alertas sin cambios · Notificaciones no generadas');
    notify('⚠️ TX-0001 duplicada: no procesada · Cartera y metas sin cambios · Sin nuevas alertas', 'warning');
    if (onAction) onAction('detectDuplicate', { id: sel });
  };

  if (view === 'detail') return (
    <div>
      <button onClick={() => setView('list')} style={{ ...S.btnOut, marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}>← Volver a lista</button>
      <div style={S.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: '#714B67' }}>{c.id}</h2>
            <p style={{ margin: '0 0 8px', color: '#888', fontSize: '13px' }}>{c.archivo} · {c.banco} · Cargado por {c.usuario}</p>
            <span style={S.badge(estCol(c.estado)) as React.CSSProperties}>{c.estado}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {c.estado === 'Borrador' && <button style={{ ...S.btn }} onClick={doValidar}>✓ Validar archivo</button>}
            {c.estado === 'Validado' && <button style={{ ...S.btn, background: '#4CAF50' }} onClick={doProcesar}>▶ Procesar archivo</button>}
            {['Borrador', 'Validado'].includes(c.estado) && (
              <button style={{ ...S.btnOut, color: '#F44336', border: '1px solid #F44336' }} onClick={doDuplicado}>⚠ Simular duplicado</button>
            )}
          </div>
        </div>

        {c.estado === 'Duplicado' && (
          <div style={{ background: '#fce4ec', border: '1px solid #F44336', borderRadius: '6px', padding: '12px', marginBottom: '16px', color: '#c62828', fontSize: '13px', fontWeight: 600 }}>
            ⚠️ Este archivo ya fue cargado anteriormente. No se procesará nuevamente. Cartera, metas, alertas y notificaciones sin cambios.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' }}>
          {[
            { l: 'Fecha operación', v: c.fechaOp }, { l: 'Fecha de carga', v: c.fechaCarga },
            { l: 'Banco', v: c.banco }, { l: 'Usuario', v: c.usuario },
            { l: 'Registros leídos', v: String(c.registros) }, { l: 'Afiliados únicos', v: String(c.afiliados) },
            { l: 'Duplicados internos', v: String(c.dupli) }, { l: 'Alertas generadas', v: c.alertas ? String(c.alertas) : '—' },
          ].map((it, i) => (
            <div key={i} style={{ background: '#f9f9f9', borderRadius: '6px', padding: '10px' }}>
              <p style={{ fontSize: '10px', color: '#888', margin: '0 0 3px', textTransform: 'uppercase', fontWeight: 600 }}>{it.l}</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#333', margin: 0 }}>{it.v}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#f0f4ff', borderRadius: '6px', padding: '12px', marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 8px', color: '#1a237e' }}>Columnas requeridas del Excel</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['FECHA', 'CODBANCO', 'MANEJADOR', 'AFILIADO (texto ⚠)', 'TRANSACCION', 'RESPUESTA', 'CANTIDAD'].map((col, i) => (
              <span key={i} style={{ background: c.estado === 'Borrador' ? '#e8eaf6' : '#E8F5E9', color: c.estado === 'Borrador' ? '#3949ab' : '#2E7D32', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, border: '1px solid ' + (c.estado === 'Borrador' ? '#9fa8da' : '#a5d6a7') }}>{col}</span>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#F44336', margin: '6px 0 0', fontWeight: 600 }}>⚠ AFILIADO siempre se trata como texto. Nunca como número.</p>
        </div>

        {c.estado === 'Procesado' && (
          <div style={{ background: '#E8F5E9', borderRadius: '6px', padding: '14px', marginBottom: '14px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, margin: '0 0 10px', color: '#2E7D32' }}>✅ Resultado del procesamiento</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
              {[
                { l: 'Afiliados actualizados', v: '498' }, { l: 'Alertas de inactividad', v: '36' },
                { l: 'Notificaciones simuladas', v: '34' }, { l: 'Sin transar en cartera', v: '142' },
                { l: 'Recuperados confirmados', v: '— (confirma próx. Excel)' }, { l: 'Metas actualizadas', v: 'Sí · Todos los vendedores' },
              ].map((it, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '4px', padding: '8px' }}>
                  <p style={{ fontSize: '10px', color: '#666', margin: '0 0 2px' }}>{it.l}</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#2E7D32', margin: 0 }}>{it.v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={S.warn}>⚠️ <strong>Regla de recuperación:</strong> Un afiliado solo se considera recuperado cuando vuelve a aparecer transando en un Excel posterior. &quot;Problema resuelto&quot; en app no confirma recuperación.</div>
      </div>

      <div style={S.section}>
        <p style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 12px', color: '#555' }}>🔍 Trazabilidad de operaciones</p>
        {traz.length === 0
          ? <p style={{ color: '#aaa', fontSize: '13px' }}>Sin operaciones registradas.</p>
          : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead><tr>{['Hora', 'Acción', 'Usuario', 'Estado anterior', 'Estado nuevo', 'Resultado'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {traz.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ ...S.td, whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '11px' }}>{row.t}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{row.acc}</td>
                    <td style={S.td}>{row.user}</td>
                    <td style={S.td}><span style={S.badge(estCol(row.antes)) as React.CSSProperties}>{row.antes}</span></td>
                    <td style={S.td}><span style={S.badge(estCol(row.despues)) as React.CSSProperties}>{row.despues}</span></td>
                    <td style={{ ...S.td, fontSize: '11px', color: '#555', maxWidth: '260px' }}>{row.res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Cargas de Transacciones</h2>
        <button style={S.btn}>+ Nueva Carga</button>
      </div>
      <div style={S.warn}>
        ⚠️ <strong>AFILIADO tratado como texto.</strong> La recuperación real se confirma en el siguiente Excel con transacción activa, no por gestión del vendedor.
      </div>
      <div style={{ height: '14px' }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr>{['ID Carga', 'Archivo', 'Fecha op.', 'Banco', 'Registros', 'Afiliados', 'Duplicados', 'Alertas', 'Estado', 'Acciones'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {cargas.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa', cursor: 'pointer' }} onClick={() => { setSel(row.id); setView('detail'); }}>
              <td style={{ ...S.td, fontWeight: 700, color: '#714B67' }}>{row.id}</td>
              <td style={{ ...S.td, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.archivo}</td>
              <td style={{ ...S.td, whiteSpace: 'nowrap' }}>{row.fechaOp}</td>
              <td style={S.td}>{row.banco}</td>
              <td style={S.td}>{row.registros}</td>
              <td style={S.td}>{row.afiliados}</td>
              <td style={{ ...S.td, color: row.dupli > 0 ? '#F44336' : '#4CAF50', fontWeight: 600 }}>{row.dupli}</td>
              <td style={S.td}>{row.alertas || '—'}</td>
              <td style={S.td}><span style={S.badge(estCol(row.estado)) as React.CSSProperties}>{row.estado}</span></td>
              <td style={S.td} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={S.btnSm('#714B67')} onClick={() => { setSel(row.id); setView('detail'); }}>Ver</button>
                  {row.estado === 'Borrador' && <button style={S.btnSm('#2196F3')} onClick={() => { setSel(row.id); setView('detail'); }}>Validar</button>}
                  {row.estado === 'Validado' && <button style={S.btnSm('#4CAF50')} onClick={() => { setSel(row.id); setView('detail'); }}>Procesar</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════ CARTERA DE CLIENTES ═══════════════════════════
function CarteraScreen({ notify, vendedorFilter, bancoFilter }: { notify: (m: string, t?: string) => void; vendedorFilter?: string; bancoFilter?: string }) {
  const CARTERA: ClienteCCR[] = [
    { id: 'c1', nombre: 'Comercial La Esquina, C.A.', rif: 'J-29481234-5', afiliado: 'AFI-20220145', banco: 'Banco 201', vendedor: 'Carlos Pérez', dias: 62, estado: 'critico', ultima: '01/04/2026', tel: '0414-5551234', correo: 'laesquina@gmail.com' },
    { id: 'c2', nombre: 'Ferretería El Clavo', rif: 'J-20441209-0', afiliado: 'AFI-20180089', banco: 'Banco 201', vendedor: 'María Gómez', dias: 0, estado: 'activo', ultima: '10/06/2026', tel: '0424-7779012', correo: 'elclavo@ferro.ve' },
    { id: 'c3', nombre: 'Panadería San Simón', rif: 'J-30572891-3', afiliado: 'AFI-20210334', banco: 'Banco 201', vendedor: 'Carlos Pérez', dias: 34, estado: 'alerta', ultima: '07/05/2026', tel: '0212-3334567', correo: 'sansmon@pan.ve' },
    { id: 'c4', nombre: 'Distribuidora Caracas', rif: 'J-31009823-1', afiliado: 'AFI-20200512', banco: 'Banco 201', vendedor: 'Ana Torres', dias: 48, estado: 'alerta', ultima: '23/04/2026', tel: '0416-8881234', correo: 'distrcaracas@ve.com' },
    { id: 'c5', nombre: 'Supermercado La Paz', rif: 'J-28765432-8', afiliado: 'AFI-20190780', banco: 'Banco 201', vendedor: 'María Gómez', dias: 15, estado: 'activo', ultima: '26/05/2026', tel: '0212-5556789', correo: 'lapaz@super.ve' },
    { id: 'c6', nombre: 'Bodegón Central', rif: 'J-27891234-6', afiliado: 'AFI-20230156', banco: 'Banco 201', vendedor: 'Carlos Pérez', dias: 58, estado: 'critico', ultima: '15/04/2026', tel: '0412-2223456', correo: 'bodegon@central.ve' },
  ];

  const [showHistorial, setShowHistorial] = useState(false);
  const estadoColor = (e: string) => ({ activo: '#4CAF50', alerta: '#FF9800', critico: '#F44336', recuperado: '#2196F3' }[e] || '#888');

  let lista = CARTERA;
  if (vendedorFilter) lista = lista.filter(x => x.vendedor.toLowerCase().includes(vendedorFilter.toLowerCase()));
  if (bancoFilter) lista = lista.filter(x => x.banco.includes(bancoFilter));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Cartera de Clientes</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ ...S.btnOut, fontSize: '12px', padding: '6px 12px' }} onClick={() => setShowHistorial(!showHistorial)}>
            {showHistorial ? 'Ocultar historial' : '📊 Ver antes/después TX-0001'}
          </button>
          <button style={S.btn}>+ Asignar responsable</button>
        </div>
      </div>

      {showHistorial && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {[
            { titulo: 'ANTES — TX-0000 (Mayo 2026)', bg: '#fff3e0', border: '#FF9800', items: ['498 afiliados en cartera', '137 sin transar (27.5%)', '32 alertas activas', 'Cumplimiento: 68%', 'Recuperados: 31'] },
            { titulo: 'DESPUÉS — TX-0001 (Junio 2026)', bg: '#E8F5E9', border: '#4CAF50', items: ['498 afiliados actualizados', '142 sin transar (28.5%)', '36 alertas activas (+4 nuevas)', 'Cumplimiento: 73% (+5pp)', 'Recuperados: 35 (+4 confirmados)'] },
          ].map((panel, i) => (
            <div key={i} style={{ background: panel.bg, border: '1px solid ' + panel.border, borderRadius: '8px', padding: '12px' }}>
              <p style={{ fontWeight: 700, fontSize: '12px', margin: '0 0 8px', color: '#555' }}>{panel.titulo}</p>
              {panel.items.map((it, j) => <p key={j} style={{ fontSize: '12px', margin: '0 0 3px', color: '#444' }}>• {it}</p>)}
            </div>
          ))}
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr>{['Nombre', 'RIF', 'Afiliado', 'Banco', 'Vendedor', 'Días sin transar', 'Estado', 'Última tx.', 'Acciones'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {lista.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              <td style={{ ...S.td, fontWeight: 600 }}>{row.nombre}</td>
              <td style={{ ...S.td, fontFamily: 'monospace', fontSize: '11px' }}>{row.rif}</td>
              <td style={{ ...S.td, fontSize: '11px', color: '#714B67', fontWeight: 600 }}>{row.afiliado}</td>
              <td style={S.td}>{row.banco}</td>
              <td style={S.td}>{row.vendedor}</td>
              <td style={{ ...S.td, fontWeight: 700, color: row.dias > 45 ? '#F44336' : row.dias > 15 ? '#FF9800' : '#4CAF50' }}>{row.dias > 0 ? row.dias + ' días' : 'Activo'}</td>
              <td style={S.td}><span style={S.tag(estadoColor(row.estado)) as React.CSSProperties}>{row.estado}</span></td>
              <td style={{ ...S.td, fontSize: '11px' }}>{row.ultima}</td>
              <td style={S.td}><button style={S.btnSm('#714B67')} onClick={() => notify('Gestión registrada para ' + row.nombre)}>Gestionar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════ ALERTAS DE INACTIVIDAD ═══════════════════════════
function AlertasScreen({ notify, vendedorFilter }: { notify: (m: string, t?: string) => void; vendedorFilter?: string }) {
  const ALERTAS_BASE: AlertaCCR[] = [
    { id: 'A001', cliente: 'Comercial La Esquina, C.A.', afiliado: 'AFI-20220145', dias: 62, nivel: 'critica', vendedor: 'Carlos Pérez', banco: 'Banco 201', notif: 'SMS+WhatsApp', gestion: 'Llamada pendiente' },
    { id: 'A002', cliente: 'Bodegón Central', afiliado: 'AFI-20230156', dias: 58, nivel: 'critica', vendedor: 'Carlos Pérez', banco: 'Banco 201', notif: 'SMS', gestion: 'Sin gestión' },
    { id: 'A003', cliente: 'Distribuidora Caracas', afiliado: 'AFI-20200512', dias: 48, nivel: 'alta', vendedor: 'Ana Torres', banco: 'Banco 201', notif: 'WhatsApp', gestion: 'En seguimiento' },
    { id: 'A004', cliente: 'Panadería San Simón', afiliado: 'AFI-20210334', dias: 34, nivel: 'media', vendedor: 'Carlos Pérez', banco: 'Banco 201', notif: 'Correo', gestion: 'Gestión programada' },
    { id: 'A005', cliente: 'Supermercado La Paz', afiliado: 'AFI-20190780', dias: 15, nivel: 'nueva', vendedor: 'María Gómez', banco: 'Banco 201', notif: 'Push', gestion: 'Nueva' },
    { id: 'A-PREV1', cliente: 'Ferretería El Clavo', afiliado: 'AFI-20180089', dias: 0, nivel: 'recuperada', vendedor: 'María Gómez', banco: 'Banco 201', notif: 'SMS', gestion: 'Recuperado en TX-0001' },
    { id: 'A-PREV2', cliente: 'Bodega Petare Sur', afiliado: 'AFI-20170234', dias: 0, nivel: 'descartada', vendedor: 'Ana Torres', banco: 'Banco 201', notif: '—', gestion: 'Descartada por CCR' },
  ];
  const [filtro, setFiltro] = useState('activas');
  const nivelColor = { critica: '#F44336', alta: '#FF5722', media: '#FF9800', nueva: '#FFC107', recuperada: '#4CAF50', descartada: '#9E9E9E' } as Record<string, string>;

  let lista = vendedorFilter ? ALERTAS_BASE.filter(a => a.vendedor.toLowerCase().includes(vendedorFilter.toLowerCase())) : ALERTAS_BASE;
  if (filtro === 'activas') lista = lista.filter(a => ['critica', 'alta', 'media', 'nueva'].includes(a.nivel));
  else if (filtro === 'criticas') lista = lista.filter(a => a.nivel === 'critica');
  else if (filtro === 'recuperadas') lista = lista.filter(a => a.nivel === 'recuperada');
  else if (filtro === 'descartadas') lista = lista.filter(a => a.nivel === 'descartada');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Alertas de Inactividad</h2>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['activas', 'criticas', 'recuperadas', 'descartadas', 'todas'].map(f => (
            <button key={f} style={{ ...S.menuBtn(filtro === f), background: filtro === f ? '#714B67' : '#f0f0f0', color: filtro === f ? 'white' : '#555', borderRadius: '6px', fontSize: '11px', padding: '5px 10px' }}
              onClick={() => setFiltro(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { l: 'Críticas ≥60d', v: ALERTAS_BASE.filter(a => a.nivel === 'critica').length, c: '#F44336' },
          { l: 'Alta 45–59d', v: ALERTAS_BASE.filter(a => a.nivel === 'alta').length, c: '#FF5722' },
          { l: 'Media 30–44d', v: ALERTAS_BASE.filter(a => a.nivel === 'media').length, c: '#FF9800' },
          { l: 'Nuevas 10–29d', v: ALERTAS_BASE.filter(a => a.nivel === 'nueva').length, c: '#FFC107' },
          { l: 'Recuperadas', v: ALERTAS_BASE.filter(a => a.nivel === 'recuperada').length, c: '#4CAF50' },
        ].map((it, i) => (
          <div key={i} style={S.kpiCard(it.c)}>
            <p style={{ fontSize: '10px', color: '#888', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 600 }}>{it.l}</p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: it.c, margin: 0 }}>{it.v}</p>
          </div>
        ))}
      </div>

      <div style={S.warn}>📋 Umbrales: 10 días = nuevos clientes · 15/30/45/60 días = cartera regular (parametrizables desde Configuración)</div>
      <div style={{ height: '10px' }} />

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr>{['ID', 'Cliente', 'Afiliado', 'Días inactivo', 'Nivel', 'Vendedor', 'Notif. enviada', 'Gestión actual', 'Acciones'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {lista.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              <td style={{ ...S.td, fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#714B67' }}>{row.id}</td>
              <td style={{ ...S.td, fontWeight: 600 }}>{row.cliente}</td>
              <td style={{ ...S.td, fontSize: '11px' }}>{row.afiliado}</td>
              <td style={{ ...S.td, fontWeight: 700, color: row.dias > 45 ? '#F44336' : row.dias > 15 ? '#FF9800' : '#4CAF50' }}>{row.dias > 0 ? row.dias + ' días' : '—'}</td>
              <td style={S.td}><span style={S.tag((nivelColor as any)[row.nivel] || '#888') as React.CSSProperties}>{row.nivel}</span></td>
              <td style={S.td}>{row.vendedor}</td>
              <td style={S.td}>{row.notif}</td>
              <td style={S.td}>{row.gestion}</td>
              <td style={S.td}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={S.btnSm('#714B67')} onClick={() => notify('Gestión iniciada: ' + row.cliente)}>Gestionar</button>
                  {row.nivel !== 'descartada' && <button style={S.btnSm('#9E9E9E')} onClick={() => notify('Alerta descartada: ' + row.id)}>Descartar</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════ AGENDA ═══════════════════════════
function AgendaScreen({ notify }: { notify: (m: string, t?: string) => void }) {
  const tareas = [
    { hora: '09:00', tipo: 'Llamada', cliente: 'Comercial La Esquina', vendedor: 'Carlos Pérez', estado: 'pendiente', prioridad: 'alta' },
    { hora: '10:30', tipo: 'Visita', cliente: 'Bodegón Central', vendedor: 'Carlos Pérez', estado: 'pendiente', prioridad: 'alta' },
    { hora: '11:00', tipo: 'WhatsApp', cliente: 'Distribuidora Caracas', vendedor: 'Ana Torres', estado: 'enviado', prioridad: 'media' },
    { hora: '14:00', tipo: 'Revisión', cliente: 'Seguimiento semanal', vendedor: 'María Gómez', estado: 'completado', prioridad: 'baja' },
    { hora: '15:30', tipo: 'Llamada', cliente: 'Panadería San Simón', vendedor: 'Carlos Pérez', estado: 'pendiente', prioridad: 'media' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Agenda Comercial — Hoy {new Date().toLocaleDateString('es-VE')}</h2>
        <button style={S.btn} onClick={() => notify('Nueva tarea creada en agenda')}>+ Nueva tarea</button>
      </div>
      <div style={S.section}>
        {tareas.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#714B67', fontWeight: 700, flexShrink: 0, width: '50px' }}>{t.hora}</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.prioridad === 'alta' ? '#F44336' : t.prioridad === 'media' ? '#FF9800' : '#4CAF50', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '13px' }}>{t.tipo} — {t.cliente}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{t.vendedor}</p>
            </div>
            <span style={S.tag(t.estado === 'completado' ? '#4CAF50' : t.estado === 'enviado' ? '#2196F3' : '#FF9800') as React.CSSProperties}>{t.estado}</span>
            {t.estado === 'pendiente' && <button style={S.btnSm('#4CAF50')} onClick={() => notify(t.tipo + ' marcada como completada')}>Completar</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════ METAS DE RECUPERACIÓN ═══════════════════════════
function MetasScreen({ notify, vendedorFilter }: { notify: (m: string, t?: string) => void; vendedorFilter?: string }) {
  const METAS: MetaRec[] = [
    { id: 'm1', vendedor: 'Carlos Pérez', meta: 15, avance: 3, banco: 'Banco 201', periodo: 'Junio 2026' },
    { id: 'm2', vendedor: 'María Gómez', meta: 18, avance: 14, banco: 'Banco 201', periodo: 'Junio 2026' },
    { id: 'm3', vendedor: 'Ana Torres', meta: 14, avance: 11, banco: 'Banco 201', periodo: 'Junio 2026' },
    { id: 'm4', vendedor: 'Banco 201', meta: 12, avance: 7, banco: 'Banco 201', periodo: 'Junio 2026' },
  ];
  const HIST = [
    { periodo: 'Abril 2026', meta: 45, avance: 31, cum: 69 },
    { periodo: 'Mayo 2026', meta: 47, avance: 32, cum: 68 },
    { periodo: 'Junio 2026 (actual)', meta: 48, avance: 35, cum: 73 },
  ];
  const lista = vendedorFilter ? METAS.filter(m => m.vendedor.toLowerCase().includes(vendedorFilter.toLowerCase())) : METAS;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Metas de Recuperación</h2>
        <button style={S.btn} onClick={() => notify('Meta actualizada')}>Actualizar metas</button>
      </div>

      <div style={{ ...S.section, marginBottom: '16px' }}>
        <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 12px', color: '#555' }}>📊 Historial de cumplimiento (últimos 3 períodos)</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Período', 'Meta global', 'Recuperados', 'Cumplimiento', 'Variación'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {HIST.map((h, i) => {
              const prev = i > 0 ? HIST[i - 1].cum : null;
              const diff = prev !== null ? h.cum - prev : null;
              return (
                <tr key={i} style={{ background: i === HIST.length - 1 ? '#f0fff4' : i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ ...S.td, fontWeight: i === HIST.length - 1 ? 700 : 400 }}>{h.periodo}</td>
                  <td style={S.td}>{h.meta} afiliados</td>
                  <td style={S.td}>{h.avance} confirmados</td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px' }}>
                        <div style={{ width: h.cum + '%', height: '100%', background: h.cum >= 80 ? '#4CAF50' : h.cum >= 60 ? '#FF9800' : '#F44336', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontWeight: 700, color: h.cum >= 80 ? '#4CAF50' : h.cum >= 60 ? '#FF9800' : '#F44336', minWidth: '40px' }}>{h.cum}%</span>
                    </div>
                  </td>
                  <td style={S.td}>{diff !== null ? <span style={{ color: diff >= 0 ? '#4CAF50' : '#F44336', fontWeight: 700 }}>{diff >= 0 ? '+' : ''}{diff}pp</span> : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={S.section}>
        <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 12px', color: '#555' }}>Por vendedor — Junio 2026</p>
        {lista.map((m, i) => {
          const pct = Math.round((m.avance / m.meta) * 100);
          return (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{m.vendedor}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>{m.avance} / {m.meta} afiliados ({pct}%)</span>
              </div>
              <div style={{ height: '10px', background: '#eee', borderRadius: '5px' }}>
                <div style={{ width: pct + '%', height: '100%', background: pct >= 80 ? '#4CAF50' : pct >= 60 ? '#FF9800' : '#F44336', borderRadius: '5px', transition: 'width 0.3s' }} />
              </div>
              <p style={{ fontSize: '10px', color: '#aaa', margin: '3px 0 0' }}>Recuperaciones confirmadas en Excel posterior</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════ GESTIONES COMERCIALES ═══════════════════════════
function GestionesScreen({ notify, vendedorFilter, onAction }: { notify: (m: string, t?: string) => void; vendedorFilter?: string; onAction?: (a: string, p?: any) => void }) {
  const GESTS: GestionCom[] = [
    { id: 'CCR-004', fecha: '11/06/2026 10:15', cliente: 'Comercial La Esquina', afiliado: 'AFI-20220145', vendedor: 'Carlos Pérez', tipo: 'Llamada', estado: 'En gestión', notas: 'Cliente confirma problema con equipo. Visitará el banco.', proxima: '13/06/2026', resultado: '' },
    { id: 'CCR-003', fecha: '10/06/2026 14:30', cliente: 'Bodegón Central', afiliado: 'AFI-20230156', vendedor: 'Carlos Pérez', tipo: 'WhatsApp', estado: 'Sin respuesta', notas: 'Enviado WhatsApp. Sin respuesta luego de 24h.', proxima: '12/06/2026', resultado: '' },
    { id: 'CCR-002', fecha: '09/06/2026 09:00', cliente: 'Distribuidora Caracas', afiliado: 'AFI-20200512', vendedor: 'Ana Torres', tipo: 'Visita', estado: 'Resuelto', notas: 'Visita completada. POS activo y procesando.', proxima: '—', resultado: 'POS activo confirmado' },
    { id: 'CCR-001', fecha: '08/06/2026 11:45', cliente: 'Panadería San Simón', afiliado: 'AFI-20210334', vendedor: 'Carlos Pérez', tipo: 'Correo', estado: 'Cerrado', notas: 'Correo enviado. Sin respuesta. Escalado a CCR.', proxima: '—', resultado: 'Escalado a Sandra CCR' },
  ];

  const [gests, setGests] = useState<GestionCom[]>(GESTS);
  const [selGest, setSelGest] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newGest, setNewGest] = useState({ cliente: 'Comercial La Esquina', tipo: 'Llamada', notas: '' });

  const CHATTER: Record<string, any[]> = {
    'CCR-004': [
      { t: '11/06/2026 10:15', user: 'Carlos Pérez', msg: 'Llamada realizada. Cliente confirma que el equipo no está funcionando.', tipo: 'nota' },
      { t: '11/06/2026 10:20', user: 'Sistema', msg: 'Alerta A001 cambiada a "En gestión"', tipo: 'sistema' },
    ],
    'CCR-003': [
      { t: '10/06/2026 14:30', user: 'Carlos Pérez', msg: 'WhatsApp enviado: "Hola, le contactamos desde Credicard sobre su terminal POS..."', tipo: 'notif' },
      { t: '11/06/2026 09:00', user: 'Sistema', msg: 'Sin respuesta luego de 24h. Alerta escalada.', tipo: 'sistema' },
    ],
  };

  const lista = vendedorFilter ? gests.filter(g => g.vendedor.toLowerCase().includes(vendedorFilter.toLowerCase())) : gests;
  const gestSel = gests.find(g => g.id === selGest);
  const chatter = selGest ? (CHATTER[selGest] || []) : [];

  const estadoColor = { 'En gestión': '#2196F3', 'Sin respuesta': '#FF9800', 'Resuelto': '#4CAF50', 'Cerrado': '#9E9E9E', 'Pendiente': '#F44336' } as Record<string, string>;

  const addNote = () => {
    if (!newNote.trim() || !selGest) return;
    notify('Nota agregada al chatter de ' + gestSel?.cliente);
    if (onAction) onAction('registerManagement', { id: selGest, nota: newNote });
    setNewNote('');
  };

  const registrarGestion = () => {
    const id = 'CCR-' + String(gests.length + 1).padStart(3, '0');
    const nueva: GestionCom = { id, fecha: new Date().toLocaleString('es-VE'), cliente: newGest.cliente, afiliado: 'AFI-auto', vendedor: 'Carlos Pérez', tipo: newGest.tipo, estado: 'Pendiente', notas: newGest.notas, proxima: '—', resultado: '' };
    setGests(prev => [nueva, ...prev]);
    if (onAction) onAction('registerManagement', { id, cliente: newGest.cliente });
    notify('✅ Gestión ' + id + ' registrada para ' + newGest.cliente);
    setShowForm(false);
    setNewGest({ cliente: 'Comercial La Esquina', tipo: 'Llamada', notas: '' });
  };

  if (selGest && gestSel) return (
    <div>
      <button onClick={() => setSelGest(null)} style={{ ...S.btnOut, marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}>← Volver</button>
      <div style={S.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: '#714B67' }}>{gestSel.id} — {gestSel.cliente}</h2>
            <p style={{ margin: '0 0 8px', color: '#888', fontSize: '12px' }}>{gestSel.afiliado} · {gestSel.vendedor} · {gestSel.tipo} · {gestSel.fecha}</p>
            <span style={S.tag((estadoColor as any)[gestSel.estado] || '#888') as React.CSSProperties}>{gestSel.estado}</span>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: '#444', margin: '0 0 10px', padding: '10px', background: '#fafafa', borderRadius: '6px' }}>{gestSel.notas}</p>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Próxima acción: <strong>{gestSel.proxima}</strong></p>
      </div>

      <div style={S.section}>
        <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 12px', color: '#555' }}>💬 Chatter / Trazabilidad</p>
        {chatter.length === 0 && <p style={{ color: '#ccc', fontSize: '12px' }}>Sin entradas de chatter.</p>}
        {chatter.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.tipo === 'sistema' ? '#eee' : c.tipo === 'notif' ? '#e3f2fd' : '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
              {c.tipo === 'sistema' ? '⚙️' : c.tipo === 'notif' ? '📢' : '✏️'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '12px' }}>{c.user}</span>
                <span style={{ fontSize: '10px', color: '#aaa' }}>{c.t}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{c.msg}</p>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Agregar nota al chatter..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px' }} />
          <button style={S.btn} onClick={addNote}>Enviar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Gestiones Comerciales</h2>
        <button style={S.btn} onClick={() => setShowForm(!showForm)}>+ Registrar gestión</button>
      </div>

      {showForm && (
        <div style={{ ...S.section, border: '2px solid #714B67', marginBottom: '16px' }}>
          <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 12px', color: '#714B67' }}>Nueva gestión</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Cliente</label>
              <select value={newGest.cliente} onChange={e => setNewGest(g => ({ ...g, cliente: e.target.value }))} style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px' }}>
                <option>Comercial La Esquina, C.A.</option>
                <option>Bodegón Central</option>
                <option>Panadería San Simón</option>
                <option>Distribuidora Caracas</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Tipo de gestión</label>
              <select value={newGest.tipo} onChange={e => setNewGest(g => ({ ...g, tipo: e.target.value }))} style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px' }}>
                {['Llamada', 'WhatsApp', 'Correo', 'Visita', 'SMS'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Notas</label>
            <textarea value={newGest.notas} onChange={e => setNewGest(g => ({ ...g, notas: e.target.value }))} rows={3} style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={S.btn} onClick={registrarGestion}>Guardar gestión</button>
            <button style={S.btnOut} onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr>{['ID', 'Fecha', 'Cliente', 'Afiliado', 'Vendedor', 'Tipo', 'Estado', 'Notas', 'Ver'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {lista.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              <td style={{ ...S.td, fontWeight: 700, color: '#714B67' }}>{row.id}</td>
              <td style={{ ...S.td, fontSize: '11px', whiteSpace: 'nowrap' }}>{row.fecha}</td>
              <td style={{ ...S.td, fontWeight: 600 }}>{row.cliente}</td>
              <td style={{ ...S.td, fontSize: '11px' }}>{row.afiliado}</td>
              <td style={S.td}>{row.vendedor}</td>
              <td style={S.td}>{row.tipo}</td>
              <td style={S.td}><span style={S.tag((estadoColor as any)[row.estado] || '#888') as React.CSSProperties}>{row.estado}</span></td>
              <td style={{ ...S.td, fontSize: '11px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.notas}</td>
              <td style={S.td}><button style={S.btnSm('#714B67')} onClick={() => setSelGest(row.id)}>Detalle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════ HISTORIAL NOTIFICACIONES ═══════════════════════════
function NotifScreen({ notify }: { notify: (m: string, t?: string) => void }) {
  const NOTIFS: NotifCCR[] = [
    { id: 'N-034', fecha: '03/06/2026 14:30', destinatario: 'Comercial La Esquina', canal: 'SMS', plantilla: 'INACTIV_60D', estado: 'Enviado', carga: 'TX-0001' },
    { id: 'N-033', fecha: '03/06/2026 14:29', destinatario: 'Bodegón Central', canal: 'WhatsApp', plantilla: 'INACTIV_60D', estado: 'Enviado', carga: 'TX-0001' },
    { id: 'N-032', fecha: '03/06/2026 14:28', destinatario: 'Distribuidora Caracas', canal: 'SMS', plantilla: 'INACTIV_45D', estado: 'Enviado', carga: 'TX-0001' },
    { id: 'N-031', fecha: '03/06/2026 14:27', destinatario: 'Panadería San Simón', canal: 'Correo', plantilla: 'INACTIV_30D', estado: 'Enviado', carga: 'TX-0001' },
    { id: 'N-030', fecha: '03/06/2026 14:26', destinatario: 'Supermercado La Paz', canal: 'Push', plantilla: 'INACTIV_15D', estado: 'Enviado', carga: 'TX-0001' },
    { id: 'N-029', fecha: '28/05/2026 10:50', destinatario: 'Panadería San Simón', canal: 'SMS', plantilla: 'INACTIV_30D', estado: 'Enviado', carga: 'TX-0002' },
    { id: 'N-028', fecha: '28/05/2026 10:49', destinatario: 'Comercial La Esquina', canal: 'SMS', plantilla: 'INACTIV_45D', estado: 'Enviado', carga: 'TX-0002' },
  ];
  const canalColor = { SMS: '#2196F3', WhatsApp: '#4CAF50', Correo: '#9C27B0', Push: '#FF9800' } as Record<string, string>;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Historial de Notificaciones</h2>
        <button style={S.btn} onClick={() => notify('Notificaciones simuladas enviadas')}>Simular envío masivo</button>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { l: 'SMS', v: NOTIFS.filter(n => n.canal === 'SMS').length, c: '#2196F3' },
          { l: 'WhatsApp', v: NOTIFS.filter(n => n.canal === 'WhatsApp').length, c: '#4CAF50' },
          { l: 'Correo', v: NOTIFS.filter(n => n.canal === 'Correo').length, c: '#9C27B0' },
          { l: 'Push', v: NOTIFS.filter(n => n.canal === 'Push').length, c: '#FF9800' },
        ].map((it, i) => (
          <div key={i} style={S.kpiCard(it.c)}>
            <p style={{ fontSize: '10px', color: '#888', margin: '0 0 3px', fontWeight: 600, textTransform: 'uppercase' }}>{it.l}</p>
            <p style={{ fontSize: '22px', fontWeight: 800, color: it.c, margin: 0 }}>{it.v}</p>
          </div>
        ))}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr>{['ID', 'Fecha', 'Destinatario', 'Canal', 'Plantilla', 'Estado', 'Carga'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {NOTIFS.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              <td style={{ ...S.td, fontFamily: 'monospace', fontWeight: 700, color: '#714B67', fontSize: '11px' }}>{row.id}</td>
              <td style={{ ...S.td, fontSize: '11px', whiteSpace: 'nowrap' }}>{row.fecha}</td>
              <td style={S.td}>{row.destinatario}</td>
              <td style={S.td}><span style={S.badge((canalColor as any)[row.canal] || '#888') as React.CSSProperties}>{row.canal}</span></td>
              <td style={{ ...S.td, fontFamily: 'monospace', fontSize: '11px' }}>{row.plantilla}</td>
              <td style={S.td}><span style={S.tag('#4CAF50') as React.CSSProperties}>{row.estado}</span></td>
              <td style={{ ...S.td, fontWeight: 600, color: '#714B67' }}>{row.carga}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════ PLANTILLAS ═══════════════════════════
function PlantillasScreen({ notify }: { notify: (m: string, t?: string) => void }) {
  const plantillas = [
    { id: 'INACTIV_10D', canal: 'Push', umbral: '10 días', texto: 'Tu terminal POS lleva 10 días sin transacciones. Recuerda que está disponible para tus clientes.' },
    { id: 'INACTIV_15D', canal: 'SMS', umbral: '15 días', texto: 'Hola, le contactamos desde Credicard. Tu terminal POS lleva más de 15 días sin transacciones...' },
    { id: 'INACTIV_30D', canal: 'Correo', umbral: '30 días', texto: 'Estimado afiliado: Su terminal POS registra 30 días de inactividad. Por favor active sus transacciones...' },
    { id: 'INACTIV_45D', canal: 'SMS+WhatsApp', umbral: '45 días', texto: '⚠️ Atención: Su terminal lleva 45 días inactivo. Un representante le contactará en breve.' },
    { id: 'INACTIV_60D', canal: 'SMS+WhatsApp+Correo', umbral: '60 días', texto: '🚨 URGENTE: Su terminal POS lleva 60 días sin transacciones. Requiere acción inmediata.' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Plantillas de Notificación</h2>
        <button style={S.btn} onClick={() => notify('Nueva plantilla creada')}>+ Nueva plantilla</button>
      </div>
      {plantillas.map((p, i) => (
        <div key={i} style={{ ...S.section, marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#714B67', fontSize: '12px' }}>{p.id}</span>
              <span style={S.tag('#FF9800') as React.CSSProperties}>Umbral: {p.umbral}</span>
              <span style={S.tag('#2196F3') as React.CSSProperties}>{p.canal}</span>
            </div>
            <button style={S.btnSm('#714B67')} onClick={() => notify('Plantilla ' + p.id + ' editada')}>Editar</button>
          </div>
          <p style={{ fontSize: '12px', color: '#555', margin: 0, background: '#fafafa', padding: '8px 10px', borderRadius: '5px', fontStyle: 'italic' }}>&quot;{p.texto}&quot;</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════ FACTURACIÓN (CONSULTIVA) ═══════════════════════════
function FacturacionScreen({ notify }: { notify: (m: string, t?: string) => void }) {
  const [busqueda, setBusqueda] = useState('');
  const FACTURAS = [
    { id: 'FC-2026-0123', fecha: '03/06/2026', afiliado: 'AFI-20220145', rif: 'J-29481234-5', cliente: 'Comercial La Esquina', monto: 'USD 45.00', estado: 'Emitida' },
    { id: 'FC-2026-0122', fecha: '28/05/2026', afiliado: 'AFI-20180089', rif: 'J-20441209-0', cliente: 'Ferretería El Clavo', monto: 'USD 21.00', estado: 'Emitida' },
    { id: 'FC-2026-0121', fecha: '26/05/2026', afiliado: 'AFI-20190780', rif: 'J-28765432-8', cliente: 'Supermercado La Paz', monto: 'USD 24.00', estado: 'Emitida' },
    { id: 'FC-2026-0120', fecha: '25/04/2026', afiliado: 'AFI-20230156', rif: 'J-27891234-6', cliente: 'Bodegón Central', monto: 'USD 15.00', estado: 'Emitida' },
  ];
  const lista = busqueda ? FACTURAS.filter(f => f.afiliado.includes(busqueda) || f.rif.includes(busqueda) || f.cliente.toLowerCase().includes(busqueda.toLowerCase()) || f.id.includes(busqueda)) : FACTURAS;
  return (
    <div>
      <div style={{ background: '#e8f5e9', border: '1px solid #4CAF50', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#1b5e20', fontWeight: 600 }}>📄 Historial de Facturación — Módulo consultivo</p>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#388e3c' }}>Este módulo es de solo consulta. No forma parte del flujo principal de Gestión de Clientes.</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por afiliado, RIF, nombre o Nº control..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
        <button style={S.btn} onClick={() => notify('Búsqueda ejecutada')}>Buscar</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr>{['Nº Control', 'Fecha', 'Afiliado', 'RIF', 'Cliente', 'Monto', 'Estado', 'Descargar'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {lista.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              <td style={{ ...S.td, fontWeight: 700, color: '#714B67', fontFamily: 'monospace', fontSize: '11px' }}>{row.id}</td>
              <td style={{ ...S.td, whiteSpace: 'nowrap' }}>{row.fecha}</td>
              <td style={{ ...S.td, fontSize: '11px', fontWeight: 600, color: '#555' }}>{row.afiliado}</td>
              <td style={{ ...S.td, fontFamily: 'monospace', fontSize: '11px' }}>{row.rif}</td>
              <td style={S.td}>{row.cliente}</td>
              <td style={{ ...S.td, fontWeight: 700 }}>{row.monto}</td>
              <td style={S.td}><span style={S.tag('#4CAF50') as React.CSSProperties}>{row.estado}</span></td>
              <td style={S.td}><button style={S.btnSm('#714B67')} onClick={() => notify('Factura ' + row.id + ' descargada')}>📥 PDF</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════ CONFIGURACIÓN ═══════════════════════════
function ConfigScreen({ notify }: { notify: (m: string, t?: string) => void }) {
  const [thresholds, setThresholds] = useState({ d1: 10, d2: 15, d3: 30, d4: 45, d5: 60 });
  return (
    <div>
      <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700 }}>Configuración del módulo</h2>
      <div style={S.section}>
        <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 4px' }}>Umbrales de inactividad (parametrizables)</p>
        <p style={{ fontSize: '11px', color: '#888', margin: '0 0 14px' }}>Valores actuales de referencia. Modificables por administrador.</p>
        {[
          { l: 'Nuevos clientes', key: 'd1' as const, color: '#FFC107' },
          { l: 'Nivel media', key: 'd2' as const, color: '#FF9800' },
          { l: 'Nivel alta', key: 'd3' as const, color: '#FF5722' },
          { l: 'Nivel crítica 1', key: 'd4' as const, color: '#F44336' },
          { l: 'Nivel crítica 2', key: 'd5' as const, color: '#B71C1C' },
        ].map(it => (
          <div key={it.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: it.color, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', flex: 1 }}>{it.l}</span>
            <input type="number" value={thresholds[it.key]} onChange={e => setThresholds(t => ({ ...t, [it.key]: Number(e.target.value) }))} style={{ width: '60px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12px', textAlign: 'center' }} />
            <span style={{ fontSize: '12px', color: '#888' }}>días</span>
          </div>
        ))}
        <button style={{ ...S.btn, marginTop: '8px' }} onClick={() => notify('Umbrales actualizados')}>Guardar umbrales</button>
      </div>
    </div>
  );
}

// ═══════════════════════════ CARTERA POR BANCO ═══════════════════════════
function CarteraByBancoScreen({ notify }: { notify: (m: string) => void }) {
  const BANCOS = [
    { banco: 'Banco 201', afiliados: 198, sinTransar: 57, alertas: 14, cumplimiento: 71 },
    { banco: 'Banco 102', afiliados: 145, sinTransar: 38, alertas: 9, cumplimiento: 78 },
    { banco: 'Banco 305', afiliados: 87, sinTransar: 29, alertas: 7, cumplimiento: 65 },
    { banco: 'Banco 410', afiliados: 68, sinTransar: 18, alertas: 6, cumplimiento: 82 },
  ];
  return (
    <div>
      <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700 }}>Cartera por Banco/Agente</h2>
      {BANCOS.map((b, i) => (
        <div key={i} style={{ ...S.section, display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }} onClick={() => notify('Filtrando por ' + b.banco)}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#714B6715', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🏦</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '14px' }}>{b.banco}</p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#888' }}>
              <span>{b.afiliados} afiliados</span>
              <span style={{ color: '#FF9800' }}>{b.sinTransar} sin transar</span>
              <span style={{ color: '#F44336' }}>{b.alertas} alertas</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: b.cumplimiento >= 75 ? '#4CAF50' : b.cumplimiento >= 60 ? '#FF9800' : '#F44336' }}>{b.cumplimiento}%</p>
            <p style={{ margin: 0, fontSize: '10px', color: '#aaa' }}>cumplimiento</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════ FALLAS TÉCNICAS ═══════════════════════════
function FallasTecnicasScreen({ notify }: { notify: (m: string) => void }) {
  const FALLAS = [
    { id: 'FT-001', afiliado: 'AFI-20220145', cliente: 'Comercial La Esquina', banco: 'Banco 201', fecha: '10/06/2026', tipo: 'POS no conecta', estado: 'Abierta', dias: 2 },
    { id: 'FT-002', afiliado: 'AFI-20230156', cliente: 'Bodegón Central', banco: 'Banco 201', fecha: '09/06/2026', tipo: 'Terminal sin papel', estado: 'En revisión', dias: 3 },
    { id: 'FT-003', afiliado: 'AFI-20190780', cliente: 'Supermercado La Paz', banco: 'Banco 102', fecha: '08/06/2026', tipo: 'Error de comunicación', estado: 'Escalada', dias: 4 },
    { id: 'FT-004', afiliado: 'AFI-20180089', cliente: 'Ferretería El Clavo', banco: 'Banco 305', fecha: '05/06/2026', tipo: 'POS no imprime', estado: 'Abierta', dias: 7 },
  ];
  const colFalla = (e: string) => ({ 'Abierta': '#F44336', 'En revisión': '#FF9800', 'Escalada': '#9C27B0' }[e] || '#888');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Fallas Técnicas</h2>
        <span style={S.badge('#F44336') as React.CSSProperties}>{FALLAS.length} activas</span>
      </div>
      <div style={{ ...S.warn, marginBottom: '16px' }}>⚠️ Las fallas técnicas reportadas aquí son consultivas. El seguimiento de equipos corresponde al área técnica de Credicard, no al módulo de Gestión de Clientes.</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr>{['ID', 'Afiliado', 'Cliente', 'Banco', 'Tipo de falla', 'Estado', 'Días', 'Acción'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {FALLAS.map((f, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              <td style={{ ...S.td, fontWeight: 700, color: '#714B67', fontFamily: 'monospace', fontSize: '11px' }}>{f.id}</td>
              <td style={{ ...S.td, fontSize: '11px', color: '#555' }}>{f.afiliado}</td>
              <td style={S.td}>{f.cliente}</td>
              <td style={S.td}>{f.banco}</td>
              <td style={S.td}>{f.tipo}</td>
              <td style={S.td}><span style={S.tag(colFalla(f.estado)) as React.CSSProperties}>{f.estado}</span></td>
              <td style={{ ...S.td, fontWeight: 700, color: f.dias >= 5 ? '#F44336' : '#FF9800' }}>{f.dias}d</td>
              <td style={S.td}><button style={S.btnSm('#714B67')} onClick={() => notify('Escalando falla ' + f.id)}>Escalar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════ PROBLEMAS RESUELTOS ═══════════════════════════
function ProblemasResueltosScreen({ notify }: { notify: (m: string) => void }) {
  const RESUELTOS = [
    { id: 'PR-001', afiliado: 'AFI-20210334', cliente: 'Panadería San Simón', banco: 'Banco 102', fechaFalla: '01/06/2026', fechaRes: '03/06/2026', tipo: 'POS no conecta', resolucion: 'Reemplazo de terminal', diasResolucion: 2 },
    { id: 'PR-002', afiliado: 'AFI-20200512', cliente: 'Distribuidora Caracas', banco: 'Banco 201', fechaFalla: '25/05/2026', fechaRes: '28/05/2026', tipo: 'Error de software', resolucion: 'Actualización de firmware', diasResolucion: 3 },
    { id: 'PR-003', afiliado: 'AFI-20170255', cliente: 'Librería Nacional', banco: 'Banco 305', fechaFalla: '18/05/2026', fechaRes: '19/05/2026', tipo: 'Terminal sin comunicación', resolucion: 'Revisión de tarjeta SIM', diasResolucion: 1 },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Problemas Resueltos</h2>
        <span style={S.badge('#4CAF50') as React.CSSProperties}>{RESUELTOS.length} resueltos este mes</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead><tr>{['ID', 'Cliente', 'Tipo de falla', 'Resolución', 'Días resolución', 'Fecha cierre'].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {RESUELTOS.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
              <td style={{ ...S.td, fontWeight: 700, color: '#4CAF50', fontFamily: 'monospace', fontSize: '11px' }}>{r.id}</td>
              <td style={S.td}>{r.cliente}</td>
              <td style={S.td}>{r.tipo}</td>
              <td style={S.td}>{r.resolucion}</td>
              <td style={{ ...S.td, fontWeight: 700, color: r.diasResolucion <= 1 ? '#4CAF50' : r.diasResolucion <= 3 ? '#FF9800' : '#F44336' }}>{r.diasResolucion}d</td>
              <td style={S.td}>{r.fechaRes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════ CUMPLIMIENTO POR BANCO ═══════════════════════════
function CumplimientoBancoScreen({ notify }: { notify: (m: string) => void }) {
  const DATA = [
    { banco: 'Banco 201', meta: 48, avance: 35, pct: 73, periodo: 'Junio 2026' },
    { banco: 'Banco 102', meta: 38, avance: 30, pct: 78, periodo: 'Junio 2026' },
    { banco: 'Banco 305', meta: 28, avance: 18, pct: 65, periodo: 'Junio 2026' },
    { banco: 'Banco 410', meta: 22, avance: 18, pct: 82, periodo: 'Junio 2026' },
  ];
  return (
    <div>
      <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700 }}>Cumplimiento por Banco/Agente — Junio 2026</h2>
      {DATA.map((d, i) => {
        return (
          <div key={i} style={{ ...S.section, marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '14px' }}>{d.banco}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{d.avance} recuperados / meta {d.meta}</p>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 800, color: d.pct >= 75 ? '#4CAF50' : d.pct >= 60 ? '#FF9800' : '#F44336' }}>{d.pct}%</span>
            </div>
            <div style={{ height: '10px', background: '#eee', borderRadius: '5px' }}>
              <div style={{ width: d.pct + '%', height: '100%', background: d.pct >= 75 ? '#4CAF50' : d.pct >= 60 ? '#FF9800' : '#F44336', borderRadius: '5px', transition: 'width 0.3s' }} />
            </div>
          </div>
        );
      })}
      <button style={S.btn} onClick={() => notify('Exportando reporte por banco')}>📊 Exportar reporte</button>
    </div>
  );
}

// ═══════════════════════════ METAS INCUMPLIDAS ═══════════════════════════
function MetasIncumplidasScreen({ notify }: { notify: (m: string) => void }) {
  const INCUMPLIDAS = [
    { vendedor: 'Carlos Pérez', banco: 'Banco 201', meta: 15, avance: 3, pct: 20, gap: 12, periodo: 'Junio 2026' },
    { vendedor: 'Banco 305 (Agente)', banco: 'Banco 305', meta: 28, avance: 18, pct: 65, gap: 10, periodo: 'Junio 2026' },
    { vendedor: 'Pedro Soto', banco: 'Banco 102', meta: 12, avance: 5, pct: 42, gap: 7, periodo: 'Junio 2026' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Metas Incumplidas</h2>
        <span style={S.badge('#F44336') as React.CSSProperties}>{INCUMPLIDAS.length} bajo el umbral</span>
      </div>
      <div style={{ ...S.warn, marginBottom: '16px' }}>⚠️ Umbral de alerta: cumplimiento &lt; 70%. Bloqueo automático planificado para Release 2.</div>
      {INCUMPLIDAS.map((m, i) => (
        <div key={i} style={{ ...S.section, borderLeft: '4px solid #F44336', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '14px' }}>{m.vendedor}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{m.banco} · {m.periodo}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#F44336' }}>{m.pct}%</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#F44336' }}>Brecha: -{m.gap} afiliados</p>
            </div>
          </div>
          <div style={{ height: '8px', background: '#eee', borderRadius: '4px', marginBottom: '10px' }}>
            <div style={{ width: m.pct + '%', height: '100%', background: '#F44336', borderRadius: '4px' }} />
          </div>
          <button style={S.btnSm('#714B67')} onClick={() => notify('Plan de acción iniciado para ' + m.vendedor)}>Plan de acción</button>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════ FEEDBACK MVP ═══════════════════════════
function FeedbackMVPScreen({ notify }: { notify: (m: string) => void }) {
  const FEEDBACKS = [
    { id: 'FB-001', fecha: '11/06/2026', usuario: 'Carlos Pérez', rol: 'Vendedor', tipo: 'Mejora', mensaje: 'La lista "Sin transar" debería ordenarse por días de mayor a menor por defecto.', estado: 'Registrado' },
    { id: 'FB-002', fecha: '10/06/2026', usuario: 'María Gómez', rol: 'Supervisor', tipo: 'Error', mensaje: 'Al filtrar por vendedor en Alertas, el contador de críticas no se actualiza.', estado: 'En revisión' },
    { id: 'FB-003', fecha: '09/06/2026', usuario: 'Sandra CCR', rol: 'Usuario CCR', tipo: 'Funcionalidad', mensaje: 'Sería útil poder exportar la cartera filtrada a Excel desde la vista de tabla.', estado: 'Planificado' },
    { id: 'FB-004', fecha: '08/06/2026', usuario: 'Carlos Pérez', rol: 'Vendedor', tipo: 'UX', mensaje: 'El formulario de gestión en la app necesita más tipos de contacto.', estado: 'Registrado' },
  ];
  const colFb = (t: string) => ({ 'Registrado': '#2196F3', 'En revisión': '#FF9800', 'Planificado': '#9C27B0', 'Implementado': '#4CAF50' }[t] || '#888');
  const tipoCol = (t: string) => ({ 'Error': '#F44336', 'Mejora': '#FF9800', 'Funcionalidad': '#2196F3', 'UX': '#9C27B0' }[t] || '#888');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Feedback MVP</h2>
        <button style={S.btn} onClick={() => notify('Formulario de feedback abierto')}>+ Registrar feedback</button>
      </div>
      <div style={{ background: '#e3f2fd', border: '1px solid #2196F3', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '12px', color: '#1565C0' }}>
        ℹ️ Feedback del MVP para priorización del Release 2. No es un sistema de tickets completo.
      </div>
      {FEEDBACKS.map((f, i) => (
        <div key={i} style={{ ...S.section, marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ ...S.tag(tipoCol(f.tipo)) as object, fontSize: '11px' }}>{f.tipo}</span>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>{f.usuario}</span>
              <span style={{ fontSize: '11px', color: '#888' }}>({f.rol})</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#aaa' }}>{f.fecha}</span>
              <span style={S.tag(colFb(f.estado)) as React.CSSProperties}>{f.estado}</span>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#444', lineHeight: 1.5 }}>{f.mensaje}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════ PERMISOS ═══════════════════════════
function PermisosScreen({ notify }: { notify: (m: string) => void }) {
  const ROLES = [
    { rol: 'Usuario CCR', badge: 'CCR', accesos: ['Dashboard global', 'Cargas TX', 'Cartera completa', 'Alertas todas', 'Gestión Comercial', 'Metas global', 'Comunicaciones', 'Facturación', 'Configuración'] },
    { rol: 'Supervisor', badge: 'SUP', accesos: ['Dashboard equipo', 'Cartera de su equipo', 'Alertas de su equipo', 'Gestiones de su equipo', 'Metas de su equipo', 'Facturación'] },
    { rol: 'Vendedor', badge: 'VEN', accesos: ['Dashboard propio', 'Mi Cartera', 'Mis alertas', 'Mis gestiones', 'Mis metas', 'Facturación'] },
    { rol: 'Banco/Agente', badge: 'BCO', accesos: ['Dashboard banco', 'Cartera de su banco', 'Alertas de su banco', 'Gestiones de su banco', 'Metas de su banco', 'Facturación'] },
    { rol: 'Administrador', badge: 'ADM', accesos: ['Acceso total', 'Configuración avanzada', 'Gestión de usuarios', 'Parámetros sistema'] },
  ];
  const PROHIBICIONES = ['Inventario', 'Stock', 'Almacén', 'Pickings', 'Transferencias de equipos', 'Reposición de terminales', 'Solicitudes de equipos'];
  return (
    <div>
      <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700 }}>Permisos por Rol</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {ROLES.map((r, i) => (
          <div key={i} style={{ ...S.section, marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
              <span style={S.badge('#714B67') as React.CSSProperties}>{r.badge}</span>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>{r.rol}</span>
            </div>
            {r.accesos.map((a, j) => (
              <div key={j} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                <span style={{ color: '#4CAF50', fontSize: '11px' }}>✓</span>
                <span style={{ fontSize: '11px' }}>{a}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ ...S.section, background: '#ffebee', border: '1px solid #F44336' }}>
        <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 10px', color: '#c62828' }}>❌ Módulos excluidos — ningún rol tiene acceso</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {PROHIBICIONES.map((p, i) => <span key={i} style={{ ...S.tag('#F44336') as object, fontSize: '11px' }}>{p}</span>)}
        </div>
      </div>
      <button style={{ ...S.btn, marginTop: '12px' }} onClick={() => notify('Cambios de permisos guardados')}>Guardar cambios</button>
    </div>
  );
}

// ═══════════════════════════ MAIN EXPORT ═══════════════════════════
const ROL_LABELS_OD: Record<string, string> = { ccr: 'Usuario CCR', vendedor: 'Vendedor', supervisor: 'Supervisor', banco: 'Banco/Agente', admin: 'Administrador' };

export default function OdooBackend(props: any = {}) {
  const { user, onAction, kpis: extKpis, syncEvents = [], embeddedHeight, initialScreen } = props;
  const [active, setActive] = useState<string>(initialScreen || 'dashboard');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<string>('');

  const canAdmin = !user || ['ccr', 'admin'].includes(user.rol);
  const canLoadExcel = canAdmin;
  const isVendedor = user?.rol === 'vendedor';
  const isBanco = user?.rol === 'banco';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3800);
  };
  const notify = (m: string) => showToast(m);

  const ODOO_MENU = [
    { id: 'dash', label: '🏠 Dashboard', items: [{ id: 'dashboard', label: 'Resumen General' }, { id: 'kpis', label: 'KPIs Credicard' }, ...(!isVendedor && !isBanco ? [{ id: 'ranking', label: 'Ranking Comercial' }] : [])] },
    { id: 'cargas', label: '📁 Cargas', show: canLoadExcel, items: [{ id: 'cargas', label: 'Cargas de Transacciones' }, { id: 'lineas', label: 'Líneas Procesadas' }, { id: 'duplis', label: 'Archivos Duplicados' }, { id: 'errores', label: 'Errores de Carga' }] },
    { id: 'cartera', label: '🏪 Cartera', items: [
      { id: 'cartera', label: 'Cartera de Clientes' },
      { id: 'mi-cartera', label: 'Mi Cartera' },
      ...(canAdmin ? [{ id: 'cartera-v', label: 'Cartera por Vendedor' }, { id: 'cartera-banco', label: 'Cartera por Banco/Agente' }, { id: 'sin-resp', label: 'Sin Responsable' }] : []),
    ] },
    { id: 'alertas', label: '🔔 Alertas', items: [{ id: 'alertas', label: 'Alertas de Inactividad' }, { id: 'criticas', label: 'Críticas' }, { id: 'nuevas', label: 'Nuevas' }, { id: 'recuperadas', label: 'Recuperadas' }, { id: 'descartadas', label: 'Descartadas' }] },
    { id: 'gestion', label: '📞 Gestión Comercial', items: [
      { id: 'agenda', label: 'Agenda' },
      { id: 'gestiones', label: 'Gestiones' },
      { id: 'pendientes', label: 'Pendientes de Visita' },
      { id: 'sin-respuesta', label: 'Sin Respuesta' },
      { id: 'fallas-tecnicas', label: 'Fallas Técnicas' },
      { id: 'problemas-resueltos', label: 'Problemas Resueltos' },
    ] },
    { id: 'metas', label: '🎯 Metas', items: [
      { id: 'metas', label: 'Metas de Recuperación' },
      { id: 'cumplimiento', label: 'Cumplimiento por Vendedor' },
      { id: 'cumplimiento-banco', label: 'Cumplimiento por Banco/Agente' },
      { id: 'metas-incumplidas', label: 'Metas Incumplidas' },
      ...(canAdmin ? [{ id: 'ranking-m', label: 'Ranking por Banco' }] : []),
    ] },
    { id: 'comms', label: '📢 Comunicaciones', items: [{ id: 'notif', label: 'Historial de Notificaciones' }, { id: 'plantillas', label: 'Plantillas' }, { id: 'canales', label: 'Canales Simulados' }, { id: 'feedback-mvp', label: 'Feedback MVP' }] },
    { id: 'facturacion', label: '📄 Facturación', items: [{ id: 'facturas', label: 'Historial de Facturas' }, { id: 'buscar-fact', label: 'Buscar por afiliado/RIF' }] },
    ...(canAdmin ? [{ id: 'config', label: '⚙️ Configuración', items: [{ id: 'config', label: 'Reglas de inactividad' }, { id: 'permisos', label: 'Permisos' }, { id: 'usuarios', label: 'Usuarios y roles' }, { id: 'parametros', label: 'Parámetros Excel' }] }] : []),
  ].filter((m: any) => m.show !== false);

  const getLabel = (id: string): string => {
    for (const m of ODOO_MENU) { for (const it of m.items) { if (it.id === id) return it.label; } }
    return id;
  };

  const renderScreen = () => {
    const p = { notify, onAction, vendedorFilter: isVendedor ? user?.nombre : undefined, bancoFilter: isBanco ? user?.banco : undefined };
    if (active === 'kpis' || active === 'ranking') return <KpisScreen user={user} />;
    if (active === 'cargas' || active === 'lineas' || active === 'duplis' || active === 'errores') return <CargasScreen notify={notify} onAction={onAction} />;
    if (active === 'cartera' || active === 'cartera-v' || active === 'sin-resp') return <CarteraScreen {...p} />;
    if (active === 'mi-cartera') return <CarteraScreen {...p} vendedorFilter={user?.nombre} />;
    if (active === 'cartera-banco') return <CarteraByBancoScreen notify={notify} />;
    if (active === 'alertas' || active === 'criticas' || active === 'nuevas' || active === 'recuperadas' || active === 'descartadas') return <AlertasScreen {...p} />;
    if (active === 'agenda') return <AgendaScreen notify={notify} />;
    if (active === 'gestiones' || active === 'pendientes' || active === 'sin-respuesta') return <GestionesScreen {...p} />;
    if (active === 'fallas-tecnicas') return <FallasTecnicasScreen notify={notify} />;
    if (active === 'problemas-resueltos') return <ProblemasResueltosScreen notify={notify} />;
    if (active === 'metas' || active === 'cumplimiento' || active === 'ranking-m') return <MetasScreen {...p} />;
    if (active === 'cumplimiento-banco') return <CumplimientoBancoScreen notify={notify} />;
    if (active === 'metas-incumplidas') return <MetasIncumplidasScreen notify={notify} />;
    if (active === 'notif' || active === 'canales') return <NotifScreen notify={notify} />;
    if (active === 'feedback-mvp') return <FeedbackMVPScreen notify={notify} />;
    if (active === 'plantillas') return <PlantillasScreen notify={notify} />;
    if (active === 'facturas' || active === 'buscar-fact') return <FacturacionScreen notify={notify} />;
    if (active === 'config' || active === 'usuarios' || active === 'parametros') return <ConfigScreen notify={notify} />;
    if (active === 'permisos') return <PermisosScreen notify={notify} />;
    return <Dashboard user={user} kpis={extKpis} syncEvents={syncEvents} />;
  };

  const totalH = embeddedHeight || '100vh';
  const topH = 96;
  const contentH = `calc(${totalH} - ${topH}px)`;

  return (
    <div style={{ height: totalH, overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f4f6f8' }}
      onClick={() => setOpenMenu(null)}>

      {/* App bar */}
      <div style={{ ...S.bar, flexShrink: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.3px' }}>Odoo 19</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span style={{ fontSize: '13px', opacity: 0.85, fontWeight: 600 }}>Gestión de Clientes CCR</span>
        <div style={{ flex: 1 }} />
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{user.badge}</span>
            <div>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600 }}>{user.nombre}</p>
              <p style={{ margin: 0, fontSize: '10px', opacity: 0.7 }}>{ROL_LABELS_OD[user.rol] || user.rol}</p>
            </div>
          </div>
        )}
      </div>

      {/* Menu bar */}
      <div style={{ ...S.bar, flexShrink: 0, zIndex: 99, position: 'relative' }} onClick={e => e.stopPropagation()}>
        {ODOO_MENU.map(m => (
          <div key={m.id} style={{ position: 'relative' }}>
            <button style={S.menuBtn(m.items.some(it => it.id === active))} onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}>
              {m.label} <span style={{ fontSize: '9px', opacity: 0.7 }}>▾</span>
            </button>
            {openMenu === m.id && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', borderRadius: '6px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: '190px', zIndex: 999, padding: '4px 0', marginTop: '2px' }}>
                {m.items.map(it => (
                  <div key={it.id} onClick={() => { setActive(it.id); setOpenMenu(null); }}
                    style={{ padding: '9px 16px', cursor: 'pointer', fontSize: '13px', color: active === it.id ? '#714B67' : '#333', fontWeight: active === it.id ? 700 : 400, background: active === it.id ? '#f3eaf0' : 'transparent' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.background = '#f9f9f9'}
                    onMouseLeave={e => (e.target as HTMLElement).style.background = active === it.id ? '#f3eaf0' : 'transparent'}>
                    {it.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid #e8e8e8', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, zIndex: 98 }}>
        <span style={{ fontSize: '12px', color: '#888', cursor: 'pointer' }} onClick={() => setActive('dashboard')}>Gestión de Clientes CCR</span>
        <span style={{ color: '#ccc', fontSize: '12px' }}>›</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>{getLabel(active)}</span>
        <div style={{ flex: 1 }} />
        {user && <span style={S.badge('#714B67') as React.CSSProperties}>{ROL_LABELS_OD[user.rol] || user.rol}</span>}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px', height: contentH }}>
        {renderScreen()}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#323232', color: 'white', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 9999, maxWidth: '360px', lineHeight: '1.4' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
