# Guía de Implementación: Módulo Almacenes (CCRPOS + Odoo 19)

Esta guía define las especificaciones técnicas y funcionales para el desarrollo del módulo Almacenes/Inventario dentro de la aplicación CCRPOS, integrándose con el backend maestro Odoo 19 Enterprise.

---

## 1. Resumen Ejecutivo
El módulo **Almacenes** es una capa operativa dentro de CCRPOS. Odoo 19 Enterprise es el backend maestro (productos, almacenes, ubicaciones, seriales, stock, pickings, trazabilidad, permisos). La App facilita la experiencia operativa: creación de solicitudes, gestión de inventario disponible y distribuciones. La App no reemplaza el ERP.

---

## 2. Alcance y Fuera de Alcance

| Área | Alcance | Fuera de Alcance |
| :--- | :--- | :--- |
| **App** | Menú por permisos, Solicitudes multiproducto, Aprobaciones, Disponibilidad, Distribución, Tracking. | Crear productos/almacenes, validar pickings nativos, configurar permisos/aprobadores, modificar stock directamente. |
| **Odoo** | Modelos `ccr.*`, Matriz de aprobación, Pickings único por sol., Transferencias por origen, Estados nativos. | Integración SAP HANA, reglas complejas regionales/bancarias, automatizaciones de reabastecimiento complejo. |

---

## 3. Mapa del Proceso
1.  **Solicitudes:** App → Pedir equipos → Solicitud → Odoo → Matriz Aprobación → Picking Único → Validación nativa Odoo.
2.  **Disponibilidad:** App → Disponibilidad → Producto → Seriales → Odoo Stock Real.
3.  **Distribución:** App → Distribución seleccionados → Odoo → Transferencias por almacén origen → Validación nativa Odoo.

> **Advertencia:** La App y las solicitudes no validan pickings. La validación ocurre exclusivamente en el documento nativo de Odoo.

---

## 4. Roles y Permisos (Acumulables)
*   **Solicitante:** Crear/ver solicitudes, tracking, disponibilidad.
*   **Aprobador:** Aprobar/rechazar/ajustar solicitudes (no propias).
*   **Super Aprobador:** Aprobar casos especiales, desbloquear urgencias.
*   **Administrador:** Configurar matriz de aprobación, auditar, reasignar.
*   **Distribuidor:** Crear/gestionar distribuciones, transferencias internas.

---

## 5. Flujo de Solicitudes
*   **App:** Formulario multiproducto (secciones separadas Equipos/SIM), indicación de entrega, dirección (si aplica), comentario. Envío síncrono.
*   **Odoo:** Genera `ccr.equipment.request`, busca aprobador en matriz, asigna estado inicial, chatter.

---

## 6. Flujo de Aprobaciones
*   **App:** Bandeja con filtros (Pendientes, Aprobadas, etc.), edición individual por línea (sin sobrescribir solicitud original), botones Aprobar/Rechazar/Ajustar.
*   **Odoo:** Registro histórico, diferencia aprobado/solicitado, chatter, estado Aprobada con ajustes.

---

## 7. Disponibilidad
*   **App:** Vista agrupada por producto/almacén, estados (Disponible, Bajo stock, No disponible), detalle de seriales individuales.
*   **Odoo:** Fuente de verdad del stock real (`stock.quant`, `product.product`, `stock.lot`).

---

## 8. Distribución
*   **App:** Selección de seriales (individual o "Seleccionar todos"), indicación almacén destino, generación de transferencias, guardado en borrador.
*   **Odoo:** Modelo `ccr.distribution`, generación automática de una transferencia por cada almacén origen.

---

## 9. Modelos Odoo Requeridos
*   `ccr.equipment.request`
*   `ccr.equipment.request.line`
*   `ccr.approval.assignment`
*   `ccr.distribution`
*   `ccr.distribution.line`
*   *Relaciones:* `stock.picking`, `stock.move`, `stock.lot`, `product.product`.

---

## 10. Responsabilidades del Desarrollador (Checklist)

### Desarrollador App (CCRPOS)
- [ ] Menú Almacenes según permisos.
- [ ] Formulario multiproducto separado (Equipos/SIM).
- [ ] Edición por línea en Aprobaciones.
- [ ] Selección de seriales (solo Distribuidor).
- [ ] Navegación y persistencia de Distribución en borrador.
- [ ] Mostrar errores de sincronización sin confirmar antes de tiempo.

### Desarrollador Odoo
- [ ] Modelos `ccr.*` y seguridad/grupos.
- [ ] Matriz de aprobación y chatter.
- [ ] Generación automática de picking único por solicitud.
- [ ] Generación automática de transferencias por origen en Distribución.
- [ ] Exposición segura de disponibilidad y seriales.
- [ ] Auditoría nativa de cambios.
