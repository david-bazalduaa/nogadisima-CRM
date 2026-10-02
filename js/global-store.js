/**
 * NOGADÍSIMA — SCALABLE MULTI-YEAR GLOBAL REACTIVE STATE STORE (2026 - 2030)
 * Centralized Single Source of Truth for Recipe, Investment, Orders, Inventory & Profit Draws
 * Supports 5-Year Rolling Horizon (2026, 2027, 2028, 2029, 2030) with Dynamic State Isolation
 * Persists Unified Multiverse Database to localStorage under 'nogadisima_multiverse_v1'
 */

(function (window) {
  'use strict';

  // 5-Year Rolling Horizon Constants
  const SUPPORTED_YEARS = ['2026', '2027', '2028', '2029', '2030'];

  // Storage Keys
  const STORAGE_KEYS = {
    MULTIVERSE_V1: 'nogadisima_multiverse_v1',
    DB_V2: 'nogadisima_db_v2', // backward-compatible mirror
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
    SUPPORTED_YEARS: SUPPORTED_YEARS,

    // 1. Centralized Multi-Year Master Database Schema
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
        },
        '2028': {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30
        },
        '2029': {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30
        },
        '2030': {
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
      console.log('NogaStore: Scalable Multi-Year Store initialized (Active: ' + this.getActiveYear() + ')');
    },

    getActiveYear: function () {
      return (this.db && this.db.activeYear) ? this.db.activeYear : '2026';
    },

    // 3. Multi-Year Season Initialization & Seeding Engine
    generateFutureYears: function (yearList, baseRecipe, baselineInventory) {
      const result = {};
      yearList.forEach(year => {
        result[year] = {
          recipe: baseRecipe ? JSON.parse(JSON.stringify(baseRecipe)) : null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: this.initializeEmptyInventoryFromRecipe(baseRecipe, baselineInventory),
          cutoffDay: 30
        };
      });
      return result;
    },

    ensureSeedData: function () {
      let mutated = false;
      const y26 = this.db.years['2026'];

      // --- 2026 BASELINE SEEDING (100% Historical Real Data) ---
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

      const baselineRecipe = y26.recipe || window.DEFAULT_RECIPE_DATA;
      const baselineInv = (y26.inventory && y26.inventory.length > 0) ? y26.inventory : (window.INITIAL_INVENTORY_ITEMS || []);

      // --- FUTURE SEASONS (2027 through 2030) ---
      const futureYears = ['2027', '2028', '2029', '2030'];
      futureYears.forEach(year => {
        if (!this.db.years[year]) {
          this.db.years[year] = {
            recipe: null,
            investments: [],
            orders: [],
            profitDraws: [],
            inventory: [],
            cutoffDay: 30
          };
          mutated = true;
        }

        const yFuture = this.db.years[year];

        // 1. "Presupuesto de Receta": Cloned baseline recipe for future season costing
        if (!yFuture.recipe && baselineRecipe) {
          yFuture.recipe = JSON.parse(JSON.stringify(baselineRecipe));
          mutated = true;
        }
        // 2. "Inversión & Gastos": COMPLETELY EMPTY
        if (!Array.isArray(yFuture.investments)) {
          yFuture.investments = [];
          mutated = true;
        }
        // 3. "Control de Pedidos": COMPLETELY EMPTY
        if (!Array.isArray(yFuture.orders)) {
          yFuture.orders = [];
          mutated = true;
        }
        // 4. "Gastos de Ganancia": COMPLETELY EMPTY
        if (!Array.isArray(yFuture.profitDraws)) {
          yFuture.profitDraws = [];
          mutated = true;
        }
        // 5. "Inventario & Reabastecimiento": COMPLETELY EMPTY / ZERO STOCK
        if (!Array.isArray(yFuture.inventory) || yFuture.inventory.length === 0) {
          yFuture.inventory = this.initializeEmptyInventoryFromRecipe(yFuture.recipe || baselineRecipe, baselineInv);
          mutated = true;
        }
      });

      // Synchronize active year state pointer
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

    // 4. Smooth Year Switching Engine (2026 through 2030)
    setYear: function (targetYear, showToast = true) {
      if (!SUPPORTED_YEARS.includes(targetYear)) {
        console.warn('NogaStore: Unsupported year target:', targetYear);
        return;
      }

      const prevYear = this.getActiveYear();

      // Step A: Preserve any unsaved in-memory edits for outgoing year
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

    // 5. Header Interactive Season Dropdown Visual State (2026 - 2030)
    updateYearSelectorUI: function (activeYear) {
      const year = activeYear || this.getActiveYear();

      // Update active label on trigger pill
      const labelEl = document.getElementById('season-active-label');
      if (labelEl) {
        labelEl.textContent = year;
      }

      // Update dropdown option items
      SUPPORTED_YEARS.forEach(y => {
        const optBtn = document.getElementById(`season-opt-${y}`);
        if (optBtn) {
          const checkIcon = optBtn.querySelector('.season-check-icon');
          if (y === year) {
            optBtn.classList.add('bg-slate-100', 'text-slate-900', 'font-semibold');
            optBtn.classList.remove('text-slate-700', 'hover:bg-slate-100/70', 'font-medium');
            if (checkIcon) checkIcon.classList.remove('hidden');
          } else {
            optBtn.classList.remove('bg-slate-100', 'text-slate-900', 'font-semibold');
            optBtn.classList.add('text-slate-700', 'hover:bg-slate-100/70', 'font-medium');
            if (checkIcon) checkIcon.classList.add('hidden');
          }
        }
      });
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

    // 7. Storage Persistence Engine (Multiverse v1)
    loadAll: function () {
      let loadedDb = null;
      try {
        // Priority 1: Check master multiverse storage key
        const multiStr = localStorage.getItem(STORAGE_KEYS.MULTIVERSE_V1);
        if (multiStr) {
          loadedDb = JSON.parse(multiStr);
        } else {
          // Priority 2: Fallback to nogadisima_db_v2
          const db2Str = localStorage.getItem(STORAGE_KEYS.DB_V2);
          if (db2Str) {
            loadedDb = JSON.parse(db2Str);
          }
        }
      } catch (e) {
        console.warn('NogaStore: Error parsing database from localStorage', e);
      }

      if (loadedDb && loadedDb.years) {
        this.db = loadedDb;
        // Ensure all 5 rolling horizon years exist
        SUPPORTED_YEARS.forEach(y => {
          if (!this.db.years[y]) {
            this.db.years[y] = {
              recipe: null,
              investments: [],
              orders: [],
              profitDraws: [],
              inventory: [],
              cutoffDay: 30
            };
          }
        });

        // Stored active year preference
        const storedActiveYear = localStorage.getItem(STORAGE_KEYS.ACTIVE_YEAR);
        if (SUPPORTED_YEARS.includes(storedActiveYear)) {
          this.db.activeYear = storedActiveYear;
        } else if (!SUPPORTED_YEARS.includes(this.db.activeYear)) {
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

    // 7. Active Tab Detection Helper
    getActiveTab: function () {
      const panels = ['presupuesto', 'inversion', 'pedidos', 'inventario'];
      for (let i = 0; i < panels.length; i++) {
        const el = document.getElementById(`panel-${panels[i]}`);
        if (el && !el.classList.contains('hidden')) return panels[i];
      }
      return 'presupuesto';
    },

    // 8. High-Performance Debounced Persistence Architecture
    _saveTimer: null,
    _pendingSave: false,

    save: function (immediate = false) {
      // 1. Immediately sync in-memory active year pointers (0ms latency for queries)
      const year = this.getActiveYear();
      if (this.db.years && this.db.years[year]) {
        this.db.years[year].recipe = this.state.recipe;
        this.db.years[year].investments = this.state.investments;
        this.db.years[year].orders = this.state.orders;
        this.db.years[year].profitDraws = this.state.profitDraws;
        this.db.years[year].inventory = this.state.inventory;
        this.db.years[year].cutoffDay = this.state.cutoffDay;
      }

      this._pendingSave = true;

      if (immediate) {
        this._flushSave();
        return;
      }

      // Batch multiple rapid keystrokes/actions into a single non-blocking disk flush (250ms)
      if (!this._saveTimer) {
        this._saveTimer = setTimeout(() => {
          this._saveTimer = null;
          this._flushSave();
        }, 250);
      }
    },

    _flushSave: function () {
      if (!this._pendingSave) return;
      this._pendingSave = false;
      if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
      }

      try {
        const year = this.getActiveYear();
        const serializedDb = JSON.stringify(this.db);

        // Persist primary multiverse root database
        localStorage.setItem(STORAGE_KEYS.MULTIVERSE_V1, serializedDb);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, year);

        // Keep nogadisima_db_v2 synced for backward compatibility
        localStorage.setItem(STORAGE_KEYS.DB_V2, serializedDb);

        // Keep 2026 legacy keys mirrored for 100% historical data preservation
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

    // 9. Reactive State Accessors (Year-Scoped)
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

    // 10. Reactive State Mutators (Active-Tab-Scoped Re-rendering)
    setInvestments: function (items, notifyOrigin = 'system', showToastNotification = true, immediateSave = false) {
      this.state.investments = items;
      this.save(immediateSave);
      this.emit('investment:changed', { source: notifyOrigin, items });
      if (!String(notifyOrigin).includes('init') && showToastNotification) {
        this._triggerSyncFeedback('Inversión & Gastos', showToastNotification);
      }

      const activeTab = this.getActiveTab();
      if (activeTab === 'inversion' && window.InvestmentApp && typeof window.InvestmentApp.render === 'function') {
        window.InvestmentApp.render();
      } else if (activeTab === 'pedidos' && window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      } else if (activeTab === 'inventario' && window.InventoryApp && typeof window.InventoryApp.render === 'function') {
        window.InventoryApp.render();
      }
    },

    setOrders: function (orders, notifyOrigin = 'system', showToastNotification = true, immediateSave = false) {
      this.state.orders = orders;
      this.save(immediateSave);
      this.emit('orders:changed', { source: notifyOrigin, orders });
      if (!String(notifyOrigin).includes('init') && showToastNotification) {
        this._triggerSyncFeedback('Control de Pedidos', showToastNotification);
      }

      const activeTab = this.getActiveTab();
      if (activeTab === 'pedidos' && window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }
    },

    setProfitDraws: function (draws, notifyOrigin = 'system', showToastNotification = true, immediateSave = false) {
      this.state.profitDraws = draws;
      this.save(immediateSave);
      this.emit('profitDraws:changed', { source: notifyOrigin, draws });
      if (!String(notifyOrigin).includes('init') && showToastNotification) {
        this._triggerSyncFeedback('Gastos de la Ganancia', showToastNotification);
      }

      const activeTab = this.getActiveTab();
      if (activeTab === 'pedidos' && window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }
    },

    setRecipe: function (recipe, notifyOrigin = 'system', showToastNotification = false, immediateSave = false) {
      this.state.recipe = recipe;
      this.save(immediateSave);
      this.emit('recipe:changed', { source: notifyOrigin, recipe });
      if (!String(notifyOrigin).includes('init') && showToastNotification) {
        this._triggerSyncFeedback('Presupuesto de Receta', true);
      }

      const activeTab = this.getActiveTab();
      if (activeTab === 'inventario') {
        if (window.InventoryApp && typeof window.InventoryApp.syncWithRecipe === 'function') {
          window.InventoryApp.syncWithRecipe();
        }
        if (window.InventoryApp && typeof window.InventoryApp.render === 'function') {
          window.InventoryApp.render();
        }
      }
    },

    setInventory: function (items, notifyOrigin = 'system', showToastNotification = false, immediateSave = false) {
      this.state.inventory = items;
      this.save(immediateSave);
      this.emit('inventory:changed', { source: notifyOrigin, items });
      if (!String(notifyOrigin).includes('init') && showToastNotification) {
        this._triggerSyncFeedback('Inventario', true);
      }
    },

    setCutoffDay: function (day, notifyOrigin = 'system', immediateSave = false) {
      this.state.cutoffDay = day;
      this.save(immediateSave);
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

      if (badgeEl) {
        badgeEl.setAttribute('title', `Sincronizado: ${sourceLabel} actualizado en tiempo real`);
        badgeEl.classList.add('bg-emerald-50/90', 'border-emerald-300/70');
        if (badgeText) badgeText.textContent = 'Sincronizado';
        if (badgeDot) {
          badgeDot.classList.remove('animate-glass-pulse');
          badgeDot.classList.add('animate-pulse');
        }

        clearTimeout(this._syncTimeout);
        this._syncTimeout = setTimeout(() => {
          badgeEl.classList.remove('bg-emerald-50/90', 'border-emerald-300/70');
          if (badgeDot) {
            badgeDot.classList.remove('animate-pulse');
            badgeDot.classList.add('animate-glass-pulse');
          }
        }, 1800);
      }

      if (showToastNotification && window.showToast) {
        clearTimeout(this._toastDebounce);
        this._toastDebounce = setTimeout(() => {
          window.showToast(`Sincronizado: ${sourceLabel}`, 'info');
        }, 150);
      }
    },

    // 12. Cross-Window / Cross-Tab Storage Listener
    _bindStorageListener: function () {
      window.addEventListener('storage', (e) => {
        if (!e.key) return;

        if (e.key === STORAGE_KEYS.MULTIVERSE_V1 || e.key === STORAGE_KEYS.DB_V2) {
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
          if (SUPPORTED_YEARS.includes(newYear)) {
            this.setYear(newYear, false);
          }
        }
      });

      // Guarantee immediate flush when closing window or switching browser tabs
      window.addEventListener('beforeunload', () => {
        this._flushSave();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this._flushSave();
        }
      });
    }
  };

  // Expose to window and initialize immediately
  window.NogaStore = NogaStore;
  NogaStore.init();
})(window);
