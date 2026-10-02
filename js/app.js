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
        desktopBtn.className = 'tab-btn flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 liquid-pill-active';
        const svg = desktopBtn.querySelector('svg');
        if (svg) svg.className = 'w-4 h-4 text-slate-900';
      }
      if (mobileBtn) {
        mobileBtn.className = 'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide font-numeric liquid-pill-active';
      }
    } else {
      if (panelEl) panelEl.classList.add('hidden');
      if (desktopBtn) {
        desktopBtn.className = 'tab-btn flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all duration-200';
        const svg = desktopBtn.querySelector('svg');
        if (svg) svg.className = 'w-4 h-4 text-slate-400';
      }
      if (mobileBtn) {
        mobileBtn.className = 'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/70 text-slate-600 font-numeric border border-white/80';
      }
    }
  });

  // Toggle Pulse Status Dots (if elements present)
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
    if (typeof window.InventoryApp.syncWithRecipe === 'function') {
      window.InventoryApp.syncWithRecipe();
    }
    window.InventoryApp.render();
  }
  if (tabId === 'presupuesto' && typeof window.recalculateAll === 'function') {
    window.recalculateAll();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchTab = switchTab;

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
          <td class="py-2.5 px-2 w-32">
            <input type="text" value="${safeHtml(item.store || '')}" placeholder="Proveedor"
              oninput="updateIngredientField('${cat.id}', '${item.id}', 'store', this.value)"
              onblur="updateIngredientField('${cat.id}', '${item.id}', 'store', this.value)"
              onkeydown="if(event.key === 'Enter') this.blur()"
              class="w-full liquid-input px-2.5 py-1.5 text-slate-600 font-medium text-xs">
          </td>

          <!-- 7. Dónde Comprar (Quick Store Price Search) -->
          <td class="py-2.5 px-2 text-center whitespace-nowrap w-36">
            <button type="button" onclick="openStoreSearchPopover(event, '${item.id}')"
              title="Cotizar ${safeHtml(item.name)} en tiendas mexicanas"
              class="store-search-btn inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/70 hover:bg-white text-slate-700 hover:text-slate-900 border border-white/90 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer active:scale-97">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
              </svg>
              <span class="text-[11px] font-semibold">Dónde Comprar</span>
            </button>
          </td>

          <!-- Acciones -->
          <td class="py-2.5 pr-4 pl-2 text-right w-14">
            <button onclick="deleteIngredient('${cat.id}', '${item.id}')" title="Eliminar ingrediente"
              class="p-1.5 text-slate-400 hover:text-granada-600 hover:bg-granada-50/80 rounded-xl transition-all cursor-pointer">
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
            <th class="py-3.5 px-2 text-center whitespace-nowrap">Dónde Comprar</th>
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
  
  let bg = 'bg-white/95 text-slate-900 backdrop-blur-xl border border-white/90 shadow-xl';
  let icon = '<svg class="w-4 h-4 text-[#166534]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>';
  
  if (type === 'error') {
    bg = 'bg-[#9F1239] text-white backdrop-blur-xl border border-white/20 shadow-xl';
    icon = '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>';
  } else if (type === 'warning') {
    bg = 'bg-[#D97706] text-white backdrop-blur-xl border border-white/20 shadow-xl';
    icon = '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01"></path></svg>';
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
  if (modal) {
    if (window.NogaStore) {
      window.NogaStore.updateYearDependentFormElements();
    }
    modal.classList.remove('hidden');
  }
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

  // Trigger Action Flow B: Prompt user to optionally allocate expense to inventory
  window.showExpenseToInventoryPrompt({
    product,
    store,
    price,
    source
  });
};

// ==========================================
// 5. Control de Pedidos Modal & Helpers
// ==========================================
window.openNewOrderModal = function() {
  const modal = document.getElementById('new-order-modal');
  if (modal) {
    if (window.NogaStore) {
      window.NogaStore.updateYearDependentFormElements();
    }
    modal.classList.remove('hidden');
    const activeYear = (window.NogaStore ? window.NogaStore.getActiveYear() : '2026');
    const defaultDate = `${activeYear}-09-15`;
    const dateInput = document.getElementById('new-ord-date');
    const delivInput = document.getElementById('new-ord-delivery');
    if (dateInput && (!dateInput.value || !dateInput.value.startsWith(activeYear))) dateInput.value = defaultDate;
    if (delivInput && (!delivInput.value || !delivInput.value.startsWith(activeYear))) delivInput.value = `${activeYear}-09-16`;
    
    const qtyInput = document.getElementById('new-ord-qty');
    if (qtyInput) {
      if (!qtyInput.value || parseInt(qtyInput.value, 10) <= 0) {
        qtyInput.value = 1;
      }
    }
    window.calculateSuggestedPrice();

    const custInput = document.getElementById('new-ord-customer');
    if (custInput) custInput.focus();
  }
};

window.closeNewOrderModal = function() {
  const modal = document.getElementById('new-order-modal');
  if (modal) modal.classList.add('hidden');
  const form = document.getElementById('new-order-form');
  if (form) form.reset();
  const hintEl = document.getElementById('order-pricing-hint');
  if (hintEl) hintEl.classList.add('hidden');
};

window.calculateSuggestedPrice = function() {
  const qtyInput = document.getElementById('new-ord-qty');
  const priceInput = document.getElementById('new-ord-price');
  const hintEl = document.getElementById('order-pricing-hint');
  const hintTextEl = document.getElementById('order-pricing-hint-text');
  if (!qtyInput || !priceInput) return;

  const qty = parseInt(qtyInput.value, 10) || 1;
  const tiers = (window.OrdersApp && typeof window.OrdersApp.getPricingTiers === 'function')
    ? window.OrdersApp.getPricingTiers()
    : (window.NogaStore ? window.NogaStore.getPricingTiers() : { single: 280, pack2: 540, pack4: 1050 });

  const calc = (window.OrdersApp && typeof window.OrdersApp.calculateTieredPrice === 'function')
    ? window.OrdersApp.calculateTieredPrice(qty, tiers)
    : { totalPrice: qty * 280, breakdownText: `Calculado: $${qty * 280}` };

  priceInput.value = calc.totalPrice;

  if (hintTextEl) {
    hintTextEl.textContent = calc.breakdownText || `Calculado: $${calc.totalPrice.toLocaleString('es-MX')}`;
  }
  if (hintEl) {
    hintEl.classList.remove('hidden');
  }
};

window.handleManualPriceOverride = function() {
  const qtyInput = document.getElementById('new-ord-qty');
  const priceInput = document.getElementById('new-ord-price');
  const hintTextEl = document.getElementById('order-pricing-hint-text');
  const hintEl = document.getElementById('order-pricing-hint');
  if (!qtyInput || !priceInput || !hintTextEl) return;

  const qty = parseInt(qtyInput.value, 10) || 1;
  const tiers = (window.OrdersApp && typeof window.OrdersApp.getPricingTiers === 'function')
    ? window.OrdersApp.getPricingTiers()
    : { single: 280, pack2: 540, pack4: 1050 };

  const calc = (window.OrdersApp && typeof window.OrdersApp.calculateTieredPrice === 'function')
    ? window.OrdersApp.calculateTieredPrice(qty, tiers)
    : { totalPrice: qty * 280, breakdownText: '' };

  const currentPrice = parseFloat(priceInput.value) || 0;

  if (hintEl) hintEl.classList.remove('hidden');

  if (Math.abs(currentPrice - calc.totalPrice) > 0.01) {
    hintTextEl.textContent = `Precio manual personalizado ($${currentPrice.toLocaleString('es-MX')} · Tarifa regular: $${calc.totalPrice.toLocaleString('es-MX')})`;
  } else {
    hintTextEl.textContent = calc.breakdownText;
  }
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

// ==========================================
// 6. Cross-Tab Workflow Controllers (Flow A & B)
// ==========================================

// Action Flow A: Restock Directo -> Inversión Bridges
window.openRestockModal = function(id) {
  if (window.InventoryApp && typeof window.InventoryApp.openRestockModal === 'function') {
    window.InventoryApp.openRestockModal(id);
  }
};

window.closeRestockModal = function() {
  if (window.InventoryApp && typeof window.InventoryApp.closeRestockModal === 'function') {
    window.InventoryApp.closeRestockModal();
  }
};

window.executeRestockOnly = function() {
  if (window.InventoryApp && typeof window.InventoryApp.executeRestockOnly === 'function') {
    window.InventoryApp.executeRestockOnly();
  }
};

window.executeRestockAndRedirect = function() {
  if (window.InventoryApp && typeof window.InventoryApp.executeRestockAndRedirect === 'function') {
    window.InventoryApp.executeRestockAndRedirect();
  }
};

// Action Flow B: Inversión -> Inventario Banner & Modal
let lastRecordedExpense = null;
let expensePromptTimer = null;

window.showExpenseToInventoryPrompt = function(expense) {
  lastRecordedExpense = expense;
  const promptEl = document.getElementById('expense-to-inventory-prompt');
  if (!promptEl) return;

  const badge = document.getElementById('prompt-expense-badge');
  if (badge) {
    const formattedPrice = (typeof expense.price === 'number') ? `$${expense.price.toFixed(2)}` : `$${expense.price}`;
    badge.textContent = `${expense.product} (${formattedPrice})`;
  }

  promptEl.classList.remove('hidden');

  if (expensePromptTimer) clearTimeout(expensePromptTimer);
  expensePromptTimer = setTimeout(() => {
    window.dismissExpenseToInventory();
  }, 12000);
};

window.dismissExpenseToInventory = function() {
  const promptEl = document.getElementById('expense-to-inventory-prompt');
  if (promptEl) promptEl.classList.add('hidden');
  if (expensePromptTimer) {
    clearTimeout(expensePromptTimer);
    expensePromptTimer = null;
  }
};

window.openInventoryAllocationFromExpense = function() {
  window.dismissExpenseToInventory();
  if (!lastRecordedExpense) return;

  // Switch smoothly to Inventario tab
  if (typeof switchTab === 'function') {
    switchTab('inventario');
  }

  const modal = document.getElementById('allocate-expense-stock-modal');
  if (!modal) return;

  // Populate reference details
  const prodEl = document.getElementById('alloc-exp-summary-product');
  const priceEl = document.getElementById('alloc-exp-summary-price');
  const storeEl = document.getElementById('alloc-exp-summary-store');
  const sourceEl = document.getElementById('alloc-exp-summary-source');

  const formattedPrice = (typeof lastRecordedExpense.price === 'number') ? `$${lastRecordedExpense.price.toFixed(2)} MXN` : `$${lastRecordedExpense.price} MXN`;
  if (prodEl) prodEl.textContent = lastRecordedExpense.product;
  if (priceEl) priceEl.textContent = formattedPrice;
  if (storeEl) storeEl.textContent = `Proveedor: ${lastRecordedExpense.store || 'Proveedor habitual'}`;
  if (sourceEl) sourceEl.textContent = `Fuente: ${lastRecordedExpense.source || 'Digs'}`;

  // Populate item selector dropdown from InventoryApp.items
  const select = document.getElementById('alloc-expense-item-select');
  if (select && window.InventoryApp && Array.isArray(window.InventoryApp.items)) {
    select.innerHTML = '';
    const items = window.InventoryApp.items;

    const targetNorm = (lastRecordedExpense.product || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let matchedId = '';
    let bestScore = 0;

    items.forEach(it => {
      const opt = document.createElement('option');
      opt.value = it.id;
      opt.textContent = `${it.name} (${it.category}) — Actual: ${it.stockActual || 0} ${it.unit}`;
      select.appendChild(opt);

      const itNorm = (it.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (itNorm === targetNorm) {
        matchedId = it.id;
        bestScore = 100;
      } else if (bestScore < 80 && (itNorm.includes(targetNorm) || targetNorm.includes(itNorm))) {
        matchedId = it.id;
        bestScore = 80;
      } else if (bestScore < 50) {
        const keywords = ['nuez', 'acitron', 'bolsa', 'envase', 'tarjeta', 'sticker', 'carne', 'chile', 'crema', 'queso', 'granada', 'almendra', 'puerco', 'res', 'liston', 'mimi', 'goplas'];
        for (const kw of keywords) {
          if (targetNorm.includes(kw) && itNorm.includes(kw)) {
            matchedId = it.id;
            bestScore = 50;
            break;
          }
        }
      }
    });

    if (matchedId) {
      select.value = matchedId;
    }
  }

  // Sync unit and default quantity
  window.handleAllocItemChange();

  // Set default custodian based on funding source:
  // 'Digs' -> Diego, 'Angy' -> Angy
  const radioDiego = document.getElementById('alloc-custody-diego');
  const radioAngy = document.getElementById('alloc-custody-angy');
  if (lastRecordedExpense.source === 'Angy') {
    if (radioAngy) radioAngy.checked = true;
  } else {
    if (radioDiego) radioDiego.checked = true;
  }

  modal.classList.remove('hidden');
};

window.handleAllocItemChange = function() {
  const select = document.getElementById('alloc-expense-item-select');
  const unitLabel = document.getElementById('alloc-expense-unit');
  const qtyInput = document.getElementById('alloc-expense-qty');
  if (!select || !window.InventoryApp || !Array.isArray(window.InventoryApp.items)) return;

  const selectedItem = window.InventoryApp.items.find(i => i.id === select.value);
  if (selectedItem) {
    if (unitLabel) unitLabel.textContent = selectedItem.unit || 'pza';
    if (qtyInput) {
      qtyInput.value = selectedItem.packageSize > 0 ? selectedItem.packageSize : 1;
    }
  }
};

window.closeAllocateExpenseStockModal = function() {
  const modal = document.getElementById('allocate-expense-stock-modal');
  if (modal) modal.classList.add('hidden');
};

window.handleAllocateExpenseStockSubmit = function() {
  const select = document.getElementById('alloc-expense-item-select');
  const qtyInput = document.getElementById('alloc-expense-qty');
  const isDiego = document.getElementById('alloc-custody-diego')?.checked;
  const custodian = isDiego ? 'diego' : 'angy';

  if (!select || !qtyInput) return;
  const itemId = select.value;
  const qty = parseFloat(qtyInput.value) || 0;

  if (qty <= 0) {
    if (window.showToast) window.showToast('Ingresa una cantidad válida mayor a cero', 'warning');
    return;
  }

  if (window.InventoryApp && typeof window.InventoryApp.allocateStockFromExpense === 'function') {
    const success = window.InventoryApp.allocateStockFromExpense(itemId, custodian, qty);
    if (success) {
      const custodianName = custodian === 'diego' ? 'Diego' : 'Angy';
      const item = window.InventoryApp.items.find(i => i.id === itemId);
      const unit = item ? item.unit : 'pza';
      if (window.showToast) {
        window.showToast(`Stock sumado exitosamente a la custodia de ${custodianName} (+${qty} ${unit})`, 'info');
      }
    }
  }

  window.closeAllocateExpenseStockModal();
};

// ==========================================
// 7. Multi-Year Season Dropdown Controller
// ==========================================
window.toggleSeasonDropdown = function(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('season-dropdown-menu');
  const chevron = document.getElementById('season-dropdown-chevron');
  if (!menu) return;
  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
  } else {
    menu.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
};

window.closeSeasonDropdown = function() {
  const menu = document.getElementById('season-dropdown-menu');
  const chevron = document.getElementById('season-dropdown-chevron');
  if (menu && !menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
};

window.selectAppYear = function(year) {
  window.closeSeasonDropdown();
  window.setAppYear(year);
};

window.setAppYear = function(year) {
  if (window.NogaStore && typeof window.NogaStore.setYear === 'function') {
    window.NogaStore.setYear(year);
  }
};

// Global click outside listener to close season dropdown
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('season-dropdown-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    window.closeSeasonDropdown();
  }
});

// Close dropdowns and floating modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeSeasonDropdown();
    if (typeof window.closeStorePopover === 'function') {
      window.closeStorePopover();
    }
    if (typeof window.closeCloudSyncModal === 'function') {
      window.closeCloudSyncModal();
    }
    if (typeof window.closePricingTiersModal === 'function') {
      window.closePricingTiersModal();
    }
  }
});

