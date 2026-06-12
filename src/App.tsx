import React, { useState, useEffect } from 'react';
import OdooBackend from './components/OdooBackend';

// ─── Types ────────────────────────────────────────────────────────────
type AppView = 'app' | 'odoo' | 'comparativa';
type UserRole = 'ccr' | 'vendedor' | 'supervisor' | 'banco' | 'admin';
interface AppUser { id: string; nombre: string; rol: UserRole; badge: string; vendedoresAsignados?: string[]; banco?: string; }
interface SharedKPIs { cargas: number; clientes: number; sinTransar: number; alertasNuevas: number; criticas: number; recuperados: number; cumplimiento: number; gestiones: number; }
interface SyncEvent { id: string; tiempo: string; tipo: string; origen: 'app' | 'odoo'; descripcion: string; }
export interface OdooBackendProps { user?: AppUser; onAction?: (a: string, p?: any) => void; kpis?: SharedKPIs; syncEvents?: SyncEvent[]; toastMsg?: string; embeddedHeight?: string; initialScreen?: string; }

const OdooBackendTyped = OdooBackend as React.ComponentType<any>;
const S = { badge: (c: string): React.CSSProperties => ({ background: c, color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, display: 'inline-block' }) };

const USUARIOS: AppUser[] = [
  { id: 'ccr', nombre: 'Sandra CCR', rol: 'ccr', badge: 'SC' },
  { id: 'carlos', nombre: 'Carlos Pérez', rol: 'vendedor', badge: 'CP' },
  { id: 'maria', nombre: 'María Gómez', rol: 'supervisor', badge: 'MG', vendedoresAsignados: ['Carlos Pérez', 'Ana Torres'] },
  { id: 'banco201', nombre: 'Banco 201', rol: 'banco', badge: 'B2', banco: '201' },
  { id: 'admin', nombre: 'Administrador', rol: 'admin', badge: 'AD' },
];
const ROL_LABELS: Record<UserRole, string> = { ccr: 'Usuario CCR', vendedor: 'Vendedor', supervisor: 'Supervisor', banco: 'Banco/Agente', admin: 'Administrador' };
const INIT_KPIS: SharedKPIs = { cargas: 3, clientes: 498, sinTransar: 142, alertasNuevas: 36, criticas: 8, recuperados: 35, cumplimiento: 73, gestiones: 89 };
const INIT_SYNC: SyncEvent[] = [
  { id: 's1', tiempo: 'Hace 3 min', tipo: 'Carga procesada', origen: 'odoo', descripcion: 'TX-0001 procesada. 498 afiliados actualizados.' },
  { id: 's2', tiempo: 'Hace 8 min', tipo: 'Alerta generada', origen: 'odoo', descripcion: '36 nuevas alertas de inactividad generadas.' },
  { id: 's3', tiempo: 'Hace 15 min', tipo: 'Gestión registrada', origen: 'app', descripcion: 'Carlos Pérez registró gestión en Comercial La Esquina.' },
];

