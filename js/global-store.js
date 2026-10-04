/**
 * NOGADÍSIMA — MULTI-USER REAL-TIME CLOUD STORE (FIREBASE REALTIME DATABASE)
 * Scalable Multi-Year Global Reactive State Store (2026 - 2030)
 * Centralized Single Source of Truth for Recipe, Investment, Orders, Inventory & Profit Draws
 * Live bidirectional cloud synchronization between Diego & Angy with 0ms input latency,
 * debounced cloud writes (300ms), and 100% offline local cache fallback.
 */

// =========================================================================
// 0. FIREBASE REALTIME DATABASE CLOUD CONFIGURATION (MULTI-USER ENGINE)
// Static GitHub Pages Compatible — Real-time live two-way sync for Diego & Angy
// Replace placeholders with your Firebase project credentials or configure via UI
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDes9ttO4upPk9gONemkayd7QRNiR7t1zY",
  authDomain: "nogadisima-crm.firebaseapp.com",
  databaseURL: "https://nogadisima-crm-default-rtdb.firebaseio.com",
  projectId: "nogadisima-crm",
  storageBucket: "nogadisima-crm.firebasestorage.app",
  messagingSenderId: "187372187162",
  appId: "1:187372187162:web:76dbb7600586279660aba3",
  measurementId: "G-ZPWSG9C6VD"
};

