/**
 * NOGADÍSIMA — UNIFIED MULTI-YEAR GLOBAL REACTIVE STATE STORE & EVENT BUS
 * Centralized Single Source of Truth for Recipe, Investment, Orders, Inventory & Profit Draws
 * Supports Multi-Year Season Scoping (2026 vs. 2027) with Dynamic State Isolation
 * Persists Unified Database Schema to localStorage under 'nogadisima_db_v2'
 */

(function (window) {
  'use strict';

  // Storage Keys
  const STORAGE_KEYS = {
    DB_V2: 'nogadisima_db_v2',
    ACTIVE_YEAR: 'nogadisima_active_year',
    // 100% backward-compatible legacy keys for historical fallback & 2026 mirror
    RECIPE_LEGACY: 'nogadisima_recipe_engine_v5',
    INVESTMENTS_LEGACY: 'nogadisima_investments_v1',
    ORDERS_LEGACY: 'nogadisima_orders_v3',
    PROFIT_DRAWS_LEGACY: 'nogadisima_profit_expenses_v1',
    INVENTORY_LEGACY: 'nogadisima_inventory_v3',
    CUTOFF_DAY_LEGACY: 'nogadisima_cutoff_day'
  };

  const NogaStore = {
    // 1. Centralized Multi-Year Database Schema
    db: {
      activeYear: '2026',
      years: {
        '2026': {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30
        },
        '2027': {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30
        }
      }
    },

    // Active Year In-Memory State Pointer
    state: {
      recipe: null,
      investments: [],
      orders: [],
      profitDraws: [],
      inventory: [],
      cutoffDay: 30
    },

    // 2. Pub-Sub Event Emitter
    _listeners: {},

    init: function () {
      this.loadAll();
      this.ensureSeedData();
      this._bindStorageListener();
      this.updateYearSelectorUI(this.getActiveYear());
      this.updateYearDependentFormElements(this.getActiveYear());
      console.log('NogaStore: Multi-Year Global Reactive State Store initialized (Active: ' + this.getActiveYear() + ')');
    },

    getActiveYear: function () {
      return (this.db && this.db.activeYear) ? this.db.activeYear : '2026';
    },

    // 3. Multi-Year Season Initialization & Seeding Engine
    ensureSeedData: function () {
      let mutated = false;
      const y26 = this.db.years['2026'];
      const y27 = this.db.years['2027'];

      // --- 2026 BASELINE SEEDING ---
      if (!y26.recipe && window.DEFAULT_RECIPE_DATA) {
        y26.recipe = JSON.parse(JSON.stringify(window.DEFAULT_RECIPE_DATA));
        mutated = true;
      }
      if ((!y26.investments || y26.investments.length === 0) && window.INITIAL_INVESTMENTS) {
        y26.investments = JSON.parse(JSON.stringify(window.INITIAL_INVESTMENTS));
        mutated = true;
      }
      if ((!y26.orders || y26.orders.length === 0) && window.INITIAL_ORDERS) {
        y26.orders = JSON.parse(JSON.stringify(window.INITIAL_ORDERS));
        mutated = true;
      }
      if ((!y26.profitDraws || y26.profitDraws.length === 0) && window.INITIAL_PROFIT_EXPENSES) {
        y26.profitDraws = JSON.parse(JSON.stringify(window.INITIAL_PROFIT_EXPENSES));
        mutated = true;
      }
      if ((!y26.inventory || y26.inventory.length === 0) && window.INITIAL_INVENTORY_ITEMS) {
        y26.inventory = JSON.parse(JSON.stringify(window.INITIAL_INVENTORY_ITEMS));
        mutated = true;
      }

      // --- 2027 NEW SEASON INITIALIZATION ---
      // 1. "Presupuesto de Receta": CLONED from the 2026 baseline recipe as starting point
      if (!y27.recipe) {
        const sourceRecipe = y26.recipe || window.DEFAULT_RECIPE_DATA;
        if (sourceRecipe) {
          y27.recipe = JSON.parse(JSON.stringify(sourceRecipe));
          mutated = true;
        }
      }
      // 2. "Inversión & Gastos": COMPLETELY EMPTY
      if (!Array.isArray(y27.investments)) {
        y27.investments = [];
        mutated = true;
      }
      // 3. "Control de Pedidos": COMPLETELY EMPTY
      if (!Array.isArray(y27.orders)) {
        y27.orders = [];
        mutated = true;
      }
      // 4. "Gastos de Ganancia": COMPLETELY EMPTY
      if (!Array.isArray(y27.profitDraws)) {
        y27.profitDraws = [];
        mutated = true;
      }
      // 5. "Inventario & Reabastecimiento": COMPLETELY EMPTY / ZERO STOCK
      if (!Array.isArray(y27.inventory) || y27.inventory.length === 0) {
        const baseInv = (y26.inventory && y26.inventory.length > 0) ? y26.inventory : (window.INITIAL_INVENTORY_ITEMS || []);
        y27.inventory = this.initializeEmptyInventoryFromRecipe(y27.recipe || y26.recipe, baseInv);
        mutated = true;
      }

      // Sync active state pointer
      this._syncStatePointer();

      if (mutated) {
        this.save();
      }
    },

    // Generates an empty inventory where every ingredient and packaging item starts with physical stock = 0
    initializeEmptyInventoryFromRecipe: function (recipeData, baselineInventory) {
      const baseItems = (baselineInventory && baselineInventory.length > 0)
        ? baselineInventory
        : (window.INITIAL_INVENTORY_ITEMS || []);

      if (baseItems.length > 0) {
        return baseItems.map(item => ({
          ...JSON.parse(JSON.stringify(item)),
          stockDiego: 0,
          stockAngy: 0,
          stockActual: 0
        }));
      }

      // Fallback builder from recipe catalog if inventory items are not yet loaded
      const items = [];
      const recipe = recipeData || window.DEFAULT_RECIPE_DATA;
      if (recipe && Array.isArray(recipe.categories)) {
        recipe.categories.forEach(cat => {
          cat.items.forEach(recItem => {
            items.push({
              id: recItem.id,
              name: recItem.name,
              category: cat.id,
              stockDiego: 0,
              stockAngy: 0,
              stockActual: 0,
              unit: recItem.unit || 'gr',
              minStock: Math.ceil((Number(recItem.qty) || 1) * 1.5),
              packageSize: Number(recItem.packageSize) || 1,
              packagePrice: Number(recItem.generalPrice) || 0,
              store: recItem.store || 'Proveedor',
              isCustom: false
            });
          });
        });
      }
      return items;
    },

    _syncStatePointer: function () {
      const year = this.getActiveYear();
      if (!this.db.years[year]) {
        this.db.years[year] = {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30
        };
      }
      const yData = this.db.years[year];
      this.state.recipe = yData.recipe;
      this.state.investments = yData.investments || [];
      this.state.orders = yData.orders || [];
      this.state.profitDraws = yData.profitDraws || [];
      this.state.inventory = yData.inventory || [];
      this.state.cutoffDay = yData.cutoffDay || 30;
    },

    // 4. Smooth Year Switching Engine (2026 vs. 2027)
    setYear: function (targetYear, showToast = true) {
      if (targetYear !== '2026' && targetYear !== '2027') {
        console.warn('NogaStore: Invalid year target:', targetYear);
        return;
      }

      const prevYear = this.getActiveYear();

      // Step A: Preserve any unsaved in-memory edits for the outgoing year
      this._captureCurrentAppState(prevYear);

      // Step B: Set new active year
      this.db.activeYear = targetYear;
      this._syncStatePointer();

      // Step C: Persist to localStorage
      this.save();

      // Step D: Update UI segmented pills
      this.updateYearSelectorUI(targetYear);
      this.updateYearDependentFormElements(targetYear);

      // Step E: Push new year scoped data to all application modules
      this._pushStateToModules();

      // Step F: Trigger immediate cross-module re-renders
      this._reRenderAllModules();

      // Step G: Emit year:changed event
      this.emit('year:changed', { year: targetYear, previousYear: prevYear });
      this.emit('state:changed', { event: 'year:changed', year: targetYear });

      if (showToast && window.showToast) {
        window.showToast(`Temporada ${targetYear} activada`, 'info');
      }
      console.log(`NogaStore: Switched season from ${prevYear} to ${targetYear}`);
    },

    _captureCurrentAppState: function (year) {
      if (!this.db.years[year]) return;

      if (window.RecipeApp && window.RecipeApp.data) {
        this.db.years[year].recipe = window.RecipeApp.data;
      }
      if (window.InvestmentApp && Array.isArray(window.InvestmentApp.items)) {
        this.db.years[year].investments = window.InvestmentApp.items;
      }
      if (window.OrdersApp && Array.isArray(window.OrdersApp.orders)) {
        this.db.years[year].orders = window.OrdersApp.orders;
      }
      if (window.OrdersApp && Array.isArray(window.OrdersApp.profitExpenses)) {
        this.db.years[year].profitDraws = window.OrdersApp.profitExpenses;
      }
      if (window.InventoryApp && Array.isArray(window.InventoryApp.items)) {
        this.db.years[year].inventory = window.InventoryApp.items;
      }
    },

    _pushStateToModules: function () {
      const activeYear = this.getActiveYear();
      const currentYearData = this.db.years[activeYear];

      if (window.RecipeApp) {
        window.RecipeApp.data = currentYearData.recipe;
      }

      if (window.InvestmentApp) {
        window.InvestmentApp.items = currentYearData.investments || [];
        window.InvestmentApp.cutoffDay = currentYearData.cutoffDay || 30;
        if (window.InvestmentApp.filters) {
          window.InvestmentApp.filters.cutoffMonth = 'Todos';
        }
        if (window.InvestmentApp.pagination) {
          window.InvestmentApp.pagination.currentPage = 1;
        }
      }

      if (window.OrdersApp) {
        window.OrdersApp.orders = currentYearData.orders || [];
        window.OrdersApp.profitExpenses = currentYearData.profitDraws || [];
        if (window.OrdersApp.pagination) {
          window.OrdersApp.pagination.currentPage = 1;
        }
      }

      if (window.InventoryApp) {
        window.InventoryApp.items = currentYearData.inventory || [];
        if (typeof window.InventoryApp.sanitizeAndFilterInventory === 'function') {
          window.InventoryApp.sanitizeAndFilterInventory();
        }
        if (window.InventoryApp.pagination) {
          window.InventoryApp.pagination.currentPage = 1;
        }
      }
    },

    _reRenderAllModules: function () {
      // 1. Presupuesto de Receta
      if (window.renderRecipeCards && typeof window.renderRecipeCards === 'function') {
        window.renderRecipeCards();
      }

      // 2. Inversión & Gastos
      if (window.InvestmentApp && typeof window.InvestmentApp.render === 'function') {
        window.InvestmentApp.render();
      }

      // 3. Control de Pedidos
      if (window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }

      // 4. Inventario & Reabastecimiento
      if (window.InventoryApp && typeof window.InventoryApp.render === 'function') {
        window.InventoryApp.render();
      }
    },

    // 5. Header Interactive Season Pill Visual State
    updateYearSelectorUI: function (activeYear) {
      const year = activeYear || this.getActiveYear();
      const btn2026 = document.getElementById('season-btn-2026');
      const btn2027 = document.getElementById('season-btn-2027');

      const activeClasses = ['bg-white', 'text-slate-900', 'shadow-sm', 'font-bold', 'rounded-lg'];
      const inactiveClasses = ['text-slate-500', 'hover:text-slate-800', 'font-semibold'];

      if (btn2026 && btn2027) {
        if (year === '2026') {
          btn2026.classList.remove(...inactiveClasses);
          btn2026.classList.add(...activeClasses);

          btn2027.classList.remove(...activeClasses);
          btn2027.classList.add(...inactiveClasses);
        } else {
          btn2027.classList.remove(...inactiveClasses);
          btn2027.classList.add(...activeClasses);

          btn2026.classList.remove(...activeClasses);
          btn2026.classList.add(...inactiveClasses);
        }
      }
    },

    // Updates cutoff selects and date inputs according to active year
    updateYearDependentFormElements: function (activeYear) {
      const year = activeYear || this.getActiveYear();

      // Inversión Modal: Cutoff Month Select
      const monthSelect = document.getElementById('new-exp-month');
      if (monthSelect) {
        const currentVal = monthSelect.value;
        monthSelect.innerHTML = `
          <option value="Agosto ${year}">Agosto ${year}</option>
          <option value="Septiembre ${year}" selected>Septiembre ${year}</option>
          <option value="Octubre ${year}">Octubre ${year}</option>
        `;
        if (currentVal && currentVal.includes(year)) {
          monthSelect.value = currentVal;
        }
      }

      // Inversión Modal: Default Date
      const expDateInput = document.getElementById('new-exp-date');
      if (expDateInput) {
        expDateInput.value = `${year}-09-30`;
      }

      // Orders Modal: Default Dates
      const orderDateInput = document.getElementById('new-order-date');
      if (orderDateInput) orderDateInput.value = `${year}-09-15`;

      const prodDateInput = document.getElementById('new-order-prod-date');
      if (prodDateInput) prodDateInput.value = `${year}-09-15`;

      const delivDateInput = document.getElementById('new-order-deliv-date');
      if (delivDateInput) delivDateInput.value = `${year}-09-16`;
    },

    // 6. Pub-Sub Event Emitter
    on: function (event, callback) {
      if (!this._listeners[event]) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(callback);
      return () => this.off(event, callback);
    },

    off: function (event, callback) {
      if (!this._listeners[event]) return;
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    },

    emit: function (event, payload = {}) {
      if (this._listeners[event]) {
        this._listeners[event].forEach(callback => {
          try {
            callback(payload);
          } catch (err) {
            console.error(`NogaStore: Error executing listener for event "${event}":`, err);
          }
        });
      }

      if (event !== 'state:changed' && this._listeners['state:changed']) {
        this._listeners['state:changed'].forEach(callback => {
          try {
            callback({ event, ...payload });
          } catch (err) {
            console.error('NogaStore: Error executing state:changed listener:', err);
          }
        });
      }
    },

    // 7. Storage Persistence Engine
    loadAll: function () {
      let loadedDb = null;
      try {
        const dbStr = localStorage.getItem(STORAGE_KEYS.DB_V2);
        if (dbStr) {
          loadedDb = JSON.parse(dbStr);
        }
      } catch (e) {
        console.warn('NogaStore: Error parsing database from localStorage', e);
      }

      if (loadedDb && loadedDb.years) {
        this.db = loadedDb;
        if (!this.db.years['2026']) this.db.years['2026'] = {};
        if (!this.db.years['2027']) this.db.years['2027'] = {};

        // Stored active year preference
        const storedActiveYear = localStorage.getItem(STORAGE_KEYS.ACTIVE_YEAR);
        if (storedActiveYear === '2026' || storedActiveYear === '2027') {
          this.db.activeYear = storedActiveYear;
        } else if (!this.db.activeYear) {
          this.db.activeYear = '2026';
        }
      } else {
        // First-time migration: read legacy keys into 2026 historical container
        this._migrateLegacyStorageInto2026();
      }

      this._syncStatePointer();
    },

    _migrateLegacyStorageInto2026: function () {
      const y26 = this.db.years['2026'];
      try {
        const recipeStr = localStorage.getItem(STORAGE_KEYS.RECIPE_LEGACY);
        if (recipeStr) y26.recipe = JSON.parse(recipeStr);
      } catch (e) {}

      try {
        const invStr = localStorage.getItem(STORAGE_KEYS.INVESTMENTS_LEGACY);
        if (invStr) {
          const parsed = JSON.parse(invStr);
          if (Array.isArray(parsed) && parsed.length > 0) y26.investments = parsed;
        }
      } catch (e) {}

      try {
        const ordStr = localStorage.getItem(STORAGE_KEYS.ORDERS_LEGACY);
        if (ordStr) {
          const parsed = JSON.parse(ordStr);
          if (Array.isArray(parsed) && parsed.length > 0) y26.orders = parsed;
        }
      } catch (e) {}

      try {
        const drawStr = localStorage.getItem(STORAGE_KEYS.PROFIT_DRAWS_LEGACY);
        if (drawStr) {
          const parsed = JSON.parse(drawStr);
          if (Array.isArray(parsed) && parsed.length > 0) y26.profitDraws = parsed;
        }
      } catch (e) {}

      try {
        const invenStr = localStorage.getItem(STORAGE_KEYS.INVENTORY_LEGACY);
        if (invenStr) {
          const parsed = JSON.parse(invenStr);
          if (Array.isArray(parsed) && parsed.length > 0) y26.inventory = parsed;
        }
      } catch (e) {}

      try {
        const dayStr = localStorage.getItem(STORAGE_KEYS.CUTOFF_DAY_LEGACY);
        if (dayStr) y26.cutoffDay = parseInt(dayStr, 10) || 30;
      } catch (e) {}

      this.db.activeYear = '2026';
    },

    save: function () {
      try {
        const year = this.getActiveYear();
        if (this.db.years[year]) {
          this.db.years[year].recipe = this.state.recipe;
          this.db.years[year].investments = this.state.investments;
          this.db.years[year].orders = this.state.orders;
          this.db.years[year].profitDraws = this.state.profitDraws;
          this.db.years[year].inventory = this.state.inventory;
          this.db.years[year].cutoffDay = this.state.cutoffDay;
        }

        // Persist primary database
        localStorage.setItem(STORAGE_KEYS.DB_V2, JSON.stringify(this.db));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, year);

        // Keep 2026 legacy keys mirrored for 100% backward-compatibility
        if (year === '2026') {
          if (this.state.recipe) {
            localStorage.setItem(STORAGE_KEYS.RECIPE_LEGACY, JSON.stringify(this.state.recipe));
          }
          if (Array.isArray(this.state.investments)) {
            localStorage.setItem(STORAGE_KEYS.INVESTMENTS_LEGACY, JSON.stringify(this.state.investments));
          }
          if (Array.isArray(this.state.orders)) {
            localStorage.setItem(STORAGE_KEYS.ORDERS_LEGACY, JSON.stringify(this.state.orders));
          }
          if (Array.isArray(this.state.profitDraws)) {
            localStorage.setItem(STORAGE_KEYS.PROFIT_DRAWS_LEGACY, JSON.stringify(this.state.profitDraws));
          }
          if (Array.isArray(this.state.inventory)) {
            localStorage.setItem(STORAGE_KEYS.INVENTORY_LEGACY, JSON.stringify(this.state.inventory));
          }
          if (this.state.cutoffDay) {
            localStorage.setItem(STORAGE_KEYS.CUTOFF_DAY_LEGACY, String(this.state.cutoffDay));
          }
        }
      } catch (e) {
        console.error('NogaStore: Error persisting database to localStorage:', e);
      }
    },

    // 8. Reactive State Accessors (Year-Scoped)
    getInvestments: function () {
      return this.state.investments;
    },

    getOrders: function () {
      return this.state.orders;
    },

    getProfitDraws: function () {
      return this.state.profitDraws;
    },

    getRecipe: function () {
      return this.state.recipe;
    },

    getInventory: function () {
      return this.state.inventory;
    },

    getCutoffDay: function () {
      return this.state.cutoffDay;
    },

    // 9. Reactive State Mutators (Dispatch Cross-Tab Events)
    setInvestments: function (items, notifyOrigin = 'system', showToastNotification = true) {
      this.state.investments = items;
      this.save();
      this.emit('investment:changed', { source: notifyOrigin, items });
      this._triggerSyncFeedback('Inversión & Gastos', showToastNotification);

      if (window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }
      if (window.InventoryApp && typeof window.InventoryApp.render === 'function') {
        window.InventoryApp.render();
      }
    },

    setOrders: function (orders, notifyOrigin = 'system', showToastNotification = true) {
      this.state.orders = orders;
      this.save();
      this.emit('orders:changed', { source: notifyOrigin, orders });
      this._triggerSyncFeedback('Control de Pedidos', showToastNotification);

      if (window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }
      if (window.InventoryApp && typeof window.InventoryApp.render === 'function') {
        window.InventoryApp.render();
      }
    },

    setProfitDraws: function (draws, notifyOrigin = 'system', showToastNotification = true) {
      this.state.profitDraws = draws;
      this.save();
      this.emit('profitDraws:changed', { source: notifyOrigin, draws });
      this._triggerSyncFeedback('Gastos de la Ganancia', showToastNotification);

      if (window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }
    },

    setRecipe: function (recipe, notifyOrigin = 'system', showToastNotification = false) {
      this.state.recipe = recipe;
      this.save();
      this.emit('recipe:changed', { source: notifyOrigin, recipe });
      if (showToastNotification) {
        this._triggerSyncFeedback('Presupuesto de Receta', true);
      }
      if (window.InventoryApp && typeof window.InventoryApp.syncWithRecipe === 'function') {
        window.InventoryApp.syncWithRecipe();
      }
      if (window.InventoryApp && typeof window.InventoryApp.render === 'function') {
        window.InventoryApp.render();
      }
    },

    setInventory: function (items, notifyOrigin = 'system', showToastNotification = false) {
      this.state.inventory = items;
      this.save();
      this.emit('inventory:changed', { source: notifyOrigin, items });
      if (showToastNotification) {
        this._triggerSyncFeedback('Inventario', true);
      }
    },

    setCutoffDay: function (day, notifyOrigin = 'system') {
      this.state.cutoffDay = day;
      this.save();
      this.emit('cutoffDay:changed', { source: notifyOrigin, day });
    },

    // 10. Live Cross-Tab Calculations & Financial Equations Engine (Operating strictly within active year)
    getGlobalMetrics: function () {
      const inv = this.state.investments || [];
      const ord = this.state.orders || [];
      const draws = this.state.profitDraws || [];

      // Total Full Investment (All recorded purchases from "Inversión & Gastos" across all funding sources)
      const totalInvestmentAudited = inv.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      const totalInsumos = totalInvestmentAudited;

      // B. Ventas Totales & Chiles (Originating from "Control de Pedidos")
      const totalRevenue = ord.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
      const totalChiles = ord.reduce((sum, o) => sum + (Number(o.qty) || 0), 0);

      // C. Dynamic Ganancia Generada (Utilidad Bruta)
      const grossProfit = totalRevenue - totalInsumos;
      const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

      // D. Total Gastado de la Ganancia (Retiros / Gastos Personales)
      const totalProfitSpent = draws.reduce((sum, d) => sum + (Number(d.amount || d.price) || 0), 0);

      // E. Ganancia Neta Disponible / Remanente
      const availableProfit = grossProfit - totalProfitSpent;
      const availableMargin = totalRevenue > 0 ? (availableProfit / totalRevenue) * 100 : 0;

      // F. Cobranza (Pagado vs. No Pagado)
      const unpaidOrders = ord.filter(o => o.paidStatus === 'No pagado');
      const paidOrders = ord.filter(o => o.paidStatus === 'Pagado');
      const unpaid = unpaidOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
      const collected = totalRevenue - unpaid;
      const collectionRate = totalRevenue > 0 ? (collected / totalRevenue) * 100 : 0;

      // G. Kitchen & Delivery Pipeline
      const unpreppedOrders = ord.filter(o => o.prepStatus === 'No preparado');
      const unpreppedChiles = unpreppedOrders.reduce((sum, o) => sum + (Number(o.qty) || 0), 0);

      const undeliveredOrders = ord.filter(o => o.deliveryStatus === 'No entregado');
      const undeliveredChiles = undeliveredOrders.reduce((sum, o) => sum + (Number(o.qty) || 0), 0);

      const completedChiles = totalChiles - undeliveredChiles;

      return {
        totalInsumos,
        totalInvestmentAudited,
        totalRevenue,
        totalChiles,
        grossProfit,
        grossMargin,
        totalProfitSpent,
        availableProfit,
        availableMargin,
        collected,
        unpaid,
        collectionRate,
        paidCount: paidOrders.length,
        unpaidCount: unpaidOrders.length,
        totalOrders: ord.length,
        unpreppedChiles,
        unpreppedCount: unpreppedOrders.length,
        undeliveredChiles,
        undeliveredCount: undeliveredOrders.length,
        completedChiles,
        avgTicket: ord.length > 0 ? totalRevenue / ord.length : 0
      };
    },

    // 11. UI Indicator & Reactivity Feedback
    _syncTimeout: null,
    _toastDebounce: null,
    _triggerSyncFeedback: function (sourceLabel, showToastNotification) {
      const badgeText = document.getElementById('global-sync-text');
      const badgeEl = document.getElementById('global-sync-badge');
      const badgeDot = document.getElementById('global-sync-dot');

      if (badgeText && badgeEl) {
        badgeText.textContent = `Sincronizado: ${sourceLabel} actualizado`;
        badgeEl.classList.add('ring-2', 'ring-emerald-400/50', 'bg-emerald-50/80', 'text-emerald-900');
        if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-ping';

        clearTimeout(this._syncTimeout);
        this._syncTimeout = setTimeout(() => {
          badgeText.textContent = 'Sistema Sincronizado';
          badgeEl.classList.remove('ring-2', 'ring-emerald-400/50', 'bg-emerald-50/80', 'text-emerald-900');
          if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-glass-pulse';
        }, 3200);
      }

      if (showToastNotification && window.showToast) {
        clearTimeout(this._toastDebounce);
        this._toastDebounce = setTimeout(() => {
          window.showToast(`Sincronizado: ${sourceLabel} actualizado`, 'info');
        }, 150);
      }
    },

    // 12. Cross-Window / Cross-Tab Storage Listener
    _bindStorageListener: function () {
      window.addEventListener('storage', (e) => {
        if (!e.key) return;

        if (e.key === STORAGE_KEYS.DB_V2) {
          try {
            const remoteDb = JSON.parse(e.newValue || '{}');
            if (remoteDb && remoteDb.years) {
              this.db = remoteDb;
              this._syncStatePointer();
              this._pushStateToModules();
              this._reRenderAllModules();
              this.updateYearSelectorUI(this.getActiveYear());
              this._triggerSyncFeedback('Base de Datos', false);
            }
          } catch (err) {}
        } else if (e.key === STORAGE_KEYS.ACTIVE_YEAR) {
          const newYear = e.newValue;
          if (newYear === '2026' || newYear === '2027') {
            this.setYear(newYear, false);
          }
        }
      });
    }
  };

  // Expose to window and initialize immediately
  window.NogaStore = NogaStore;
  NogaStore.init();
})(window);
