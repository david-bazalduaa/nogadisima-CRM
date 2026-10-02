/**
 * NOGADÍSIMA — MAIN APPLICATION CONTROLLER
 * Coordinates Views, Liquid Glass Component Rendering & Poblano Forest Green Palette
 */

// 1. Tab Switching Controller
function switchTab(tabId) {
  const panels = ['presupuesto', 'inversion', 'pedidos', 'inventario'];
  panels.forEach(id => {
    const panelEl = document.getElementById(`panel-${id}`);
    const desktopBtn = document.getElementById(`tab-${id}`);
    const mobileBtn = document.getElementById(`mob-tab-${id}`);

    if (id === tabId) {
      if (panelEl) panelEl.classList.remove('hidden');
      if (desktopBtn) {
        desktopBtn.className = 'tab-btn flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 liquid-pill-active';
        const svg = desktopBtn.querySelector('svg');
        if (svg) svg.className = 'w-4 h-4 text-white';
      }
      if (mobileBtn) {
        mobileBtn.className = 'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#1E222B] text-white font-numeric shadow-sm border border-white/20';
      }
    } else {
      if (panelEl) panelEl.classList.add('hidden');
      if (desktopBtn) {
        desktopBtn.className = 'tab-btn flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all duration-200';
        const svg = desktopBtn.querySelector('svg');
        if (svg) svg.className = 'w-4 h-4 text-slate-400';
      }
      if (mobileBtn) {
        mobileBtn.className = 'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/70 text-slate-600 font-numeric border border-white/80';
      }
    }
  });

  // Toggle Pulse Status Dots
  const pulsePresupuesto = document.getElementById('tab-pulse-presupuesto');
  const pulseInversion = document.getElementById('tab-pulse-inversion');
  const pulsePedidos = document.getElementById('tab-pulse-pedidos');
  const pulseInventario = document.getElementById('tab-pulse-inventario');
  if (pulsePresupuesto) pulsePresupuesto.classList.toggle('hidden', tabId !== 'presupuesto');
  if (pulseInversion) pulseInversion.classList.toggle('hidden', tabId !== 'inversion');
  if (pulsePedidos) pulsePedidos.classList.toggle('hidden', tabId !== 'pedidos');
  if (pulseInventario) pulseInventario.classList.toggle('hidden', tabId !== 'inventario');

  // Trigger reactive render when entering tabs
  if (tabId === 'inversion' && window.InvestmentApp && typeof window.InvestmentApp.render === 'function') {
    window.InvestmentApp.render();
  }
  if (tabId === 'pedidos' && window.OrdersApp && typeof window.OrdersApp.render === 'function') {
    window.OrdersApp.render();
  }
  if (tabId === 'inventario' && window.InventoryApp && typeof window.InventoryApp.render === 'function') {
    window.InventoryApp.render();
  }
  if (tabId === 'presupuesto' && typeof window.recalculateAll === 'function') {
    window.recalculateAll();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Dynamic Liquid Glass Recipe Category Cards Renderer
window.renderRecipeCards = function() {
  const container = document.getElementById('recipe-categories-container');
  if (!container || !window.RecipeApp.data) return;

  container.innerHTML = '';

  window.RecipeApp.data.categories.forEach((cat) => {
    const isCollapsed = window.RecipeApp.collapsedCards.has(cat.id);
    const card = document.createElement('div');
    card.className = 'liquid-card overflow-hidden transition-all duration-200';
    card.id = `card-${cat.id}`;

    // Header Element
    const header = document.createElement('div');
    header.className = 'p-5 sm:p-6 bg-white/35 backdrop-blur-md cursor-pointer select-none border-b border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/60 transition-all duration-200';
    header.onclick = (e) => {
      if (e.target.closest('button')) return;
      toggleCardCollapse(cat.id);
    };

    // Minimalist Category Line SVG
    let categorySvgIcon = '';
    if (cat.id === 'nogada') {
      categorySvgIcon = '<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>';
    } else if (cat.id === 'relleno') {
      categorySvgIcon = '<svg class="w-5 h-5 text-granada-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>';
    } else if (cat.id === 'extras') {
      categorySvgIcon = '<svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>';
    } else {
      categorySvgIcon = '<svg class="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>';
    }

    header.innerHTML = `
      <div class="flex items-center space-x-3.5">
        <div class="w-11 h-11 rounded-2xl bg-white/80 flex items-center justify-center shrink-0 border border-white/90 shadow-sm backdrop-blur-md">
          ${categorySvgIcon}
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-base sm:text-lg font-bold text-slate-900">${safeHtml(cat.title)}</h3>
            <span id="count-${cat.id}" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 text-slate-600 border border-white/90 font-numeric shadow-sm">
              ${cat.items.length} insumos
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">${safeHtml(cat.description)}</p>
        </div>
      </div>

      <div class="flex items-center space-x-3 self-end sm:self-center">
        <!-- Dynamic Subtotal Badge -->
        <div class="text-right">
          <div id="subtotal-${cat.id}" class="text-base sm:text-lg font-extrabold text-slate-900 font-numeric">$0.00</div>
          <div id="share-${cat.id}" class="text-[10px] font-semibold text-slate-500 font-numeric">0% del lote</div>
        </div>

        <!-- Quick Add Button inside header (Liquid Glass Action Button) -->
        <button onclick="addNewIngredientRow('${cat.id}'); event.stopPropagation();" 
          class="liquid-btn-dark px-3.5 py-1.5 text-xs font-semibold space-x-1.5">
          <svg class="w-3.5 h-3.5 text-white/90" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          <span>Añadir</span>
        </button>

        <!-- Chevron Collapse Toggle -->
        <div class="p-1 text-slate-400 hover:text-slate-600 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}" id="chevron-${cat.id}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    `;

    // Table Content Body
    const body = document.createElement('div');
    body.id = `body-${cat.id}`;
    body.className = `${isCollapsed ? 'hidden' : 'block'} overflow-x-auto transition-all`;

    let rowsHtml = '';
    cat.items.forEach(item => {
      rowsHtml += `
        <tr id="row-${item.id}" class="liquid-table-row group">
          <!-- 1. Ingrediente / Insumo -->
          <td class="py-2.5 px-4 font-semibold text-slate-800 text-xs sm:text-sm">
            <input type="text" id="name-${item.id}" value="${safeHtml(item.name)}" 
              oninput="updateIngredientField('${cat.id}', '${item.id}', 'name', this.value)"
              onblur="updateIngredientField('${cat.id}', '${item.id}', 'name', this.value)"
              onkeydown="if(event.key === 'Enter') this.blur()"
              class="w-full liquid-input px-3 py-1.5 text-slate-900 font-semibold">
          </td>

          <!-- 2. Cantidad Receta -->
          <td class="py-2.5 px-2 text-right w-28">
            <input type="number" step="any" min="0" value="${item.qty}"
              oninput="updateIngredientField('${cat.id}', '${item.id}', 'qty', this.value)"
              onblur="updateIngredientField('${cat.id}', '${item.id}', 'qty', this.value)"
              onkeydown="if(event.key === 'Enter') this.blur()"
              class="w-full text-right liquid-input px-2.5 py-1.5 text-slate-800 font-extrabold text-xs sm:text-sm font-numeric">
          </td>

          <!-- 3. Unidad (Multi-Unit Selector: gr, ml, taza, cda, pza) -->
          <td class="py-2.5 px-2 w-32">
            <select onchange="updateIngredientField('${cat.id}', '${item.id}', 'unit', this.value)"
              class="w-full liquid-input px-2.5 py-1.5 text-slate-700 font-semibold cursor-pointer text-xs">
              <option value="gr" ${item.unit === 'gr' ? 'selected' : ''}>gr (gramos)</option>
              <option value="ml" ${item.unit === 'ml' ? 'selected' : ''}>ml (mililitros)</option>
              <option value="taza" ${item.unit === 'taza' ? 'selected' : ''}>taza (tazas)</option>
              <option value="cda" ${item.unit === 'cda' ? 'selected' : ''}>cda (cucharadas)</option>
              <option value="pza" ${item.unit === 'pza' ? 'selected' : ''}>pza (piezas)</option>
            </select>
          </td>

          <!-- 4. Precio Gral (Paquete / Mercado) -->
          <td class="py-2.5 px-2 text-right w-36">
            <div class="relative flex items-center justify-end">
              <span class="text-slate-400 text-xs font-medium mr-1">$</span>
              <input type="number" step="0.5" min="0" value="${Number(item.generalPrice).toFixed(2)}"
                oninput="updateIngredientField('${cat.id}', '${item.id}', 'generalPrice', this.value)"
                onblur="updateIngredientField('${cat.id}', '${item.id}', 'generalPrice', this.value)"
                onkeydown="if(event.key === 'Enter') this.blur()"
                class="w-24 text-right liquid-input px-2 py-1.5 text-slate-700 font-bold text-xs sm:text-sm font-numeric">
            </div>
          </td>

          <!-- 5. Costo Receta (Calculado / Editable) -->
          <td class="py-2.5 px-2 text-right w-36">
            <div class="relative flex items-center justify-end">
              <span class="text-slate-400 font-bold text-xs mr-1">$</span>
              <input type="number" step="0.01" min="0" id="cost-${item.id}" value="${Number(item.finalCost).toFixed(2)}"
                oninput="updateIngredientField('${cat.id}', '${item.id}', 'finalCost', this.value)"
                onblur="updateIngredientField('${cat.id}', '${item.id}', 'finalCost', this.value)"
                onkeydown="if(event.key === 'Enter') this.blur()"
                class="w-24 text-right liquid-input px-2 py-1.5 text-slate-900 font-extrabold text-xs sm:text-sm font-numeric">
            </div>
          </td>

          <!-- 6. Proveedor / Tienda -->
          <td class="py-2.5 px-2 w-36">
            <input type="text" value="${safeHtml(item.store || '')}" placeholder="Proveedor"
              oninput="updateIngredientField('${cat.id}', '${item.id}', 'store', this.value)"
              onblur="updateIngredientField('${cat.id}', '${item.id}', 'store', this.value)"
              onkeydown="if(event.key === 'Enter') this.blur()"
              class="w-full liquid-input px-2.5 py-1.5 text-slate-600 font-medium text-xs">
          </td>

          <!-- Acciones -->
          <td class="py-2.5 pr-4 pl-2 text-right w-14">
            <button onclick="deleteIngredient('${cat.id}', '${item.id}')" title="Eliminar ingrediente"
              class="p-1.5 text-slate-400 hover:text-granada-600 hover:bg-granada-50/80 rounded-xl transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </td>
        </tr>
      `;
    });

    body.innerHTML = `
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="liquid-table-head text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
            <th class="py-3.5 px-4">Ingrediente / Insumo</th>
            <th class="py-3.5 px-2 text-right">Cantidad Receta</th>
            <th class="py-3.5 px-2">Unidad</th>
            <th class="py-3.5 px-2 text-right">Precio Gral (Paquete)</th>
            <th class="py-3.5 px-2 text-right">Costo Receta ($ MXN)</th>
            <th class="py-3.5 px-2">Proveedor / Tienda</th>
            <th class="py-3.5 pr-4 pl-2 text-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <!-- Bottom Card Action Bar -->
      <div class="p-3.5 sm:p-4 bg-white/30 backdrop-blur-md border-t border-white/60 flex items-center justify-between text-xs">
        <span class="text-slate-400 text-[11px]">
          Soporta gramos, mililitros, tazas y cucharadas. El conversor ajusta densidades de frutos secos y líquidos.
        </span>
        <button onclick="addNewIngredientRow('${cat.id}')" 
          class="liquid-pill px-3.5 py-1.5 inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all">
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
          <span>Añadir a ${safeHtml(cat.title.split(' ')[0])}</span>
        </button>
      </div>
    `;

    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  });

  recalculateAll();
};

// 3. Liquid Frosted Toast System (Smoked Charcoal Accent)
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  
  let bg = 'bg-[#1E222B]/95 text-white backdrop-blur-xl border border-white/20 shadow-2xl';
  let icon = '<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>';
  
  if (type === 'error') {
    bg = 'bg-granada-700/95 text-white backdrop-blur-xl border border-white/20 shadow-2xl';
    icon = '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>';
  } else if (type === 'warning') {
    bg = 'bg-amber-600/95 text-white backdrop-blur-xl border border-white/20 shadow-2xl';
    icon = '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01"></path></svg>';
  }

  toast.className = `${bg} px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = `${icon}<span>${message}</span>`;
  
  container.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 2400);
};

// 4. Inversión & Gastos Modal Controllers
window.openNewExpenseModal = function() {
  const modal = document.getElementById('new-expense-modal');
  if (modal) modal.classList.remove('hidden');
};

window.toggleContributorField = function(sourceValue) {
  const container = document.getElementById('new-exp-contributor-container');
  if (container) {
    if (sourceValue === 'Otros') {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
      const input = document.getElementById('new-exp-contributor');
      if (input) input.value = '';
    }
  }
};

window.closeNewExpenseModal = function() {
  const modal = document.getElementById('new-expense-modal');
  if (modal) modal.classList.add('hidden');
  const form = document.getElementById('new-expense-form');
  if (form) form.reset();
  const contribContainer = document.getElementById('new-exp-contributor-container');
  if (contribContainer) contribContainer.classList.add('hidden');
};

window.handleNewExpenseSubmit = function(e) {
  e.preventDefault();
  const source = document.getElementById('new-exp-source').value;
  const contributorInput = document.getElementById('new-exp-contributor');
  const contributorName = (source === 'Otros' && contributorInput) ? contributorInput.value.trim() : '';
  const store = document.getElementById('new-exp-store').value.trim();
  const product = document.getElementById('new-exp-product').value.trim();
  const price = parseFloat(document.getElementById('new-exp-price').value) || 0;
  const cutoffMonth = document.getElementById('new-exp-month').value;
  const status = document.getElementById('new-exp-status').value;
  const dueDate = document.getElementById('new-exp-date').value;

  if (!store || !product || price <= 0) {
    if (window.showToast) window.showToast('Por favor completa todos los campos requeridos', 'error');
    return;
  }

  if (window.InvestmentApp && typeof window.InvestmentApp.addNewExpense === 'function') {
    window.InvestmentApp.addNewExpense({
      source,
      contributorName,
      store,
      product,
      price,
      cutoffMonth,
      status,
      dueDate
    });
  }

  window.closeNewExpenseModal();
};

window.openResetInvestmentsModal = function() {
  const modal = document.getElementById('reset-investments-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeResetInvestmentsModal = function() {
  const modal = document.getElementById('reset-investments-modal');
  if (modal) modal.classList.add('hidden');
};

window.executeResetInvestments = function() {
  if (window.InvestmentApp && typeof window.InvestmentApp.resetToSeedData === 'function') {
    window.InvestmentApp.resetToSeedData();
  }
  window.closeResetInvestmentsModal();
};

// ==========================================
// 5. Control de Pedidos Modal & Helpers
// ==========================================
window.openNewOrderModal = function() {
  const modal = document.getElementById('new-order-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const today = new Date().toISOString().slice(0, 10);
    const dateInput = document.getElementById('new-ord-date');
    const delivInput = document.getElementById('new-ord-delivery');
    if (dateInput && !dateInput.value) dateInput.value = today;
    if (delivInput && !delivInput.value) delivInput.value = today;
    const custInput = document.getElementById('new-ord-customer');
    if (custInput) custInput.focus();
  }
};

window.closeNewOrderModal = function() {
  const modal = document.getElementById('new-order-modal');
  if (modal) modal.classList.add('hidden');
  const form = document.getElementById('new-order-form');
  if (form) form.reset();
};

window.calculateSuggestedPrice = function() {
  const qtyInput = document.getElementById('new-ord-qty');
  const priceInput = document.getElementById('new-ord-price');
  if (!qtyInput || !priceInput) return;
  const qty = parseInt(qtyInput.value, 10) || 1;
  const priceMap = {
    1: 280,
    2: 540,
    3: 820,
    4: 1050,
    5: 1330,
    6: 1590,
    7: 1850,
    20: 4550
  };
  priceInput.value = priceMap[qty] !== undefined ? priceMap[qty] : (qty * 265);
};

window.handleNewOrderSubmit = function(e) {
  e.preventDefault();
  const customer = document.getElementById('new-ord-customer').value.trim();
  const orderDate = document.getElementById('new-ord-date').value;
  const prodDate = document.getElementById('new-ord-prod') ? document.getElementById('new-ord-prod').value : '';
  const deliveryDate = document.getElementById('new-ord-delivery').value;
  const qty = parseInt(document.getElementById('new-ord-qty').value, 10) || 1;
  const price = parseFloat(document.getElementById('new-ord-price').value) || 0;
  const paidStatus = document.getElementById('new-ord-paid').value;
  const prepStatus = document.getElementById('new-ord-prep').value;
  const deliveryStatus = document.getElementById('new-ord-delivery-status').value;
  const notes = document.getElementById('new-ord-notes').value.trim();

  if (!customer || qty <= 0) {
    if (window.showToast) window.showToast('Por favor completa los campos requeridos', 'error');
    return;
  }

  if (window.OrdersApp && typeof window.OrdersApp.addNewOrder === 'function') {
    window.OrdersApp.addNewOrder({
      customer,
      orderDate,
      prodDate,
      deliveryDate,
      qty,
      price,
      paidStatus,
      prepStatus,
      deliveryStatus,
      notes
    });
  }

  window.closeNewOrderModal();
};

window.openResetOrdersModal = function() {
  const modal = document.getElementById('reset-orders-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeResetOrdersModal = function() {
  const modal = document.getElementById('reset-orders-modal');
  if (modal) modal.classList.add('hidden');
};

window.executeResetOrders = function() {
  if (window.OrdersApp && typeof window.OrdersApp.resetToSeedData === 'function') {
    window.OrdersApp.resetToSeedData();
  }
  window.closeResetOrdersModal();
};

// ==========================================
// 5. Inventory Modal Controllers
// ==========================================
window.openNewCustomItemModal = function() {
  const modal = document.getElementById('new-custom-item-modal');
  if (modal) {
    const form = document.getElementById('new-custom-item-form');
    if (form) form.reset();
    modal.classList.remove('hidden');
  }
};

window.closeNewCustomItemModal = function() {
  const modal = document.getElementById('new-custom-item-modal');
  if (modal) modal.classList.add('hidden');
};

window.handleNewCustomItemSubmit = function(e) {
  if (e) e.preventDefault();

  const nameInput = document.getElementById('custom-item-name');
  const catInput = document.getElementById('custom-item-category');
  const unitInput = document.getElementById('custom-item-unit');
  const stockInput = document.getElementById('custom-item-stock');
  const minStockInput = document.getElementById('custom-item-min-stock');
  const pkgSizeInput = document.getElementById('custom-item-pkg-size');
  const pkgPriceInput = document.getElementById('custom-item-pkg-price');
  const storeInput = document.getElementById('custom-item-store');

  if (!nameInput || !nameInput.value.trim()) {
    if (window.showToast) window.showToast('Ingresa el nombre del insumo', 'warning');
    return;
  }

  if (window.InventoryApp && typeof window.InventoryApp.addNewCustomItem === 'function') {
    window.InventoryApp.addNewCustomItem({
      name: nameInput.value.trim(),
      category: catInput ? catInput.value : 'ingrediente',
      unit: unitInput ? unitInput.value : 'pza',
      stockActual: stockInput ? stockInput.value : 0,
      minStock: minStockInput ? minStockInput.value : 10,
      packageSize: pkgSizeInput ? pkgSizeInput.value : 1,
      packagePrice: pkgPriceInput ? pkgPriceInput.value : 0,
      store: storeInput ? storeInput.value.trim() : 'Proveedor Local'
    });
  }

  window.closeNewCustomItemModal();
};

window.openResetInventoryModal = function() {
  const modal = document.getElementById('reset-inventory-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeResetInventoryModal = function() {
  const modal = document.getElementById('reset-inventory-modal');
  if (modal) modal.classList.add('hidden');
};

window.executeResetInventory = function() {
  if (window.InventoryApp && typeof window.InventoryApp.resetToSeedData === 'function') {
    window.InventoryApp.resetToSeedData();
  }
  window.closeResetInventoryModal();
};

// ==========================================
// 6. Initialize Application
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.NogaStore && typeof window.NogaStore.init === 'function') {
    window.NogaStore.init();
  }
  loadRecipeState();
  window.renderRecipeCards();
  if (window.initPresetButtons) window.initPresetButtons();
  if (window.InvestmentApp && typeof window.InvestmentApp.init === 'function') {
    window.InvestmentApp.init();
  }
  if (window.OrdersApp && typeof window.OrdersApp.init === 'function') {
    window.OrdersApp.init();
  }
  if (window.InventoryApp && typeof window.InventoryApp.init === 'function') {
    window.InventoryApp.init();
  }
});
