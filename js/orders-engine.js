/**
 * NOGADÍSIMA — ORDER MANAGEMENT & PROFIT ENGINE (TAB 3)
 * Exact verified business data: 95 verified client orders
 * Financial & Operational metrics:
 *  - Ventas Totales: $86,625.00 MXN across 332 chiles
 *  - Inversión Insumos: $24,983.50 MXN
 *  - Ganancia Generada (Utilidad Bruta): $61,641.50 MXN (Margen: 71.2%)
 *  - Gastos de la Ganancia (Retiros Realizados): $2,008.30 MXN (Ryoshi $1,653.30, Ninja $270.00, Estacionamiento $85.00)
 *  - Ganancia Neta Disponible (Remanente): $59,633.20 MXN
 *  - Cobranza: Cobrado $81,355.00 (86 pagados) / Por Cobrar $5,270.00 (9 no pagados)
 *  - Pipeline: 13 chiles pendientes por preparar/entregar (5 pedidos activos) / 319 chiles completados (90 entregados)
 * 
 * Interactive Drill-Down Quick Filter Engine:
 *  - Por Preparar: 13 piezas (5 pedidos) -> prepStatus === 'No preparado'
 *  - Por Entregar: 13 piezas (5 pedidos) -> deliveryStatus === 'No entregado'
 *  - Por Cobrar: $5,270.00 MXN (9 pedidos) -> paidStatus === 'No pagado'
 *  - Cobrado: $81,355.00 MXN (86 pedidos) -> paidStatus === 'Pagado'
 *  - Total Ventas / Pedidos: $86,625.00 MXN (95 pedidos) -> reset all filters
 */