// ═══════════════════════════ MOBILE APP VIEW ═══════════════════════════
function MobileAppView({ user, kpis, onAction, initialSub = 'dashboard', initialTab = 'clientes' }: {
  user?: AppUser; kpis?: SharedKPIs; onAction?: (a: string, p?: any) => void;
  initialSub?: string; initialTab?: string;
}) {
  const [tab, setTab] = useState(initialTab);
  const [sub, setSub] = useState(initialSub);
  const [gestNotes, setGestNotes] = useState('');

  useEffect(() => { setSub(initialSub); }, [initialSub]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const k = kpis || INIT_KPIS;
  const isV = user?.rol === 'vendedor';
  const isB = user?.rol === 'banco';
  const factor = isV ? 3 : isB ? 4 : 1;

  const mySize = Math.floor(k.clientes / factor);
  const myST = Math.floor(k.sinTransar / factor);
  const myMeta = isV ? 15 : isB ? 12 : 48;
  const myRec = Math.floor(k.recuperados / factor);
  const myCum = isV ? k.cumplimiento - 5 : k.cumplimiento;

  const CARTERA_APP = [
    { n: 'Comercial La Esquina', af: 'AFI-20220145', dias: 62, estado: 'critico' },
    { n: 'Panadería San Simón', af: 'AFI-20210334', dias: 34, estado: 'alerta' },
    { n: 'Bodegón Central', af: 'AFI-20230156', dias: 58, estado: 'critico' },
    { n: 'Ferretería El Clavo', af: 'AFI-20180089', dias: 0, estado: 'activo' },
    { n: 'Supermercado La Paz', af: 'AFI-20190780', dias: 15, estado: 'activo' },
  ].slice(0, isV ? 3 : isB ? 3 : 5);

  const GESTIONES_APP = [
    { id: 'CCR-004', cliente: 'Comercial La Esquina', tipo: 'Llamada', estado: 'En gestión', fecha: '11/06/2026' },
    { id: 'CCR-003', cliente: 'Bodegón Central', tipo: 'WhatsApp', estado: 'Sin respuesta', fecha: '10/06/2026' },
    { id: 'CCR-002', cliente: 'Distribuidora Caracas', tipo: 'Visita', estado: 'Resuelto', fecha: '09/06/2026' },
  ];

  const estadoColor = (e: string) => ({ activo: '#4CAF50', alerta: '#FF9800', critico: '#F44336', recuperado: '#2196F3' }[e] || '#888');
  const gestColor = (e: string) => ({ 'En gestión': '#2196F3', 'Sin respuesta': '#FF9800', 'Resuelto': '#4CAF50', 'Cerrado': '#9E9E9E' }[e] || '#888');

  const isCCR = user?.rol === 'ccr' || user?.rol === 'admin';
  const isSup = user?.rol === 'supervisor';
  const NAV_TABS = [
    { id: 'ventas', icon: '💳', label: 'Ventas' },
    { id: 'clientes', icon: '🏪', label: 'Clientes' },
    isCCR ? { id: 'config', icon: '⚙️', label: 'Config' } : isSup ? { id: 'equipo', icon: '👥', label: 'Equipo' } : { id: 'alertas', icon: '🔔', label: 'Alertas' },
    { id: 'facturacion', icon: '📄', label: 'Facturas' },
    { id: 'perfil', icon: '👤', label: 'Perfil' },
  ];

  const SUB_TABS = ['dashboard', 'cartera', 'sintransar', 'metas', 'gestiones', 'historial'];

  const [configTab, setConfigTab] = useState<'metas' | 'agenda' | 'mensajes'>('metas');
  const [metaVendedor, setMetaVendedor] = useState('Carlos Pérez');
  const [metaValor, setMetaValor] = useState(15);
  const [agendaPrio, setAgendaPrio] = useState<'critico' | 'alto' | 'todos'>('critico');
  const [mensajeActivo, setMensajeActivo] = useState<Record<string, boolean>>({ sms: true, whatsapp: false, correo: true });

  const renderContent = () => {
    if (tab === 'config') return (
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', background: 'white', borderRadius: '8px', padding: '4px' }}>
          {([['metas', '🎯 Metas'], ['agenda', '📅 Agenda'], ['mensajes', '📢 Mensajes']] as const).map(([id, l]) => (
            <button key={id} onClick={() => setConfigTab(id)} style={{ flex: 1, padding: '6px 4px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: configTab === id ? 700 : 400, background: configTab === id ? '#F57C00' : 'transparent', color: configTab === id ? 'white' : '#888' }}>{l}</button>
          ))}
        </div>
        {configTab === 'metas' && (
          <div>
            <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '10px' }}>Asignar metas de recuperación</p>
            {[['Carlos Pérez', 15], ['Ana Torres', 14], ['Pedro Soto', 12]].map(([v, m], i) => (
              <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{v}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button style={{ width: '24px', height: '24px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'white', fontSize: '14px' }} onClick={() => v === metaVendedor && setMetaValor(x => Math.max(1, x - 1))}>−</button>
                    <span style={{ fontWeight: 800, fontSize: '14px', minWidth: '24px', textAlign: 'center' }}>{v === metaVendedor ? metaValor : Number(m)}</span>
                    <button style={{ width: '24px', height: '24px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'white', fontSize: '14px' }} onClick={() => v === metaVendedor && setMetaValor(x => x + 1)}>+</button>
                  </div>
                </div>
                <button style={{ marginTop: '6px', width: '100%', background: v === metaVendedor ? '#714B67' : '#eee', color: v === metaVendedor ? 'white' : '#999', border: 'none', borderRadius: '5px', padding: '4px', fontSize: '10px', cursor: 'pointer' }}
                  onClick={() => { setMetaVendedor(String(v)); onAction && onAction('toast', { msg: 'Meta actualizada para ' + v }); }}>
                  {v === metaVendedor ? '✓ Guardando meta' : 'Editar meta'}
                </button>
              </div>
            ))}
          </div>
        )}
        {configTab === 'agenda' && (
          <div>
            <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>Priorizar agenda comercial</p>
            <p style={{ fontSize: '10px', color: '#888', marginBottom: '10px' }}>Selecciona qué alertas se priorizan primero en la agenda</p>
            {([['critico', '🔴 Solo críticos (60+ días)'], ['alto', '🟠 Críticos + Alta (30+ días)'], ['todos', '🟡 Todos los niveles']] as const).map(([id, l]) => (
              <button key={id} onClick={() => { setAgendaPrio(id); onAction && onAction('toast', { msg: 'Prioridad de agenda actualizada' }); }}
                style={{ display: 'block', width: '100%', marginBottom: '8px', padding: '10px 12px', border: agendaPrio === id ? '2px solid #F57C00' : '1px solid #ddd', borderRadius: '8px', background: agendaPrio === id ? '#fff8e1' : 'white', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: agendaPrio === id ? 700 : 400, color: agendaPrio === id ? '#F57C00' : '#333' }}>{l}</button>
            ))}
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>Filtrar por vendedor</p>
              {['Todos', 'Carlos Pérez', 'Ana Torres', 'Pedro Soto'].map((v, i) => (
                <button key={i} onClick={() => onAction && onAction('toast', { msg: 'Agenda filtrada: ' + v })}
                  style={{ marginRight: '6px', marginBottom: '6px', padding: '4px 10px', border: '1px solid #ddd', borderRadius: '12px', background: 'white', cursor: 'pointer', fontSize: '10px' }}>{v}</button>
              ))}
            </div>
          </div>
        )}
        {configTab === 'mensajes' && (
          <div>
            <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>Activar mensajes simulados</p>
            <div style={{ background: '#fff8e1', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', fontSize: '10px', color: '#795548' }}>⚠️ En producción, los mensajes son enviados por batch nocturno. En MVP se simulan.</div>
            {([['sms', '📱 SMS', '#2196F3'], ['whatsapp', '💬 WhatsApp', '#4CAF50'], ['correo', '📧 Correo', '#9C27B0']] as const).map(([id, l, c]) => (
              <div key={id} style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>{l}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: mensajeActivo[id] ? c : '#aaa' }}>{mensajeActivo[id] ? 'Activo' : 'Inactivo'}</span>
                  <button onClick={() => { setMensajeActivo(m => ({ ...m, [id]: !m[id] })); onAction && onAction('toast', { msg: l + ' ' + (!mensajeActivo[id] ? 'activado' : 'desactivado') }); }}
                    style={{ width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer', background: mensajeActivo[id] ? c : '#ddd', position: 'relative', transition: 'background 0.2s' }}>
                    <span style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', background: 'white', top: '2px', left: mensajeActivo[id] ? '20px' : '2px', transition: 'left 0.2s' }} />
                  </button>
                </div>
              </div>
            ))}
            <button style={{ width: '100%', background: '#714B67', color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '12px', cursor: 'pointer', marginTop: '8px' }}
              onClick={() => onAction && onAction('toast', { msg: 'Configuración de mensajes guardada' })}>Guardar configuración</button>
          </div>
        )}
      </div>
    );

    if (tab === 'equipo') return (
      <div style={{ padding: '12px' }}>
        <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px' }}>Mi equipo — {user?.nombre}</p>
        {(user?.vendedoresAsignados || ['Carlos Pérez', 'Ana Torres']).map((v, i) => {
          const pcts = [20, 78];
          const pct = pcts[i] || 65;
          return (
            <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '12px' }}>{v}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: pct >= 70 ? '#4CAF50' : '#FF9800' }}>{pct}%</span>
              </div>
              <div style={{ height: '6px', background: '#eee', borderRadius: '3px', marginBottom: '4px' }}>
                <div style={{ width: pct + '%', height: '100%', background: pct >= 70 ? '#4CAF50' : '#FF9800', borderRadius: '3px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', fontSize: '10px', color: '#888' }}>
                <span>🔔 {i === 0 ? 14 : 5} alertas</span>
                <span>✅ {i === 0 ? 3 : 11} recuperados</span>
              </div>
            </div>
          );
        })}
        <div style={{ background: '#f3e5f5', borderRadius: '8px', padding: '10px 12px', marginTop: '8px' }}>
          <p style={{ fontWeight: 700, fontSize: '11px', margin: '0 0 4px', color: '#4a148c' }}>Cumplimiento equipo</p>
          <p style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#7b1fa2' }}>{Math.round(([20, 78].reduce((a, b) => a + b, 0)) / 2)}%</p>
        </div>
      </div>
    );

    if (tab === 'alertas') return (
      <div style={{ padding: '12px' }}>
        <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px' }}>Mis alertas activas</p>
        {[
          { cliente: 'Comercial La Esquina', dias: 62, nivel: 'critico', tipo: 'Crítica 2' },
          { cliente: 'Bodegón Central', dias: 58, nivel: 'critico', tipo: 'Crítica 2' },
          { cliente: 'Panadería San Simón', dias: 34, nivel: 'alerta', tipo: 'Alta' },
        ].slice(0, isV ? 3 : isB ? 2 : 3).map((a, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', borderLeft: '3px solid ' + (a.nivel === 'critico' ? '#F44336' : '#FF9800') }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{a.cliente}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: a.nivel === 'critico' ? '#F44336' : '#FF9800' }}>{a.tipo}</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#888' }}>{a.dias} días sin transar</p>
          </div>
        ))}
      </div>
    );

    if (tab !== 'clientes') return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '30px', marginBottom: '10px' }}>{tab === 'ventas' ? '💳' : tab === 'facturacion' ? '📄' : '👤'}</p>
        <p style={{ fontSize: '13px', color: '#888' }}>{tab === 'ventas' ? 'Módulo de Ventas POS' : tab === 'facturacion' ? 'Historial de Facturas' : 'Perfil: ' + (user?.nombre || 'Usuario')}</p>
        {tab === 'perfil' && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#714B67', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, margin: '0 auto 10px' }}>{user?.badge || 'U'}</div>
            <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px' }}>{user?.nombre}</p>
            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{ROL_LABELS[user?.rol || 'ccr']}</p>
          </div>
        )}
      </div>
    );

    if (sub === 'dashboard') return (
      <div style={{ padding: '14px' }}>
        <div style={{ background: isSup ? 'linear-gradient(135deg,#4a148c,#7b1fa2)' : isB ? 'linear-gradient(135deg,#1565C0,#1976D2)' : 'linear-gradient(135deg,#F57C00,#FF9800)', borderRadius: '10px', padding: '14px', color: 'white', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 2px', fontSize: '11px', opacity: 0.8 }}>Hola, {user?.nombre?.split(' ')[0] || 'Usuario'} 👋</p>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{isSup ? 'Supervisando: ' + (user?.vendedoresAsignados?.join(', ') || 'tu equipo') : isB ? 'Banco ' + (user?.banco || '201') + ' — Cartera activa' : 'Última actualización: TX-0001 · 03/06/2026'}</p>
        </div>
        {(isSup ? [
          { l: 'Cartera de mi equipo', v: mySize, c: '#7b1fa2', icon: '👥' },
          { l: 'Sin transar (equipo)', v: myST, c: '#F44336', icon: '⚠️' },
          { l: 'Alertas activas', v: Math.floor(k.alertasNuevas / factor), c: '#FF9800', icon: '🔔' },
          { l: 'Recuperados equipo', v: myRec, c: '#4CAF50', icon: '✅' },
        ] : isB ? [
          { l: 'Cartera banco ' + (user?.banco || '201'), v: mySize, c: '#1976D2', icon: '🏦' },
          { l: 'Sin transar', v: myST, c: '#F44336', icon: '⚠️' },
          { l: 'Alertas banco', v: Math.floor(k.alertasNuevas / factor), c: '#FF9800', icon: '🔔' },
          { l: 'Recuperados', v: myRec, c: '#4CAF50', icon: '✅' },
        ] : [
          { l: isCCR ? 'Cartera total' : 'Cartera asignada', v: mySize, c: '#2196F3', icon: '🏪' },
          { l: 'Sin transar', v: myST, c: '#F44336', icon: '⚠️' },
          { l: 'Alertas nuevas', v: Math.floor(k.alertasNuevas / factor), c: '#FF9800', icon: '🔔' },
          { l: 'Recuperados', v: myRec, c: '#4CAF50', icon: '✅' },
        ]).map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <span style={{ fontSize: '18px' }}>{it.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{it.l}</p>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: it.c }}>{it.v}</p>
            </div>
          </div>
        ))}
        {isCCR && (
          <div style={{ background: '#f3e5f5', borderRadius: '8px', padding: '10px 12px', marginTop: '4px' }}>
            <p style={{ margin: 0, fontSize: '10px', color: '#7b1fa2', fontWeight: 700 }}>Cumplimiento global: {myCum}% · Ranking activo</p>
          </div>
        )}
      </div>
    );

    if (sub === 'cartera') return (
      <div style={{ padding: '14px' }}>
        <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 10px' }}>Mi Cartera ({mySize} afiliados)</p>
        {CARTERA_APP.map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', borderLeft: '3px solid ' + estadoColor(c.estado) }}>
            <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '12px' }}>{c.n}</p>
            <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#888' }}>{c.af}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: c.dias > 0 ? estadoColor(c.estado) : '#4CAF50', fontWeight: 600 }}>{c.dias > 0 ? c.dias + ' días sin transar' : 'Activo'}</span>
              <span style={{ fontSize: '10px', color: 'white', background: estadoColor(c.estado), padding: '1px 6px', borderRadius: '8px' }}>{c.estado}</span>
            </div>
          </div>
        ))}
      </div>
    );

    if (sub === 'sintransar') return (
      <div style={{ padding: '14px' }}>
        <div style={{ background: '#ffebee', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
          <p style={{ fontWeight: 700, fontSize: '12px', margin: '0 0 2px', color: '#c62828' }}>⚠️ {myST} POS sin transar</p>
          <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>Actualizado desde TX-0001 · 03/06/2026</p>
        </div>
        {CARTERA_APP.filter(c => c.dias > 0).map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
            <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '12px' }}>{c.n}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#888' }}>{c.af}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: estadoColor(c.estado) }}>{c.dias} días</span>
            </div>
            <button style={{ marginTop: '6px', background: '#714B67', color: 'white', border: 'none', borderRadius: '5px', padding: '4px 10px', fontSize: '10px', cursor: 'pointer', width: '100%' }}
              onClick={() => onAction && onAction('registerManagement', { cliente: c.n })}>
              Registrar gestión
            </button>
          </div>
        ))}
      </div>
    );

    if (sub === 'metas') return (
      <div style={{ padding: '14px' }}>
        <div style={{ background: 'linear-gradient(135deg,#2E7D32,#4CAF50)', borderRadius: '10px', padding: '14px', color: 'white', marginBottom: '12px' }}>
          <p style={{ margin: '0 0 2px', fontSize: '11px', opacity: 0.8 }}>Meta Junio 2026</p>
          <p style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800 }}>{myRec} / {myMeta}</p>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}>
            <div style={{ width: Math.min(100, Math.round((myRec / myMeta) * 100)) + '%', height: '100%', background: 'white', borderRadius: '4px' }} />
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '12px', opacity: 0.9 }}>Cumplimiento: {myCum}%</p>
        </div>
        <div style={{ background: '#fff8e1', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: '#795548' }}>
          ⚠️ Recuperación real se confirma en el siguiente Excel con transacción activa.
        </div>
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '8px' }}>Historial de cumplimiento</p>
          {[{ periodo: 'Abril 2026', cum: 65 }, { periodo: 'Mayo 2026', cum: 68 }, { periodo: 'Junio 2026', cum: myCum }].map((h, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px' }}>{h.periodo}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: h.cum >= 80 ? '#4CAF50' : h.cum >= 60 ? '#FF9800' : '#F44336' }}>{h.cum}%</span>
              </div>
              <div style={{ height: '6px', background: '#eee', borderRadius: '3px' }}>
                <div style={{ width: h.cum + '%', height: '100%', background: h.cum >= 80 ? '#4CAF50' : h.cum >= 60 ? '#FF9800' : '#F44336', borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (sub === 'gestiones') return (
      <div style={{ padding: '14px' }}>
        <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 10px' }}>Mis gestiones</p>
        <div style={{ marginBottom: '12px' }}>
          <input placeholder="Notas de gestión..." value={gestNotes} onChange={e => setGestNotes(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px', marginBottom: '6px', boxSizing: 'border-box' }} />
          <button style={{ width: '100%', background: '#714B67', color: 'white', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '12px', cursor: 'pointer' }}
            onClick={() => { if (onAction) onAction('registerManagement', { nota: gestNotes }); setGestNotes(''); }}>
            Registrar gestión
          </button>
        </div>
        {GESTIONES_APP.map((g, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', borderLeft: '3px solid ' + gestColor(g.estado) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontWeight: 700, fontSize: '11px', color: '#714B67' }}>{g.id}</span>
              <span style={{ fontSize: '9px', color: '#aaa' }}>{g.fecha}</span>
            </div>
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '11px' }}>{g.cliente}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#888' }}>{g.tipo}</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: gestColor(g.estado) }}>{g.estado}</span>
            </div>
          </div>
        ))}
      </div>
    );

    if (sub === 'historial') return (
      <div style={{ padding: '14px' }}>
        <p style={{ fontWeight: 700, fontSize: '13px', margin: '0 0 10px' }}>Historial de actividad</p>
        {[
          { t: '03/06/2026 14:00', ev: 'TX-0001 procesada · Cartera actualizada', tipo: 'carga' },
          { t: '11/06/2026 10:15', ev: 'Gestión CCR-004 registrada · Comercial La Esquina', tipo: 'gestion' },
          { t: '10/06/2026 14:30', ev: 'WhatsApp enviado · Bodegón Central', tipo: 'notif' },
          { t: '28/05/2026 10:30', ev: 'TX-0002 procesada · 484 afiliados', tipo: 'carga' },
          { t: '09/06/2026 09:00', ev: 'Gestión CCR-002 · Distribuidora Caracas · Resuelto', tipo: 'gestion' },
        ].map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '14px', flexShrink: 0 }}>{e.tipo === 'carga' ? '📁' : e.tipo === 'gestion' ? '📞' : '📢'}</span>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 600, color: '#333' }}>{e.ev}</p>
              <p style={{ margin: 0, fontSize: '9px', color: '#aaa' }}>{e.t}</p>
            </div>
          </div>
        ))}
      </div>
    );

    return null;
  };

  return (
    <div style={{ width: '340px', height: '700px', background: '#F5F5F5', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#F57C00', padding: '12px 16px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💳</div>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '13px' }}>CCRPOS</p>
          <p style={{ margin: 0, fontSize: '9px', opacity: 0.8 }}>{ROL_LABELS[user?.rol || 'ccr']} · {user?.nombre || 'Usuario'}</p>
        </div>
      </div>

      {/* Sub-tabs (only for clientes) */}
      {tab === 'clientes' && (
        <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '0 8px', display: 'flex', gap: '2px', overflowX: 'auto', flexShrink: 0 }}>
          {[
            { id: 'dashboard', l: 'Inicio' }, { id: 'cartera', l: 'Cartera' }, { id: 'sintransar', l: 'Sin transar' },
            { id: 'metas', l: 'Metas' }, { id: 'gestiones', l: 'Gestiones' }, { id: 'historial', l: 'Historial' }
          ].map(s => (
            <button key={s.id} onClick={() => setSub(s.id)} style={{ padding: '7px 8px', border: 'none', background: 'transparent', fontSize: '10px', fontWeight: sub === s.id ? 700 : 400, color: sub === s.id ? '#F57C00' : '#888', borderBottom: sub === s.id ? '2px solid #F57C00' : '2px solid transparent', cursor: 'pointer', flexShrink: 0 }}>{s.l}</button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f5' }}>
        {renderContent()}
      </div>

      {/* Bottom nav */}
      <div style={{ background: 'white', borderTop: '1px solid #eee', display: 'flex', flexShrink: 0 }}>
        {NAV_TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === 'clientes') setSub('dashboard'); }}
            style={{ flex: 1, padding: '8px 0', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '16px' }}>{t.icon}</span>
            <span style={{ fontSize: '9px', color: tab === t.id ? '#F57C00' : '#999', fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════ COMPARATIVA VIEW ═══════════════════════════
interface CompStep {
  label: string; appSub: string; appTab: string; odooScreen: string;
  syncMsg: string; appDesc: string; odooDesc: string;
  kpiDelta?: Partial<SharedKPIs>;
}

const COMP_STEPS: CompStep[] = [
  {
    label: '1. Carga del Excel', appSub: 'dashboard', appTab: 'clientes', odooScreen: 'cargas',
    syncMsg: 'Odoo recibe archivo · App en espera',
    appDesc: 'Cartera sin cambios · 142 sin transar · Meta 68% · Esperando procesamiento',
    odooDesc: 'TX-0001 en Borrador · Archivo listo · Columnas verificadas · Sin procesar aún',
  },
  {
    label: '2. Procesamiento', appSub: 'sintransar', appTab: 'clientes', odooScreen: 'cargas',
    syncMsg: 'Odoo procesa → App actualiza KPIs',
    appDesc: '142 afiliados sin transar · 36 alertas nuevas · Meta actualizada · Última sync: ahora',
    odooDesc: 'TX-0001 Procesado · 498 afiliados · 36 alertas · 34 notificaciones · KPIs actualizados',
    kpiDelta: { cargas: 3, alertasNuevas: 36, cumplimiento: 73 },
  },
  {
    label: '3. Duplicado detectado', appSub: 'dashboard', appTab: 'clientes', odooScreen: 'cargas',
    syncMsg: 'Archivo rechazado · Sin cambios en app',
    appDesc: 'Sin cambios · Misma cartera · Sin nuevas alertas · Sin cambios en meta',
    odooDesc: 'TX duplicado · No procesado · Cartera, metas, alertas sin cambios · Trazabilidad registrada',
    kpiDelta: {},
  },
  {
    label: '4. Gestión desde App', appSub: 'gestiones', appTab: 'clientes', odooScreen: 'gestiones',
    syncMsg: 'App registra → Odoo actualiza chatter',
    appDesc: 'Gestión CCR-004 guardada · Comercial La Esquina · Estado: En gestión',
    odooDesc: 'Nueva gestión CCR-004 · Alerta A001 en "En gestión" · Chatter actualizado · Trazabilidad visible',
    kpiDelta: { gestiones: 90 },
  },
  {
    label: '5. Recuperación confirmada', appSub: 'metas', appTab: 'clientes', odooScreen: 'alertas',
    syncMsg: 'Excel TX-0002 confirma recuperación',
    appDesc: 'Cumplimiento 68% → 73% · Comercial La Esquina recuperado · Meta +1 · Cartera actualizada',
    odooDesc: 'Alerta A001 → Recuperada · Meta +1 · Confirmado en TX-0002 · No por "Problema resuelto" en app',
    kpiDelta: { recuperados: 36, sinTransar: 141, cumplimiento: 74 },
  },
];

function ComparativaView({ user, kpis, syncEvents, onAction }: {
  user: AppUser; kpis: SharedKPIs; syncEvents: SyncEvent[]; onAction: (a: string, p?: any) => void;
}) {
  const [step, setStep] = useState(0);
  const st = COMP_STEPS[step];
  const stepKpis = { ...kpis, ...(st.kpiDelta || {}) };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#e8eaf0', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' }}>
      {/* Step navigator */}
      <div style={{ background: '#714B67', padding: '10px 16px', display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
        <span style={{ color: 'white', fontSize: '12px', fontWeight: 700, marginRight: '6px', flexShrink: 0 }}>Paso:</span>
        {COMP_STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: step === i ? 700 : 400,
            background: step === i ? 'white' : 'rgba(255,255,255,0.15)', color: step === i ? '#714B67' : 'white',
          }}>{s.label}</button>
        ))}
      </div>

      {/* 3-panel layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', gap: '0', minHeight: 0 }}>

        {/* LEFT: Phone */}
        <div style={{ width: '256px', flexShrink: 0, padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#eef0f5', borderRight: '1px solid #dce0ee' }}>
          <p style={{ fontSize: '11px', color: '#555', margin: '0 0 8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>📱 App Móvil CCRPOS</p>
          <div style={{ width: '221px', height: '455px', overflow: 'hidden', position: 'relative', borderRadius: '16px', boxShadow: '0 4px 18px rgba(0,0,0,0.25)', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, transform: 'scale(0.65)', transformOrigin: 'top left', width: '154%' }}>
              <MobileAppView key={`app-step-${step}`} user={user} kpis={stepKpis} onAction={onAction} initialSub={st.appSub} initialTab={st.appTab} />
            </div>
          </div>
          <div style={{ marginTop: '8px', background: '#fff8e1', border: '1px solid #FFC107', borderRadius: '6px', padding: '6px 8px', width: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '10px', color: '#795548', margin: 0, lineHeight: 1.4 }}>{st.appDesc}</p>
          </div>
        </div>

        {/* CENTER: Sync indicator */}
        <div style={{ width: '100px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f0ff', borderRight: '1px solid #dce0ee', padding: '8px', gap: '6px' }}>
          <p style={{ fontSize: '22px', margin: 0 }}>⇄</p>
          <p style={{ fontSize: '10px', color: '#714B67', fontWeight: 800, textAlign: 'center', margin: 0, lineHeight: 1.3 }}>SYNC</p>
          <p style={{ fontSize: '9px', color: '#777', textAlign: 'center', margin: 0, lineHeight: 1.4 }}>{st.syncMsg}</p>
          <div style={{ background: '#E8F5E9', border: '1px solid #4CAF50', borderRadius: '5px', padding: '4px 6px', width: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '9px', color: '#2E7D32', fontWeight: 700, margin: 0, textAlign: 'center' }}>App → Odoo ✓</p>
          </div>
          <div style={{ background: '#E3F2FD', border: '1px solid #2196F3', borderRadius: '5px', padding: '4px 6px', width: '100%', boxSizing: 'border-box' }}>
            <p style={{ fontSize: '9px', color: '#1565C0', fontWeight: 700, margin: 0, textAlign: 'center' }}>Odoo → App ✓</p>
          </div>
          <div style={{ marginTop: '4px', textAlign: 'center' }}>
            <p style={{ fontSize: '9px', color: '#aaa', margin: 0 }}>Paso {step + 1}/5</p>
          </div>
          <button onClick={() => setStep(s => Math.min(COMP_STEPS.length - 1, s + 1))} disabled={step === COMP_STEPS.length - 1}
            style={{ fontSize: '11px', padding: '4px 8px', background: step === COMP_STEPS.length - 1 ? '#eee' : '#714B67', color: step === COMP_STEPS.length - 1 ? '#aaa' : 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '4px' }}>
            {step === COMP_STEPS.length - 1 ? '✓ Fin' : 'Siguiente →'}
          </button>
          {step > 0 && (
            <button onClick={() => setStep(s => Math.max(0, s - 1))} style={{ fontSize: '10px', padding: '3px 6px', background: 'transparent', color: '#714B67', border: '1px solid #714B67', borderRadius: '5px', cursor: 'pointer' }}>← Atrás</button>
          )}
        </div>

        {/* RIGHT: OdooBackend at scale */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '12px', minWidth: 0 }}>
          <p style={{ fontSize: '11px', color: '#555', margin: '0 0 8px', fontWeight: 700 }}>🖥️ Odoo — Gestión de Clientes CCR</p>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', borderRadius: '8px', boxShadow: '0 4px 18px rgba(0,0,0,0.18)', minHeight: 0 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, transform: 'scale(0.48)', transformOrigin: 'top left', width: '208.33%', height: '1100px' }}>
              <OdooBackendTyped key={`odoo-step-${step}`} user={user} embeddedHeight="1100px" initialScreen={st.odooScreen} kpis={stepKpis} syncEvents={syncEvents} onAction={onAction} />
            </div>
          </div>
          <div style={{ marginTop: '8px', background: '#e8f5e9', border: '1px solid #4CAF50', borderRadius: '6px', padding: '6px 10px' }}>
            <p style={{ fontSize: '10px', color: '#1b5e20', margin: 0, lineHeight: 1.4 }}>{st.odooDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════ DEV GUIDE MODAL ═══════════════════════════
function DevGuideModal({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState('alcance');
  const [filter, setFilter] = useState<'todos' | 'app' | 'odoo' | 'ambos'>('todos');
  const [search, setSearch] = useState('');

  const HS: React.CSSProperties = { fontSize: '16px', fontWeight: 800, color: '#714B67', margin: '0 0 10px' };
  const PT: React.CSSProperties = { fontSize: '13px', color: '#444', lineHeight: 1.5, margin: '0 0 10px' };
  const WB: React.CSSProperties = { background: '#fff3e0', border: '1px solid #FF9800', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', color: '#E65100', marginBottom: '10px' };
  const TB: React.CSSProperties = { overflowX: 'auto', marginBottom: '10px' };
  const TBT: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '12px' };
  const TH: React.CSSProperties = { padding: '8px 12px', textAlign: 'left', fontWeight: 700, fontSize: '11px', color: '#555' };
  const TC: React.CSSProperties = { padding: '7px 12px', borderBottom: '1px solid #f0f0f0' };

  const SECTIONS = [
    {
      id: 'alcance', label: '📋 Alcance del módulo', scope: 'ambos', content: (
        <div>
          <p style={HS}>Módulo 2 — Gestión de Clientes CCR (CCRPOS)</p>
          <p style={PT}>Permite monitorear la cartera activa de afiliados/POS, detectar inactividad, asignar metas de recuperación y registrar gestiones comerciales. No incluye almacén, inventario ni logística.</p>
          <div style={WB}>⚠️ Fuera del alcance (MVP): Notificaciones automáticas batch, analytics avanzados, bloqueo automático de metas, offline total.</div>
          <div style={TB}><table style={TBT}><tbody>
            {[['Módulo', 'Gestión de Clientes CCR'], ['Release', 'MVP — Release 1'], ['Stack', 'React + TypeScript · Vite/esbuild · Odoo 19'], ['Prototipo', 'Demo funcional con datos mock'], ['Fuente de datos real', 'Data Integriti (transaccionalidad POS)']].map(([k, v], i) => <tr key={i} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}><td style={TC}><strong>{k}</strong></td><td style={TC}>{v}</td></tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'roles', label: '👥 Roles y permisos', scope: 'ambos', content: (
        <div>
          <p style={HS}>Roles del sistema y visibilidad</p>
          <div style={TB}><table style={TBT}><thead><tr style={{ background: '#714B6722' }}>{['Rol', 'Cartera', 'Cargas', 'KPIs', 'Metas', 'Config'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>
            {[
              ['Sandra CCR', 'Global', 'Sí', 'Global', 'Configura', 'Sí'],
              ['Supervisor (María)', 'Su equipo', 'No', 'Su equipo', 'Ve equipo', 'No'],
              ['Vendedor (Carlos)', 'Solo propia', 'No', 'Solo propios', 'Ve propia', 'No'],
              ['Banco 201', 'Su banco', 'No', 'Su banco', 'Ve propia', 'No'],
              ['Administrador', 'Global', 'Sí', 'Global', 'Global', 'Sí'],
            ].map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>{row.map((c, j) => <td key={j} style={TC}>{c}</td>)}</tr>)}
          </tbody></table></div>
          <div style={WB}>R1 (Segregación): Banco nunca ve datos de otro banco. R2 (Territorialidad): Por zona geográfica.</div>
        </div>
      ),
    },
    {
      id: 'cartera', label: '🏪 Cartera de clientes', scope: 'odoo', content: (
        <div>
          <p style={HS}>Estructura de la cartera</p>
          <p style={PT}>Cada afiliado es un comercio vinculado a un banco mediante CODAFI. Un mismo RIF puede tener múltiples afiliados. La cartera se actualiza solo al procesar un Excel exitoso.</p>
          <p style={{ fontWeight: 700, fontSize: '13px', margin: '12px 0 6px' }}>Campos clave por afiliado:</p>
          <div style={TB}><table style={TBT}><tbody>
            {[['afiliado (CODAFI)', 'Texto — identificador maestro'], ['rif', 'Texto — identificador fiscal del comercio'], ['banco', 'Banco al que pertenece el afiliado'], ['vendedor', 'Responsable de recuperación'], ['dias_sin_transar', 'Calculado desde última tx en Excel'], ['estado', 'activo / alerta / critico / recuperado'], ['ultima_transaccion', 'Fecha de última tx confirmada en Excel']].map(([k, v], i) => <tr key={i} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}><td style={{ ...TC, fontFamily: 'monospace', color: '#714B67' }}>{k}</td><td style={TC}>{v}</td></tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'excel', label: '📁 Carga de Excel', scope: 'odoo', content: (
        <div>
          <p style={HS}>Proceso de carga de transacciones</p>
          <div style={WB}>⚠️ AFILIADO siempre se trata como texto (string), nunca como número. Crítico para afiliados con ceros iniciales.</div>
          <p style={{ fontWeight: 700, fontSize: '13px', margin: '12px 0 6px' }}>Columnas requeridas:</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {['FECHA', 'CODBANCO', 'MANEJADOR', 'AFILIADO (texto)', 'TRANSACCION', 'RESPUESTA', 'CANTIDAD'].map((c, i) => <span key={i} style={{ background: '#e8eaf6', color: '#3949ab', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, border: '1px solid #9fa8da' }}>{c}</span>)}
          </div>
          <p style={{ fontWeight: 700, fontSize: '13px', margin: '12px 0 6px' }}>Máquina de estados:</p>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
            {['Borrador', '→ [Validar]', 'Validado', '→ [Procesar]', 'Procesado'].map((s, i) => <span key={i} style={{ background: s.startsWith('→') ? 'transparent' : '#f0f0f0', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: s.startsWith('→') ? 400 : 600, color: s.startsWith('→') ? '#888' : '#333' }}>{s}</span>)}
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            {['Borrador/Validado', '→ [Simular duplicado]', 'Duplicado'].map((s, i) => <span key={i} style={{ background: s.startsWith('→') ? 'transparent' : s === 'Duplicado' ? '#ffebee' : '#f0f0f0', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: s === 'Duplicado' ? '#F44336' : s.startsWith('→') ? '#888' : '#333', fontWeight: s.startsWith('→') ? 400 : 600 }}>{s}</span>)}
          </div>
        </div>
      ),
    },
    {
      id: 'duplicados', label: '🔁 Validación duplicados', scope: 'odoo', content: (
        <div>
          <p style={HS}>Lógica de detección de duplicados</p>
          <p style={PT}>Un archivo se considera duplicado si ya fue procesado anteriormente con el mismo contenido o nombre. El prototipo simula este comportamiento con &quot;Simular duplicado&quot;.</p>
          <div style={WB}>Cuando se detecta duplicado: NO se actualizan cartera, metas, alertas ni notificaciones. El estado cambia a &quot;Duplicado&quot;. La trazabilidad registra el evento.</div>
          <div style={TB}><table style={TBT}><tbody>
            {[['Carga duplicada detectada', 'Estado → Duplicado · Sin cambios en datos'], ['Carga con errores de columnas', 'Estado → Con errores · Columnas faltantes reportadas'], ['AFILIADO numérico accidental', 'Error de formato · Afiliados con ceros iniciales se pierden']].map(([k, v], i) => <tr key={i} style={{ background: i % 2 === 0 ? '#fff3e0' : 'white' }}><td style={{ ...TC, fontWeight: 600 }}>{k}</td><td style={TC}>{v}</td></tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'afiliados', label: '⚙️ Procesamiento afiliados', scope: 'odoo', content: (
        <div>
          <p style={HS}>Motor de inactividad — Documento técnico Sandra</p>
          <p style={PT}>Al procesar un Excel exitoso, el motor compara cada AFILIADO contra la cartera activa y calcula días sin transar. Los umbrales son parametrizables.</p>
          <div style={TB}><table style={TBT}><thead><tr style={{ background: '#714B6722' }}>{['Umbral', 'Nivel', 'Notificación', 'Canal'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>
            {[['10 días', 'Nueva (clientes nuevos)', 'Push automático', 'App Push'], ['15 días', 'Media', 'SMS', 'SMS simulado'], ['30 días', 'Alta', 'Correo', 'Correo simulado'], ['45 días', 'Crítica 1', 'SMS + WhatsApp', 'Multi-canal'], ['60 días', 'Crítica 2', 'SMS + WhatsApp + Correo', 'Full multi-canal']].map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>{row.map((c, j) => <td key={j} style={TC}>{c}</td>)}</tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'alertas', label: '🔔 Alertas de inactividad', scope: 'ambos', content: (
        <div>
          <p style={HS}>Gestión de alertas</p>
          <p style={PT}>Las alertas se generan automáticamente al procesar un Excel. Cada alerta tiene nivel, vendedor asignado, notificación enviada y estado de gestión.</p>
          <p style={{ fontWeight: 700, fontSize: '13px', margin: '8px 0 6px' }}>Ciclo de vida de una alerta:</p>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
            {['Nueva', '→', 'En gestión', '→', 'Resuelto / Descartada / Recuperada'].map((s, i) => <span key={i} style={{ padding: '4px 8px', background: s === '→' ? 'transparent' : '#f0f0f0', fontSize: '11px', fontWeight: s === '→' ? 400 : 600, color: s === '→' ? '#888' : '#333', borderRadius: '5px' }}>{s}</span>)}
          </div>
          <div style={WB}>Recuperación real: Solo cuando el afiliado vuelve a aparecer transando en un Excel posterior. No por acción manual del vendedor.</div>
          <p style={PT}>En app: visible como lista &quot;Sin transar&quot; con botón &quot;Registrar gestión&quot;. En Odoo: panel completo con filtros por nivel, vendedor y estado.</p>
        </div>
      ),
    },
    {
      id: 'metas', label: '🎯 Metas de recuperación', scope: 'ambos', content: (
        <div>
          <p style={HS}>Configuración y seguimiento de metas</p>
          <p style={PT}>El usuario CCR asigna metas mensuales de recuperación por vendedor y banco. El avance se calcula solo con recuperaciones confirmadas en Excel.</p>
          <div style={TB}><table style={TBT}><tbody>
            {[['Meta asignada', 'Nro. de afiliados a recuperar en el período'], ['Recuperados confirmados', 'Solo afiliados que volvieron a transar en Excel posterior'], ['Cumplimiento (%)', '(recuperados / meta) × 100'], ['Período', 'Mensual. Ejemplo: Junio 2026'], ['Bloqueo automático', 'No en MVP. Planificado para Release 2']].map(([k, v], i) => <tr key={i} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}><td style={{ ...TC, fontWeight: 600 }}>{k}</td><td style={TC}>{v}</td></tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'kpis', label: '📊 KPIs Credicard', scope: 'odoo', content: (
        <div>
          <p style={HS}>KPIs por grupo y perfil</p>
          <p style={PT}>Los KPIs se agrupan en 5 categorías: Cartera, Alertas, Metas, Gestiones y Cargas. Cada perfil ve solo los KPIs correspondientes a su cartera.</p>
          <div style={WB}>⚠️ Diseño original de KPIs (Portal KPIs Credicard.html) no accesible en la sesión. KPIs implementados basados en el documento técnico del Módulo 2.</div>
          <div style={TB}><table style={TBT}><thead><tr style={{ background: '#714B6722' }}>{['KPI', 'Descripción', 'Visible para'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>
            {[
              ['Afiliados en cartera', 'Total de POS activos', 'Todos'],
              ['Sin transar (%)', 'Porcentaje de cartera inactiva', 'Todos'],
              ['Alertas activas', 'Por nivel: nueva/media/alta/crítica', 'Todos'],
              ['Cumplimiento de meta', '% de meta alcanzada', 'Todos'],
              ['Recuperados confirmados', 'Solo por Excel posterior', 'Todos'],
              ['Gestiones registradas', 'App + Odoo', 'Todos'],
              ['Ranking vendedores', 'Por cumplimiento de meta', 'CCR / Admin / Supervisor'],
              ['Cargas del mes', 'Archivos procesados', 'CCR / Admin'],
            ].map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>{row.map((c, j) => <td key={j} style={TC}>{c}</td>)}</tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'gestiones', label: '📞 Gestiones comerciales', scope: 'ambos', content: (
        <div>
          <p style={HS}>Flujo de gestión desde app y Odoo</p>
          <p style={PT}>Las gestiones se pueden registrar desde la app móvil (campo Notas + botón Registrar) o desde Odoo (formulario completo con tipo, notas, próxima acción). Ambas se reflejan en el chatter del cliente.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '10px 0' }}>
            <div style={{ background: '#e3f2fd', borderRadius: '6px', padding: '10px' }}>
              <p style={{ fontWeight: 700, fontSize: '12px', margin: '0 0 6px', color: '#1565C0' }}>📱 Desde App</p>
              {['Seleccionar cliente en "Sin transar"', 'Tocar "Registrar gestión"', 'Escribir notas', 'Guardar → Sync a Odoo'].map((s, i) => <p key={i} style={{ fontSize: '11px', margin: '0 0 3px' }}>→ {s}</p>)}
            </div>
            <div style={{ background: '#f3e5f5', borderRadius: '6px', padding: '10px' }}>
              <p style={{ fontWeight: 700, fontSize: '12px', margin: '0 0 6px', color: '#4a148c' }}>🖥️ Desde Odoo</p>
              {['Gestiones Comerciales → Nueva gestión', 'Seleccionar cliente + tipo + notas', 'Guardar → chatter actualizado', 'Alerta cambia a "En gestión"'].map((s, i) => <p key={i} style={{ fontSize: '11px', margin: '0 0 3px' }}>→ {s}</p>)}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'notif', label: '📢 Notificaciones simuladas', scope: 'odoo', content: (
        <div>
          <p style={HS}>Canales de notificación (simulados en MVP)</p>
          <p style={PT}>Las notificaciones se simulan al procesar un Excel. En producción, serán enviadas por batch nocturno (AS400) o mediante APIs externas. El MVP solo simula la generación.</p>
          <div style={WB}>Motor de notificaciones completo (Módulo 4) está planificado para Release 2. En MVP: solo OTP (SMS) y factura por correo son reales.</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[['SMS', '#2196F3'], ['WhatsApp', '#4CAF50'], ['Correo', '#9C27B0'], ['Push', '#FF9800']].map(([canal, c], i) => (
              <div key={i} style={{ background: c + '15', border: '1px solid ' + c + '44', borderRadius: '8px', padding: '10px 14px', flex: 1, minWidth: '80px' }}>
                <p style={{ fontWeight: 700, fontSize: '12px', color: c, margin: '0 0 4px' }}>{canal}</p>
                <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>Simulado</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'feedback', label: '💬 Feedback MVP', scope: 'ambos', content: (
        <div>
          <p style={HS}>Feedback liviano del MVP</p>
          <p style={PT}>El prototipo incluye feedback MVP liviano: notificaciones toast, estados visuales de operaciones, trazabilidad de acciones. No incluye sistema de tickets ni formularios complejos.</p>
          <div style={TB}><table style={TBT}><tbody>
            {[['Toast notifications', 'Confirmación visual de acciones (3.8s)'], ['Badges de estado', 'Colores semáforo: verde/naranja/rojo'], ['Trazabilidad de cargas', 'Log de operaciones por TX-XXXX'], ['Chatter Odoo', 'Historial de comentarios por gestión'], ['Sincronización App-Odoo', 'Indicador visual en vista comparativa']].map(([k, v], i) => <tr key={i} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}><td style={{ ...TC, fontWeight: 600 }}>{k}</td><td style={TC}>{v}</td></tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'facturacion', label: '📄 Facturación (consultiva)', scope: 'ambos', content: (
        <div>
          <p style={HS}>Historial de Facturación — Módulo separado</p>
          <div style={{ background: '#e8f5e9', border: '1px solid #4CAF50', borderRadius: '6px', padding: '10px', marginBottom: '12px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#1b5e20', fontWeight: 600 }}>✅ Facturación es un módulo aparte. No forma parte del flujo de Gestión de Clientes.</p>
          </div>
          <p style={PT}>Accesible para todos los roles. Cada usuario ve facturas correspondientes a sus propios clientes. Búsqueda por: afiliado, RIF, serial, número de control.</p>
          <div style={WB}>No mezclar con almacén, inventario, transferencias de equipos ni solicitudes de POS.</div>
        </div>
      ),
    },
    {
      id: 'vista-app', label: '📱 Vista App', scope: 'app', content: (
        <div>
          <p style={HS}>App móvil CCRPOS — Gestión de Clientes</p>
          <p style={PT}>La app muestra el módulo Clientes con 6 sub-secciones navegables. La cartera y KPIs se actualizan solo al procesar un Excel exitoso desde Odoo.</p>
          <div style={TB}><table style={TBT}><thead><tr style={{ background: '#714B6722' }}>{['Sub-sección', 'Qué muestra', 'Se actualiza con'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>
            {[['Inicio', 'KPIs de cartera personal', 'Procesamiento Excel'], ['Cartera', 'Lista de afiliados asignados', 'Procesamiento Excel'], ['Sin transar', 'Afiliados inactivos por días', 'Procesamiento Excel'], ['Metas', 'Meta y avance mensual', 'Excel posterior (recuperación real)'], ['Gestiones', 'Registro y historial de gestiones', 'Acción del vendedor'], ['Historial', 'Log de actividad reciente', 'Todas las acciones']].map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>{row.map((c, j) => <td key={j} style={TC}>{c}</td>)}</tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'vista-odoo', label: '🖥️ Vista Odoo', scope: 'odoo', content: (
        <div>
          <p style={HS}>Odoo Backend — Gestión de Clientes CCR</p>
          <p style={PT}>Odoo tiene 9 menús principales en barra horizontal superior. Sin barra lateral. Sin Inventario/Almacén en este módulo.</p>
          <div style={TB}><table style={TBT}><thead><tr style={{ background: '#714B6722' }}>{['Menú', 'Sub-menús principales'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>
            {[['Dashboard', 'Resumen General · KPIs Credicard · Ranking'], ['Cargas', 'Cargas TX · Líneas · Duplicados · Errores'], ['Cartera', 'Cartera · Mi Cartera · Por Vendedor · Por Banco/Agente · Sin Responsable'], ['Alertas', 'Inactividad · Críticas · Nuevas · Recuperadas · Descartadas'], ['Gestión Comercial', 'Agenda · Gestiones · Pendientes · Sin Respuesta · Fallas Técnicas · Problemas Resueltos'], ['Metas', 'Recuperación · Cumplimiento por Vendedor · Por Banco/Agente · Metas Incumplidas · Ranking'], ['Comunicaciones', 'Notificaciones · Plantillas · Canales · Feedback MVP'], ['Facturación', 'Historial consultivo (módulo aparte)'], ['Configuración', 'Reglas de inactividad · Permisos · Usuarios · Parámetros Excel']].map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>{row.map((c, j) => <td key={j} style={TC}>{c}</td>)}</tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'vista-comp', label: '⇄ Vista Comparativa', scope: 'ambos', content: (
        <div>
          <p style={HS}>Comparativa App / Odoo en espejo real</p>
          <p style={PT}>La vista comparativa renderiza los componentes reales de App y Odoo a escala (65% y 48% respectivamente) en una misma pantalla. 5 pasos navegables mostrando el flujo completo.</p>
          <div style={TB}><table style={TBT}><thead><tr style={{ background: '#714B6722' }}>{['Paso', 'App muestra', 'Odoo muestra'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>
            {[['1. Carga del Excel', 'Dashboard · KPIs sin cambio', 'TX-0001 en Borrador'], ['2. Procesamiento', 'Sin transar · 36 alertas nuevas', 'TX-0001 Procesado · 498 afiliados'], ['3. Duplicado detectado', 'Dashboard · Sin cambios', 'TX Duplicado · Sin cambios'], ['4. Gestión desde App', 'Gestiones · CCR-004 registrada', 'Chatter actualizado · Alerta en gestión'], ['5. Recuperación confirmada', 'Metas · Cumplimiento subió', 'Alerta Recuperada · TX-0002 confirma']].map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>{row.map((c, j) => <td key={j} style={TC}>{c}</td>)}</tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'modelos', label: '🗄️ Modelos Odoo', scope: 'odoo', content: (
        <div>
          <p style={HS}>Modelos de datos del módulo</p>
          <div style={TB}><table style={TBT}><thead><tr style={{ background: '#714B6722' }}>{['Modelo', 'Descripción', 'Campos clave'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead><tbody>
            {[
              ['ccrpos.carga.tx', 'Carga de transacciones Excel', 'id, archivo, fecha_op, banco_id, estado, afiliados, duplicados'],
              ['ccrpos.cliente', 'Afiliado / cartera activa', 'codafi, rif, banco_id, vendedor_id, dias_inactivo, estado'],
              ['ccrpos.alerta', 'Alerta de inactividad', 'cliente_id, nivel, dias, notif_enviada, estado_gestion'],
              ['ccrpos.meta', 'Meta de recuperación', 'vendedor_id, meta, avance, periodo, cumplimiento'],
              ['ccrpos.gestion', 'Gestión comercial', 'cliente_id, tipo, notas, estado, proxima_accion, chatter'],
              ['ccrpos.plan', 'Plan de servicio (PD-02)', 'code, nombre, precio_usd, tipo_plan'],
            ].map((row, i) => <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>{row.map((c, j) => <td key={j} style={{ ...TC, fontFamily: j === 0 ? 'monospace' : undefined, color: j === 0 ? '#714B67' : undefined, fontSize: j === 2 ? '11px' : undefined }}>{c}</td>)}</tr>)}
          </tbody></table></div>
        </div>
      ),
    },
    {
      id: 'contratos', label: '📝 Contratos App-Odoo', scope: 'ambos', content: (
        <div>
          <p style={HS}>Contratos de comunicación App ↔ Odoo</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#f3e5f5', borderRadius: '6px', padding: '10px' }}>
              <p style={{ fontWeight: 700, fontSize: '12px', margin: '0 0 8px', color: '#4a148c' }}>App → Odoo (acciones)</p>
              {[['registerManagement', '{ clienteId, tipo, notas, vendedorId }'], ['confirmRecovery', '{ clienteId, cargaId }'], ['requestSync', '{ userId, timestamp }']].map(([k, v], i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <p style={{ margin: '0 0 1px', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#7b1fa2' }}>{k}()</p>
                  <p style={{ margin: 0, fontSize: '10px', color: '#555' }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ background: '#e3f2fd', borderRadius: '6px', padding: '10px' }}>
              <p style={{ fontWeight: 700, fontSize: '12px', margin: '0 0 8px', color: '#1565C0' }}>Odoo → App (eventos)</p>
              {[['processUpload', '{ afiliados, alertas, notifs, kpisActualizados }'], ['detectDuplicate', '{ cargaId, mensaje }'], ['validateUpload', '{ columnas, afiliados, duplicados }']].map(([k, v], i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <p style={{ margin: '0 0 1px', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#1976d2' }}>{k}()</p>
                  <p style={{ margin: 0, fontSize: '10px', color: '#555' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'bordes', label: '⚠️ Casos borde', scope: 'ambos', content: (
        <div>
          <p style={HS}>Casos borde críticos</p>
          {[
            { caso: 'AFILIADO como número', riesgo: 'Afiliados con ceros iniciales se truncan', mitigacion: 'Forzar tipo TEXT en todas las lecturas de Excel. Regla documentada.' },
            { caso: 'Archivo duplicado', riesgo: 'Doble conteo de afiliados y alertas', mitigacion: 'Detección por hash del archivo. Estado → Duplicado. Sin cambios en datos.' },
            { caso: 'Recuperación marcada manualmente', riesgo: 'Cumplimiento inflado', mitigacion: 'Solo Excel posterior confirma recuperación real. No acepta acción manual.' },
            { caso: 'Vendedor sin afiliados asignados', riesgo: 'Metas vacías / sin datos', mitigacion: 'Dashboard muestra mensaje "Sin cartera asignada". KPIs en 0.' },
            { caso: 'Carga con columnas faltantes', riesgo: 'Procesamiento incompleto', mitigacion: 'Validación previa. Estado → Con errores. Detalle de columnas faltantes.' },
          ].map((it, i) => (
            <div key={i} style={{ background: i % 2 === 0 ? '#fff3e0' : '#fafafa', borderRadius: '6px', padding: '10px', marginBottom: '8px' }}>
              <p style={{ fontWeight: 700, fontSize: '12px', margin: '0 0 4px', color: '#E65100' }}>⚠️ {it.caso}</p>
              <p style={{ fontSize: '11px', color: '#555', margin: '0 0 3px' }}><strong>Riesgo:</strong> {it.riesgo}</p>
              <p style={{ fontSize: '11px', color: '#555', margin: 0 }}><strong>Mitigación:</strong> {it.mitigacion}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'criterios', label: '✅ Criterios de aceptación', scope: 'ambos', content: (
        <div>
          <p style={HS}>Criterios de aceptación del prototipo</p>
          <p style={{ fontWeight: 700, fontSize: '12px', margin: '0 0 8px', color: '#714B67' }}>App móvil:</p>
          {['Cartera cargada y filtrada por rol de usuario', 'Lista "Sin transar" refleja días desde último Excel', 'Meta y avance visibles por período', 'Gestión registrable con notas y tipo', 'Historial de actividad accesible'].map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: '#4CAF50', fontWeight: 700, fontSize: '14px' }}>✓</span>
              <span style={{ fontSize: '12px' }}>{c}</span>
            </div>
          ))}
          <p style={{ fontWeight: 700, fontSize: '12px', margin: '12px 0 8px', color: '#714B67' }}>Odoo Backend:</p>
          {['Menús superiores (sin sidebar)', 'KPIs Credicard por perfil de usuario', 'CargasScreen: Validar + Procesar + Simular duplicado funcional', 'Trazabilidad de operaciones visible en detalle de carga', 'Gestiones con chatter y notas', 'Sin Inventario / Almacén en este módulo'].map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: '#4CAF50', fontWeight: 700, fontSize: '14px' }}>✓</span>
              <span style={{ fontSize: '12px' }}>{c}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'checklist-app', label: '☑️ Checklist App', scope: 'app', content: (
        <div>
          <p style={HS}>Checklist de cobertura — App Móvil</p>
          {[
            ['✅', 'Autenticación y perfilado por rol (5 perfiles)'],
            ['✅', 'Header naranja CCRPOS con nombre y rol'],
            ['✅', 'Navegación inferior: Ventas / Clientes / Config/Equipo/Alertas / Facturas / Perfil'],
            ['✅', 'Tab Almacén eliminado — cumple restricción no-inventario'],
            ['✅', 'CCR/Admin: Tab Config con metas, agenda y mensajes'],
            ['✅', 'Supervisor: Tab Equipo con vista de vendedores y cumplimiento'],
            ['✅', 'Vendedor/Banco: Tab Alertas con alertas propias'],
            ['✅', 'Sub-tabs Clientes: Inicio / Cartera / Sin transar / Metas / Gestiones / Historial'],
            ['✅', 'Dashboard con KPIs diferenciados por perfil (etiquetas y colores distintos)'],
            ['✅', 'Lista de cartera con estado y días sin transar'],
            ['✅', 'Lista "Sin transar" con botón Registrar gestión'],
            ['✅', 'Metas con barra de progreso, cumplimiento % e historial 3 períodos'],
            ['✅', 'Historial de gestiones con estado y tipo'],
            ['✅', 'Historial de actividad (cargas + gestiones + notif)'],
            ['✅', 'Formulario de gestión (tipo + notas)'],
            ['✅', 'Advertencia recuperación real (regla R)'],
            ['⚠️', 'Notificaciones push (simuladas, no real en MVP)'],
            ['⚠️', 'Offline mode (no en MVP)'],
          ].map(([icn, txt], i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{icn}</span>
              <span style={{ fontSize: '12px', color: '#333' }}>{txt}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'checklist-odoo', label: '☑️ Checklist Odoo', scope: 'odoo', content: (
        <div>
          <p style={HS}>Checklist de cobertura — Odoo Backend</p>
          {[
            ['✅', 'Menú horizontal superior (sin sidebar) — 9 menús'],
            ['✅', 'Dashboard con KPIs y sincronización reciente'],
            ['✅', 'KPIs Credicard con semáforos, ranking y filtros por perfil'],
            ['✅', 'Cargas: TX-0001/0002/0003 con 7 estados completos'],
            ['✅', 'Cargas: Validar → Validado'],
            ['✅', 'Cargas: Procesar → Procesado + KPIs actualizados'],
            ['✅', 'Cargas: Simular duplicado → Duplicado sin cambios'],
            ['✅', 'Cartas: Mi Cartera + Por Banco/Agente'],
            ['✅', 'Cartera con historial antes/después TX'],
            ['✅', 'Alertas con filtros por nivel, vendedor, banco'],
            ['✅', 'Gestión Comercial: Fallas Técnicas + Problemas Resueltos'],
            ['✅', 'Gestiones con formulario + chatter + trazabilidad'],
            ['✅', 'Metas: Cumplimiento por Banco/Agente + Metas Incumplidas'],
            ['✅', 'Metas con barras de progreso e historial 3 períodos'],
            ['✅', 'Comunicaciones: Feedback MVP registrado'],
            ['✅', 'Facturación como módulo consultivo aparte'],
            ['✅', 'Configuración: Permisos por rol explícito'],
            ['✅', 'Configuración de umbrales de inactividad (parametrizables)'],
            ['❌', 'Sin Inventario · Sin Stock · Sin Transferencias · Sin Almacén'],
          ].map(([icn, txt], i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{icn}</span>
              <span style={{ fontSize: '12px', color: txt.startsWith('Sin') ? '#F44336' : '#333', fontWeight: txt.startsWith('Sin') ? 700 : 400 }}>{txt}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'auditoria', label: '🔍 Auditoría de cobertura', scope: 'ambos', content: (
        <div>
          <p style={HS}>Auditoría de cumplimiento — 40 checkpoints</p>
          {([
            [true, 'APP', 'App móvil existe con marco de teléfono (340×700px)'],
            [true, 'APP', 'Header naranja CCRPOS con nombre de usuario y rol'],
            [true, 'APP', 'Navegación inferior: 5 tabs (Ventas / Clientes / Config-Alertas-Equipo / Facturas / Perfil)'],
            [true, 'APP', 'Tab Almacén/Inventario eliminado (prohibido por reglas del módulo)'],
            [true, 'APP', 'Sub-tabs Clientes: Inicio / Cartera / Sin transar / Metas / Gestiones / Historial'],
            [true, 'APP', 'KPIs del dashboard filtrados y etiquetados por perfil (CCR / vendedor / supervisor / banco)'],
            [true, 'APP', 'CCR/Admin: Tab Config con metas asignables, priorización de agenda, mensajes simulados'],
            [true, 'APP', 'Supervisor: Tab Equipo con vista de equipo y cumplimiento por vendedor'],
            [true, 'APP', 'Vendedor/Banco: Tab Alertas con alertas propias filtradas'],
            [true, 'APP', 'Lista "Sin transar" con botón Registrar gestión funcional'],
            [true, 'APP', 'Metas con barra de progreso, cumplimiento %, historial 3 períodos'],
            [true, 'APP', 'Gestiones con formulario + registro + lista con estado y tipo'],
            [true, 'APP', 'Historial de actividad (cargas + gestiones + notif)'],
            [true, 'APP', 'Advertencia de recuperación real (solo por Excel posterior)'],
            [true, 'ODOO', 'Odoo con 9 menús en barra horizontal superior (sin sidebar)'],
            [true, 'ODOO', 'Dashboard con KPIs filtrados por rol y sincronización reciente'],
            [true, 'ODOO', 'KPIs Credicard implementado con semáforos, ranking y filtros por perfil'],
            [true, 'ODOO', 'Cargas TX: Cargas de Transacciones + Mi Cartera + Por Banco/Agente'],
            [true, 'ODOO', 'Cargas TX funcional con 7 estados (Borrador/Validado/Procesando/Procesado/Proc.advertencias/Duplicado/Con errores)'],
            [true, 'ODOO', 'Validar + Procesar + Simular duplicado funcionales con KPIs actualizados'],
            [true, 'ODOO', 'Cartera con historial antes/después TX (trazabilidad completa)'],
            [true, 'ODOO', 'Alertas con filtros por nivel, vendedor, banco y estado de gestión'],
            [true, 'ODOO', 'Gestión Comercial: Agenda + Gestiones + Fallas Técnicas + Problemas Resueltos'],
            [true, 'ODOO', 'Gestiones con formulario completo + chatter + trazabilidad'],
            [true, 'ODOO', 'Metas: Recuperación + Cumplimiento por Vendedor + Por Banco/Agente + Incumplidas'],
            [true, 'ODOO', 'Comunicaciones: Notificaciones + Plantillas + Canales + Feedback MVP'],
            [true, 'ODOO', 'Facturación como módulo consultivo separado (no mezclado con cartera)'],
            [true, 'ODOO', 'Configuración: Reglas inactividad + Permisos + Usuarios + Parámetros'],
            [true, 'ODOO', 'Pantalla Permisos con roles, accesos y módulos excluidos explícitos'],
            [true, 'COMP', 'ComparativaView renderiza App real y Odoo real a escala (65% y 48%)'],
            [true, 'COMP', '5 pasos navegables: carga → procesamiento → duplicado → gestión → recuperación'],
            [true, 'COMP', 'Indicadores de sync App→Odoo y Odoo→App en panel central'],
            [true, 'REG', 'Recuperación solo por Excel posterior — nunca por acción manual'],
            [true, 'REG', 'AFILIADO tratado como texto (no número) para preservar ceros iniciales'],
            [true, 'REG', 'Archivo duplicado detectado y no modifica cartera/metas/alertas'],
            [true, 'REG', 'Segregación: Banco nunca ve datos de otro banco'],
            [true, 'REG', 'No hay Inventario / Stock / Pickings / Transferencias / Almacén / Reposición en ninguna vista'],
            [true, 'GUIDE', 'Guía Dev con botón flotante always-on-display'],
            [true, 'GUIDE', 'Guía Dev con 20+ secciones interactivas, filtros y buscador'],
            [false, 'GUIDE', 'KPIs Credicard HTML original (portal no accesible — implementado desde doc técnico Módulo 2)'],
          ] as [boolean, string, string][]).map(([ok, scope, txt], i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontSize: '12px', flexShrink: 0 }}>{ok ? '✅' : '⚠️'}</span>
              <span style={{ ...S.badge(scope === 'APP' ? '#F57C00' : scope === 'ODOO' ? '#714B67' : scope === 'COMP' ? '#2196F3' : scope === 'REG' ? '#F44336' : '#888') as object, fontSize: '9px', padding: '1px 5px', flexShrink: 0 }}>{scope}</span>
              <span style={{ fontSize: '11px', color: ok ? '#333' : '#E65100', fontWeight: ok ? 400 : 600 }}>{String(i + 1).padStart(2, '0')}. {txt}</span>
            </div>
          ))}
          <div style={{ marginTop: '10px', background: '#fff3e0', border: '1px solid #FF9800', borderRadius: '6px', padding: '10px' }}>
            <p style={{ fontSize: '11px', color: '#E65100', margin: 0 }}>⚠️ Checkpoint 40: KPIs Credicard.html no accesible desde claudeusercontent.com. Para sincronizar diseño exacto, pegar el HTML del portal.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'fuera-alcance', label: '🚫 Fuera de alcance', scope: 'ambos', content: (
        <div>
          <p style={HS}>Fuera de alcance — Este prototipo MVP</p>
          <p style={PT}>Lo siguiente está explícitamente fuera del alcance del prototipo actual (Release 1 / MVP). Está planificado para releases posteriores o corresponde a otros módulos.</p>
          <div style={{ background: '#ffebee', border: '1px solid #F44336', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <p style={{ fontWeight: 700, fontSize: '12px', color: '#c62828', margin: '0 0 10px' }}>🚫 Prohibido en App (nunca implementar)</p>
            {['Cargar/validar/procesar Excel desde la app', 'Ver hash de archivo', 'Configurar reglas técnicas (10/15/30/45/60 días)', 'Configurar columnas del Excel', 'Configurar plantillas técnicas', 'Administrar permisos técnicos', 'Ver modelos, JSON, cron, ETL', 'Auditoría técnica completa', 'Inventario / Stock / Almacén / Pickings / Transferencias', 'Reposición de terminales / Solicitudes de equipos'].map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ color: '#F44336', fontWeight: 700, flexShrink: 0 }}>✗</span>
                <span style={{ fontSize: '11px', color: '#555' }}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff3e0', border: '1px solid #FF9800', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <p style={{ fontWeight: 700, fontSize: '12px', color: '#E65100', margin: '0 0 10px' }}>⏳ Planificado para Release 2</p>
            {['Notificaciones automáticas batch nocturno reales', 'Bloqueo automático de metas', 'Analytics avanzados y reportes personalizados', 'Motor de notificaciones completo (Módulo 4)', 'Modo offline total en app móvil', 'Sistema de tickets completo para feedback', 'Integración real con AS400 y SAP HANA', 'OTP SMS y correo de factura real (vs simulado)'].map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ color: '#FF9800', fontWeight: 700, flexShrink: 0 }}>⏳</span>
                <span style={{ fontSize: '11px', color: '#555' }}>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#e8f5e9', border: '1px solid #4CAF50', borderRadius: '8px', padding: '12px' }}>
            <p style={{ fontWeight: 700, fontSize: '12px', color: '#1b5e20', margin: '0 0 10px' }}>✅ Lo que SÍ hace el Usuario CCR en la app</p>
            {['Configurar y asignar metas de recuperación por vendedor', 'Priorizar la agenda comercial (por nivel de alerta)', 'Seleccionar vendedor/banco/agente para filtrar', 'Activar/desactivar mensajes simulados por canal', 'Visualizar cumplimiento global y ranking', 'Ver alertas relevantes y comportamiento de cartera', 'Registrar gestiones comerciales con notas'].map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ color: '#4CAF50', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '11px', color: '#555' }}>{it}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = SECTIONS.filter(s => {
    const matchFilter = filter === 'todos' || s.scope === filter || s.scope === 'ambos';
    const matchSearch = !search || s.label.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '900px', height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ background: '#714B67', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span style={{ fontSize: '20px' }}>📖</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, color: 'white', fontSize: '16px', fontWeight: 800 }}>Guía Dev — Gestión de Clientes CCR</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Prototipo CCRPOS · Módulo 2 · {SECTIONS.length} secciones · 40 checkpoints</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ background: '#f8f4f7', borderBottom: '1px solid #e8e0e8', padding: '10px 16px', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar sección..." style={{ padding: '5px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', width: '160px' }} />
          {(['todos', 'app', 'odoo', 'ambos'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '11px', fontWeight: filter === f ? 700 : 400, background: filter === f ? '#714B67' : '#eee', color: filter === f ? 'white' : '#555' }}>
              {f === 'todos' ? 'Todos' : f === 'app' ? '📱 App' : f === 'odoo' ? '🖥️ Odoo' : '⇄ Ambos'}
            </button>
          ))}
          <span style={{ fontSize: '11px', color: '#aaa', marginLeft: 'auto' }}>{filteredSections.length} secciones</span>
        </div>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: '220px', flexShrink: 0, borderRight: '1px solid #eee', overflowY: 'auto', padding: '8px 0' }}>
            {filteredSections.map(s => (
              <div key={s.id} onClick={() => setActiveSection(s.id)}
                style={{ padding: '8px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: activeSection === s.id ? 700 : 400, color: activeSection === s.id ? '#714B67' : '#555', background: activeSection === s.id ? '#f3eaf0' : 'transparent', borderLeft: activeSection === s.id ? '3px solid #714B67' : '3px solid transparent' }}>
                {s.label}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {filteredSections.find(s => s.id === activeSection)?.content || (
              <p style={{ color: '#aaa', fontSize: '13px' }}>Selecciona una sección de la lista.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════ VIEW SELECTOR ═══════════════════════════
function ViewSelector({ view, setView, user, setUser }: { view: AppView; setView: (v: AppView) => void; user: AppUser; setUser: (u: AppUser) => void }) {
  return (
    <div style={{ background: '#1a1a2e', padding: '0 16px', height: '44px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
      <span style={{ color: 'white', fontWeight: 800, fontSize: '13px', letterSpacing: '-0.2px' }}>CCRPOS</span>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>|</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {([['app', '📱 App Móvil'], ['odoo', '🖥️ Odoo Backend'], ['comparativa', '⇄ Comparativa']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setView(v)}
            style={{ padding: '5px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: view === v ? 700 : 400, background: view === v ? '#714B67' : 'rgba(255,255,255,0.08)', color: view === v ? 'white' : 'rgba(255,255,255,0.6)' }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <select value={user.id} onChange={e => setUser(USUARIOS.find(u => u.id === e.target.value) || USUARIOS[0])}
        style={{ padding: '4px 8px', borderRadius: '5px', border: 'none', fontSize: '11px', background: 'rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer' }}>
        {USUARIOS.map(u => <option key={u.id} value={u.id} style={{ background: '#333', color: 'white' }}>{u.badge} {u.nombre} ({ROL_LABELS[u.rol]})</option>)}
      </select>
    </div>
  );
}

// ═══════════════════════════ MAIN APP ═══════════════════════════
export default function App() {
  const [view, setView] = useState<AppView>('odoo');
  const [user, setUser] = useState<AppUser>(USUARIOS[0]);
  const [showGuide, setShowGuide] = useState(false);
  const [kpis, setKpis] = useState<SharedKPIs>(INIT_KPIS);
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>(INIT_SYNC);
  const [toast, setToast] = useState<string>('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3800); };

  const handleAction = (action: string, payload?: any) => {
    switch (action) {
      case 'validateUpload':
        showToast('✅ Archivo validado: columnas correctas · 498 afiliados únicos');
        break;
      case 'processUpload':
        setKpis(k => ({ ...k, cargas: k.cargas + 1, clientes: k.clientes + (payload?.afiliados || 2), sinTransar: k.sinTransar + 5, alertasNuevas: k.alertasNuevas + (payload?.alertas || 4), gestiones: k.gestiones }));
        setSyncEvents(ev => [{ id: 'sx' + Date.now(), tiempo: 'Ahora', tipo: 'Carga procesada', origen: 'odoo', descripcion: `${payload?.id || 'TX'} procesada · ${payload?.afiliados || '498'} afiliados · ${payload?.alertas || '36'} alertas · KPIs actualizados` }, ...ev.slice(0, 4)]);
        showToast('✅ Carga procesada · KPIs actualizados · Cartera y metas refrescadas');
        break;
      case 'detectDuplicate':
        setSyncEvents(ev => [{ id: 'sx' + Date.now(), tiempo: 'Ahora', tipo: 'Duplicado detectado', origen: 'odoo', descripcion: `${payload?.id || 'TX'} duplicado · Sin cambios · Cartera y metas intactas` }, ...ev.slice(0, 4)]);
        showToast('⚠️ Archivo duplicado detectado · Sin cambios en datos');
        break;
      case 'registerManagement':
        setKpis(k => ({ ...k, gestiones: k.gestiones + 1 }));
        setSyncEvents(ev => [{ id: 'sx' + Date.now(), tiempo: 'Ahora', tipo: 'Gestión registrada', origen: 'app', descripcion: `Gestión registrada para ${payload?.cliente || payload?.id || 'cliente'} · Alerta actualizada` }, ...ev.slice(0, 4)]);
        showToast('✅ Gestión registrada · Alerta actualizada · Chatter sincronizado');
        break;
      case 'confirmRecovery':
        setKpis(k => ({ ...k, recuperados: k.recuperados + 1, sinTransar: Math.max(0, k.sinTransar - 1), cumplimiento: Math.min(100, k.cumplimiento + 1) }));
        showToast('✅ Recuperación confirmada · Meta actualizada');
        break;
      case 'toast':
        if (payload?.msg) showToast(payload.msg);
        break;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <ViewSelector view={view} setView={setView} user={user} setUser={setUser} />

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {view === 'app' && (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8eaf0', overflow: 'auto', padding: '20px' }}>
            <MobileAppView user={user} kpis={kpis} onAction={handleAction} />
          </div>
        )}
        {view === 'odoo' && (
          <OdooBackendTyped user={user} onAction={handleAction} kpis={kpis} syncEvents={syncEvents} />
        )}
        {view === 'comparativa' && (
          <ComparativaView user={user} kpis={kpis} syncEvents={syncEvents} onAction={handleAction} />
        )}
      </div>

      <button onClick={() => setShowGuide(true)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#714B67', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 16px rgba(113,75,103,0.5)', zIndex: 8888, display: 'flex', alignItems: 'center', gap: '6px' }}>
        📖 Guía Dev
      </button>

      {toast && (
        <div style={{ position: 'fixed', bottom: '80px', right: '24px', background: '#323232', color: 'white', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 9999, maxWidth: '360px', lineHeight: '1.4' }}>
          {toast}
        </div>
      )}

      {showGuide && <DevGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}
