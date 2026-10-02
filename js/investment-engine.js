/**
 * NOGADÍSIMA — INVESTMENT & EXPENSES ENGINE (INVERSIÓN & GASTOS)
 * Financial Cutoff Engine, Credit Card Cycles, Reconciliation & State Management
 * Total Audited Baseline: $26,579.75 MXN (108 real business records)
 * Funding Sources: Nogadísima, Digs, Angy, Otros (Aportes Externos / Terceros)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. REAL SEED DATA (STRICT DATA FIDELITY — 108 RECORDS)
  // =========================================================================
  const INITIAL_INVESTMENTS = [
    // NOGADÍSIMA (Business Capital - Agosto 2026 - $6,094.50)
    { id: 1, source: "Nogadísima", store: "Mercado Libre", product: "Bolsas blancas", price: 208, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 2, source: "Nogadísima", store: "Mercado Libre", product: "Papel encerado", price: 130, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 3, source: "Nogadísima", store: "Goplas", product: "Envases plástico", price: 250, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 4, source: "Nogadísima", store: "Mercado", product: "Granada", price: 100, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 5, source: "Nogadísima", store: "Mercado", product: "Chiles", price: 100, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 6, source: "Nogadísima", store: "Mercado Mixcoac", product: "Granada mercado Mixcoac", price: 50, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 7, source: "Nogadísima", store: "Local", product: "Etiquetas", price: 130, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 8, source: "Nogadísima", store: "Lumen", product: "Lumen", price: 140.5, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 9, source: "Nogadísima", store: "Cuadro", product: "Chiles", price: 100, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 10, source: "Nogadísima", store: "Casetas", product: "Casetas Bosque Real", price: 63, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 11, source: "Nogadísima", store: "Cuadro", product: "Carne de puerco (1.4)", price: 160, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 12, source: "Nogadísima", store: "Tlalne", product: "Acitrón (1kg)", price: 125, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 13, source: "Nogadísima", store: "Tlalne", product: "Nuez (1kg)", price: 180, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 14, source: "Nogadísima", store: "Tlalne", product: "Duraznos en almíbar", price: 165, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 15, source: "Nogadísima", store: "Tlalne", product: "Piñón (1/2kg)", price: 280, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 16, source: "Nogadísima", store: "Tlalne", product: "Almendra (1kg)", price: 210, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 17, source: "Nogadísima", store: "Mercado", product: "Chile, granada, manzana, perejil", price: 443, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 18, source: "Nogadísima", store: "Goplas", product: "Envases plástico 150", price: 250, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 19, source: "Nogadísima", store: "Local", product: "Etiquetas", price: 130, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 20, source: "Nogadísima", store: "Local", product: "Carne de puerco (1.5)", price: 175, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 21, source: "Nogadísima", store: "Mercado", product: "Chiles y cebolla", price: 220, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 22, source: "Nogadísima", store: "Mercado", product: "Granada y manzana", price: 125, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 23, source: "Nogadísima", store: "Cuadro", product: "Carne de puerco", price: 145, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 24, source: "Nogadísima", store: "Cuadro", product: "Chiles", price: 180, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 25, source: "Nogadísima", store: "Cuadro", product: "Carne de puerco (1KG)", price: 120, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 26, source: "Nogadísima", store: "Atizapán", product: "Nuez y acitrón", price: 560, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 27, source: "Nogadísima", store: "Lumen/Varios", product: "Lumen, nuez, acitrón, almendra, etc.", price: 840, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 28, source: "Nogadísima", store: "Cuadro", product: "Chiles, perejil, manzana, carne", price: 280, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 29, source: "Nogadísima", store: "Goplas", product: "Goplas", price: 170, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 30, source: "Nogadísima", store: "Local", product: "Stickers", price: 65, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },

    // DIGS (Agosto 2026 - Pagado - $3,892.50)
    { id: 31, source: "Digs", store: "Tlalne", product: "Piñón, almendra y acitrón", price: 929, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 32, source: "Digs", store: "Lumen", product: "Tarjetas", price: 280.5, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 33, source: "Digs", store: "Bodegas", product: "Granada", price: 70, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 34, source: "Digs", store: "Local", product: "Bolsas blancas", price: 525, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 35, source: "Digs", store: "Local", product: "Listón", price: 253, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 36, source: "Digs", store: "Costco", product: "Carne res", price: 466, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 37, source: "Digs", store: "Rappi", product: "Perejil", price: 48, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 38, source: "Digs", store: "Walmart", product: "Crema, philadelphia, manzana y chiles", price: 227, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 39, source: "Digs", store: "La mimi", product: "Envases mimi", price: 270, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 40, source: "Digs", store: "Walmart", product: "Chiles, canela, crema, philadelphia", price: 680, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 41, source: "Digs", store: "Chedraui", product: "Manzana, queso de cabra, ajo", price: 144, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },

    // DIGS (Septiembre 2026 - Pendiente - $5,523.00)
    { id: 42, source: "Digs", store: "Costco", product: "Carne res", price: 460, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 43, source: "Digs", store: "Comer", product: "Chiles, cebolla, ajo", price: 176, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 44, source: "Digs", store: "Amazon", product: "Listón", price: 145, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 45, source: "Digs", store: "La mimi", product: "Envases mimi", price: 270, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 46, source: "Digs", store: "Local", product: "Guantes", price: 198, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 47, source: "Digs", store: "Local", product: "Cambio", price: 30, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 48, source: "Digs", store: "Mercado Libre", product: "Bolsas y papel encerado", price: 489, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 49, source: "Digs", store: "Local", product: "Crema Alpura + cambio", price: 100, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 50, source: "Digs", store: "Local", product: "Envases goplas", price: 50, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 51, source: "Digs", store: "Uber", product: "Uber Deye", price: 120, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 52, source: "Digs", store: "Local", product: "Pimienta", price: 67, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 53, source: "Digs", store: "Costco", product: "Philadelphia", price: 163, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 54, source: "Digs", store: "Costco", product: "Carne de res", price: 448, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 55, source: "Digs", store: "Walmart", product: "Crema, philadelphia, cabra", price: 318, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 56, source: "Digs", store: "La mimi", product: "Envases mimi", price: 224, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 57, source: "Digs", store: "Goplas", product: "Envases goplas", price: 170, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 58, source: "Digs", store: "La comer", product: "Chile poblano", price: 49, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 59, source: "Digs", store: "Walmart", product: "Crema, philadelphia, cabra", price: 393, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 60, source: "Digs", store: "Chedraui", product: "Queso de cabra, chiles", price: 107, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 61, source: "Digs", store: "Chedraui", product: "Crema", price: 107, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 62, source: "Digs", store: "Mercado", product: "Chiles", price: 200, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 63, source: "Digs", store: "Amazon", product: "Listón", price: 140, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 64, source: "Digs", store: "Casetas", product: "Caseta Bosque Real", price: 63, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 65, source: "Digs", store: "Local", product: "Báscula y cucharas", price: 313, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 66, source: "Digs", store: "Transporte", product: "Recorrido", price: 338, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 67, source: "Digs", store: "Walmart", product: "Crema, philadelphia, manzana y chiles", price: 385, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },

    // DIGS (Octubre 2026 - Pendiente - $2,626.00)
    { id: 68, source: "Digs", store: "Costco", product: "Carne de res", price: 480, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 69, source: "Digs", store: "Walmart", product: "Crema, chiles", price: 200, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 70, source: "Digs", store: "Chedraui", product: "Queso de cabra", price: 92, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 71, source: "Digs", store: "Transporte", product: "Recorrido", price: 210, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 72, source: "Digs", store: "Walmart", product: "Crema y philadelphia", price: 352, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 73, source: "Digs", store: "Mercado Libre", product: "Bolsas, báscula y encerado", price: 506, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 74, source: "Digs", store: "Lumen", product: "Impresión", price: 195, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 75, source: "Digs", store: "Chedraui", product: "Chiles y bolsa Benja", price: 124, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 76, source: "Digs", store: "Chedraui", product: "Queso de cabra", price: 88, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },
    { id: 77, source: "Digs", store: "Chedraui", product: "Chiles, chonitas, duraznos", price: 379, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },

    // ANGY (Agosto 2026 - Pagado - $3,617.50)
    { id: 78, source: "Angy", store: "Tlalne", product: "Nuez (3kg)", price: 540, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 79, source: "Angy", store: "Tlalne", product: "Carnation / aceite", price: 171, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 80, source: "Angy", store: "Comer", product: "Durazno", price: 296, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 81, source: "Angy", store: "Tlalne", product: "Nuez (2kg)", price: 360, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 82, source: "Angy", store: "Tlalne", product: "Acitrón (1kg)", price: 115, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 83, source: "Angy", store: "Mercado", product: "Granada (2kg)", price: 100, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 84, source: "Angy", store: "Mercado", product: "Poblano (3kg)", price: 105, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 85, source: "Angy", store: "Cuadro", product: "Carne puerco", price: 120, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 86, source: "Angy", store: "Tlalne", product: "Jerez", price: 244, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 87, source: "Angy", store: "Tlalne", product: "Azúcar", price: 19, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 88, source: "Angy", store: "Taller Imp.", product: "Etiquetas", price: 195, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 89, source: "Angy", store: "Chedraui", product: "Queso de cabra", price: 92.5, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 90, source: "Angy", store: "Cuadro", product: "Poblano", price: 100, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 91, source: "Angy", store: "Cuadro", product: "Carne puerco", price: 120, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 92, source: "Angy", store: "Taller Imp.", product: "Etiquetas", price: 195, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 93, source: "Angy", store: "Tlalne", product: "Durazno", price: 165, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 94, source: "Angy", store: "Local", product: "Stickers", price: 130, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 95, source: "Angy", store: "Local", product: "Goplas", price: 200, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 96, source: "Angy", store: "Cuadro", product: "Chiles", price: 100, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 97, source: "Angy", store: "Cuadro", product: "Chiles", price: 250, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },

    // ANGY (Septiembre 2026 - Pendiente - $2,886.00)
    { id: 98, source: "Angy", store: "Tlalne", product: "Nuez y acitrón", price: 772, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 99, source: "Angy", store: "Tlalne", product: "Nuez, piñón, almendra, acitrón", price: 886, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 100, source: "Angy", store: "Local", product: "Stickers", price: 260, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 101, source: "Angy", store: "Tlalne", product: "Durazno, carnation", price: 340, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 102, source: "Angy", store: "Cuadro", product: "Chile y granada", price: 506, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },
    { id: 103, source: "Angy", store: "Local", product: "Manzana, cebolla y granada", price: 122, cutoffMonth: "Septiembre 2026", dueDate: "2026-09-30", status: "Pendiente" },

    // ANGY (Octubre 2026 - Pendiente - $344.00)
    { id: 104, source: "Angy", store: "Cuadro", product: "Chile y manzana", price: 344, cutoffMonth: "Octubre 2026", dueDate: "2026-10-30", status: "Pendiente" },

    // OTROS (Aportes Externos / Terceros - Pagado - $1,596.25)
    { id: 105, source: "Otros", contributorName: "Alma", store: "La comer", product: "Chonita", price: 137.25, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 106, source: "Otros", contributorName: "Alma", store: "Chedraui", product: "Crema", price: 214, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 107, source: "Otros", contributorName: "Alma", store: "Mercado", product: "Chile, ajo, granada, manzana, perejil (1)", price: 380, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" },
    { id: 108, source: "Otros", contributorName: "Alma", store: "Mercado", product: "Chile, ajo, granada, manzana, perejil (2)", price: 865, cutoffMonth: "Agosto 2026", dueDate: "2026-08-30", status: "Pagado" }
  ];

  const STORAGE_KEY = 'nogadisima_investments_v1';
  const CUTOFF_DAY_STORAGE_KEY = 'nogadisima_cutoff_day';

  // Helper safe HTML
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMoney(amount) {
    const num = Number(amount) || 0;
    return '$' + num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // =========================================================================
  // 2. INVESTMENT APP STATE & CONTROLLER
  // =========================================================================
  const InvestmentApp = {
    items: [],
    cutoffDay: 30,
    filters: {
      source: 'Todos',
      cutoffMonth: 'Todos',
      status: 'Todos',
      search: ''
    },
    pagination: {
      currentPage: 1,
      perPage: 25
    },

    init: function () {
      this.loadFromStorage();
      this.render();

      if (window.NogaStore) {
        window.NogaStore.setInvestments(this.items, 'investment-init', false);

        // Listen for cross-module or storage sync
        window.NogaStore.on('investment:changed', (payload) => {
          if (payload && payload.source === 'cross-tab-storage' && payload.items) {
            this.items = payload.items;
            this.render();
          }
        });
      }
    },

    loadFromStorage: function () {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Auto-migrate legacy 'Alma' source to 'Otros'
            this.items = parsed.map(item => {
              if (item.source === 'Alma') {
                return { ...item, source: 'Otros', contributorName: item.contributorName || 'Alma' };
              }
              return item;
            });
            this.saveToStorage(false);
          } else {
            this.items = JSON.parse(JSON.stringify(INITIAL_INVESTMENTS));
            this.saveToStorage(false);
          }
        } else {
          this.items = JSON.parse(JSON.stringify(INITIAL_INVESTMENTS));
          this.saveToStorage(false);
        }

        const savedDay = localStorage.getItem(CUTOFF_DAY_STORAGE_KEY);
        if (savedDay) {
          this.cutoffDay = parseInt(savedDay, 10) || 30;
        }
      } catch (e) {
        console.error('Error loading investments:', e);
        this.items = JSON.parse(JSON.stringify(INITIAL_INVESTMENTS));
      }
    },

    saveToStorage: function (notify = true) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        if (window.NogaStore) {
          window.NogaStore.setInvestments(this.items, 'investment-module', notify);
        }
      } catch (e) {
        console.error('Error saving investments to localStorage:', e);
      }
    },

    saveCutoffDay: function (day) {
      this.cutoffDay = parseInt(day, 10) || 30;
      localStorage.setItem(CUTOFF_DAY_STORAGE_KEY, this.cutoffDay.toString());
    },

    // Financial Analysis & Calculations Engine (4 Sources: Nogadísima, Digs, Angy, Otros)
    getMetrics: function () {
      const all = this.items;
      let total = 0;
      let paid = 0;
      let pending = 0;

      const sources = {
        'Nogadísima': { total: 0, paid: 0, pending: 0, count: 0 },
        'Digs': { total: 0, paid: 0, pending: 0, count: 0 },
        'Angy': { total: 0, paid: 0, pending: 0, count: 0 },
        'Otros': { total: 0, paid: 0, pending: 0, count: 0 }
      };

      const months = {
        'Agosto 2026': { Digs: 0, Angy: 0, 'Nogadísima': 0, Otros: 0, total: 0, paid: 0, pending: 0, defaultDate: '2026-08-30' },
        'Septiembre 2026': { Digs: 0, Angy: 0, 'Nogadísima': 0, Otros: 0, total: 0, paid: 0, pending: 0, defaultDate: '2026-09-30' },
        'Octubre 2026': { Digs: 0, Angy: 0, 'Nogadísima': 0, Otros: 0, total: 0, paid: 0, pending: 0, defaultDate: '2026-10-30' }
      };

      all.forEach(item => {
        const amt = Number(item.price) || 0;
        total += amt;
        const isPaid = (item.status === 'Pagado');
        if (isPaid) {
          paid += amt;
        } else {
          pending += amt;
        }

        // Normalize source key (group any legacy 'Alma' into 'Otros')
        const sKey = (item.source === 'Alma') ? 'Otros' : (item.source || 'Otros');

        if (sources[sKey]) {
          sources[sKey].total += amt;
          sources[sKey].count += 1;
          if (isPaid) {
            sources[sKey].paid += amt;
          } else {
            sources[sKey].pending += amt;
          }
        }

        // By Cutoff Month
        const mKey = item.cutoffMonth || 'Agosto 2026';
        if (!months[mKey]) {
          months[mKey] = { Digs: 0, Angy: 0, 'Nogadísima': 0, Otros: 0, total: 0, paid: 0, pending: 0, defaultDate: item.dueDate || '' };
        }
        if (months[mKey][sKey] !== undefined) {
          months[mKey][sKey] += amt;
        }
        months[mKey].total += amt;
        if (isPaid) {
          months[mKey].paid += amt;
        } else {
          months[mKey].pending += amt;
        }
      });

      return {
        total,
        paid,
        pending,
        count: all.length,
        sources,
        months
      };
    },

    // Filter and Search Pipeline
    getFilteredItems: function () {
      const q = (this.filters.search || '').trim().toLowerCase();
      const s = this.filters.source;
      const m = this.filters.cutoffMonth;
      const st = this.filters.status;

      return this.items.filter(item => {
        const itemSource = (item.source === 'Alma') ? 'Otros' : item.source;
        if (s !== 'Todos' && itemSource !== s) return false;
        if (m !== 'Todos' && item.cutoffMonth !== m) return false;
        if (st !== 'Todos' && item.status !== st) return false;
        if (q) {
          const matchProd = (item.product || '').toLowerCase().includes(q);
          const matchStore = (item.store || '').toLowerCase().includes(q);
          const matchSource = (itemSource || '').toLowerCase().includes(q);
          const matchContrib = (item.contributorName || '').toLowerCase().includes(q);
          if (!matchProd && !matchStore && !matchSource && !matchContrib) return false;
        }
        return true;
      });
    },

    // Main Render Pipeline
    render: function () {
      this.renderKpiCards();
      this.renderSettlementMatrix();
      this.renderTable();
      this.renderFilterPills();
    },

    // 1. KPI Cards Renderer
    renderKpiCards: function () {
      const metrics = this.getMetrics();

      const kpiTotalEl = document.getElementById('inv-kpi-total');
      const kpiTotalSubEl = document.getElementById('inv-kpi-total-sub');
      const kpiTotalProgressEl = document.getElementById('inv-kpi-total-progress');

      const kpiDigsEl = document.getElementById('inv-kpi-digs');
      const kpiDigsPaidEl = document.getElementById('inv-kpi-digs-paid');
      const kpiDigsPendEl = document.getElementById('inv-kpi-digs-pend');
      const kpiDigsShareEl = document.getElementById('inv-kpi-digs-share');

      const kpiAngyEl = document.getElementById('inv-kpi-angy');
      const kpiAngyPaidEl = document.getElementById('inv-kpi-angy-paid');
      const kpiAngyPendEl = document.getElementById('inv-kpi-angy-pend');
      const kpiAngyShareEl = document.getElementById('inv-kpi-angy-share');

      const kpiCajaEl = document.getElementById('inv-kpi-caja');
      const kpiOtrosEl = document.getElementById('inv-kpi-otros') || document.getElementById('inv-kpi-alma');

      if (kpiTotalEl) kpiTotalEl.textContent = formatMoney(metrics.total);
      if (kpiTotalSubEl) {
        kpiTotalSubEl.textContent = `${metrics.count} adquisiciones • Pagado: ${formatMoney(metrics.paid)} • Pendiente: ${formatMoney(metrics.pending)}`;
      }
      if (kpiTotalProgressEl) {
        const pct = metrics.total > 0 ? (metrics.paid / metrics.total) * 100 : 0;
        kpiTotalProgressEl.style.width = `${pct.toFixed(1)}%`;
      }

      // Digs
      const digs = metrics.sources['Digs'];
      if (kpiDigsEl) kpiDigsEl.textContent = formatMoney(digs.total);
      if (kpiDigsPaidEl) kpiDigsPaidEl.textContent = formatMoney(digs.paid);
      if (kpiDigsPendEl) kpiDigsPendEl.textContent = formatMoney(digs.pending);
      if (kpiDigsShareEl && metrics.total > 0) {
        const share = (digs.total / metrics.total) * 100;
        kpiDigsShareEl.textContent = `${share.toFixed(1)}% del capital total`;
      }

      // Angy
      const angy = metrics.sources['Angy'];
      if (kpiAngyEl) kpiAngyEl.textContent = formatMoney(angy.total);
      if (kpiAngyPaidEl) kpiAngyPaidEl.textContent = formatMoney(angy.paid);
      if (kpiAngyPendEl) kpiAngyPendEl.textContent = formatMoney(angy.pending);
      if (kpiAngyShareEl && metrics.total > 0) {
        const share = (angy.total / metrics.total) * 100;
        kpiAngyShareEl.textContent = `${share.toFixed(1)}% del capital total`;
      }

      // Caja Nogadísima & Otros
      const noga = metrics.sources['Nogadísima'];
      const otros = metrics.sources['Otros'];
      if (kpiCajaEl) kpiCajaEl.textContent = formatMoney(noga.total);
      if (kpiOtrosEl && otros) kpiOtrosEl.textContent = formatMoney(otros.total);
    },

    // 2. Monthly Settlement Matrix Renderer (Columns: DIGS | ANGY | NOGADÍSIMA | OTROS)
    renderSettlementMatrix: function () {
      const container = document.getElementById('settlement-matrix-body');
      if (!container) return;

      const metrics = this.getMetrics();
      const monthKeys = ['Agosto 2026', 'Septiembre 2026', 'Octubre 2026'];

      let html = '';
      monthKeys.forEach(mKey => {
        const data = metrics.months[mKey] || { Digs: 0, Angy: 0, 'Nogadísima': 0, Otros: 0, total: 0, paid: 0, pending: 0 };
        const isCurrentFilter = (this.filters.cutoffMonth === mKey);
        const isFullyPaid = data.pending === 0 && data.total > 0;
        const statusBadge = isFullyPaid 
          ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300 font-numeric">
               <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>PAGADO
             </span>`
          : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/90 text-amber-800 border border-amber-300 font-numeric">
               <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>PENDIENTE
             </span>`;

        // Format formatted due date string
        let formattedDate = '30 de mes';
        if (mKey === 'Agosto 2026') formattedDate = `${this.cutoffDay} de agosto, 2026`;
        if (mKey === 'Septiembre 2026') formattedDate = `${this.cutoffDay} de septiembre, 2026`;
        if (mKey === 'Octubre 2026') formattedDate = `${this.cutoffDay} de octubre, 2026`;

        html += `
          <tr class="liquid-table-row cursor-pointer transition-all duration-150 ${isCurrentFilter ? 'bg-white/80 ring-2 ring-slate-800/20' : 'hover:bg-white/60'}" 
              onclick="InvestmentApp.applyMonthFilter('${escapeHtml(mKey)}')">
            <td class="py-3 px-4 font-bold text-slate-900 text-xs sm:text-sm">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full ${isCurrentFilter ? 'bg-slate-900 ring-4 ring-slate-300' : 'bg-slate-400'}"></span>
                <span>${escapeHtml(mKey)}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-slate-600 text-xs font-medium">${formattedDate}</td>
            <td class="py-3 px-3 text-right font-numeric font-bold text-slate-800 text-xs sm:text-sm">${formatMoney(data.Digs)}</td>
            <td class="py-3 px-3 text-right font-numeric font-bold text-slate-800 text-xs sm:text-sm">${formatMoney(data.Angy)}</td>
            <td class="py-3 px-3 text-right font-numeric font-medium text-slate-700 text-xs sm:text-sm">${formatMoney(data['Nogadísima'])}</td>
            <td class="py-3 px-3 text-right font-numeric font-medium text-slate-700 text-xs sm:text-sm">${formatMoney(data.Otros)}</td>
            <td class="py-3 px-4 text-right font-numeric font-extrabold text-slate-900 text-sm sm:text-base">${formatMoney(data.total)}</td>
            <td class="py-3 px-3 text-center">${statusBadge}</td>
            <td class="py-3 px-3 text-right">
              <button onclick="event.stopPropagation(); InvestmentApp.applyMonthFilter('${escapeHtml(mKey)}');"
                class="px-2.5 py-1 rounded-lg text-xs font-semibold ${isCurrentFilter ? 'liquid-pill-active' : 'liquid-pill hover:bg-white'} transition-all">
                ${isCurrentFilter ? 'Filtrado' : 'Ver Compras'}
              </button>
            </td>
          </tr>
        `;
      });

      container.innerHTML = html;

      // Update total summary footer in the matrix
      const footDigs = document.getElementById('matrix-total-digs');
      const footAngy = document.getElementById('matrix-total-angy');
      const footNoga = document.getElementById('matrix-total-noga');
      const footOtros = document.getElementById('matrix-total-otros') || document.getElementById('matrix-total-alma');
      const footGrand = document.getElementById('matrix-total-grand');

      if (footDigs) footDigs.textContent = formatMoney(metrics.sources['Digs'].total);
      if (footAngy) footAngy.textContent = formatMoney(metrics.sources['Angy'].total);
      if (footNoga) footNoga.textContent = formatMoney(metrics.sources['Nogadísima'].total);
      if (footOtros) footOtros.textContent = formatMoney(metrics.sources['Otros'].total);
      if (footGrand) footGrand.textContent = formatMoney(metrics.total);

      // Select element for cutoff day
      const cutoffSelect = document.getElementById('cutoff-day-select');
      if (cutoffSelect) {
        cutoffSelect.value = this.cutoffDay.toString();
      }
    },

    // 3. Interactive Expense Table Renderer
    renderTable: function () {
      const container = document.getElementById('expenses-table-body');
      if (!container) return;

      const filtered = this.getFilteredItems();
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

      // Summary label for filtered items
      const filterSummaryEl = document.getElementById('inv-filter-summary');
      if (filterSummaryEl) {
        const sumFiltered = filtered.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        filterSummaryEl.textContent = `Mostrando ${itemsToDisplay.length} de ${totalFiltered} gastos (Subtotal: ${formatMoney(sumFiltered)})`;
      }

      if (itemsToDisplay.length === 0) {
        container.innerHTML = `
          <tr>
            <td colspan="8" class="py-12 text-center text-slate-500">
              <div class="max-w-xs mx-auto space-y-2">
                <p class="font-bold text-slate-700 text-sm">No se encontraron registros</p>
                <p class="text-xs text-slate-400">Prueba ajustando los filtros de búsqueda, mes o fuente de fondos.</p>
                <button onclick="InvestmentApp.resetFilters()" class="mt-2 px-3 py-1.5 text-xs font-semibold liquid-pill text-slate-700">
                  Limpiar Filtros
                </button>
              </div>
            </td>
          </tr>
        `;
        this.renderPagination(0, 0, 0);
        return;
      }

      let rowsHtml = '';
      itemsToDisplay.forEach((item) => {
        const currentSource = (item.source === 'Alma') ? 'Otros' : item.source;

        // Badges for funding source (with optional contributor tag for Otros)
        let sourceBadge = '';
        if (currentSource === 'Nogadísima') {
          sourceBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-900 border border-slate-200/60 shadow-xs">Nogadísima</span>`;
        } else if (currentSource === 'Digs') {
          sourceBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-900/85 text-sky-100 border border-sky-700/40">Digs</span>`;
        } else if (currentSource === 'Angy') {
          sourceBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-granada-700/90 text-white border border-granada-600/40">Angy</span>`;
        } else {
          const contribTag = item.contributorName ? ` (${escapeHtml(item.contributorName)})` : '';
          sourceBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-900/85 text-purple-100 border border-purple-700/40">Otros${contribTag}</span>`;
        }

        const isPaid = (item.status === 'Pagado');
        const statusPill = isPaid
          ? `<button onclick="InvestmentApp.toggleStatus(${item.id})" title="Clic para alternar a Pendiente"
              class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-all font-numeric">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Pagado</span>
             </button>`
          : `<button onclick="InvestmentApp.toggleStatus(${item.id})" title="Clic para alternar a Pagado"
              class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100/90 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-all font-numeric">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Pendiente</span>
             </button>`;

        rowsHtml += `
          <tr class="liquid-table-row group">
            <!-- 1. Fuente de Fondos -->
            <td class="py-2 px-3 text-left whitespace-nowrap">
              <div class="flex items-center space-x-2">
                <span class="text-[10px] text-slate-400 font-numeric w-5">${item.id}</span>
                <select onchange="InvestmentApp.updateField(${item.id}, 'source', this.value)" 
                  class="liquid-input px-2 py-1 text-xs font-semibold text-slate-800 bg-transparent border-0 focus:bg-white cursor-pointer">
                  <option value="Nogadísima" ${currentSource === 'Nogadísima' ? 'selected' : ''}>Nogadísima</option>
                  <option value="Digs" ${currentSource === 'Digs' ? 'selected' : ''}>Digs</option>
                  <option value="Angy" ${currentSource === 'Angy' ? 'selected' : ''}>Angy</option>
                  <option value="Otros" ${currentSource === 'Otros' ? 'selected' : ''}>Otros</option>
                </select>
                ${sourceBadge}
              </div>
            </td>

            <!-- 2. Tienda / Proveedor -->
            <td class="py-2 px-2 text-left">
              <input type="text" value="${escapeHtml(item.store)}"
                onchange="InvestmentApp.updateField(${item.id}, 'store', this.value)"
                class="w-full liquid-input px-2.5 py-1 text-xs text-slate-800 font-medium">
            </td>

            <!-- 3. Concepto / Insumo -->
            <td class="py-2 px-2 text-left">
              <input type="text" value="${escapeHtml(item.product)}"
                onchange="InvestmentApp.updateField(${item.id}, 'product', this.value)"
                class="w-full liquid-input px-2.5 py-1 text-xs text-slate-900 font-semibold">
            </td>

            <!-- 4. Monto ($ MXN) -->
            <td class="py-2 px-2 text-right w-28">
              <input type="number" step="any" min="0" value="${item.price}"
                onchange="InvestmentApp.updateField(${item.id}, 'price', parseFloat(this.value) || 0)"
                class="w-full text-right liquid-input px-2 py-1 text-xs sm:text-sm font-extrabold text-slate-900 font-numeric">
            </td>

            <!-- 5. Mes de Corte -->
            <td class="py-2 px-2 text-center whitespace-nowrap">
              <select onchange="InvestmentApp.updateField(${item.id}, 'cutoffMonth', this.value)"
                class="liquid-input px-2 py-1 text-xs font-medium text-slate-700 cursor-pointer">
                <option value="Agosto 2026" ${item.cutoffMonth === 'Agosto 2026' ? 'selected' : ''}>Agosto 2026</option>
                <option value="Septiembre 2026" ${item.cutoffMonth === 'Septiembre 2026' ? 'selected' : ''}>Septiembre 2026</option>
                <option value="Octubre 2026" ${item.cutoffMonth === 'Octubre 2026' ? 'selected' : ''}>Octubre 2026</option>
              </select>
            </td>

            <!-- 6. Fecha de Pago -->
            <td class="py-2 px-2 text-center whitespace-nowrap">
              <input type="date" value="${escapeHtml(item.dueDate || '')}"
                onchange="InvestmentApp.updateField(${item.id}, 'dueDate', this.value)"
                class="liquid-input px-2 py-1 text-xs text-slate-700 font-numeric">
            </td>

            <!-- 7. Estatus -->
            <td class="py-2 px-3 text-center whitespace-nowrap">
              ${statusPill}
            </td>

            <!-- 8. Acción -->
            <td class="py-2 px-2 text-center whitespace-nowrap">
              <button onclick="InvestmentApp.deleteExpense(${item.id})" 
                title="Eliminar gasto"
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

    // 4. Pagination Controller
    renderPagination: function (totalItems, totalPages, currentPage) {
      const container = document.getElementById('expenses-pagination-container');
      if (!container) return;

      if (totalItems === 0 || totalPages <= 1) {
        container.innerHTML = `
          <div class="text-xs text-slate-500 font-numeric">
            Total: ${totalItems} registros
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full text-xs">
          <div class="text-slate-500 font-numeric">
            Página <span class="font-bold text-slate-800">${currentPage}</span> de <span class="font-bold text-slate-800">${totalPages}</span> (${totalItems} registros en total)
          </div>
          <div class="flex items-center space-x-1.5">
            <button onclick="InvestmentApp.changePage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled class="px-2.5 py-1 rounded-lg text-slate-300 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-slate-700 bg-white/70 hover:bg-white border border-white/80 shadow-sm transition-all"'} >
              Anterior
            </button>
            <span class="px-2 font-numeric font-bold text-slate-700">${currentPage}</span>
            <button onclick="InvestmentApp.changePage(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled class="px-2.5 py-1 rounded-lg text-slate-300 cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg text-slate-700 bg-white/70 hover:bg-white border border-white/80 shadow-sm transition-all"'} >
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

    // 5. Filter Pills Controls (4 Sources: Nogadísima, Digs, Angy, Otros)
    renderFilterPills: function () {
      // Source Pills
      const sourceList = ['Todos', 'Nogadísima', 'Digs', 'Angy', 'Otros'];
      const sourceContainer = document.getElementById('filter-pills-source');
      if (sourceContainer) {
        sourceContainer.innerHTML = sourceList.map(src => {
          const active = (this.filters.source === src);
          return `
            <button onclick="InvestmentApp.setFilter('source', '${src}')"
              class="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${active ? 'liquid-pill-active' : 'liquid-pill hover:bg-white/70'}">
              ${src}
            </button>
          `;
        }).join('');
      }

      // Cutoff Month Pills
      const monthList = ['Todos', 'Agosto 2026', 'Septiembre 2026', 'Octubre 2026'];
      const monthContainer = document.getElementById('filter-pills-month');
      if (monthContainer) {
        monthContainer.innerHTML = monthList.map(m => {
          const active = (this.filters.cutoffMonth === m);
          return `
            <button onclick="InvestmentApp.setFilter('cutoffMonth', '${m}')"
              class="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${active ? 'liquid-pill-active' : 'liquid-pill hover:bg-white/70'}">
              ${m}
            </button>
          `;
        }).join('');
      }

      // Status Pills
      const statusList = ['Todos', 'Pagado', 'Pendiente'];
      const statusContainer = document.getElementById('filter-pills-status');
      if (statusContainer) {
        statusContainer.innerHTML = statusList.map(st => {
          const active = (this.filters.status === st);
          return `
            <button onclick="InvestmentApp.setFilter('status', '${st}')"
              class="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${active ? 'liquid-pill-active' : 'liquid-pill hover:bg-white/70'}">
              ${st}
            </button>
          `;
        }).join('');
      }
    },

    setFilter: function (key, value) {
      this.filters[key] = value;
      this.pagination.currentPage = 1;
      this.render();
    },

    setSearch: function (query) {
      this.filters.search = query;
      this.pagination.currentPage = 1;
      this.renderTable();
    },

    applyMonthFilter: function (mKey) {
      if (this.filters.cutoffMonth === mKey) {
        this.filters.cutoffMonth = 'Todos';
      } else {
        this.filters.cutoffMonth = mKey;
      }
      this.pagination.currentPage = 1;
      this.render();

      const tableEl = document.getElementById('expenses-data-grid-section');
      if (tableEl) {
        tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    resetFilters: function () {
      this.filters.source = 'Todos';
      this.filters.cutoffMonth = 'Todos';
      this.filters.status = 'Todos';
      this.filters.search = '';
      const searchInput = document.getElementById('inv-search-input');
      if (searchInput) searchInput.value = '';
      this.pagination.currentPage = 1;
      this.render();
      if (window.showToast) window.showToast('Filtros restablecidos', 'info');
    },

    // 6. Data Mutation & Auto-Save
    updateField: function (id, field, value) {
      const item = this.items.find(i => i.id === id);
      if (!item) return;

      if (field === 'price') {
        item.price = Math.max(0, Number(value) || 0);
      } else {
        item[field] = value;
      }

      this.saveToStorage();
      this.renderKpiCards();
      this.renderSettlementMatrix();

      // Recalculate summary badge
      const filtered = this.getFilteredItems();
      const filterSummaryEl = document.getElementById('inv-filter-summary');
      if (filterSummaryEl) {
        const sumFiltered = filtered.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        filterSummaryEl.textContent = `Mostrando ${filtered.length} gastos (Subtotal: ${formatMoney(sumFiltered)})`;
      }
    },

    toggleStatus: function (id) {
      const item = this.items.find(i => i.id === id);
      if (!item) return;

      item.status = (item.status === 'Pagado') ? 'Pendiente' : 'Pagado';
      this.saveToStorage();
      this.render();

      if (window.showToast) {
        window.showToast(`Gasto #${id} marcado como ${item.status}`, 'info');
      }
    },

    deleteExpense: function (id) {
      const idx = this.items.findIndex(i => i.id === id);
      if (idx === -1) return;

      const deletedItem = this.items.splice(idx, 1)[0];
      this.saveToStorage();
      this.render();

      if (window.showToast) {
        window.showToast(`Gasto "${deletedItem.product}" eliminado`, 'warning');
      }
    },

    addNewExpense: function (expenseData) {
      const maxId = this.items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
      const newId = maxId + 1;

      const newExpense = {
        id: newId,
        source: expenseData.source || 'Nogadísima',
        contributorName: expenseData.contributorName || '',
        store: expenseData.store || 'Proveedor',
        product: expenseData.product || 'Insumo',
        price: Number(expenseData.price) || 0,
        cutoffMonth: expenseData.cutoffMonth || 'Agosto 2026',
        dueDate: expenseData.dueDate || '2026-08-30',
        status: expenseData.status || 'Pendiente'
      };

      this.items.unshift(newExpense);
      this.saveToStorage();
      this.pagination.currentPage = 1;
      this.render();

      if (window.showToast) {
        window.showToast(`Gasto "${newExpense.product}" registrado exitosamente`, 'info');
      }
    },

    // 7. Cutoff Engine: Adjust cycle day
    changeCutoffDaySetting: function (day, applyToAll = false) {
      const d = parseInt(day, 10) || 30;
      this.saveCutoffDay(d);

      if (applyToAll) {
        const dayStr = String(d).padStart(2, '0');
        this.items.forEach(item => {
          if (item.dueDate && item.dueDate.length === 10) {
            const parts = item.dueDate.split('-');
            if (parts.length === 3) {
              item.dueDate = `${parts[0]}-${parts[1]}-${dayStr}`;
            }
          }
        });
        this.saveToStorage();
      }

      this.render();
      if (window.showToast) {
        window.showToast(`Día de corte fijado al día ${d} de cada mes`, 'info');
      }
    },

    // 8. Restore Seed Data
    resetToSeedData: function () {
      this.items = JSON.parse(JSON.stringify(INITIAL_INVESTMENTS));
      this.cutoffDay = 30;
      this.saveToStorage();
      this.saveCutoffDay(30);
      this.resetFilters();
      if (window.showToast) {
        window.showToast('Datos de inversión restaurados al balance oficial ($26,579.75 MXN)', 'info');
      }
    },

    // 9. Export to CSV
    exportCsv: function () {
      const items = this.items;
      let csv = '\uFEFF'; // UTF-8 BOM
      csv += 'ID,Fuente de Fondos,Aportante / Tercero,Tienda / Proveedor,Concepto / Insumo,Monto ($ MXN),Mes de Corte,Fecha de Pago,Estatus\n';

      items.forEach(item => {
        const cleanStore = `"${(item.store || '').replace(/"/g, '""')}"`;
        const cleanProduct = `"${(item.product || '').replace(/"/g, '""')}"`;
        const currentSource = (item.source === 'Alma') ? 'Otros' : item.source;
        const cleanSource = `"${(currentSource || '').replace(/"/g, '""')}"`;
        const cleanContrib = `"${(item.contributorName || '').replace(/"/g, '""')}"`;
        const cleanMonth = `"${(item.cutoffMonth || '').replace(/"/g, '""')}"`;
        csv += `${item.id},${cleanSource},${cleanContrib},${cleanStore},${cleanProduct},${item.price},${cleanMonth},${item.dueDate},${item.status}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Nogadisima_Inversion_Gastos_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.showToast) {
        window.showToast('Archivo CSV de Inversión descargado exitosamente', 'info');
      }
    }
  };

  // Expose globally
  window.InvestmentApp = InvestmentApp;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InvestmentApp.init());
  } else {
    InvestmentApp.init();
  }
})();
