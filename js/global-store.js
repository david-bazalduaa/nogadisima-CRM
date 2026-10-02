/**
 * NOGADÍSIMA — UNIFIED GLOBAL REACTIVE STATE STORE & EVENT BUS
 * Centralized Single Source of Truth for Recipe, Investment, Orders & Profit Draws
 * Enables Instant Cross-Tab Reactive Synchronization with LocalStorage Persistence
 */

(function (window) {
  'use strict';

  // Storage Keys (100% backward-compatible with existing schema)
  const STORAGE_KEYS = {
    RECIPE: 'nogadisima_recipe_engine_v5',
    INVESTMENTS: 'nogadisima_investments_v1',
    ORDERS: 'nogadisima_orders_v3',
    PROFIT_DRAWS: 'nogadisima_profit_expenses_v1',
    CUTOFF_DAY: 'nogadisima_cutoff_day'
  };

  const NogaStore = {
    // 1. Centralized Reactive State
    state: {
      recipe: null,
      investments: [],
      orders: [],
      profitDraws: [],
      cutoffDay: 30
    },

    // 2. Pub-Sub Event Emitter
    _listeners: {},

    init: function () {
      this.loadAll();
      this._bindStorageListener();
      console.log('NogaStore: Unified Global State Store initialized');
    },

    // Subscribe to state change events
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

      // Universal state change event for cross-module observers
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

    // 3. Storage Persistence Engine
    loadAll: function () {
      // A. Recipe State
      try {
        const recipeStr = localStorage.getItem(STORAGE_KEYS.RECIPE);
        if (recipeStr) {
          this.state.recipe = JSON.parse(recipeStr);
        }
      } catch (e) {
        console.warn('NogaStore: Error loading recipe from localStorage', e);
      }

      // B. Investment State
      try {
        const invStr = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
        if (invStr) {
          const parsed = JSON.parse(invStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.state.investments = parsed;
          }
        }
      } catch (e) {
        console.warn('NogaStore: Error loading investments from localStorage', e);
      }

      // C. Orders State
      try {
        const ordStr = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (ordStr) {
          const parsed = JSON.parse(ordStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.state.orders = parsed;
          }
        }
      } catch (e) {
        console.warn('NogaStore: Error loading orders from localStorage', e);
      }

      // D. Profit Draws State (Gastos de la Ganancia)
      try {
        const drawStr = localStorage.getItem(STORAGE_KEYS.PROFIT_DRAWS);
        if (drawStr) {
          const parsed = JSON.parse(drawStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.state.profitDraws = parsed;
          }
        }
      } catch (e) {
        console.warn('NogaStore: Error loading profit draws from localStorage', e);
      }

      // E. Cutoff Day
      try {
        const dayStr = localStorage.getItem(STORAGE_KEYS.CUTOFF_DAY);
        if (dayStr) {
          this.state.cutoffDay = parseInt(dayStr, 10) || 30;
        }
      } catch (e) {
        console.warn('NogaStore: Error loading cutoff day from localStorage', e);
      }
    },

    save: function (slice) {
      try {
        if (slice === 'investments' || slice === 'all') {
          localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(this.state.investments));
        }
        if (slice === 'orders' || slice === 'all') {
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.state.orders));
        }
        if (slice === 'profitDraws' || slice === 'all') {
          localStorage.setItem(STORAGE_KEYS.PROFIT_DRAWS, JSON.stringify(this.state.profitDraws));
        }
        if (slice === 'recipe' || slice === 'all') {
          if (this.state.recipe) {
            localStorage.setItem(STORAGE_KEYS.RECIPE, JSON.stringify(this.state.recipe));
          }
        }
        if (slice === 'cutoffDay' || slice === 'all') {
          localStorage.setItem(STORAGE_KEYS.CUTOFF_DAY, String(this.state.cutoffDay));
        }
      } catch (e) {
        console.error(`NogaStore: Error persisting slice "${slice}" to localStorage:`, e);
      }
    },

    // 4. Reactive State Accessors
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

    getCutoffDay: function () {
      return this.state.cutoffDay;
    },

    // 5. Reactive State Mutators (Dispatch Cross-Tab Events)
    setInvestments: function (items, notifyOrigin = 'system', showToastNotification = true) {
      this.state.investments = items;
      this.save('investments');
      this.emit('investment:changed', { source: notifyOrigin, items });
      this._triggerSyncFeedback('Inversión & Gastos', showToastNotification);

      // Instant cross-tab view render guarantee
      if (window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }
    },

    setOrders: function (orders, notifyOrigin = 'system', showToastNotification = true) {
      this.state.orders = orders;
      this.save('orders');
      this.emit('orders:changed', { source: notifyOrigin, orders });
      this._triggerSyncFeedback('Control de Pedidos', showToastNotification);

      if (window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }
    },

    setProfitDraws: function (draws, notifyOrigin = 'system', showToastNotification = true) {
      this.state.profitDraws = draws;
      this.save('profitDraws');
      this.emit('profitDraws:changed', { source: notifyOrigin, draws });
      this._triggerSyncFeedback('Gastos de la Ganancia', showToastNotification);

      if (window.OrdersApp && typeof window.OrdersApp.render === 'function') {
        window.OrdersApp.render();
      }
    },

    setRecipe: function (recipe, notifyOrigin = 'system', showToastNotification = false) {
      this.state.recipe = recipe;
      this.save('recipe');
      this.emit('recipe:changed', { source: notifyOrigin, recipe });
      if (showToastNotification) {
        this._triggerSyncFeedback('Presupuesto de Receta', true);
      }
    },

    setCutoffDay: function (day, notifyOrigin = 'system') {
      this.state.cutoffDay = day;
      this.save('cutoffDay');
      this.emit('cutoffDay:changed', { source: notifyOrigin, day });
    },

    // 6. Live Cross-Tab Calculations & Financial Equations Engine
    getGlobalMetrics: function () {
      const inv = this.state.investments || [];
      const ord = this.state.orders || [];
      const draws = this.state.profitDraws || [];

      // Total Full Investment (All recorded purchases from "Inversión & Gastos" across all funding sources)
      // This is the EXACT amount shown in the "Inversión Total" KPI card on the Inversión tab
      const totalInvestmentAudited = inv.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

      // Core operational partners (Digs, Angy, Nogadísima)
      const coreInsumos = inv
        .filter(item => ['Digs', 'Angy', 'Nogadísima'].includes(item.source))
        .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

      // The Insumos / Inversión deduction used for Ganancia Generada:
      // Perfectly synchronized with the "Inversión Total" KPI card so both tabs always match to the cent
      const totalInsumos = totalInvestmentAudited;

      // B. Ventas Totales & Chiles (Originating from "Control de Pedidos")
      const totalRevenue = ord.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
      const totalChiles = ord.reduce((sum, o) => sum + (Number(o.qty) || 0), 0);

      // C. Dynamic Ganancia Generada (Utilidad Bruta)
      // gananciaGenerada = ventasTotales - totalInsumos
      const grossProfit = totalRevenue - totalInsumos;
      const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

      // D. Total Gastado de la Ganancia (Retiros / Gastos Personales)
      const totalProfitSpent = draws.reduce((sum, d) => sum + (Number(d.amount || d.price) || 0), 0);

      // E. Ganancia Neta Disponible / Remanente
      // gananciaDisponible = gananciaGenerada - totalGastadoGanancia
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

    // 7. UI Indicator & Reactivity Feedback
    _syncTimeout: null,
    _toastDebounce: null,
    _triggerSyncFeedback: function (sourceLabel, showToastNotification) {
      // Header Status Badge update
      const badgeText = document.getElementById('global-sync-text');
      const badgeEl = document.getElementById('global-sync-badge');
      const badgeDot = document.getElementById('global-sync-dot');

      if (badgeText && badgeEl) {
        badgeText.textContent = 'Sincronizado: Utilidades y métricas actualizadas';
        badgeEl.classList.add('ring-2', 'ring-emerald-400/50', 'bg-emerald-50/80', 'text-emerald-900');
        if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-ping';

        clearTimeout(this._syncTimeout);
        this._syncTimeout = setTimeout(() => {
          badgeText.textContent = 'Sistema Sincronizado';
          badgeEl.classList.remove('ring-2', 'ring-emerald-400/50', 'bg-emerald-50/80', 'text-emerald-900');
          if (badgeDot) badgeDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-glass-pulse';
        }, 3200);
      }

      // Subtle frosted toast (debounced to avoid spam during rapid input)
      if (showToastNotification && window.showToast) {
        clearTimeout(this._toastDebounce);
        this._toastDebounce = setTimeout(() => {
          window.showToast('Sincronizado: Utilidades y métricas actualizadas en todo el sistema', 'info');
        }, 150);
      }
    },

    // 8. Cross-Window / Cross-Tab Storage Listener
    _bindStorageListener: function () {
      window.addEventListener('storage', (e) => {
        if (!e.key) return;

        if (e.key === STORAGE_KEYS.INVESTMENTS) {
          try {
            this.state.investments = JSON.parse(e.newValue || '[]');
            this.emit('investment:changed', { source: 'cross-tab-storage', items: this.state.investments });
            this._triggerSyncFeedback('Inversión', false);
          } catch (err) {}
        } else if (e.key === STORAGE_KEYS.ORDERS) {
          try {
            this.state.orders = JSON.parse(e.newValue || '[]');
            this.emit('orders:changed', { source: 'cross-tab-storage', orders: this.state.orders });
            this._triggerSyncFeedback('Pedidos', false);
          } catch (err) {}
        } else if (e.key === STORAGE_KEYS.PROFIT_DRAWS) {
          try {
            this.state.profitDraws = JSON.parse(e.newValue || '[]');
            this.emit('profitDraws:changed', { source: 'cross-tab-storage', draws: this.state.profitDraws });
            this._triggerSyncFeedback('Gastos de Ganancia', false);
          } catch (err) {}
        } else if (e.key === STORAGE_KEYS.RECIPE) {
          try {
            this.state.recipe = JSON.parse(e.newValue || '{}');
            this.emit('recipe:changed', { source: 'cross-tab-storage', recipe: this.state.recipe });
          } catch (err) {}
        }
      });
    }
  };

  // Expose to window and initialize immediately
  window.NogaStore = NogaStore;
  NogaStore.init();
})(window);