(function () {
  'use strict';

  // 1. Exact 95 Verified Master Seed Records
  const INITIAL_ORDERS = [
    { id: 1, customer: "Crespón 13B", orderDate: "2026-07-30", prodDate: "2026-07-31", deliveryDate: "2026-08-02", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" },
    { id: 2, customer: "Daniel", orderDate: "2026-07-30", prodDate: "2026-07-31", deliveryDate: "2026-08-01", qty: 0, price: 0, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Se juntará en paquete de 4" },
    { id: 3, customer: "Luis", orderDate: "2026-07-30", prodDate: "2026-07-31", deliveryDate: "2026-08-03", qty: 6, price: 1590, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 4, customer: "Telmex", orderDate: "2026-07-30", prodDate: "2026-07-31", deliveryDate: "2026-08-03", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 5, customer: "Yamel", orderDate: "2026-08-02", prodDate: "2026-07-31", deliveryDate: "2026-08-04", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 6, customer: "Telmex", orderDate: "2026-07-30", prodDate: "2026-08-03", deliveryDate: "2026-08-05", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 7, customer: "Kassian", orderDate: "2026-08-02", prodDate: "2026-08-03", deliveryDate: "2026-08-07", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 8, customer: "Daniel/Ale", orderDate: "2026-08-01", prodDate: "2026-08-03", deliveryDate: "2026-08-08", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Se juntan con 1 de Daniel" },
    { id: 9, customer: "Pao Bosque Real", orderDate: "2026-08-03", prodDate: "2026-08-03", deliveryDate: "2026-08-06", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 10, customer: "Carlos", orderDate: "2026-08-05", prodDate: "2026-08-03", deliveryDate: "2026-08-07", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 11, customer: "Sader", orderDate: "2026-08-05", prodDate: "2026-08-03", deliveryDate: "2026-08-07", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 12, customer: "Zule", orderDate: "2026-08-06", prodDate: "2026-08-06", deliveryDate: "2026-08-07", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 13, customer: "Pelayo", orderDate: "2026-08-06", prodDate: "2026-08-08", deliveryDate: "2026-08-12", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 14, customer: "Rafael Morat", orderDate: "2026-08-07", prodDate: "2026-08-08", deliveryDate: "2026-08-08", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 15, customer: "Tec", orderDate: "2026-08-07", prodDate: "2026-08-08", deliveryDate: "2026-08-10", qty: 3, price: 820, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 16, customer: "Tec", orderDate: "2026-08-07", prodDate: "2026-08-08", deliveryDate: "2026-08-10", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 17, customer: "Tec", orderDate: "2026-08-07", prodDate: "2026-08-08", deliveryDate: "2026-08-10", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 18, customer: "Tec", orderDate: "2026-08-07", prodDate: "2026-08-08", deliveryDate: "2026-08-10", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 19, customer: "Kassian", orderDate: "2026-08-09", prodDate: "2026-08-08", deliveryDate: "2026-08-11", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 20, customer: "Kassian", orderDate: "2026-08-09", prodDate: "", deliveryDate: "2026-08-15", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 21, customer: "Rafael Morat", orderDate: "2026-08-09", prodDate: "2026-08-10", deliveryDate: "2026-08-11", qty: 5, price: 1330, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 22, customer: "Daniel", orderDate: "2026-08-10", prodDate: "", deliveryDate: "2026-08-15", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 23, customer: "Perla", orderDate: "2026-08-11", prodDate: "", deliveryDate: "2026-09-12", qty: 20, price: 4550, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 24, customer: "Alicia Kassian", orderDate: "2026-08-12", prodDate: "", deliveryDate: "2026-08-16", qty: 6, price: 1590, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 25, customer: "Tec", orderDate: "2026-08-13", prodDate: "", deliveryDate: "2026-08-17", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 26, customer: "Tec", orderDate: "2026-08-13", prodDate: "", deliveryDate: "2026-08-17", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 27, customer: "Liz Bosque Real", orderDate: "2026-08-14", prodDate: "", deliveryDate: "2026-08-14", qty: 6, price: 1590, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 28, customer: "Benja", orderDate: "2026-08-14", prodDate: "", deliveryDate: "2026-08-15", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 29, customer: "Luis", orderDate: "2026-08-14", prodDate: "", deliveryDate: "2026-08-14", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 30, customer: "Pao Bosque Real", orderDate: "2026-08-14", prodDate: "", deliveryDate: "2026-08-15", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 31, customer: "Pelayo", orderDate: "2026-08-15", prodDate: "2026-08-17", deliveryDate: "2026-08-19", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 32, customer: "Kassian", orderDate: "2026-08-16", prodDate: "2026-08-17", deliveryDate: "2026-08-18", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 33, customer: "Kassian", orderDate: "2026-08-16", prodDate: "2026-08-17", deliveryDate: "2026-08-21", qty: 6, price: 1590, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 34, customer: "Deye", orderDate: "2026-08-16", prodDate: "", deliveryDate: "2026-08-25", qty: 5, price: 1500, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "5 + Uber" },
    { id: 35, customer: "Abud", orderDate: "2026-08-14", prodDate: "2026-08-15", deliveryDate: "2026-08-16", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 36, customer: "Ana", orderDate: "2026-08-15", prodDate: "", deliveryDate: "2026-08-28", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Angy" },
    { id: 37, customer: "Ceci Mundo E", orderDate: "2026-08-17", prodDate: "", deliveryDate: "2026-08-22", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 38, customer: "Yola", orderDate: "2026-08-18", prodDate: "", deliveryDate: "2026-08-22", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 39, customer: "Caludia Luis Cabrera", orderDate: "2026-08-13", prodDate: "", deliveryDate: "2026-08-23", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 40, customer: "Esteban Salesforce", orderDate: "2026-08-13", prodDate: "", deliveryDate: "2026-08-24", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 41, customer: "Silvia", orderDate: "2026-08-19", prodDate: "2026-08-17", deliveryDate: "2026-08-20", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 43, customer: "Betty Calle Angy", orderDate: "2026-08-19", prodDate: "", deliveryDate: "2026-08-22", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 44, customer: "Mechis", orderDate: "2026-08-22", prodDate: "", deliveryDate: "2026-08-29", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 45, customer: "Sergio", orderDate: "2026-08-20", prodDate: "", deliveryDate: "2026-08-24", qty: 22, price: 5000, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 46, customer: "Kassian", orderDate: "2026-08-23", prodDate: "", deliveryDate: "2026-08-30", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 47, customer: "Crespón 13B", orderDate: "2026-08-25", prodDate: "", deliveryDate: "2026-08-29", qty: 2, price: 585, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 48, customer: "Cuadro", orderDate: "2026-08-26", prodDate: "", deliveryDate: "2026-08-31", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 49, customer: "Yammel", orderDate: "2026-08-27", prodDate: "", deliveryDate: "2026-08-31", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 50, customer: "Rox", orderDate: "2026-08-27", prodDate: "", deliveryDate: "2026-08-31", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 51, customer: "Ale Gay", orderDate: "2026-08-27", prodDate: "", deliveryDate: "2026-08-31", qty: 1, price: 250, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 52, customer: "Doctora Tec", orderDate: "2026-08-27", prodDate: "", deliveryDate: "2026-08-31", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 53, customer: "Debbie", orderDate: "2026-08-27", prodDate: "", deliveryDate: "2026-08-31", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 54, customer: "Rafael Morat", orderDate: "2026-08-27", prodDate: "", deliveryDate: "2026-08-28", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 55, customer: "Benjamin", orderDate: "2026-08-27", prodDate: "", deliveryDate: "2026-08-31", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 56, customer: "Robin", orderDate: "2026-08-27", prodDate: "", deliveryDate: "2026-08-29", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 57, customer: "Crespón 13B", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-15", qty: 10, price: 2600, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 58, customer: "Daniel", orderDate: "2026-08-30", prodDate: "", deliveryDate: "2026-09-12", qty: 4, price: 1050, paidStatus: "No pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" },
    { id: 59, customer: "Claudia", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-04", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 60, customer: "Chela", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-16", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 61, customer: "Telmex", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-04", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 62, customer: "Lety Covarrubias", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-06", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 63, customer: "Irma Hoyo", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-10", qty: 8, price: 2100, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 64, customer: "Juan Tapia", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-11", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" },
    { id: 65, customer: "Fran", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-10", qty: 1, price: 200, paidStatus: "No pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" },
    { id: 66, customer: "Dani Adrián", orderDate: "2026-09-04", prodDate: "", deliveryDate: "2026-09-15", qty: 7, price: 1870, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 67, customer: "Karla Luis", orderDate: "2026-09-04", prodDate: "", deliveryDate: "2026-09-11", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" },
    { id: 68, customer: "Kassian", orderDate: "2026-09-03", prodDate: "", deliveryDate: "2026-09-06", qty: 6, price: 1590, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 69, customer: "Rafael Morat", orderDate: "2026-09-04", prodDate: "", deliveryDate: "2026-09-05", qty: 3, price: 820, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 70, customer: "Kassian", orderDate: "2026-09-09", prodDate: "", deliveryDate: "2026-09-10", qty: 3, price: 820, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 71, customer: "Bulldogs", orderDate: "2026-09-10", prodDate: "", deliveryDate: "2026-09-12", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 72, customer: "Emmy", orderDate: "2026-09-11", prodDate: "", deliveryDate: "2026-09-15", qty: 4, price: 1050, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 73, customer: "Abue", orderDate: "2026-09-11", prodDate: "", deliveryDate: "2026-09-24", qty: 6, price: 1500, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 74, customer: "Gaby", orderDate: "2026-09-13", prodDate: "", deliveryDate: "2026-09-15", qty: 5, price: 1330, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 75, customer: "Crespón 18B", orderDate: "2026-09-11", prodDate: "", deliveryDate: "2026-09-16", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 76, customer: "Yann Tik tok", orderDate: "2026-09-13", prodDate: "", deliveryDate: "2026-09-15", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 77, customer: "Alfonso Abdala", orderDate: "2026-09-14", prodDate: "", deliveryDate: "2026-09-15", qty: 8, price: 2100, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 78, customer: "Sader", orderDate: "2026-09-14", prodDate: "", deliveryDate: "2026-09-25", qty: 1, price: 280, paidStatus: "No pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" },
    { id: 79, customer: "Lety Covarrubias", orderDate: "2026-09-17", prodDate: "", deliveryDate: "2026-09-19", qty: 8, price: 2130, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Efectivo" },
    { id: 80, customer: "Tec", orderDate: "2026-09-18", prodDate: "", deliveryDate: "2026-09-18", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 81, customer: "Tec", orderDate: "2026-09-18", prodDate: "", deliveryDate: "2026-09-21", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 82, customer: "Tec", orderDate: "2026-09-18", prodDate: "", deliveryDate: "2026-09-21", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 83, customer: "Tec", orderDate: "2026-09-18", prodDate: "", deliveryDate: "2026-09-21", qty: 1, price: 280, paidStatus: "No pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" },
    { id: 84, customer: "Tec", orderDate: "2026-09-18", prodDate: "", deliveryDate: "2026-09-24", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 85, customer: "Gaby Cacho", orderDate: "2026-09-18", prodDate: "", deliveryDate: "2026-09-24", qty: 8, price: 2000, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 86, customer: "Pelayo", orderDate: "2026-09-20", prodDate: "", deliveryDate: "2026-09-21", qty: 4, price: 1050, paidStatus: "No pagado", deliveryStatus: "No entregado", prepStatus: "No preparado", notes: "Faltan 2" },
    { id: 87, customer: "Leo", orderDate: "2026-09-20", prodDate: "", deliveryDate: "2026-09-21", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 88, customer: "Mario", orderDate: "2026-09-21", prodDate: "", deliveryDate: "2026-09-23", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 89, customer: "Luis", orderDate: "2026-09-21", prodDate: "", deliveryDate: "2026-09-23", qty: 1, price: 280, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" },
    { id: 90, customer: "Seguro", orderDate: "2026-09-21", prodDate: "", deliveryDate: "2026-09-25", qty: 7, price: 1960, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 91, customer: "Suzy", orderDate: "2026-09-22", prodDate: "", deliveryDate: "2026-09-26", qty: 2, price: 540, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "Revolut" },
    { id: 92, customer: "Silvia", orderDate: "2026-09-22", prodDate: "", deliveryDate: "2026-09-25", qty: 2, price: 540, paidStatus: "No pagado", deliveryStatus: "No entregado", prepStatus: "No preparado", notes: "" },
    { id: 93, customer: "Tec", orderDate: "2026-09-25", prodDate: "", deliveryDate: "2026-09-30", qty: 1, price: 280, paidStatus: "No pagado", deliveryStatus: "No entregado", prepStatus: "No preparado", notes: "" },
    { id: 94, customer: "Abue", orderDate: "2026-09-27", prodDate: "", deliveryDate: "2026-09-30", qty: 2, price: 540, paidStatus: "No pagado", deliveryStatus: "No entregado", prepStatus: "No preparado", notes: "" },
    { id: 95, customer: "Ale del Alto", orderDate: "2026-09-28", prodDate: "", deliveryDate: "2026-09-30", qty: 4, price: 1050, paidStatus: "No pagado", deliveryStatus: "No entregado", prepStatus: "No preparado", notes: "" },
    { id: 96, customer: "Nuestros", orderDate: "2026-08-06", prodDate: "2026-08-08", deliveryDate: "2026-08-08", qty: 2, price: 400, paidStatus: "Pagado", deliveryStatus: "Entregado", prepStatus: "Preparado", notes: "" }
  ];

  // 2. Base Seed Records for Profit Expenses / Withdrawals (Personal Draws)
  const INITIAL_PROFIT_EXPENSES = [
    { id: 1, concept: "Estacionamiento", amount: 85.00 },
    { id: 2, concept: "Ryoshi", amount: 1653.30 },
    { id: 3, concept: "Ninja", amount: 270.00 }
  ];

  // Expose seed datasets for unified database initialization
  window.INITIAL_ORDERS = INITIAL_ORDERS;
  window.INITIAL_PROFIT_EXPENSES = INITIAL_PROFIT_EXPENSES;

  // Financial baseline constants
  const INSUMOS_COST = 24983.50; // Inversión en Insumos oficial

  const STORAGE_KEY_ORDERS = 'nogadisima_orders_v3';
  const STORAGE_KEY_PROFIT_EXP = 'nogadisima_profit_expenses_v1';

  // Currency Formatter
  function formatMoney(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Orders State Store
  const OrdersApp = {
    orders: [],
    profitExpenses: [],
    filters: {
      search: '',
      paid: 'Todos',       // 'Todos', 'Pagado', 'No pagado'
      delivery: 'Todos',   // 'Todos', 'Entregado', 'No entregado'
      prep: 'Todos',       // 'Todos', 'Preparado', 'No preparado'
      activeQuickFilter: null // 'all', 'unprepped', 'undelivered', 'unpaid', 'paid'
    },
    pagination: {
      currentPage: 1,
      perPage: 20
    },

    init: function () {
      this.loadFromStorage();
      this.loadProfitExpensesFromStorage();
      this.render();

      if (window.NogaStore) {
        window.NogaStore.setOrders(this.orders, 'orders-init', false);
        window.NogaStore.setProfitDraws(this.profitExpenses, 'orders-init', false);

        // React immediately to any investment changes in "Inversión & Gastos"
        window.NogaStore.on('investment:changed', () => {
          this.render();
        });

        // React to storage sync
        window.NogaStore.on('orders:changed', (payload) => {
          if (payload && payload.source === 'cross-tab-storage' && payload.orders) {
            this.orders = payload.orders;
            this.render();
          }
        });

        window.NogaStore.on('profitDraws:changed', (payload) => {
          if (payload && payload.source === 'cross-tab-storage' && payload.draws) {
            this.profitExpenses = payload.draws;
            this.render();
          }
        });
      }
    },

    loadFromStorage: function () {
      try {
        if (window.NogaStore) {
          const stored = window.NogaStore.getOrders();
          if (Array.isArray(stored)) {
            this.orders = stored;
            return;
          }
        }
        const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.orders = parsed;
            return;
          }
        }
      } catch (e) {
        console.warn('OrdersApp: error reading orders from localStorage', e);
      }
      this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
      this.saveToStorage(false);
    },

    saveToStorage: function (notify = true) {
      try {
        if (window.NogaStore) {
          window.NogaStore.setOrders(this.orders, 'orders-module', notify);
        } else {
          localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
        }
      } catch (e) {
        console.warn('OrdersApp: error saving orders to localStorage', e);
      }
    },

    loadProfitExpensesFromStorage: function () {
      try {
        if (window.NogaStore) {
          const stored = window.NogaStore.getProfitDraws();
          if (Array.isArray(stored)) {
            this.profitExpenses = stored;
            return;
          }
        }
        const stored = localStorage.getItem(STORAGE_KEY_PROFIT_EXP);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.profitExpenses = parsed;
            return;
          }
        }
      } catch (e) {
        console.warn('OrdersApp: error reading profit expenses from localStorage', e);
      }
      this.profitExpenses = JSON.parse(JSON.stringify(INITIAL_PROFIT_EXPENSES));
      this.saveProfitExpensesToStorage(false);
    },

    saveProfitExpensesToStorage: function (notify = true) {
      try {
        if (window.NogaStore) {
          window.NogaStore.setProfitDraws(this.profitExpenses, 'orders-module', notify);
        } else {
          localStorage.setItem(STORAGE_KEY_PROFIT_EXP, JSON.stringify(this.profitExpenses));
        }
      } catch (e) {
        console.warn('OrdersApp: error saving profit expenses to localStorage', e);
      }
    },

    // Financial & Operational Metrics Calculation (Direct & Pure Live Reactivity)
    getMetrics: function () {
      const all = this.orders;

      const totalRevenue = all.reduce((s, o) => s + (Number(o.price) || 0), 0);
      const totalChiles = all.reduce((s, o) => s + (Number(o.qty) || 0), 0);

      // Cobranza
      const unpaidOrders = all.filter(o => o.paidStatus === 'No pagado');
      const paidOrders = all.filter(o => o.paidStatus === 'Pagado');
      const unpaid = unpaidOrders.reduce((s, o) => s + (Number(o.price) || 0), 0);
      const collected = totalRevenue - unpaid;

      // Ganancia Generada (Utilidad Bruta): Ventas Totales - Inversión Insumos (Dynamic from NogaStore)
      const insumosCost = (window.NogaStore && typeof window.NogaStore.getGlobalMetrics === 'function')
        ? window.NogaStore.getGlobalMetrics().totalInsumos
        : INSUMOS_COST;
      const grossProfit = totalRevenue - insumosCost;
      const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

      // Total Gastado de la Ganancia (Retiros / Gastos Personales)
      const totalProfitSpent = this.profitExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

      // Ganancia Neta Disponible (Remanente): Ganancia Generada - Total Gastado
      const availableProfit = grossProfit - totalProfitSpent;
      const availableMargin = totalRevenue > 0 ? (availableProfit / totalRevenue) * 100 : 0;

      // Pipeline & Operational Drill-Down Metrics
      const unpreppedOrders = all.filter(o => o.prepStatus === 'No preparado');
      const unpreppedChiles = unpreppedOrders.reduce((s, o) => s + (Number(o.qty) || 0), 0);
      const unpreppedCount = unpreppedOrders.length;

      const undeliveredOrders = all.filter(o => o.deliveryStatus === 'No entregado');
      const undeliveredChiles = undeliveredOrders.reduce((s, o) => s + (Number(o.qty) || 0), 0);
      const undeliveredCount = undeliveredOrders.length;

      const preppedOrders = all.filter(o => o.prepStatus === 'Preparado');
      const preppedCount = preppedOrders.length;

      const deliveredOrders = all.filter(o => o.deliveryStatus === 'Entregado');
      const deliveredCount = deliveredOrders.length;

      const pendingChiles = undeliveredChiles;
      const completedChiles = totalChiles - pendingChiles;

      const paidCount = paidOrders.length;
      const unpaidCount = unpaidOrders.length;

      return {
        totalOrders: all.length,
        totalRevenue,
        totalChiles,
        insumosCost,
        grossProfit,
        grossMargin,
        totalProfitSpent,
        availableProfit,
        availableMargin,
        collected,
        unpaid,
        paidCount,
        unpaidCount,
        delivCount: deliveredCount,
        notDelivCount: undeliveredCount,
        prepCount: preppedCount,
        notPrepCount: unpreppedCount,
        unpreppedChiles,
        unpreppedCount,
        undeliveredChiles,
        undeliveredCount,
        pendingChiles,
        completedChiles,
        avgTicket: all.length > 0 ? totalRevenue / all.length : 0
      };
    },

    // Filter Pipeline
    getFilteredOrders: function () {
      const q = (this.filters.search || '').trim().toLowerCase();
      const p = this.filters.paid;
      const d = this.filters.delivery;
      const pr = this.filters.prep;

      return this.orders.filter(item => {
        if (p !== 'Todos' && item.paidStatus !== p) return false;
        if (d !== 'Todos' && item.deliveryStatus !== d) return false;
        if (pr !== 'Todos' && item.prepStatus !== pr) return false;

        if (q) {
          const matchCust = (item.customer || '').toLowerCase().includes(q);
          const matchNotes = (item.notes || '').toLowerCase().includes(q);
          const matchId = String(item.id).includes(q);
          if (!matchCust && !matchNotes && !matchId) return false;
        }
        return true;
      });
    },

    // Main Render Coordinator
    render: function () {
      this.renderKpiCards();
      this.renderPipelinePills();
      this.renderFilterPills();
      this.renderTable();
      this.renderProfitExpenses();
    },

    // 1. Financial KPI Cards Renderer (Live & Reactive)
    renderKpiCards: function () {
      const m = this.getMetrics();

      // Card 1: Ganancia Generada (Utilidad Bruta) ($61,641.50 • 71.2%)
      const grossProfitEl = document.getElementById('ord-kpi-gross-profit');
      const grossMarginEl = document.getElementById('ord-kpi-gross-margin');
      const grossProgressEl = document.getElementById('ord-kpi-gross-progress');
      const grossSubEl = document.getElementById('ord-kpi-gross-sub');
      if (grossProfitEl) grossProfitEl.textContent = formatMoney(m.grossProfit);
      if (grossMarginEl) grossMarginEl.textContent = `${m.grossMargin.toFixed(1)}%`;
      if (grossProgressEl) grossProgressEl.style.width = `${Math.min(100, Math.max(0, m.grossMargin)).toFixed(1)}%`;
      if (grossSubEl) grossSubEl.textContent = `Ventas (${formatMoney(m.totalRevenue)}) - Inversión (${formatMoney(m.insumosCost)})`;

      // Card 2: Ganancia Neta Disponible ($59,633.20)
      const netProfitEl = document.getElementById('ord-kpi-net-profit');
      const netSubEl = document.getElementById('ord-kpi-net-sub');
      const spentProfitEl = document.getElementById('ord-kpi-spent-profit');
      if (netProfitEl) netProfitEl.textContent = formatMoney(m.availableProfit);
      if (netSubEl) netSubEl.textContent = `Ganancia (${formatMoney(m.grossProfit)}) - Gastado (${formatMoney(m.totalProfitSpent)})`;
      if (spentProfitEl) spentProfitEl.textContent = `${formatMoney(m.totalProfitSpent)} MXN`;

      // Card 3: Ventas Totales (Facturación) ($86,625.00 • 332 chiles)
      const totalRevEl = document.getElementById('ord-kpi-total-revenue');
      const totalRevSubEl = document.getElementById('ord-kpi-total-sub');
      const avgTicketEl = document.getElementById('ord-kpi-avg-ticket');
      if (totalRevEl) totalRevEl.textContent = formatMoney(m.totalRevenue);
      if (totalRevSubEl) totalRevSubEl.textContent = `${m.totalChiles} chiles colocados (${m.totalOrders} comandas)`;
      if (avgTicketEl) avgTicketEl.textContent = formatMoney(m.avgTicket);

      // Card 4: Cobranza (Cobrado $81,355.00 vs. Por Cobrar $5,270.00)
      const collectedEl = document.getElementById('ord-kpi-collected');
      const paidPillsEl = document.getElementById('ord-kpi-paid-pills');
      const unpaidPillsEl = document.getElementById('ord-kpi-unpaid-pills');
      const collectionRateEl = document.getElementById('ord-kpi-collection-rate');
      if (collectedEl) collectedEl.textContent = formatMoney(m.collected);
      if (paidPillsEl) paidPillsEl.textContent = `${formatMoney(m.collected)} (${m.paidCount} pagados)`;
      if (unpaidPillsEl) unpaidPillsEl.textContent = `${formatMoney(m.unpaid)} (${m.unpaidCount} no pagados)`;
      if (collectionRateEl) {
        const rate = m.totalRevenue > 0 ? (m.collected / m.totalRevenue) * 100 : 0;
        collectionRateEl.textContent = `${rate.toFixed(1)}% efectividad`;
      }
    },

    // 2. Kitchen & Logistics Pipeline & Quick Filters Renderer
    renderPipelinePills: function () {
      const m = this.getMetrics();
      const qf = this.filters.activeQuickFilter;

      // 1. Text Metrics
      const unpreppedChilesEl = document.getElementById('pipe-unprepped-chiles');
      const unpreppedOrdersEl = document.getElementById('pipe-unprepped-orders');
      const undeliveredChilesEl = document.getElementById('pipe-undelivered-chiles');
      const undeliveredOrdersEl = document.getElementById('pipe-undelivered-orders');
      const unpaidAmountEl = document.getElementById('pipe-unpaid-amount');
      const unpaidOrdersEl = document.getElementById('pipe-unpaid-orders');
      const paidAmountEl = document.getElementById('pipe-paid-amount');
      const paidOrdersEl = document.getElementById('pipe-paid-orders');
      const completedBadgeEl = document.getElementById('pipe-completed-chiles-badge');
      const extrasAmountEl = document.getElementById('pipe-extras-amount');

      if (unpreppedChilesEl) unpreppedChilesEl.textContent = m.unpreppedChiles;
      if (unpreppedOrdersEl) unpreppedOrdersEl.textContent = `${m.unpreppedCount} pedidos activos`;
      if (undeliveredChilesEl) undeliveredChilesEl.textContent = m.undeliveredChiles;
      if (undeliveredOrdersEl) undeliveredOrdersEl.textContent = `${m.undeliveredCount} pedidos activos`;
      if (unpaidAmountEl) unpaidAmountEl.textContent = formatMoney(m.unpaid);
      if (unpaidOrdersEl) unpaidOrdersEl.textContent = `${m.unpaidCount} pedidos por cobrar`;
      if (paidAmountEl) paidAmountEl.textContent = formatMoney(m.collected);
      if (paidOrdersEl) paidOrdersEl.textContent = `${m.paidCount} pedidos pagados`;
      if (completedBadgeEl) completedBadgeEl.textContent = `${m.completedChiles} listos (${m.delivCount} pedidos)`;
      if (extrasAmountEl) extrasAmountEl.textContent = `${formatMoney(m.totalProfitSpent)} MXN`;

      // 2. Interactive Card Highlights & Specular Rings
      const cardAll = document.getElementById('card-filter-all');
      const cardUnprepped = document.getElementById('card-filter-unprepped');
      const cardUndelivered = document.getElementById('card-filter-undelivered');
      const cardUnpaid = document.getElementById('card-filter-unpaid');
      const cardPaid = document.getElementById('card-filter-paid');

      const badgeAll = document.getElementById('badge-filter-all');
      if (badgeAll) {
        if (qf) {
          badgeAll.textContent = 'Limpiar Filtro';
          badgeAll.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold liquid-pill-active font-numeric cursor-pointer shadow-xs transition-all';
        } else {
          badgeAll.textContent = '95 Pedidos';
          badgeAll.className = 'px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 text-slate-700 border border-slate-200/80 font-numeric';
        }
      }

      if (cardAll) {
        if (!qf) {
          cardAll.className = "liquid-card p-5 sm:p-6 flex flex-col justify-between cursor-pointer hover:bg-white/80 transition-all duration-200 group select-none";
        } else {
          cardAll.className = "liquid-card p-5 sm:p-6 flex flex-col justify-between cursor-pointer opacity-95 ring-2 ring-slate-800/40 bg-white/90 shadow-md scale-[1.01] transition-all duration-200 group select-none";
        }
      }

      const indUnprepped = document.getElementById('indicator-filter-unprepped');
      const indUndelivered = document.getElementById('indicator-filter-undelivered');
      const indUnpaid = document.getElementById('indicator-filter-unpaid');
      const indPaid = document.getElementById('indicator-filter-paid');

      const baseCard = "p-4 rounded-2xl flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 select-none backdrop-blur-md";

      if (cardUnprepped) {
        cardUnprepped.className = (qf === 'unprepped')
          ? `${baseCard} ring-2 ring-amber-500/80 ring-offset-2 ring-offset-amber-50/50 bg-amber-50/90 border border-amber-300 shadow-lg scale-[1.02]`
          : `${baseCard} bg-white/40 border border-white/70 hover:bg-white/70 hover:shadow-md hover:scale-[1.01]`;
        if (indUnprepped) indUnprepped.classList.toggle('hidden', qf !== 'unprepped');
      }

      if (cardUndelivered) {
        cardUndelivered.className = (qf === 'undelivered')
          ? `${baseCard} ring-2 ring-rose-500/80 ring-offset-2 ring-offset-rose-50/50 bg-rose-50/90 border border-rose-300 shadow-lg scale-[1.02]`
          : `${baseCard} bg-white/40 border border-white/70 hover:bg-white/70 hover:shadow-md hover:scale-[1.01]`;
        if (indUndelivered) indUndelivered.classList.toggle('hidden', qf !== 'undelivered');
      }

      if (cardUnpaid) {
        cardUnpaid.className = (qf === 'unpaid')
          ? `${baseCard} ring-2 ring-amber-600/80 ring-offset-2 ring-offset-amber-50/50 bg-amber-50/90 border border-amber-400 shadow-lg scale-[1.02]`
          : `${baseCard} bg-white/40 border border-white/70 hover:bg-white/70 hover:shadow-md hover:scale-[1.01]`;
        if (indUnpaid) indUnpaid.classList.toggle('hidden', qf !== 'unpaid');
      }

      if (cardPaid) {
        cardPaid.className = (qf === 'paid')
          ? `${baseCard} ring-2 ring-emerald-500/80 ring-offset-2 ring-offset-emerald-50/50 bg-emerald-50/90 border border-emerald-300 shadow-lg scale-[1.02]`
          : `${baseCard} bg-white/40 border border-white/70 hover:bg-white/70 hover:shadow-md hover:scale-[1.01]`;
        if (indPaid) indPaid.classList.toggle('hidden', qf !== 'paid');
      }

      // Highlight pills inside Card 4 (Cobranza)
      const pillPaid = document.getElementById('pill-filter-paid');
      const pillUnpaid = document.getElementById('pill-filter-unpaid');
      if (pillPaid) {
        if (qf === 'paid') {
          pillPaid.className = "inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-600 text-white border border-emerald-700 font-extrabold shadow-sm transition-all";
        } else {
          pillPaid.className = "inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100/90 hover:bg-emerald-200/90 text-emerald-800 border border-emerald-200 transition-all font-bold cursor-pointer";
        }
      }
      if (pillUnpaid) {
        if (qf === 'unpaid') {
          pillUnpaid.className = "inline-flex items-center px-2.5 py-1 rounded-md bg-amber-600 text-white border border-amber-700 font-extrabold shadow-sm transition-all";
        } else {
          pillUnpaid.className = "inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100/90 hover:bg-amber-200/90 text-amber-800 border border-amber-200 transition-all font-bold cursor-pointer";
        }
      }

      // 3. Drill-down banner in Section C
      const bannerEl = document.getElementById('ord-drilldown-banner');
      const bannerTextEl = document.getElementById('ord-drilldown-text');
      if (bannerEl && bannerTextEl) {
        if (!qf || qf === 'all') {
          bannerEl.classList.add('hidden');
          bannerEl.classList.remove('flex');
        } else {
          bannerEl.classList.remove('hidden');
          bannerEl.classList.add('flex');
          if (qf === 'unprepped') {
            bannerTextEl.textContent = `Filtro activo: Pendientes de preparación (${m.unpreppedChiles} chiles)`;
          } else if (qf === 'undelivered') {
            bannerTextEl.textContent = `Filtro activo: Pendientes de entrega (${m.undeliveredChiles} chiles)`;
          } else if (qf === 'unpaid') {
            bannerTextEl.textContent = `Filtro activo: Por cobrar (${formatMoney(m.unpaid)} MXN • ${m.unpaidCount} pedidos)`;
          } else if (qf === 'paid') {
            bannerTextEl.textContent = `Filtro activo: Cobrado (${formatMoney(m.collected)} MXN • ${m.paidCount} pedidos)`;
          } else {
            bannerTextEl.textContent = `Filtro activo personalizado`;
          }
        }
      }
    },

    // 3. Quick Drill-Down Filter Action
    quickFilter: function (type) {
      // Toggle off if clicking the already active quick filter
      if (this.filters.activeQuickFilter === type) {
        type = 'all';
      }

      if (type === 'all') {
        this.filters.paid = 'Todos';
        this.filters.delivery = 'Todos';
        this.filters.prep = 'Todos';
        this.filters.search = '';
        this.filters.activeQuickFilter = null;
        const searchInput = document.getElementById('ord-search-input');
        if (searchInput) searchInput.value = '';
        if (window.showToast) window.showToast('Mostrando todas las comandas (95 pedidos)', 'info');
      } else if (type === 'unprepped') {
        this.filters.paid = 'Todos';
        this.filters.delivery = 'Todos';
        this.filters.prep = 'No preparado';
        this.filters.activeQuickFilter = 'unprepped';
        if (window.showToast) window.showToast('Filtrando pedidos pendientes de cocina', 'info');
      } else if (type === 'undelivered') {
        this.filters.paid = 'Todos';
        this.filters.delivery = 'No entregado';
        this.filters.prep = 'Todos';
        this.filters.activeQuickFilter = 'undelivered';
        if (window.showToast) window.showToast('Filtrando pedidos pendientes de entrega', 'info');
      } else if (type === 'unpaid') {
        this.filters.paid = 'No pagado';
        this.filters.delivery = 'Todos';
        this.filters.prep = 'Todos';
        this.filters.activeQuickFilter = 'unpaid';
        if (window.showToast) window.showToast('Filtrando pedidos pendientes de cobro', 'info');
      } else if (type === 'paid') {
        this.filters.paid = 'Pagado';
        this.filters.delivery = 'Todos';
        this.filters.prep = 'Todos';
        this.filters.activeQuickFilter = 'paid';
        if (window.showToast) window.showToast('Filtrando pedidos pagados', 'info');
      }

      this.pagination.currentPage = 1;
      this.render();
    },

    // 4. Multi-Category Filter Pills Bar
    renderFilterPills: function () {
      const m = this.getMetrics();

      // Payment Filter Pills
      const paidOptions = [
        { label: `Todos (${m.totalOrders})`, val: 'Todos' },
        { label: `Pagado (${m.paidCount})`, val: 'Pagado' },
        { label: `No pagado (${m.unpaidCount})`, val: 'No pagado' }
      ];
      const paidContainer = document.getElementById('ord-filter-pills-paid');
      if (paidContainer) {
        paidContainer.innerHTML = paidOptions.map(opt => {
          const active = (this.filters.paid === opt.val);
          return `
            <button onclick="OrdersApp.setFilter('paid', '${opt.val}')"
              class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${active ? 'liquid-pill-active' : 'liquid-pill hover:bg-white/70'}">
              ${opt.label}
            </button>
          `;
        }).join('');
      }

      // Preparation Filter Pills
      const prepOptions = [
        { label: `Todos (${m.totalOrders})`, val: 'Todos' },
        { label: `Preparado (${m.prepCount})`, val: 'Preparado' },
        { label: `No preparado (${m.notPrepCount})`, val: 'No preparado' }
      ];
      const prepContainer = document.getElementById('ord-filter-pills-prep');
      if (prepContainer) {
        prepContainer.innerHTML = prepOptions.map(opt => {
          const active = (this.filters.prep === opt.val);
          return `
            <button onclick="OrdersApp.setFilter('prep', '${opt.val}')"
              class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${active ? 'liquid-pill-active' : 'liquid-pill hover:bg-white/70'}">
              ${opt.label}
            </button>
          `;
        }).join('');
      }

      // Delivery Filter Pills
      const delivOptions = [
        { label: `Todos (${m.totalOrders})`, val: 'Todos' },
        { label: `Entregado (${m.delivCount})`, val: 'Entregado' },
        { label: `No entregado (${m.notDelivCount})`, val: 'No entregado' }
      ];
      const delivContainer = document.getElementById('ord-filter-pills-delivery');
      if (delivContainer) {
        delivContainer.innerHTML = delivOptions.map(opt => {
          const active = (this.filters.delivery === opt.val);
          return `
            <button onclick="OrdersApp.setFilter('delivery', '${opt.val}')"
              class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${active ? 'liquid-pill-active' : 'liquid-pill hover:bg-white/70'}">
              ${opt.label}
            </button>
          `;
        }).join('');
      }
    },

    setFilter: function (key, value) {
      this.filters[key] = value;

      // Synchronize activeQuickFilter indicator
      if (this.filters.prep === 'No preparado' && this.filters.delivery === 'Todos' && this.filters.paid === 'Todos') {
        this.filters.activeQuickFilter = 'unprepped';
      } else if (this.filters.delivery === 'No entregado' && this.filters.prep === 'Todos' && this.filters.paid === 'Todos') {
        this.filters.activeQuickFilter = 'undelivered';
      } else if (this.filters.paid === 'No pagado' && this.filters.prep === 'Todos' && this.filters.delivery === 'Todos') {
        this.filters.activeQuickFilter = 'unpaid';
      } else if (this.filters.paid === 'Pagado' && this.filters.prep === 'Todos' && this.filters.delivery === 'Todos') {
        this.filters.activeQuickFilter = 'paid';
      } else if (this.filters.paid === 'Todos' && this.filters.delivery === 'Todos' && this.filters.prep === 'Todos') {
        this.filters.activeQuickFilter = null;
      } else {
        this.filters.activeQuickFilter = 'custom';
      }

      this.pagination.currentPage = 1;
      this.render();
    },

    setSearch: function (query) {
      this.filters.search = query;
      this.pagination.currentPage = 1;
      this.renderTable();
    },

    resetFilters: function () {
      this.filters.search = '';
      this.filters.paid = 'Todos';
      this.filters.delivery = 'Todos';
      this.filters.prep = 'Todos';
      this.filters.activeQuickFilter = null;
      const searchInput = document.getElementById('ord-search-input');
      if (searchInput) searchInput.value = '';
      this.pagination.currentPage = 1;
      this.render();
      if (window.showToast) window.showToast('Filtros de pedidos restablecidos', 'info');
    },

    // 5. Orders Table Renderer (12 Columns)
    renderTable: function () {
      const container = document.getElementById('orders-table-body');
      if (!container) return;

      const filtered = this.getFilteredOrders();
      const totalFiltered = filtered.length;
      const perPage = this.pagination.perPage;
      const totalPages = perPage === 'all' ? 1 : Math.ceil(totalFiltered / perPage) || 1;

      if (this.pagination.currentPage > totalPages) {
        this.pagination.currentPage = totalPages;
      }
      const currentPage = this.pagination.currentPage;

      let itemsToDisplay = filtered;
      if (perPage !== 'all') {
        const start = (currentPage - 1) * perPage;
        itemsToDisplay = filtered.slice(start, start + perPage);
      }

      // Summary label / Active Filter Pill
      const summaryEl = document.getElementById('ord-filter-summary');
      if (summaryEl) {
        const subtotal = filtered.reduce((s, o) => s + (Number(o.price) || 0), 0);
        const subChiles = filtered.reduce((s, o) => s + (Number(o.qty) || 0), 0);
        const isFilterActive = !!(this.filters.activeQuickFilter || this.filters.paid !== 'Todos' || this.filters.delivery !== 'Todos' || this.filters.prep !== 'Todos' || (this.filters.search && this.filters.search.trim().length > 0));

        if (isFilterActive) {
          summaryEl.innerHTML = `
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200/90 shadow-xs text-slate-800 text-xs font-semibold backdrop-blur-md">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Mostrando <strong class="text-slate-900 font-extrabold font-numeric">${totalFiltered}</strong> resultados (${subChiles} chiles)</span>
              <button onclick="OrdersApp.quickFilter('all')" class="ml-1 px-2.5 py-0.5 rounded-full liquid-pill-active hover:bg-white text-[11px] font-bold transition-all cursor-pointer shadow-xs" title="Ver todas las comandas">
                Ver todos
              </button>
            </span>`;
        } else {
          summaryEl.innerHTML = `<span class="text-xs text-slate-500 font-numeric">Mostrando ${itemsToDisplay.length} de ${totalFiltered} comandas (${subChiles} chiles • ${formatMoney(subtotal)})</span>`;
        }
      }

      if (itemsToDisplay.length === 0) {
        const activeYear = (window.NogaStore ? window.NogaStore.getActiveYear() : '2026');
        const isSeasonEmpty = (this.orders.length === 0);

        let emptyTitle = isSeasonEmpty 
          ? `No hay pedidos registrados para la temporada ${activeYear}`
          : 'No se encontraron comandas';
        let emptyDesc = isSeasonEmpty
          ? `No hay pedidos registrados para la temporada ${activeYear}. Registra el primer pedido para activar la producción.`
          : 'Ajusta los filtros o busca por nombre de cliente.';
        let emptyAction = isSeasonEmpty
          ? `<button onclick="openNewOrderModal()" class="mt-3 px-4 py-2 text-xs font-semibold liquid-btn-dark shadow-sm">
               + Registrar Pedido
             </button>`
          : `<button onclick="OrdersApp.quickFilter('all')" class="mt-2 px-4 py-2 text-xs font-semibold liquid-btn-dark shadow-sm">
               Ver todas las comandas (${this.orders.length})
             </button>`;

        if (!isSeasonEmpty) {
          if (this.filters.activeQuickFilter === 'unprepped') {
            emptyTitle = '¡Todo preparado en cocina!';
            emptyDesc = 'No hay pedidos pendientes de elaboración.';
          } else if (this.filters.activeQuickFilter === 'undelivered') {
            emptyTitle = '¡Todo entregado en ruta!';
            emptyDesc = 'No hay comandas pendientes de despacho.';
          } else if (this.filters.activeQuickFilter === 'unpaid') {
            emptyTitle = '¡Cobranza 100% al día!';
            emptyDesc = 'No hay comandas pendientes de cobro.';
          }
        }

        container.innerHTML = `
          <tr>
            <td colspan="12" class="py-12 text-center text-slate-500">
              <div class="max-w-md mx-auto space-y-2">
                <p class="font-bold text-slate-800 text-sm">${emptyTitle}</p>
                <p class="text-xs text-slate-500 leading-relaxed">${emptyDesc}</p>
                ${emptyAction}
              </div>
            </td>
          </tr>
        `;
        this.renderPagination(0, 0, 0);
        return;
      }

      let rowsHtml = '';
      itemsToDisplay.forEach((item) => {
        const isPaid = (item.paidStatus === 'Pagado');
        const isPrepped = (item.prepStatus === 'Preparado');
        const isDelivered = (item.deliveryStatus === 'Entregado');

        // Status Pills with interactive toggle
        const paidPill = isPaid
          ? `<button onclick="OrdersApp.togglePaid(${item.id})" title="Clic para marcar como No pagado"
              class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-all font-numeric">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Pagado</span>
             </button>`
          : `<button onclick="OrdersApp.togglePaid(${item.id})" title="Clic para marcar como Pagado"
              class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100/90 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-all font-numeric">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>No pagado</span>
             </button>`;

        const prepPill = isPrepped
          ? `<button onclick="OrdersApp.togglePrep(${item.id})" title="Clic para marcar como No preparado"
              class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/80 text-slate-800 border border-slate-300 hover:bg-white transition-all font-numeric">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
              <span>Preparado</span>
             </button>`
          : `<button onclick="OrdersApp.togglePrep(${item.id})" title="Clic para marcar como Preparado"
              class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100/90 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-all font-numeric">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>No preparado</span>
             </button>`;

        const delivPill = isDelivered
          ? `<button onclick="OrdersApp.toggleDelivery(${item.id})" title="Clic para marcar como No entregado"
              class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-all font-numeric">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Entregado</span>
             </button>`
          : `<button onclick="OrdersApp.toggleDelivery(${item.id})" title="Clic para marcar como Entregado"
              class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100/90 text-rose-800 border border-rose-300 hover:bg-rose-200 transition-all font-numeric">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>No entregado</span>
             </button>`;

        rowsHtml += `
          <tr class="liquid-table-row group">
            <!-- 1. # ID -->
            <td class="py-2.5 px-3 text-left font-numeric font-bold text-slate-400 text-xs w-12">
              #${item.id}
            </td>

            <!-- 2. Cliente / Contacto -->
            <td class="py-2.5 px-2 text-left">
              <input type="text" value="${escapeHtml(item.customer)}"
                onchange="OrdersApp.updateField(${item.id}, 'customer', this.value)"
                class="w-full liquid-input px-2.5 py-1 text-xs font-bold text-slate-900">
            </td>

            <!-- 3. Fecha Pedido -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              <input type="date" value="${escapeHtml(item.orderDate || '')}"
                onchange="OrdersApp.updateField(${item.id}, 'orderDate', this.value)"
                class="liquid-input px-2 py-1 text-[11px] text-slate-700 font-numeric">
            </td>

            <!-- 4. Fecha Producción -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              <input type="date" value="${escapeHtml(item.prodDate || '')}"
                onchange="OrdersApp.updateField(${item.id}, 'prodDate', this.value)"
                class="liquid-input px-2 py-1 text-[11px] text-slate-700 font-numeric">
            </td>

            <!-- 5. Fecha Entrega -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              <input type="date" value="${escapeHtml(item.deliveryDate || '')}"
                onchange="OrdersApp.updateField(${item.id}, 'deliveryDate', this.value)"
                class="liquid-input px-2 py-1 text-[11px] font-bold text-slate-900 font-numeric">
            </td>

            <!-- 6. Cant. (Chiles) -->
            <td class="py-2.5 px-2 text-right w-20">
              <input type="number" min="0" step="1" value="${item.qty}"
                onchange="OrdersApp.updateField(${item.id}, 'qty', parseInt(this.value, 10) || 0)"
                class="w-full text-right liquid-input px-2 py-1 text-xs font-extrabold text-slate-900 font-numeric">
            </td>

            <!-- 7. Total ($ MXN) -->
            <td class="py-2.5 px-2 text-right w-28">
              <input type="number" min="0" step="any" value="${item.price}"
                onchange="OrdersApp.updateField(${item.id}, 'price', parseFloat(this.value) || 0)"
                class="w-full text-right liquid-input px-2 py-1 text-xs sm:text-sm font-extrabold text-slate-900 font-numeric">
            </td>

            <!-- 8. Estatus Pago -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              ${paidPill}
            </td>

            <!-- 9. Preparación -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              ${prepPill}
            </td>

            <!-- 10. Entrega -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              ${delivPill}
            </td>

            <!-- 11. Notas / Pago -->
            <td class="py-2.5 px-2 text-left">
              <input type="text" value="${escapeHtml(item.notes || '')}"
                placeholder="Revolut, Efectivo..."
                onchange="OrdersApp.updateField(${item.id}, 'notes', this.value)"
                class="w-full liquid-input px-2 py-1 text-[11px] text-slate-600">
            </td>

            <!-- 12. Acciones -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              <button onclick="OrdersApp.deleteOrder(${item.id})" title="Eliminar comanda"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50/60 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </td>
          </tr>
        `;
      });

      container.innerHTML = rowsHtml;
      this.renderPagination(totalFiltered, totalPages, currentPage);
    },

    // 6. Pagination Controller
    renderPagination: function (totalItems, totalPages, currentPage) {
      const container = document.getElementById('orders-pagination-container');
      if (!container) return;

      if (totalItems === 0 || totalPages <= 1) {
        container.innerHTML = `<div class="text-xs text-slate-500 font-numeric">Total: ${totalItems} pedidos</div>`;
        return;
      }

      container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full text-xs">
          <div class="text-slate-500 font-numeric">
            Página <span class="font-bold text-slate-800">${currentPage}</span> de <span class="font-bold text-slate-800">${totalPages}</span> (${totalItems} comandas)
          </div>
          <div class="flex items-center space-x-1.5">
            <button onclick="OrdersApp.changePage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled class="px-2.5 py-1 rounded-lg text-slate-300 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-slate-700 bg-white/70 hover:bg-white border border-white/80 shadow-sm transition-all"'} >
              Anterior
            </button>
            <span class="px-2 font-numeric font-bold text-slate-700">${currentPage}</span>
            <button onclick="OrdersApp.changePage(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled class="px-2.5 py-1 rounded-lg text-slate-300 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-slate-700 bg-white/70 hover:bg-white border border-white/80 shadow-sm transition-all"'} >
              Siguiente
            </button>
          </div>
        </div>
      `;
    },

    changePage: function (newPage) {
      this.pagination.currentPage = newPage;
      this.renderTable();
    },

    setPerPage: function (num) {
      this.pagination.perPage = num === 'all' ? 'all' : parseInt(num, 10);
      this.pagination.currentPage = 1;
      this.renderTable();
    },

    // 7. Direct Field Mutations & Status Toggles (Two-Way Reactive Synchronization)
    updateField: function (id, field, value) {
      const order = this.orders.find(o => o.id === id);
      if (!order) return;

      order[field] = value;
      this.saveToStorage();
      this.render();
    },

    togglePaid: function (id) {
      const order = this.orders.find(o => o.id === id);
      if (!order) return;

      order.paidStatus = (order.paidStatus === 'Pagado') ? 'No pagado' : 'Pagado';
      this.saveToStorage();
      this.render();

      if (window.showToast) {
        window.showToast(`Comanda #${id} marcada como ${order.paidStatus}`, 'info');
      }
    },

    togglePrep: function (id) {
      const order = this.orders.find(o => o.id === id);
      if (!order) return;

      order.prepStatus = (order.prepStatus === 'Preparado') ? 'No preparado' : 'Preparado';
      this.saveToStorage();
      this.render();

      if (window.showToast) {
        window.showToast(`Comanda #${id} marcada como ${order.prepStatus}`, 'info');
      }
    },

    toggleDelivery: function (id) {
      const order = this.orders.find(o => o.id === id);
      if (!order) return;

      order.deliveryStatus = (order.deliveryStatus === 'Entregado') ? 'No entregado' : 'Entregado';
      this.saveToStorage();
      this.render();

      if (window.showToast) {
        window.showToast(`Comanda #${id} marcada como ${order.deliveryStatus}`, 'info');
      }
    },

    deleteOrder: function (id) {
      const idx = this.orders.findIndex(o => o.id === id);
      if (idx === -1) return;

      const deleted = this.orders.splice(idx, 1)[0];
      this.saveToStorage();
      this.render();

      if (window.showToast) {
        window.showToast(`Comanda de "${deleted.customer}" eliminada`, 'warning');
      }
    },

    addNewOrder: function (orderData) {
      const maxId = this.orders.reduce((max, o) => Math.max(max, Number(o.id) || 0), 0);
      const newId = maxId + 1;

      const newOrder = {
        id: newId,
        customer: orderData.customer || 'Nuevo Cliente',
        orderDate: orderData.orderDate || new Date().toISOString().slice(0, 10),
        prodDate: orderData.prodDate || '',
        deliveryDate: orderData.deliveryDate || new Date().toISOString().slice(0, 10),
        qty: parseInt(orderData.qty, 10) || 1,
        price: parseFloat(orderData.price) || 280,
        paidStatus: orderData.paidStatus || 'No pagado',
        prepStatus: orderData.prepStatus || 'No preparado',
        deliveryStatus: orderData.deliveryStatus || 'No entregado',
        notes: orderData.notes || ''
      };

      this.orders.unshift(newOrder);
      this.saveToStorage();
      this.pagination.currentPage = 1;
      this.render();

      if (window.showToast) {
        window.showToast(`Comanda #${newId} registrada exitosamente para ${newOrder.customer}`, 'info');
      }
    },

    // 8. Section D: Profit Expenses / Personal Draws Management
    renderProfitExpenses: function () {
      const container = document.getElementById('profit-expenses-table-body');
      const countEl = document.getElementById('profit-expenses-count');
      const genEl = document.getElementById('profit-exp-generated');
      const spentEl = document.getElementById('profit-exp-total-spent');
      const availEl = document.getElementById('profit-exp-available');
      const footerTotalEl = document.getElementById('profit-expenses-footer-total');

      const m = this.getMetrics();

      if (countEl) countEl.textContent = `${this.profitExpenses.length} ${this.profitExpenses.length === 1 ? 'Retiro' : 'Retiros'}`;
      if (genEl) genEl.textContent = formatMoney(m.grossProfit);
      if (spentEl) spentEl.textContent = formatMoney(m.totalProfitSpent);
      if (availEl) availEl.textContent = formatMoney(m.availableProfit);
      if (footerTotalEl) footerTotalEl.textContent = formatMoney(m.totalProfitSpent);

      if (!container) return;

      if (this.profitExpenses.length === 0) {
        container.innerHTML = `
          <tr>
            <td colspan="3" class="py-8 text-center text-slate-500">
              <p class="font-bold text-slate-700 text-xs">No hay retiros de ganancia registrados</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Toda la ganancia generada (${formatMoney(m.grossProfit)}) está íntegramente disponible.</p>
              <button onclick="OrdersApp.addProfitExpense()" class="mt-2.5 px-3 py-1.5 text-xs font-semibold liquid-btn-dark">
                + Registrar Gasto de Ganancia
              </button>
            </td>
          </tr>
        `;
        return;
      }

      let html = '';
      this.profitExpenses.forEach(item => {
        html += `
          <tr class="liquid-table-row group">
            <!-- 1. Concepto / Destino -->
            <td class="py-2.5 px-4 text-left">
              <input type="text" id="profit-exp-concept-${item.id}" value="${escapeHtml(item.concept)}"
                placeholder="Ej. Ryoshi, Ninja, Estacionamiento..."
                onchange="OrdersApp.updateProfitExpense(${item.id}, 'concept', this.value)"
                class="w-full liquid-input px-3 py-1.5 text-xs font-semibold text-slate-800">
            </td>

            <!-- 2. Monto ($ MXN) -->
            <td class="py-2.5 px-3 text-right w-48">
              <div class="relative flex items-center justify-end">
                <span class="text-slate-400 text-xs font-bold mr-1">$</span>
                <input type="number" step="0.5" min="0" value="${Number(item.amount).toFixed(2)}"
                  onchange="OrdersApp.updateProfitExpense(${item.id}, 'amount', parseFloat(this.value) || 0)"
                  class="w-36 text-right liquid-input px-2.5 py-1.5 text-xs font-extrabold font-numeric text-amber-700">
              </div>
            </td>

            <!-- 3. Acciones -->
            <td class="py-2.5 px-3 text-center w-20">
              <button onclick="OrdersApp.deleteProfitExpense(${item.id})" title="Eliminar registro"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50/60 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </td>
          </tr>
        `;
      });

      container.innerHTML = html;
    },

    addProfitExpense: function (concept = '', amount = 0) {
      const maxId = this.profitExpenses.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);
      const newId = maxId + 1;
      this.profitExpenses.push({
        id: newId,
        concept: concept || 'Nuevo Retiro',
        amount: parseFloat(amount) || 0
      });
      this.saveProfitExpensesToStorage();
      this.render();
      if (window.showToast) {
        window.showToast('Gasto de ganancia agregado', 'info');
      }
      setTimeout(() => {
        const input = document.getElementById(`profit-exp-concept-${newId}`);
        if (input) {
          input.focus();
          input.select();
        }
      }, 50);
    },

    updateProfitExpense: function (id, field, value) {
      const item = this.profitExpenses.find(e => e.id === id);
      if (!item) return;
      item[field] = value;
      this.saveProfitExpensesToStorage();
      this.renderKpiCards();
      this.renderPipelinePills();
      this.renderProfitExpenses();
    },

    deleteProfitExpense: function (id) {
      const idx = this.profitExpenses.findIndex(e => e.id === id);
      if (idx === -1) return;
      const deleted = this.profitExpenses.splice(idx, 1)[0];
      this.saveProfitExpensesToStorage();
      this.render();
      if (window.showToast) {
        window.showToast(`Registro "${deleted.concept}" eliminado`, 'warning');
      }
    },

    // 9. Reset to Audited Baseline Data
    resetToSeedData: function () {
      this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
      this.profitExpenses = JSON.parse(JSON.stringify(INITIAL_PROFIT_EXPENSES));
      this.saveToStorage();
      this.saveProfitExpensesToStorage();
      this.resetFilters();
      if (window.showToast) {
        window.showToast('Base de pedidos y retiros de ganancia restaurados al registro oficial ($86,625.00 MXN / 332 chiles)', 'info');
      }
    },

    // 10. Export to CSV (Includes Fecha Producción)
    exportCsv: function () {
      const list = this.orders;
      let csv = '\uFEFF'; // UTF-8 BOM
      csv += 'ID,Cliente / Contacto,Fecha Pedido,Fecha Producción,Fecha Entrega,Cantidad (Chiles),Total ($ MXN),Estatus Pago,Preparación,Entrega,Notas\n';

      list.forEach(o => {
        const cleanCust = `"${(o.customer || '').replace(/"/g, '""')}"`;
        const cleanNotes = `"${(o.notes || '').replace(/"/g, '""')}"`;
        csv += `${o.id},${cleanCust},${o.orderDate || ''},${o.prodDate || ''},${o.deliveryDate || ''},${o.qty},${o.price},${o.paidStatus},${o.prepStatus},${o.deliveryStatus},${cleanNotes}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Nogadisima_Control_Pedidos_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.showToast) {
        window.showToast('Archivo CSV de pedidos descargado exitosamente', 'info');
      }
    }
  };

  // Expose globally
  window.OrdersApp = OrdersApp;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => OrdersApp.init());
  } else {
    OrdersApp.init();
  }
})();