(function (window) {
  'use strict';

  // Global Outbound Write Lock Guard (Firebase Realtime Database as SSOT)
  let isCloudHydrated = false;
  window.isCloudHydrated = false;

  // 5-Year Rolling Horizon Constants
  const SUPPORTED_YEARS = ['2026', '2027', '2028', '2029', '2030'];

  // Storage Keys
  const STORAGE_KEYS = {
    MULTIVERSE_V2: 'nogadisima_multiverse_v2',
    MULTIVERSE_V1: 'nogadisima_multiverse_v1',
    DB_V2: 'nogadisima_db_v2', // backward-compatible mirror
    ACTIVE_YEAR: 'nogadisima_active_year',
    FIREBASE_CUSTOM_CONFIG: 'nogadisima_firebase_custom_config',
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

    // Outbound Write Lock & State Hydration Flags
    isCloudHydrated: false,
    _isInitialized: false,
    _isFirebaseInitialized: false,
    _clientId: 'client_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
    _lastWrittenTimestamp: 0,

    // Firebase Cloud Synchronization Properties
    _firebaseApp: null,
    _firebaseDb: null,
    _dbRef: null,
    _connectedRef: null,
    _connectionStatus: 'connecting', // 'connected' | 'syncing' | 'connecting' | 'offline'
    _isReceivingRemoteSync: false,
    _isPerformingCloudSave: false,
    _cloudSaveTimer: null,
    _pendingCloudSave: false,
    _lastSyncTime: null,
    _hasUnsyncedLocalChanges: false,

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
          cutoffDay: 30,
          pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
        },
        '2027': {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30,
          pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
        },
        '2028': {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30,
          pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
        },
        '2029': {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30,
          pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
        },
        '2030': {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30,
          pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
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
      cutoffDay: 30,
      pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
    },

    // 2. Pub-Sub Event Emitter
    _listeners: {},

    init: function () {
      if (this._isInitialized) return;
      this._isInitialized = true;

      // 1. Force outbound write lock guard
      isCloudHydrated = false;
      window.isCloudHydrated = false;
      this.isCloudHydrated = false;

      // 2. Load cached local database if available (for instant offline render)
      this.loadAll();
      this._syncStatePointer();
      this._bindStorageListener();

      const runBoot = () => {
        this.updateConnectionStatus('connecting', 'Conectando...');
        this.updateYearSelectorUI(this.getActiveYear());
        this.updateYearDependentFormElements(this.getActiveYear());
        this._initFirebase();
        console.log('NogaStore: Multi-Year Store booted (Active: ' + this.getActiveYear() + '). Waiting for cloud hydration.');
      };

      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        runBoot();
      } else {
        window.addEventListener('DOMContentLoaded', runBoot, { once: true });
      }
    },

    getActiveYear: function () {
      return (this.db && this.db.activeYear) ? this.db.activeYear : '2026';
    },

    // 3. Multi-Year Season Initialization & Seeding Engine
    // Historical Master Dataset Seeder (Case 2: First-time cloud deployment only)
    seedVerifiedHistoricalData: function () {
      console.info('NogaStore: Seeding verified historical dataset (2026 baseline)...');

      const baselineRecipe = (window.DEFAULT_RECIPE_DATA)
        ? JSON.parse(JSON.stringify(window.DEFAULT_RECIPE_DATA))
        : null;

      const baselineInvestments = (window.INITIAL_INVESTMENTS && Array.isArray(window.INITIAL_INVESTMENTS))
        ? JSON.parse(JSON.stringify(window.INITIAL_INVESTMENTS))
        : [];

      const baselineOrders = (window.INITIAL_ORDERS && Array.isArray(window.INITIAL_ORDERS))
        ? JSON.parse(JSON.stringify(window.INITIAL_ORDERS))
        : [];

      const baselineProfitDraws = (window.INITIAL_PROFIT_EXPENSES && Array.isArray(window.INITIAL_PROFIT_EXPENSES))
        ? JSON.parse(JSON.stringify(window.INITIAL_PROFIT_EXPENSES))
        : [];

      const baselineInventory = (window.INITIAL_INVENTORY_ITEMS && Array.isArray(window.INITIAL_INVENTORY_ITEMS))
        ? JSON.parse(JSON.stringify(window.INITIAL_INVENTORY_ITEMS))
        : [];

      this.db = {
        activeYear: '2026',
        lastUpdated: Date.now(),
        updatedBy: this._clientId,
        years: {
          '2026': {
            recipe: baselineRecipe,
            investments: baselineInvestments,
            orders: baselineOrders,
            profitDraws: baselineProfitDraws,
            inventory: baselineInventory,
            cutoffDay: 30,
            pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
          }
        }
      };

      // Populate future rolling horizon years (2027 through 2030)
      ['2027', '2028', '2029', '2030'].forEach(year => {
        this.db.years[year] = {
          recipe: baselineRecipe ? JSON.parse(JSON.stringify(baselineRecipe)) : null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: this.initializeEmptyInventoryFromRecipe(baselineRecipe, baselineInventory),
          cutoffDay: 30,
          pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
        };
      });

      this._syncStatePointer();
      this._persistLocalMirrors();
    },

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
      const y26 = this.db.years ? this.db.years['2026'] : null;
      if (!y26) return;

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
      if (!y26.pricingTiers) {
        y26.pricingTiers = { single: 280, pack2: 540, pack4: 1050 };
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
            cutoffDay: 30,
            pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
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
        if (!yFuture.pricingTiers) {
          yFuture.pricingTiers = { single: 280, pack2: 540, pack4: 1050 };
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

      // Only save locally; never trigger cloud save from ensureSeedData if not hydrated
      if (mutated) {
        this._persistLocalMirrors();
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
      this.state.pricingTiers = yData.pricingTiers || { single: 280, pack2: 540, pack4: 1050 };
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
      if (window.OrdersApp && window.OrdersApp.pricingTiers) {
        this.db.years[year].pricingTiers = window.OrdersApp.pricingTiers;
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
        window.OrdersApp.pricingTiers = currentYearData.pricingTiers || { single: 280, pack2: 540, pack4: 1050 };
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
      if (window.OrdersApp && typeof window.OrdersApp.renderPricingTiersWidget === 'function') {
        window.OrdersApp.renderPricingTiersWidget();
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

    // 7. Storage Persistence Engine (Multiverse v2 & v1 Fallback)
    loadAll: function () {
      let loadedDb = null;
      try {
        // Priority 1: Check master multiverse v2 storage key
        const multi2Str = localStorage.getItem(STORAGE_KEYS.MULTIVERSE_V2);
        if (multi2Str) {
          loadedDb = JSON.parse(multi2Str);
        } else {
          // Priority 2: Check master multiverse v1 storage key
          const multi1Str = localStorage.getItem(STORAGE_KEYS.MULTIVERSE_V1);
          if (multi1Str) {
            loadedDb = JSON.parse(multi1Str);
          } else {
            // Priority 3: Fallback to nogadisima_db_v2
            const db2Str = localStorage.getItem(STORAGE_KEYS.DB_V2);
            if (db2Str) {
              loadedDb = JSON.parse(db2Str);
            }
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
              cutoffDay: 30,
              pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
            };
          } else if (!this.db.years[y].pricingTiers) {
            this.db.years[y].pricingTiers = { single: 280, pack2: 540, pack4: 1050 };
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

    _persistLegacyMirrors: function () {
      try {
        const year = this.getActiveYear();
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
        console.warn('NogaStore: Error updating legacy mirrors:', e);
      }
    },

    _persistLocalMirrors: function () {
      try {
        const year = this.getActiveYear();
        const serialized = JSON.stringify(this.db);
        localStorage.setItem(STORAGE_KEYS.MULTIVERSE_V2, serialized);
        localStorage.setItem(STORAGE_KEYS.MULTIVERSE_V1, serialized);
        localStorage.setItem(STORAGE_KEYS.DB_V2, serialized);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, year);
        this._persistLegacyMirrors();
      } catch (e) {
        console.error('NogaStore: Error persisting database to localStorage:', e);
      }
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

    // 8. High-Performance Debounced Persistence Architecture (Local + Cloud)
    _saveTimer: null,
    _pendingSave: false,

    persistState: function (immediate = false) {
      this.save(immediate);
    },

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
        this.db.years[year].pricingTiers = this.state.pricingTiers;
      }

      this.db.lastUpdated = Date.now();
      this._pendingSave = true;

      if (immediate) {
        this._flushSave();
      } else if (!this._saveTimer) {
        // Batch multiple rapid keystrokes/actions into a single non-blocking disk flush (250ms)
        this._saveTimer = setTimeout(() => {
          this._saveTimer = null;
          this._flushSave();
        }, 250);
      }

      // 2. Multi-user cloud write (Firebase Realtime Database) with 300ms debounce
      // Strict guard: ONLY schedule if already cloud-hydrated and not receiving remote sync
      if (!this._isReceivingRemoteSync) {
        if (!this.isCloudHydrated) {
          console.warn("Outbound sync blocked: Waiting for initial cloud hydration.");
          return;
        }
        this._scheduleCloudSave(immediate);
      }
    },

    _flushSave: function () {
      if (!this._pendingSave) return;
      this._pendingSave = false;
      if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
      }
      this._persistLocalMirrors();
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

    getPricingTiers: function (year) {
      const y = year || this.getActiveYear();
      const yData = (this.db && this.db.years) ? this.db.years[y] : null;
      if (yData && yData.pricingTiers) {
        return { ...yData.pricingTiers };
      }
      return { single: 280, pack2: 540, pack4: 1050 };
    },

    setPricingTiers: function (newTiers, year, notifyOrigin = 'system') {
      const y = year || this.getActiveYear();
      if (!this.db.years[y]) {
        this.db.years[y] = {
          recipe: null,
          investments: [],
          orders: [],
          profitDraws: [],
          inventory: [],
          cutoffDay: 30,
          pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
        };
      }
      const single = Math.max(0, parseFloat(newTiers.single) || 280);
      const pack2 = Math.max(0, parseFloat(newTiers.pack2) || 540);
      const pack4 = Math.max(0, parseFloat(newTiers.pack4) || 1050);

      this.db.years[y].pricingTiers = { single, pack2, pack4 };

      if (y === this.getActiveYear()) {
        this.state.pricingTiers = { single, pack2, pack4 };
        if (window.OrdersApp) {
          window.OrdersApp.pricingTiers = { single, pack2, pack4 };
          if (typeof window.OrdersApp.renderPricingTiersWidget === 'function') {
            window.OrdersApp.renderPricingTiersWidget();
          }
        }
      }
      this.save(true);
      this.emit('pricing:changed', { year: y, tiers: { single, pack2, pack4 }, source: notifyOrigin });
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

    // 12. Firebase Realtime Database Cloud Sync Engine
    getActiveFirebaseConfig: function () {
      try {
        const custom = localStorage.getItem(STORAGE_KEYS.FIREBASE_CUSTOM_CONFIG);
        if (custom) {
          const parsed = JSON.parse(custom);
          if (parsed && parsed.databaseURL && !parsed.databaseURL.includes('YOUR_PROJECT_ID')) {
            return parsed;
          }
        }
      } catch (e) {}
      return firebaseConfig;
    },

    _initFirebase: function (forceReinit = false) {
      if (this._isFirebaseInitialized && !forceReinit) {
        return;
      }

      if (typeof window.firebase === 'undefined' || !window.firebase.initializeApp) {
        console.warn('NogaStore: Firebase SDK no cargado vía CDN. Ejecutando en modo local.');
        this.updateConnectionStatus('offline');
        return;
      }

      const activeConfig = this.getActiveFirebaseConfig();
      const hasRealCredentials = activeConfig &&
        activeConfig.databaseURL &&
        !activeConfig.databaseURL.includes('YOUR_PROJECT_ID') &&
        activeConfig.projectId &&
        !activeConfig.projectId.includes('YOUR_PROJECT_ID');

      if (!hasRealCredentials) {
        console.info('NogaStore: Firebase en modo local ("Sin conexión (Modo local)"). Puedes configurar las credenciales en el badge de sincronización.');
        this.updateConnectionStatus('offline');
        return;
      }

      try {
        const fb = window.firebase || (typeof firebase !== 'undefined' ? firebase : null);
        if (!fb) {
          throw new Error('Firebase SDK reference not found on window or scope.');
        }

        if (!fb.apps || fb.apps.length === 0) {
          this._firebaseApp = fb.initializeApp(activeConfig);
        } else {
          this._firebaseApp = fb.apps[0];
        }

        this._firebaseDb = fb.database();
        this._dbRef = this._firebaseDb.ref('nogadisima_crm');
        this._connectedRef = this._firebaseDb.ref('.info/connected');
        this._isFirebaseInitialized = true;

        // Show discreet connecting pulse during initial startup
        this.updateConnectionStatus('connecting', 'Conectando...');

        // 1. Connection health monitor
        this._connectedRef.on('value', (snap) => {
          const isConnected = (snap.val() === true);
          if (isConnected) {
            if (this.isCloudHydrated) {
              this.updateConnectionStatus('connected');
              if (this._hasUnsyncedLocalChanges) {
                this._scheduleCloudSave(true);
              }
            } else {
              this.updateConnectionStatus('connecting', 'Conectando...');
            }
          } else {
            this.updateConnectionStatus('offline');
          }
        });

        // 2. Real-time root database listener (Cloud-First SSOT Handshake)
        this._dbRef.on('value', (snapshot) => {
          const remoteVal = snapshot.val();
          this._handleRemoteCloudSync(remoteVal, snapshot.exists());
        }, (error) => {
          console.warn('NogaStore: Error en listener de Firebase Realtime Database:', error);
          this.updateConnectionStatus('offline');
        });

        // Fallback safety timeout: if after 5 seconds neither connected nor snapshot received
        setTimeout(() => {
          if (!this.isCloudHydrated && this._connectionStatus === 'connecting') {
            this.updateConnectionStatus('offline');
          }
        }, 5000);

        // 3. Optional Analytics initialization
        if (typeof fb.analytics === 'function') {
          try {
            fb.analytics();
          } catch (e) {}
        }

        console.log('NogaStore: Firebase Realtime Database conectado y escuchando en /nogadisima_crm');
      } catch (err) {
        console.error('NogaStore: Error inicializando Firebase Realtime Database:', err);
        this.updateConnectionStatus('offline');
      }
    },

    _handleRemoteCloudSync: function (remoteVal, snapshotExists = true) {
      // 1. Echo preventer: ignore self-originated writes
      if (this._isPerformingCloudSave) {
        return;
      }
      if (remoteVal && remoteVal.updatedBy === this._clientId && remoteVal.lastUpdated === this._lastWrittenTimestamp) {
        return;
      }

      const hasValidCloudData = Boolean(
        snapshotExists &&
        remoteVal &&
        remoteVal.years &&
        typeof remoteVal.years === 'object' &&
        (remoteVal.years['2026'] || Object.keys(remoteVal.years).length > 0)
      );

      // Case 2: Cloud is Completely Empty (First-time deployment only)
      if (!hasValidCloudData) {
        if (!this.isCloudHydrated) {
          console.info('NogaStore: Cloud root is empty. Initializing and pushing verified historical seed data...');
          this.seedVerifiedHistoricalData();
          isCloudHydrated = true;
          window.isCloudHydrated = true;
          this.isCloudHydrated = true;
          this.saveToFirebase(this.db);
          this._pushStateToModules();
          this._reRenderAllModules();
          this.updateConnectionStatus('connected');
          this._lastSyncTime = new Date();
          this.emit('cloud:synced', { timestamp: this._lastSyncTime, type: 'initial-seed' });
        }
        return;
      }

      // Case 1: Cloud Data Exists
      const remoteTime = Number(remoteVal.lastUpdated) || 0;
      const localTime = Number(this.db.lastUpdated) || 0;

      // Only accept if remote is newer, or if this is the initial hydration
      if (!this.isCloudHydrated || remoteTime >= localTime || !localTime) {
        this._isReceivingRemoteSync = true;
        this._lastSyncTime = new Date();

        try {
          const activeYear = this.getActiveYear();
          const prevYearData = (this.db && this.db.years) ? this.db.years[activeYear] : null;

          // Replace in-memory database entirely with cloud snapshot
          const activeYearToRetain = this.getActiveYear();
          this.db = remoteVal;
          if (!this.db.activeYear || !SUPPORTED_YEARS.includes(this.db.activeYear)) {
            this.db.activeYear = activeYearToRetain;
          }

          // Ensure all supported rolling horizon years are structurally present
          SUPPORTED_YEARS.forEach(y => {
            if (!this.db.years[y]) {
              this.db.years[y] = {
                recipe: null,
                investments: [],
                orders: [],
                profitDraws: [],
                inventory: [],
                cutoffDay: 30,
                pricingTiers: { single: 280, pack2: 540, pack4: 1050 }
              };
            }
          });

          // Release the outbound write lock
          isCloudHydrated = true;
          window.isCloudHydrated = true;
          this.isCloudHydrated = true;

          // Update local cache in background (without echo write)
          this._syncStatePointer();
          this._persistLocalMirrors();

          const newYearData = (this.db.years) ? this.db.years[this.getActiveYear()] : null;

          // Targeted DOM Patching (0 FPS stutter, avoid blanket innerHTML resets on unchanged rows)
          if (prevYearData && newYearData) {
            this._patchModulesWithRemoteData(prevYearData, newYearData);
          } else {
            this._pushStateToModules();
            this._reRenderAllModules();
          }

          this.updateConnectionStatus('connected');
          this.emit('cloud:synced', { timestamp: this._lastSyncTime, type: 'remote-update' });
        } catch (err) {
          console.error('NogaStore: Error procesando sincronización remota:', err);
        } finally {
          this._isReceivingRemoteSync = false;
        }
      }
    },

    _patchModulesWithRemoteData: function (prevYearData, newYearData) {
      // A. Orders patching
      if (window.OrdersApp) {
        const oldOrders = prevYearData.orders || [];
        const newOrders = newYearData.orders || [];
        window.OrdersApp.orders = newOrders;
        window.OrdersApp.profitExpenses = newYearData.profitDraws || [];
        window.OrdersApp.pricingTiers = newYearData.pricingTiers || { single: 280, pack2: 540, pack4: 1050 };

        if (oldOrders.length === newOrders.length && typeof window.OrdersApp.patchOrderRow === 'function') {
          for (let i = 0; i < newOrders.length; i++) {
            if (JSON.stringify(oldOrders[i]) !== JSON.stringify(newOrders[i])) {
              window.OrdersApp.patchOrderRow(newOrders[i].id);
            }
          }
          window.OrdersApp.renderKpiCards();
          window.OrdersApp.renderPipelinePills();
        } else {
          window.OrdersApp.render();
        }
      }

      // B. Investments patching
      if (window.InvestmentApp) {
        const oldInv = prevYearData.investments || [];
        const newInv = newYearData.investments || [];
        window.InvestmentApp.items = newInv;
        window.InvestmentApp.cutoffDay = newYearData.cutoffDay || 30;

        if (oldInv.length === newInv.length && typeof window.InvestmentApp.patchExpenseRow === 'function') {
          for (let i = 0; i < newInv.length; i++) {
            if (JSON.stringify(oldInv[i]) !== JSON.stringify(newInv[i])) {
              window.InvestmentApp.patchExpenseRow(newInv[i].id);
            }
          }
          window.InvestmentApp.renderKpiCards();
        } else {
          window.InvestmentApp.render();
        }
      }

      // C. Inventory patching
      if (window.InventoryApp) {
        window.InventoryApp.items = newYearData.inventory || [];
        window.InventoryApp.render();
      }

      // D. Recipe patching
      if (window.RecipeApp && newYearData.recipe) {
        window.RecipeApp.data = newYearData.recipe;
        if (typeof window.renderRecipeCards === 'function') {
          window.renderRecipeCards();
        }
      }
    },

    saveToFirebase: function (state) {
      // Strict rule: ABORT any cloud push if the initial cloud fetch has NOT resolved yet
      if (!this.isCloudHydrated) {
        console.warn("Outbound sync blocked: Waiting for initial cloud hydration.");
        return Promise.reject(new Error("Outbound sync blocked: Waiting for initial cloud hydration."));
      }

      if (!this._dbRef) {
        this._hasUnsyncedLocalChanges = true;
        console.warn("Outbound sync blocked: No Firebase database reference.");
        return Promise.resolve();
      }

      const currentState = state || this.db;
      const now = Date.now();
      this.db.lastUpdated = now;
      this._lastWrittenTimestamp = now;
      this._isPerformingCloudSave = true;

      // Attach an atomic timestamp & client author to every write
      const payload = {
        ...JSON.parse(JSON.stringify(currentState)),
        lastUpdated: now,
        updatedBy: this._clientId
      };

      this.updateConnectionStatus('syncing');

      return this._dbRef.set(payload)
        .then(() => {
          this._isPerformingCloudSave = false;
          this._hasUnsyncedLocalChanges = false;
          this._lastSyncTime = new Date();
          this.updateConnectionStatus('connected');
        })
        .catch((err) => {
          this._isPerformingCloudSave = false;
          this._hasUnsyncedLocalChanges = true;
          console.error("Firebase write error:", err);
          this.updateConnectionStatus('offline');
        });
    },

    _scheduleCloudSave: function (immediate = false) {
      if (this._isReceivingRemoteSync) return;

      if (!this.isCloudHydrated) {
        console.warn("Outbound sync blocked: Waiting for initial cloud hydration.");
        return;
      }

      if (!this._dbRef) {
        this._hasUnsyncedLocalChanges = true;
        return;
      }

      this._pendingCloudSave = true;
      this.updateConnectionStatus('syncing');

      if (immediate) {
        if (this._cloudSaveTimer) {
          clearTimeout(this._cloudSaveTimer);
          this._cloudSaveTimer = null;
        }
        this._pendingCloudSave = false;
        this.saveToFirebase(this.db);
        return;
      }

      // Debounce cloud writes (300ms) to prevent flooding on rapid typing/inputs
      if (this._cloudSaveTimer) {
        clearTimeout(this._cloudSaveTimer);
      }
      this._cloudSaveTimer = setTimeout(() => {
        this._cloudSaveTimer = null;
        if (this._pendingCloudSave) {
          this._pendingCloudSave = false;
          this.saveToFirebase(this.db);
        }
      }, 300);
    },

    _performCloudSave: function () {
      if (!this.isCloudHydrated) {
        console.warn("Outbound sync blocked: Waiting for initial cloud hydration.");
        return;
      }
      this.saveToFirebase(this.db);
    },

    updateConnectionStatus: function (status, customLabel) {
      this._connectionStatus = status;

      const badge = document.getElementById('global-sync-badge');
      const dot = document.getElementById('global-sync-dot');
      const text = document.getElementById('global-sync-text');

      const modalBadge = document.getElementById('modal-sync-status-badge');
      const modalDot = document.getElementById('modal-sync-dot');
      const modalText = document.getElementById('modal-sync-status-text');
      const modalTime = document.getElementById('modal-last-sync-time');

      let labelText = '';
      if (status === 'connected') {
        labelText = customLabel || 'En vivo (Sincronizado)';
        if (dot) {
          dot.className = 'liquid-status-jewel status-connected animate-glass-pulse';
        }
        if (badge) {
          badge.setAttribute('title', 'Firebase Realtime Database: En vivo (Sincronizado)');
          badge.className = 'hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-xs backdrop-blur-md text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-98';
        }
        if (modalBadge) {
          modalBadge.className = 'inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
          const innerDot = modalBadge.querySelector ? modalBadge.querySelector('span:first-child') : null;
          if (innerDot) innerDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-600';
        }
        if (modalDot) {
          modalDot.className = 'liquid-status-jewel status-connected animate-glass-pulse';
        }
      } else if (status === 'syncing' || status === 'connecting') {
        labelText = customLabel || (status === 'connecting' || !this.isCloudHydrated ? 'Conectando...' : 'Sincronizando...');
        if (dot) {
          dot.className = 'liquid-status-jewel status-syncing animate-pulse';
        }
        if (badge) {
          badge.setAttribute('title', 'Sincronizando con la nube...');
          badge.className = 'hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 hover:bg-amber-50 text-amber-800 border border-amber-300/80 shadow-xs backdrop-blur-md text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-98';
        }
        if (modalBadge) {
          modalBadge.className = 'inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300';
          const innerDot = modalBadge.querySelector ? modalBadge.querySelector('span:first-child') : null;
          if (innerDot) innerDot.className = 'w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse';
        }
        if (modalDot) {
          modalDot.className = 'liquid-status-jewel status-syncing animate-pulse';
        }
      } else {
        labelText = customLabel || 'Sin conexión (Modo local)';
        if (dot) {
          dot.className = 'liquid-status-jewel status-offline';
        }
        if (badge) {
          badge.setAttribute('title', 'Modo local: Cambios guardados en memoria local');
          badge.className = 'hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-100 text-slate-600 border border-slate-300/80 shadow-xs backdrop-blur-md text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-98';
        }
        if (modalBadge) {
          modalBadge.className = 'inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300';
          const innerDot = modalBadge.querySelector ? modalBadge.querySelector('span:first-child') : null;
          if (innerDot) innerDot.className = 'w-1.5 h-1.5 rounded-full bg-slate-400';
        }
        if (modalDot) {
          modalDot.className = 'liquid-status-jewel status-offline';
        }
      }

      if (text) text.textContent = labelText;
      if (modalText) modalText.textContent = labelText;
      if (modalTime) {
        if (this._lastSyncTime) {
          const hours = String(this._lastSyncTime.getHours()).padStart(2, '0');
          const minutes = String(this._lastSyncTime.getMinutes()).padStart(2, '0');
          const seconds = String(this._lastSyncTime.getSeconds()).padStart(2, '0');
          modalTime.textContent = `${hours}:${minutes}:${seconds}`;
        } else {
          modalTime.textContent = 'En espera de conexión';
        }
      }
    },

    // 13. Cross-Window / Cross-Tab Storage Listener
    _bindStorageListener: function () {
      window.addEventListener('storage', (e) => {
        if (!e.key) return;

        if (e.key === STORAGE_KEYS.MULTIVERSE_V2 || e.key === STORAGE_KEYS.MULTIVERSE_V1 || e.key === STORAGE_KEYS.DB_V2) {
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

      window.addEventListener('online', () => {
        if (this._hasUnsyncedLocalChanges && this._dbRef && this.isCloudHydrated) {
          this._scheduleCloudSave(true);
        }
      });
    }
  };

  // Expose to window and initialize immediately
  window.NogaStore = NogaStore;
  window.isCloudHydrated = false;
  window.saveToFirebase = function (state) {
    return NogaStore.saveToFirebase(state);
  };
  window.persistState = function (immediate) {
    return NogaStore.save(immediate);
  };

  // Cloud Sync Modal Global Handlers
  window.openCloudSyncModal = function () {
    const modal = document.getElementById('cloud-sync-modal');
    if (!modal) return;
    const cfg = NogaStore.getActiveFirebaseConfig();
    const dbUrlInp = document.getElementById('fb-cfg-dburl');
    const projInp = document.getElementById('fb-cfg-projectid');
    const apiInp = document.getElementById('fb-cfg-apikey');
    if (dbUrlInp) dbUrlInp.value = (cfg && cfg.databaseURL && !cfg.databaseURL.includes('YOUR_PROJECT_ID')) ? cfg.databaseURL : '';
    if (projInp) projInp.value = (cfg && cfg.projectId && !cfg.projectId.includes('YOUR_PROJECT_ID')) ? cfg.projectId : '';
    if (apiInp) apiInp.value = (cfg && cfg.apiKey && !cfg.apiKey.includes('YOUR_API_KEY')) ? cfg.apiKey : '';

    NogaStore.updateConnectionStatus(NogaStore._connectionStatus);
    modal.classList.remove('hidden');
  };

  window.closeCloudSyncModal = function () {
    const modal = document.getElementById('cloud-sync-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.handleSaveFirebaseConfig = function (e) {
    if (e) e.preventDefault();
    const dbUrl = (document.getElementById('fb-cfg-dburl')?.value || '').trim();
    const projectId = (document.getElementById('fb-cfg-projectid')?.value || '').trim();
    const apiKey = (document.getElementById('fb-cfg-apikey')?.value || '').trim();

    if (!dbUrl || !projectId) {
      if (window.showToast) window.showToast('Ingresa al menos Database URL y Project ID', 'warning');
      return;
    }

    const customCfg = {
      apiKey: apiKey || 'YOUR_API_KEY',
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: dbUrl,
      projectId: projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: '',
      appId: ''
    };

    localStorage.setItem(STORAGE_KEYS.FIREBASE_CUSTOM_CONFIG, JSON.stringify(customCfg));
    if (window.showToast) window.showToast('Configuración guardada. Conectando a Firebase...', 'info');

    // Reset hydration state on new project credentials
    isCloudHydrated = false;
    window.isCloudHydrated = false;
    NogaStore.isCloudHydrated = false;
    NogaStore._isFirebaseInitialized = false;
    NogaStore._initFirebase(true);
    window.closeCloudSyncModal();
  };

  NogaStore.init();
})(window);
