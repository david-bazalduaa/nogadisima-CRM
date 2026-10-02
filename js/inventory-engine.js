/**
 * NOGADÍSIMA — DYNAMIC INVENTORY & PREDICTIVE RESTOCK ENGINE
 * (INVENTARIO & REABASTECIMIENTO PROACTIVO)
 * Real-time Supply Chain Demand Deduction, Recipe Catalog Sync,
 * 7-Day Predictive Lookahead & Restock Costing Engine
 */

(function () {
  'use strict';

  const STORAGE_KEY_INVENTORY = 'nogadisima_inventory_v2';

  // =========================================================================
  // 1. VERIFIED BASELINE SEED DATA (STRICT DATA FIDELITY)
  // =========================================================================
  const INITIAL_INVENTORY_ITEMS = [
    // --- EMPAQUES & PRESENTACIÓN ---
    {
      id: 'pkg-6',
      name: 'Tarjetas de presentación / agradecimiento',
      category: 'empaque',
      stockActual: 51,
      unit: 'pza',
      minStock: 20,
      packageSize: 70,
      packagePrice: 280.50,
      store: 'Lumen',
      isCustom: false
    },
    {
      id: 'pkg-2',
      name: 'Bolsas blancas de entrega',
      category: 'empaque',
      stockActual: 61,
      unit: 'pza',
      minStock: 20,
      packageSize: 58.24,
      packagePrice: 208.00,
      store: 'Mercado Libre',
      isCustom: false
    },
    {
      id: 'pkg-3',
      name: 'Envases termoformados (Marce / Goplas)',
      category: 'empaque',
      stockActual: 117,
      unit: 'pza',
      minStock: 30,
      packageSize: 350,
      packagePrice: 250.00,
      store: 'Goplas',
      isCustom: false
    },
    {
      id: 'pkg-1',
      name: 'Papel encerado',
      category: 'empaque',
      stockActual: 112,
      unit: 'pza',
      minStock: 25,
      packageSize: 100,
      packagePrice: 130.00,
      store: 'Mercado Libre',
      isCustom: false
    },
    {
      id: 'pkg-5',
      name: 'Sticker de sello bolsa',
      category: 'empaque',
      stockActual: 34,
      unit: 'pza',
      minStock: 15,
      packageSize: 46.6,
      packagePrice: 65.00,
      store: 'Goplas',
      isCustom: false
    },
    {
      id: 'pkg-4',
      name: 'Sticker decorativo chile',
      category: 'empaque',
      stockActual: 24,
      unit: 'pza',
      minStock: 15,
      packageSize: 210,
      packagePrice: 65.00,
      store: 'Goplas',
      isCustom: false
    },
    {
      id: 'pkg-7',
      name: 'Listón',
      category: 'empaque',
      stockActual: 50,
      unit: 'pza',
      minStock: 15,
      packageSize: 50,
      packagePrice: 140.00,
      store: 'Amazon',
      isCustom: false
    },

    // --- INGREDIENTES CLAVE ---
    {
      id: 'nog-5',
      name: 'Nuez de Castilla',
      category: 'nogada',
      stockActual: 1521,
      unit: 'gr',
      minStock: 500,
      packageSize: 1000,
      packagePrice: 280.00,
      store: 'Tlalne',
      isCustom: false
    },
    {
      id: 'nog-3',
      name: 'Acitrón',
      category: 'nogada',
      stockActual: 900,
      unit: 'gr',
      minStock: 300,
      packageSize: 1200,
      packagePrice: 120.00,
      store: 'Tlalne',
      isCustom: false
    },
    {
      id: 'rel-8',
      name: 'Almendra fileteada',
      category: 'relleno',
      stockActual: 854,
      unit: 'gr',
      minStock: 200,
      packageSize: 1000,
      packagePrice: 215.00,
      store: 'Tlalne',
      isCustom: false
    },
    {
      id: 'rel-9',
      name: 'Piñón rosa',
      category: 'relleno',
      stockActual: 494,
      unit: 'gr',
      minStock: 200,
      packageSize: 1000,
      packagePrice: 570.00,
      store: 'Tlalne',
      isCustom: false
    },
    {
      id: 'rel-2',
      name: 'Carne de res molida',
      category: 'relleno',
      stockActual: 2800,
      unit: 'gr',
      minStock: 800,
      packageSize: 1000,
      packagePrice: 152.00,
      store: 'Costco',
      isCustom: false
    },
    {
      id: 'rel-3',
      name: 'Carne de puerco molida',
      category: 'relleno',
      stockActual: 550,
      unit: 'gr',
      minStock: 500,
      packageSize: 1000,
      packagePrice: 110.00,
      store: 'Cuadro',
      isCustom: false
    },
    {
      id: 'ext-1',
      name: 'Chiles poblanos seleccionados',
      category: 'extras',
      stockActual: 30,
      unit: 'pza',
      minStock: 15,
      packageSize: 7,
      packagePrice: 107.00,
      store: 'Chedraui',
      isCustom: false
    },
    {
      id: 'nog-1',
      name: 'Queso Philadelphia',
      category: 'nogada',
      stockActual: 420,
      unit: 'gr',
      minStock: 280,
      packageSize: 420,
      packagePrice: 93.00,
      store: 'Walmart',
      isCustom: false
    },
    {
      id: 'nog-2',
      name: 'Crema',
      category: 'nogada',
      stockActual: 1000,
      unit: 'ml',
      minStock: 450,
      packageSize: 800,
      packagePrice: 76.00,
      store: 'Walmart',
      isCustom: false
    },
    {
      id: 'nog-7',
      name: 'Jerez',
      category: 'nogada',
      stockActual: 3000,
      unit: 'ml',
      minStock: 500,
      packageSize: 4000,
      packagePrice: 244.00,
      store: 'Chedraui',
      isCustom: false
    },
    {
      id: 'nog-4',
      name: 'Queso de cabra',
      category: 'nogada',
      stockActual: 350,
      unit: 'gr',
      minStock: 140,
      packageSize: 280,
      packagePrice: 92.00,
      store: 'Chedraui',
      isCustom: false
    },
    {
      id: 'nog-6',
      name: 'Leche evaporada',
      category: 'nogada',
      stockActual: 1000,
      unit: 'gr',
      minStock: 250,
      packageSize: 1000,
      packagePrice: 42.00,
      store: 'Chedraui',
      isCustom: false
    },
    {
      id: 'rel-4',
      name: 'Manzana panochera',
      category: 'relleno',
      stockActual: 12,
      unit: 'pza',
      minStock: 4,
      packageSize: 5,
      packagePrice: 54.00,
      store: 'Mercado',
      isCustom: false
    },
    {
      id: 'rel-5',
      name: 'Durazno criollo',
      category: 'relleno',
      stockActual: 18,
      unit: 'pza',
      minStock: 6,
      packageSize: 8,
      packagePrice: 65.00,
      store: 'Mercado',
      isCustom: false
    },
    {
      id: 'rel-10',
      name: 'Cebolla blanca',
      category: 'relleno',
      stockActual: 1200,
      unit: 'gr',
      minStock: 400,
      packageSize: 1000,
      packagePrice: 35.00,
      store: 'Mercado',
      isCustom: false
    },
    {
      id: 'rel-11',
      name: 'Diente de ajo',
      category: 'relleno',
      stockActual: 10,
      unit: 'pza',
      minStock: 3,
      packageSize: 20.5,
      packagePrice: 41.00,
      store: 'Mercado',
      isCustom: false
    },
    {
      id: 'rel-12',
      name: 'Puré de tomate',
      category: 'relleno',
      stockActual: 680,
      unit: 'ml',
      minStock: 340,
      packageSize: 340,
      packagePrice: 18.22,
      store: 'Walmart',
      isCustom: false
    },
    {
      id: 'ext-2',
      name: 'Granada roja desgranada',
      category: 'extras',
      stockActual: 600,
      unit: 'gr',
      minStock: 600,
      packageSize: 1000,
      packagePrice: 70.00,
      store: 'Mercado',
      isCustom: false
    },
    {
      id: 'ext-3',
      name: 'Perejil liso fresco',
      category: 'extras',
      stockActual: 4,
      unit: 'cda',
      minStock: 2,
      packageSize: 2,
      packagePrice: 1.00,
      store: 'Mercado',
      isCustom: false
    },
    {
      id: 'rel-1',
      name: 'Azúcar blanca',
      category: 'relleno',
      stockActual: 1000,
      unit: 'gr',
      minStock: 200,
      packageSize: 1000,
      packagePrice: 19.00,
      store: 'Tlalne',
      isCustom: false
    }
  ];

  // Number & Currency Formatters
  function formatMoney(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  function formatNumber(num, maxDecimals = 1) {
    const val = Number(num) || 0;
    return Number.isInteger(val) ? val.toLocaleString('es-MX') : val.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: maxDecimals });
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 2. INVENTORY APP CONTROLLER & ENGINE
  // =========================================================================
  const InventoryApp = {
    items: [],
    filters: {
      actionFilter: 'todos', // 'todos', 'urgente', 'ingrediente', 'empaque'
      search: '',
      catalogFilter: 'todos' // 'todos', 'nogada', 'relleno', 'extras', 'empaque'
    },

    init: function () {
      this.loadFromStorage();
      this.syncWithRecipe();
      this.setActionFilter(this.filters.actionFilter);
      this.setCatalogFilter(this.filters.catalogFilter);
      this.render();

      // Listen for reactive updates across modules
      if (window.NogaStore) {
        window.NogaStore.on('orders:changed', () => {
          this.render();
        });
        window.NogaStore.on('recipe:changed', () => {
          this.syncWithRecipe();
          this.render();
        });
      }
    },

    loadFromStorage: function () {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_INVENTORY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.items = parsed;
            return;
          }
        }
      } catch (e) {
        console.warn('InventoryApp: Error reading inventory from localStorage', e);
      }
      this.items = JSON.parse(JSON.stringify(INITIAL_INVENTORY_ITEMS));
      this.saveToStorage(false);
    },

    saveToStorage: function (notify = true) {
      try {
        localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(this.items));
        if (notify && window.NogaStore) {
          window.NogaStore.emit('inventory:changed', { items: this.items });
        }
      } catch (e) {
        console.warn('InventoryApp: Error saving inventory to localStorage', e);
      }
    },

    // 1. Two-Way Reactivity & Recipe Catalog Sync
    syncWithRecipe: function () {
      const recipeData = (window.RecipeApp && window.RecipeApp.data)
        ? window.RecipeApp.data
        : (window.NogaStore ? window.NogaStore.getRecipe() : null);

      if (!recipeData || !Array.isArray(recipeData.categories)) return;

      let hasChanges = false;

      recipeData.categories.forEach(cat => {
        cat.items.forEach(recItem => {
          const recNorm = (recItem.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          let existing = this.items.find(i => {
            if (i.id === recItem.id) return true;
            const invNorm = (i.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (invNorm === recNorm) return true;
            if (invNorm.includes('nuez') && recNorm.includes('nuez')) return true;
            if (invNorm.includes('acitron') && recNorm.includes('acitron')) return true;
            if (invNorm.includes('termoformado') && recNorm.includes('termoformado')) return true;
            if (invNorm.includes('tarjeta') && recNorm.includes('tarjeta')) return true;
            return false;
          });

          if (!existing) {
            this.items.push({
              id: recItem.id,
              name: recItem.name,
              category: cat.id,
              stockActual: 0,
              unit: recItem.unit || 'pza',
              minStock: Math.ceil((recItem.qty || 1) * 1.5),
              packageSize: recItem.packageSize || 1,
              packagePrice: recItem.generalPrice || 0,
              store: recItem.store || 'Proveedor',
              isCustom: false
            });
            hasChanges = true;
          } else {
            // Update reference metadata
            if (recItem.packageSize && !existing.packageSize) existing.packageSize = recItem.packageSize;
            if (recItem.generalPrice && !existing.packagePrice) existing.packagePrice = recItem.generalPrice;
            if (recItem.store && !existing.store) existing.store = recItem.store;
          }
        });
      });

      if (hasChanges) {
        this.saveToStorage(false);
      }
    },

    // 2. Consumption Allocation Logic
    // Packaging Demand per Order (Q chiles)
    calculatePackagingDemandForOrder: function (orderQty) {
      const q = Math.max(0, parseInt(orderQty, 10) || 0);
      if (q === 0) return {};

      const bagsAndRibbons = Math.ceil(q / 2);
      return {
        'Bolsas blancas de entrega': bagsAndRibbons,
        'Listón': bagsAndRibbons,
        'Sticker de sello bolsa': bagsAndRibbons,
        'Tarjetas de presentación / agradecimiento': bagsAndRibbons,
        'Tarjetas de agradecimiento / presentación': bagsAndRibbons,
        'Envases termoformados (Marce)': q * 2,
        'Envases termoformados (Marce / Goplas)': q * 2,
        'Papel encerado': q * 1,
        'Sticker decorativo chile': q * 1
      };
    },

    // Kitchen Ingredients Demand per Order (Q chiles)
    calculateIngredientsDemandForOrder: function (orderQty) {
      const q = Math.max(0, parseInt(orderQty, 10) || 0);
      if (q === 0) return {};

      const recipeData = (window.RecipeApp && window.RecipeApp.data)
        ? window.RecipeApp.data
        : (window.NogaStore ? window.NogaStore.getRecipe() : null);

      const yieldPortions = (recipeData && Number(recipeData.yieldPortions) > 0)
        ? Number(recipeData.yieldPortions)
        : 6.5;

      const demandMap = {};

      if (recipeData && Array.isArray(recipeData.categories)) {
        recipeData.categories.forEach(cat => {
          if (cat.id === 'empaque') return; // Handled separately
          cat.items.forEach(item => {
            const unitConsumption = (Number(item.qty) || 0) / yieldPortions;
            const totalForOrder = q * unitConsumption;
            demandMap[item.id] = (demandMap[item.id] || 0) + totalForOrder;
            demandMap[item.name.toLowerCase()] = (demandMap[item.name.toLowerCase()] || 0) + totalForOrder;
          });
        });
      }

      return demandMap;
    },

    // 3. Predictive 7-Day Lookahead Window & Active Demand Calculation
    getUpcomingOrders: function () {
      const orders = (window.OrdersApp && Array.isArray(window.OrdersApp.orders))
        ? window.OrdersApp.orders
        : (window.NogaStore ? window.NogaStore.getOrders() : []);

      // Filter unfulfilled orders (not yet delivered or not yet prepped)
      const pendingOrders = orders.filter(o => o.prepStatus === 'No preparado' || o.deliveryStatus === 'No entregado');
      return pendingOrders;
    },

    // Complete Demand Breakdown for Items
    calculateDemandMap: function () {
      const upcomingOrders = this.getUpcomingOrders();
      const itemDemandMap = {}; // itemId -> { reservedAll: number, lookahead7d: number }

      this.items.forEach(item => {
        itemDemandMap[item.id] = { reservedAll: 0, lookahead7d: 0 };
      });

      const recipeData = (window.RecipeApp && window.RecipeApp.data)
        ? window.RecipeApp.data
        : (window.NogaStore ? window.NogaStore.getRecipe() : null);

      const yieldPortions = (recipeData && Number(recipeData.yieldPortions) > 0)
        ? Number(recipeData.yieldPortions)
        : 6.5;

      upcomingOrders.forEach(order => {
        const q = Math.max(0, parseInt(order.qty, 10) || 0);
        if (q === 0) return;

        const isUnprepped = (order.prepStatus === 'No preparado');
        const pkgDemand = this.calculatePackagingDemandForOrder(q);

        this.items.forEach(invItem => {
          let orderRequirement = 0;

          // Check packaging formulas
          if (invItem.category === 'empaque') {
            for (const [pkgName, requiredQty] of Object.entries(pkgDemand)) {
              const normPkg = pkgName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              const normInv = invItem.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              if (normInv.includes(normPkg) || normPkg.includes(normInv)) {
                orderRequirement = requiredQty;
                break;
              }
            }
          } else {
            // Kitchen Ingredient formula
            if (recipeData && Array.isArray(recipeData.categories)) {
              for (const cat of recipeData.categories) {
                if (cat.id === 'empaque') continue;
                for (const recItem of cat.items) {
                  let isMatch = (recItem.id === invItem.id);
                  if (!isMatch) {
                    const normRec = (recItem.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const normInv = (invItem.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    if (normRec === normInv) {
                      isMatch = true;
                    } else if (normInv.includes('nuez') && normRec.includes('nuez')) {
                      isMatch = true;
                    } else if (normInv.includes('acitron') && normRec.includes('acitron')) {
                      isMatch = true;
                    }
                  }
                  if (isMatch) {
                    orderRequirement += q * ((Number(recItem.qty) || 0) / yieldPortions);
                  }
                }
              }
            }
          }

          if (orderRequirement > 0) {
            // Reserved demand for currently active kitchen preparation
            if (isUnprepped) {
              itemDemandMap[invItem.id].reservedAll += orderRequirement;
            }
            // Upcoming 7-day lookahead pipeline demand
            itemDemandMap[invItem.id].lookahead7d += orderRequirement;
          }
        });
      });

      return itemDemandMap;
    },

    // 4. Financial & Operational Inventory Metrics
    getMetrics: function () {
      const demandMap = this.calculateDemandMap();
      const upcomingOrders = this.getUpcomingOrders();
      const demand7DaysChiles = upcomingOrders.reduce((sum, o) => sum + (parseInt(o.qty, 10) || 0), 0);

      let urgentAlertsCount = 0;
      let suggestedAlertsCount = 0;
      let totalRestockCost = 0;

      const itemAnalysis = this.items.map(item => {
        const demand = demandMap[item.id] || { reservedAll: 0, lookahead7d: 0 };
        const demand7d = demand.lookahead7d;
        const reserved = demand.reservedAll;
        const availableStock = item.stockActual - reserved;
        const projectedBalance = item.stockActual - demand7d;

        let status = 'saludable'; // 'saludable', 'sugerido', 'urgente'
        let deficit = 0;
        let suggestedPurchaseQty = 0;
        let estimatedCost = 0;

        if (projectedBalance < 0) {
          status = 'urgente';
          deficit = Math.abs(projectedBalance);
          urgentAlertsCount += 1;

          // Purchase quantity based on package unit or deficit
          const pkgSize = Math.max(0.1, Number(item.packageSize) || 1);
          const pkgPrice = Math.max(0, Number(item.packagePrice) || 0);
          const packagesNeeded = Math.ceil(deficit / pkgSize);
          suggestedPurchaseQty = packagesNeeded * pkgSize;
          estimatedCost = packagesNeeded * pkgPrice;
          totalRestockCost += estimatedCost;
        } else if (projectedBalance < item.minStock) {
          status = 'sugerido';
          suggestedAlertsCount += 1;
          const deficitToMin = item.minStock - projectedBalance;
          const pkgSize = Math.max(0.1, Number(item.packageSize) || 1);
          const pkgPrice = Math.max(0, Number(item.packagePrice) || 0);
          const packagesNeeded = Math.ceil(deficitToMin / pkgSize);
          suggestedPurchaseQty = packagesNeeded * pkgSize;
          estimatedCost = packagesNeeded * pkgPrice;
        }

        return {
          ...item,
          demand7d,
          reserved,
          availableStock,
          projectedBalance,
          status,
          deficit,
          suggestedPurchaseQty,
          estimatedCost
        };
      });

      return {
        totalMonitored: this.items.length,
        urgentAlertsCount,
        suggestedAlertsCount,
        totalAlertsCount: urgentAlertsCount + suggestedAlertsCount,
        demand7DaysChiles,
        totalRestockCost,
        itemAnalysis
      };
    },

    // 5. Main Render Coordinator
    render: function () {
      this.renderKpiCards();
      this.renderRestockAlertsTable();
      this.renderMasterCatalogTable();
    },

    // Top KPI Cards Renderer
    renderKpiCards: function () {
      const m = this.getMetrics();

      const kpiMonitoredEl = document.getElementById('inv-kpi-monitored');
      const kpiAlertsEl = document.getElementById('inv-kpi-alerts-count');
      const kpiAlertsSubEl = document.getElementById('inv-kpi-alerts-sub');
      const kpiDemandChilesEl = document.getElementById('inv-kpi-demand-chiles');
      const kpiRestockCostEl = document.getElementById('inv-kpi-restock-cost');

      if (kpiMonitoredEl) kpiMonitoredEl.textContent = m.totalMonitored;
      if (kpiAlertsEl) kpiAlertsEl.textContent = m.urgentAlertsCount;
      if (kpiAlertsSubEl) {
        kpiAlertsSubEl.textContent = `${m.urgentAlertsCount} críticas • ${m.suggestedAlertsCount} sugeridas`;
      }
      if (kpiDemandChilesEl) kpiDemandChilesEl.textContent = `${m.demand7DaysChiles} chiles`;
      if (kpiRestockCostEl) kpiRestockCostEl.textContent = formatMoney(m.totalRestockCost);
    },

    // Table B: Restock Recomendado & Alertas de Compra
    renderRestockAlertsTable: function () {
      const tbody = document.getElementById('inventory-alerts-table-body');
      if (!tbody) return;

      const m = this.getMetrics();
      const filter = this.filters.actionFilter;
      const search = (this.filters.search || '').toLowerCase().trim();

      let itemsToDisplay = m.itemAnalysis.filter(item => {
        if (search) {
          const matchName = item.name.toLowerCase().includes(search);
          const matchStore = (item.store || '').toLowerCase().includes(search);
          if (!matchName && !matchStore) return false;
        }

        if (filter === 'urgente') {
          return item.status === 'urgente' || item.status === 'sugerido';
        } else if (filter === 'ingrediente') {
          return item.category !== 'empaque';
        } else if (filter === 'empaque') {
          return item.category === 'empaque';
        }
        return true;
      });

      // Sort with critical urgent deficits first
      itemsToDisplay.sort((a, b) => {
        if (a.status === 'urgente' && b.status !== 'urgente') return -1;
        if (b.status === 'urgente' && a.status !== 'urgente') return 1;
        if (a.status === 'sugerido' && b.status === 'saludable') return -1;
        if (b.status === 'sugerido' && a.status === 'saludable') return 1;
        return a.name.localeCompare(b.name);
      });

      const summaryBadge = document.getElementById('alerts-filter-summary');
      if (summaryBadge) {
        summaryBadge.textContent = `Mostrando ${itemsToDisplay.length} insumos analizados`;
      }

      if (itemsToDisplay.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="py-12 text-center text-slate-500">
              <div class="max-w-xs mx-auto space-y-2">
                <p class="font-bold text-slate-800 text-sm">Inventario en Nivel Óptimo</p>
                <p class="text-xs text-slate-400">No hay déficits en la ventana proyectada de demanda.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = itemsToDisplay.map(item => {
        // Status Badge
        let statusBadge = '';
        if (item.status === 'urgente') {
          statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-700 border border-rose-200/80 font-numeric shadow-xs">Restock Urgente</span>`;
        } else if (item.status === 'sugerido') {
          statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-200/80 font-numeric shadow-xs">Restock Sugerido</span>`;
        } else {
          statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 border border-emerald-200/60 font-numeric">Stock Saludable</span>`;
        }

        // Category Pill
        const isEmpaque = (item.category === 'empaque');
        const catBadge = isEmpaque
          ? `<span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 text-[10px] font-bold">Empaque</span>`
          : `<span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold">Ingrediente</span>`;

        // Deficit / Balance Display
        let balanceDisplay = '';
        if (item.projectedBalance < 0) {
          balanceDisplay = `<span class="text-rose-600 font-extrabold font-numeric">-${formatNumber(item.deficit)} ${item.unit}</span>`;
        } else {
          balanceDisplay = `<span class="text-emerald-700 font-semibold font-numeric">+${formatNumber(item.projectedBalance)} ${item.unit}</span>`;
        }

        // Suggested purchase
        let purchaseDisplay = '';
        if (item.suggestedPurchaseQty > 0) {
          purchaseDisplay = `<strong class="text-slate-900 font-numeric">${formatNumber(item.suggestedPurchaseQty)} ${item.unit}</strong>`;
        } else {
          purchaseDisplay = `<span class="text-slate-400 text-[11px]">Cubierto</span>`;
        }

        return `
          <tr class="liquid-table-row hover:bg-white/60 transition-colors">
            <!-- 1. Insumo / Material -->
            <td class="py-3 px-3 font-bold text-slate-900">
              ${escapeHtml(item.name)}
            </td>

            <!-- 2. Tipo -->
            <td class="py-3 px-2 text-center whitespace-nowrap">
              ${catBadge}
            </td>

            <!-- 3. Stock Físico Actual -->
            <td class="py-3 px-2 text-right font-numeric font-bold text-slate-800">
              ${formatNumber(item.stockActual)} <span class="text-slate-500 font-normal text-xs">${item.unit}</span>
            </td>

            <!-- 4. Demanda 7 Días -->
            <td class="py-3 px-2 text-right font-numeric font-bold text-slate-700">
              ${formatNumber(item.demand7d)} <span class="text-slate-400 font-normal text-xs">${item.unit}</span>
            </td>

            <!-- 5. Déficit / Sobrante -->
            <td class="py-3 px-2 text-right whitespace-nowrap">
              ${balanceDisplay}
            </td>

            <!-- 6. Compra Sugerida -->
            <td class="py-3 px-2 text-right whitespace-nowrap">
              ${purchaseDisplay}
            </td>

            <!-- 7. Proveedor Habitual -->
            <td class="py-3 px-2 text-left text-slate-600">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-white/70 border border-slate-200 text-xs text-slate-700 font-medium">
                ${escapeHtml(item.store || 'Proveedor')}
              </span>
            </td>

            <!-- 8. Costo Estimado ($ MXN) & Estatus -->
            <td class="py-3 px-3 text-right whitespace-nowrap">
              <div class="flex flex-col items-end">
                <span class="font-numeric font-extrabold text-slate-900">${formatMoney(item.estimatedCost)}</span>
                <div class="mt-0.5">${statusBadge}</div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    },

    // Table C: Catálogo Maestro de Inventario Físico (Editable on-hand stock)
    renderMasterCatalogTable: function () {
      const tbody = document.getElementById('inventory-catalog-table-body');
      if (!tbody) return;

      const m = this.getMetrics();
      const catFilter = this.filters.catalogFilter;

      let itemsToDisplay = m.itemAnalysis.filter(item => {
        if (catFilter !== 'todos') {
          if (catFilter === 'empaque' && item.category !== 'empaque') return false;
          if (catFilter !== 'empaque' && item.category !== catFilter) return false;
        }
        return true;
      });

      const catalogCountBadge = document.getElementById('catalog-items-count');
      if (catalogCountBadge) {
        catalogCountBadge.textContent = `${itemsToDisplay.length} Insumos`;
      }

      tbody.innerHTML = itemsToDisplay.map(item => {
        // Status indicator
        let statusDot = '<span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>';
        if (item.status === 'urgente') {
          statusDot = '<span class="w-2 h-2 rounded-full bg-rose-500 mr-1.5 animate-pulse"></span>';
        } else if (item.status === 'sugerido') {
          statusDot = '<span class="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>';
        }

        // Category Tag
        let catLabel = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        if (item.category === 'nogada') catLabel = 'Nogada';
        if (item.category === 'relleno') catLabel = 'Relleno';
        if (item.category === 'extras') catLabel = 'Extras';
        if (item.category === 'empaque') catLabel = 'Empaque';

        return `
          <tr class="liquid-table-row hover:bg-white/60 transition-colors">
            <!-- 1. Insumo -->
            <td class="py-2.5 px-3 font-bold text-slate-900">
              <div class="flex items-center">
                ${statusDot}
                <span>${escapeHtml(item.name)}</span>
              </div>
            </td>

            <!-- 2. Categoría -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              <span class="px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-xs font-semibold text-slate-700">
                ${catLabel}
              </span>
            </td>

            <!-- 3. Stock Actual (Inline Editable Input) -->
            <td class="py-2.5 px-2 text-right w-36">
              <input type="number" step="any" min="0" value="${item.stockActual}"
                onchange="InventoryApp.updateStock('${item.id}', this.value)"
                onblur="InventoryApp.updateStock('${item.id}', this.value)"
                onkeydown="if(event.key==='Enter'){this.blur();}"
                class="w-full text-right liquid-input px-2.5 py-1 text-xs font-extrabold text-slate-900 font-numeric"
                title="Haz clic para ajustar existencias físicas">
            </td>

            <!-- 4. Unidad -->
            <td class="py-2.5 px-2 text-center text-xs text-slate-500 font-medium">
              ${item.unit}
            </td>

            <!-- 5. Stock Reservado (Pedidos Activos) -->
            <td class="py-2.5 px-2 text-right font-numeric font-bold text-amber-700">
              ${formatNumber(item.reserved)} <span class="text-xs text-slate-400 font-normal">${item.unit}</span>
            </td>

            <!-- 6. Stock Disponible Real -->
            <td class="py-2.5 px-2 text-right font-numeric font-extrabold ${item.availableStock < 0 ? 'text-rose-600' : 'text-emerald-700'}">
              ${formatNumber(item.availableStock)} <span class="text-xs font-normal ${item.availableStock < 0 ? 'text-rose-400' : 'text-emerald-500'}">${item.unit}</span>
            </td>

            <!-- 7. Acciones -->
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              ${item.isCustom ? `
                <button onclick="InventoryApp.deleteCustomItem('${item.id}')" title="Eliminar insumo personalizado"
                  class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                </button>
              ` : `
                <span class="text-[10px] text-slate-400 font-medium">Oficial</span>
              `}
            </td>
          </tr>
        `;
      }).join('');
    },

    // 6. User Mutations & Storage Updates
    updateStock: function (id, newStock) {
      const item = this.items.find(i => i.id === id);
      if (!item) return;

      const parsed = Math.max(0, parseFloat(newStock) || 0);
      item.stockActual = parsed;
      this.saveToStorage(true);
      this.render();

      if (window.showToast) {
        window.showToast(`Stock de "${item.name}" actualizado a ${formatNumber(parsed)} ${item.unit}`, 'info');
      }
    },

    setActionFilter: function (filterName) {
      this.filters.actionFilter = filterName;
      document.querySelectorAll('.inv-filter-btn').forEach(btn => {
        const f = btn.getAttribute('data-filter');
        if (f === filterName) {
          btn.className = 'inv-filter-btn px-3 py-1 rounded-full text-xs font-bold bg-[#1E222B] text-white shadow-xs transition-all';
        } else {
          btn.className = 'inv-filter-btn px-3 py-1 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all';
        }
      });
      this.renderRestockAlertsTable();
    },

    setSearch: function (query) {
      this.filters.search = query || '';
      this.renderRestockAlertsTable();
    },

    setCatalogFilter: function (category) {
      this.filters.catalogFilter = category;
      document.querySelectorAll('.cat-filter-btn').forEach(btn => {
        const c = btn.getAttribute('data-cat');
        if (c === category) {
          btn.className = 'cat-filter-btn px-3 py-1 rounded-full text-xs font-bold bg-[#1E222B] text-white shadow-xs transition-all';
        } else {
          btn.className = 'cat-filter-btn px-3 py-1 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all';
        }
      });
      this.renderMasterCatalogTable();
    },

    addNewCustomItem: function (itemData) {
      const newId = 'custom-' + Date.now();
      const newItem = {
        id: newId,
        name: itemData.name.trim(),
        category: itemData.category || 'ingrediente',
        stockActual: Math.max(0, parseFloat(itemData.stockActual) || 0),
        unit: itemData.unit || 'pza',
        minStock: Math.max(0, parseFloat(itemData.minStock) || 10),
        packageSize: Math.max(0.1, parseFloat(itemData.packageSize) || 1),
        packagePrice: Math.max(0, parseFloat(itemData.packagePrice) || 0),
        store: itemData.store || 'Proveedor Local',
        isCustom: true
      };

      this.items.push(newItem);
      this.saveToStorage(true);
      this.render();

      if (window.showToast) {
        window.showToast(`Insumo "${newItem.name}" añadido al catálogo`, 'info');
      }
    },

    deleteCustomItem: function (id) {
      const idx = this.items.findIndex(i => i.id === id);
      if (idx === -1) return;

      const deleted = this.items.splice(idx, 1)[0];
      this.saveToStorage(true);
      this.render();

      if (window.showToast) {
        window.showToast(`Insumo "${deleted.name}" eliminado del catálogo`, 'warning');
      }
    },

    resetToSeedData: function () {
      this.items = JSON.parse(JSON.stringify(INITIAL_INVENTORY_ITEMS));
      this.saveToStorage(true);
      this.syncWithRecipe();
      this.render();

      if (window.showToast) {
        window.showToast('Inventario restaurado al balance físico inicial auditado', 'info');
      }
    },

    exportCsv: function () {
      const m = this.getMetrics();
      let csv = '\uFEFF'; // UTF-8 BOM
      csv += 'Insumo / Material,Categoría,Stock Físico Actual,Unidad,Demanda 7 Días,Déficit / Sobrante,Compra Sugerida,Proveedor Habitual,Costo Estimado ($ MXN),Estatus\n';

      m.itemAnalysis.forEach(i => {
        const cleanName = `"${(i.name || '').replace(/"/g, '""')}"`;
        const cleanStore = `"${(i.store || '').replace(/"/g, '""')}"`;
        const balance = i.projectedBalance < 0 ? `-${i.deficit}` : `+${i.projectedBalance}`;
        csv += `${cleanName},${i.category},${i.stockActual},${i.unit},${i.demand7d},${balance},${i.suggestedPurchaseQty},${cleanStore},${i.estimatedCost},${i.status}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Nogadisima_Inventario_Restock_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (window.showToast) {
        window.showToast('Archivo CSV de Inventario descargado exitosamente', 'info');
      }
    }
  };

  // Expose globally
  window.InventoryApp = InventoryApp;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InventoryApp.init());
  } else {
    InventoryApp.init();
  }
})();