// ==========================================
// 8. Interactive Store Price Search (Dónde Comprar)
// ==========================================
window._currentSearchIngredient = '';

function generateStoreSearchUrl(storeKey, ingredientName) {
  const cleanName = (ingredientName || '').trim();
  const query = encodeURIComponent(cleanName);
  const slug = encodeURIComponent(cleanName.toLowerCase().replace(/[\s/]+/g, '-'));

  switch (storeKey) {
    case 'walmart':
      return `https://www.walmart.com.mx/search?q=${query}`;
    case 'bodega':
      return `https://www.bodegaaurrera.com.mx/search?q=${query}`;
    case 'lacomer':
      return `https://www.lacomer.com.mx/lacomer/#!/item-search/287/${query}/true?p=1&t=0`;
    case 'amazon':
      return `https://www.amazon.com.mx/s?k=${query}`;
    case 'mercadolibre':
      return `https://listado.mercadolibre.com.mx/${slug}`;
    default:
      return `https://www.google.com/search?q=${query}`;
  }
}
window.generateStoreSearchUrl = generateStoreSearchUrl;

window.openStoreSearchPopover = function(event, itemId) {
  if (event) event.stopPropagation();
  const btn = event.currentTarget || (event.target ? event.target.closest('button') : null);
  const popover = document.getElementById('store-search-popover');
  if (!popover || !btn) return;

  // Retrieve current ingredient name from live DOM input or data store
  let ingredientName = '';
  const inputEl = document.getElementById(`name-${itemId}`);
  if (inputEl && inputEl.value) {
    ingredientName = inputEl.value.trim();
  } else if (window.RecipeApp && window.RecipeApp.data && window.RecipeApp.data.categories) {
    for (const cat of window.RecipeApp.data.categories) {
      const it = cat.items.find(i => i.id === itemId);
      if (it) {
        ingredientName = it.name.trim();
        break;
      }
    }
  }

  if (!ingredientName) ingredientName = 'Insumo';
  window._currentSearchIngredient = ingredientName;

  const titleEl = document.getElementById('popover-ingredient-name');
  if (titleEl) {
    titleEl.textContent = `"${ingredientName}"`;
  }

  // Display popover and compute smart floating position
  popover.classList.remove('hidden');

  const rect = btn.getBoundingClientRect();
  const popoverWidth = popover.offsetWidth || 480;
  const popoverHeight = popover.offsetHeight || 100;
  const margin = 16;

  // Horizontal centering
  let left = rect.left + (rect.width / 2) - (popoverWidth / 2);
  if (left < margin) left = margin;
  if (left + popoverWidth > window.innerWidth - margin) {
    left = window.innerWidth - popoverWidth - margin;
  }

  // Vertical anchoring: prefer below, flip above if near screen bottom
  let top = rect.bottom + 8;
  if (top + popoverHeight > window.innerHeight - margin) {
    top = Math.max(margin, rect.top - popoverHeight - 8);
  }

  popover.style.left = `${Math.round(left)}px`;
  popover.style.top = `${Math.round(top)}px`;
};

window.closeStoreSearchPopover = function() {
  const popover = document.getElementById('store-search-popover');
  if (popover && !popover.classList.contains('hidden')) {
    popover.classList.add('hidden');
  }
};

window.onSelectStoreSearch = function(storeKey) {
  const ingredient = window._currentSearchIngredient || '';
  if (!ingredient) return;

  const url = generateStoreSearchUrl(storeKey, ingredient);
  window.open(url, '_blank', 'noopener,noreferrer');
  window.closeStoreSearchPopover();
};

// Global click outside listener to close store search popover
document.addEventListener('click', (e) => {
  const popover = document.getElementById('store-search-popover');
  if (popover && !popover.classList.contains('hidden')) {
    if (!popover.contains(e.target) && !e.target.closest('.store-search-btn')) {
      window.closeStoreSearchPopover();
    }
  }
});

// Close store popover on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeStoreSearchPopover();
  }
});

// ==========================================
// 9. Apple Minimalist Security & Lock Screen Engine
// ==========================================
const APP_AUTH_KEY = 'nogadisima_authenticated';
const APP_ACCESS_PASSWORD = 'NogadisimaDA2001';

window.isAppAuthenticated = function() {
  try {
    return sessionStorage.getItem(APP_AUTH_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

window.handleLockLogin = function(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('lock-password-input');
  const card = document.getElementById('lock-card');
  const errorMsg = document.getElementById('lock-error-msg');
  const lockScreen = document.getElementById('lock-screen');
  const dashboard = document.getElementById('app-dashboard');

  if (!input) return;

  const enteredPassword = input.value;

  if (enteredPassword === APP_ACCESS_PASSWORD) {
    // 1. Persist authenticated session
    try {
      sessionStorage.setItem(APP_AUTH_KEY, 'true');
    } catch (e) {}

    // 2. Hide error message
    if (errorMsg) errorMsg.classList.add('hidden');

    // 3. Smooth fade-out of lock screen revealing dashboard
    if (dashboard) {
      dashboard.style.display = 'block';
    }

    if (lockScreen) {
      lockScreen.classList.add('opacity-0');
      setTimeout(() => {
        document.documentElement.classList.add('is-authenticated');
        lockScreen.classList.add('hidden');
        if (dashboard) dashboard.style.display = '';
        input.value = '';
        window.dispatchEvent(new Event('resize'));
      }, 300);
    } else {
      document.documentElement.classList.add('is-authenticated');
    }
  } else {
    // 4. Authentication Failure: Authentic iOS shake & discreet error label
    if (card) {
      card.classList.remove('animate-apple-shake');
      void card.offsetWidth; // Force DOM reflow to replay keyframe
      card.classList.add('animate-apple-shake');
    }
    if (errorMsg) {
      errorMsg.classList.remove('hidden');
    }
    input.value = '';
    input.focus();
  }
};

window.lockAppSession = function() {
  try {
    sessionStorage.removeItem(APP_AUTH_KEY);
  } catch (e) {}

  document.documentElement.classList.remove('is-authenticated');

  const lockScreen = document.getElementById('lock-screen');
  const input = document.getElementById('lock-password-input');
  const errorMsg = document.getElementById('lock-error-msg');
  const card = document.getElementById('lock-card');

  if (card) card.classList.remove('animate-apple-shake');
  if (errorMsg) errorMsg.classList.add('hidden');

  if (lockScreen) {
    lockScreen.classList.remove('hidden', 'opacity-0');
  }

  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 80);
  }
};

window.checkAuthState = function() {
  const isAuth = window.isAppAuthenticated();
  const lockScreen = document.getElementById('lock-screen');
  const input = document.getElementById('lock-password-input');

  if (isAuth) {
    document.documentElement.classList.add('is-authenticated');
    if (lockScreen) lockScreen.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('is-authenticated');
    if (lockScreen) {
      lockScreen.classList.remove('hidden', 'opacity-0');
      if (input) {
        setTimeout(() => input.focus(), 120);
      }
    }
  }
};

// ==========================================
// 10. Initialize Application
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Check session security gate immediately
  window.checkAuthState();

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

  // Ensure initial season pill visual state and form elements match active year
  if (window.NogaStore) {
    window.NogaStore.ensureSeedData();
    window.NogaStore.updateYearSelectorUI();
    window.NogaStore.updateYearDependentFormElements();
  }
});

