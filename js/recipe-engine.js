/**
 * NOGADÍSIMA — MULTI-UNIT RECIPE COSTING & BUDGET ENGINE
 * Pure Vanilla ES6+ State & Precision Cent Calculations
 */

const DEFAULT_RECIPE_DATA = {
  batchPieces: 7,
  yieldPortions: 6.5,
  salePrice: 280.00,
  categories: [
    {
      id: 'nogada',
      title: 'Nogada (Salsa / Cobertura)',
      description: 'Salsa tradicional a base de nuez de Castilla fresca, queso de cabra y jerez.',
      color: 'amber',
      items: [
        { id: 'nog-1', name: 'Queso Philadelphia', qty: 140, unit: 'gr', packageSize: 420, generalPrice: 93.00, finalCost: 31.00, store: 'Walmart' },
        { id: 'nog-2', name: 'Crema', qty: 225, unit: 'ml', packageSize: 800, generalPrice: 76.00, finalCost: 21.38, store: 'Walmart' },
        { id: 'nog-3', name: 'Acitrón', qty: 100, unit: 'gr', packageSize: 1200, generalPrice: 120.00, finalCost: 10.00, store: 'Tlalne' },
        { id: 'nog-4', name: 'Queso de cabra', qty: 70, unit: 'gr', packageSize: 280, generalPrice: 92.00, finalCost: 23.00, store: 'Chedraui' },
        { id: 'nog-5', name: 'Nuez de Castilla', qty: 250, unit: 'gr', packageSize: 1000, generalPrice: 280.00, finalCost: 70.00, store: 'Tlalne' },
        { id: 'nog-6', name: 'Leche evaporada', qty: 120, unit: 'gr', packageSize: 1000, generalPrice: 42.00, finalCost: 5.04, store: 'Chedraui' },
        { id: 'nog-7', name: 'Jerez', qty: 60, unit: 'ml', packageSize: 4000, generalPrice: 244.00, finalCost: 3.66, store: 'Chedraui' },
        { id: 'nog-8', name: 'Canela en polvo', qty: 1, unit: 'cda', packageSize: 50, generalPrice: 15.00, finalCost: 0.00, store: 'Alacena' },
        { id: 'nog-9', name: 'Almíbar de durazno', qty: 50, unit: 'ml', packageSize: 1000, generalPrice: 20.00, finalCost: 0.00, store: 'Alacena' },
        { id: 'nog-10', name: 'Sal y pimienta blanca', qty: 1, unit: 'cda', packageSize: 50, generalPrice: 10.00, finalCost: 0.00, store: 'Alacena' }
      ]
    },
    {
      id: 'relleno',
      title: 'Relleno (Picadillo Poblano)',
      description: 'Carne picada de res y cerdo con manzana panochera, durazno, frutos secos y especias.',
      color: 'pomegranate',
      items: [
        { id: 'rel-1', name: 'Azúcar blanca', qty: 50, unit: 'gr', packageSize: 1000, generalPrice: 19.00, finalCost: 0.95, store: 'Tlalne' },
        { id: 'rel-2', name: 'Carne de res molida', qty: 200, unit: 'gr', packageSize: 1000, generalPrice: 152.00, finalCost: 30.40, store: 'Costco' },
        { id: 'rel-3', name: 'Carne de puerco molida', qty: 200, unit: 'gr', packageSize: 1000, generalPrice: 110.00, finalCost: 22.00, store: 'Cuadro' },
        { id: 'rel-4', name: 'Manzana panochera', qty: 1, unit: 'pza', packageSize: 5, generalPrice: 54.00, finalCost: 10.80, store: 'Mercado' },
        { id: 'rel-5', name: 'Durazno criollo', qty: 3, unit: 'pza', packageSize: 8, generalPrice: 65.00, finalCost: 24.38, store: 'Mercado' },
        { id: 'rel-6', name: 'Acitrón picado', qty: 100, unit: 'gr', packageSize: 1200, generalPrice: 144.00, finalCost: 12.00, store: 'Tlalne' },
        { id: 'rel-7', name: 'Nuez picada', qty: 100, unit: 'gr', packageSize: 1000, generalPrice: 280.00, finalCost: 28.00, store: 'Tlalne' },
        { id: 'rel-8', name: 'Almendra fileteada', qty: 50, unit: 'gr', packageSize: 1000, generalPrice: 215.00, finalCost: 10.75, store: 'Tlalne' },
        { id: 'rel-9', name: 'Piñón rosa', qty: 50, unit: 'gr', packageSize: 1000, generalPrice: 570.00, finalCost: 28.50, store: 'Tlalne' },
        { id: 'rel-10', name: 'Cebolla blanca', qty: 200, unit: 'gr', packageSize: 1000, generalPrice: 35.00, finalCost: 7.00, store: 'Mercado' },
        { id: 'rel-11', name: 'Diente de ajo', qty: 1, unit: 'pza', packageSize: 20.5, generalPrice: 41.00, finalCost: 2.00, store: 'Mercado' },
        { id: 'rel-12', name: 'Puré de tomate', qty: 170, unit: 'ml', packageSize: 340, generalPrice: 18.22, finalCost: 9.11, store: 'Walmart' },
        { id: 'rel-13', name: 'Especias (canela, clavo, nuez moscada, aceite)', qty: 1, unit: 'cda', packageSize: 50, generalPrice: 30.00, finalCost: 0.00, store: 'Alacena' }
      ]
    },
    {
      id: 'extras',
      title: 'Extras & Montaje',
      description: 'Chiles poblanos seleccionados, granada roja y perejil fresco de adorno.',
      color: 'poblano',
      items: [
        { id: 'ext-1', name: 'Chiles poblanos seleccionados', qty: 7, unit: 'pza', packageSize: 7, generalPrice: 107.00, finalCost: 107.00, store: 'Chedraui' },
        { id: 'ext-2', name: 'Granada roja desgranada', qty: 300, unit: 'gr', packageSize: 1000, generalPrice: 70.00, finalCost: 21.00, store: 'Mercado' },
        { id: 'ext-3', name: 'Perejil liso fresco', qty: 1, unit: 'cda', packageSize: 2, generalPrice: 1.00, finalCost: 0.50, store: 'Mercado' }
      ]
    },
    {
      id: 'empaque',
      title: 'Costeo de Empaque y Presentación',
      description: 'Cajas, envases termoformados, bolsas blancas y etiquetas corporativas proporcionales.',
      color: 'amber',
      items: [
        { id: 'pkg-1', name: 'Papel encerado', qty: 7, unit: 'pza', packageSize: 100, generalPrice: 130.00, finalCost: 9.10, store: 'Mercado Libre' },
        { id: 'pkg-2', name: 'Bolsas blancas de entrega', qty: 7, unit: 'pza', packageSize: 58.24, generalPrice: 208.00, finalCost: 25.00, store: 'Mercado Libre' },
        { id: 'pkg-3', name: 'Envases termoformados (Marce)', qty: 7, unit: 'pza', packageSize: 350, generalPrice: 250.00, finalCost: 5.00, store: 'Goplas' },
        { id: 'pkg-4', name: 'Sticker decorativo chile', qty: 7, unit: 'pza', packageSize: 210, generalPrice: 65.00, finalCost: 2.17, store: 'Goplas' },
        { id: 'pkg-5', name: 'Sticker de sello bolsa', qty: 7, unit: 'pza', packageSize: 46.6, generalPrice: 65.00, finalCost: 9.75, store: 'Goplas' },
        { id: 'pkg-6', name: 'Tarjetas de agradecimiento / presentación', qty: 7, unit: 'pza', packageSize: 70, generalPrice: 280.50, finalCost: 28.00, store: 'Lumen' }
      ]
    }
  ]
};

const STORAGE_KEY_RECIPE = 'nogadisima_recipe_engine_v5';

// Application State Container
window.RecipeApp = {
  data: null,
  collapsedCards: new Set()
};

function loadRecipeState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_RECIPE);
    if (stored) {
      window.RecipeApp.data = JSON.parse(stored);
    } else {
      window.RecipeApp.data = JSON.parse(JSON.stringify(DEFAULT_RECIPE_DATA));
    }
  } catch (e) {
    console.error('Error loading recipe state', e);
    window.RecipeApp.data = JSON.parse(JSON.stringify(DEFAULT_RECIPE_DATA));
  }

  if (window.NogaStore) {
    window.NogaStore.setRecipe(window.RecipeApp.data, 'recipe-init', false);
  }
}

function saveRecipeState(notify = false) {
  try {
    localStorage.setItem(STORAGE_KEY_RECIPE, JSON.stringify(window.RecipeApp.data));
    if (window.NogaStore) {
      window.NogaStore.setRecipe(window.RecipeApp.data, 'recipe-module', notify);
    }
  } catch (e) {
    console.error('Error saving recipe state', e);
  }
}

// 2. Formatting Utilities with Strict Two-Decimal Mexican Currency Formatting
const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return currencyFormatter.format(num);
}

function safeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text !== undefined && text !== null ? text.toString() : '';
  return div.innerHTML;
}

// 3. Culinary Multi-Unit Conversion Engine
function convertToMetricEquivalent(qty, unit, name = '') {
  const lower = (name || '').toLowerCase();
  const n = Number(qty) || 0;

  if (unit === 'gr' || unit === 'ml') {
    return n;
  }
  if (unit === 'taza') {
    // Chopped nuts, flour, sugar: ~100g per cup
    if (lower.includes('nuez') || lower.includes('almendra') || lower.includes('piñón') || lower.includes('azúcar')) {
      return n * 100;
    }
    // Liquids, creams, purees, syrups: ~240g/ml per cup
    return n * 240;
  }
  if (unit === 'cda') {
    // Standard culinary tablespoon: 15g / 15ml
    return n * 15;
  }
  // Pieces or other direct unit items
  return n;
}

function recalculateItemCost(item) {
  const qty = Number(item.qty) || 0;
  const genPrice = Number(item.generalPrice) || 0;
  if (qty <= 0 || genPrice <= 0) {
    item.finalCost = 0;
    return;
  }

  let calculated = 0;
  if (item.unit === 'pza') {
    const pkgSize = Number(item.packageSize) || 1;
    calculated = (qty / pkgSize) * genPrice;
  } else {
    const effectiveMetric = convertToMetricEquivalent(qty, item.unit, item.name);
    const pkgMetric = Number(item.packageSize) || 1000;
    calculated = (effectiveMetric / pkgMetric) * genPrice;
  }

  // Keep internal calculations in precise floating-point cents
  item.finalCost = Math.round(calculated * 100) / 100;
}

// 4. Reactive Formula Engine with Strict Precision
function recalculateAll() {
  if (!window.RecipeApp.data) return;

  const allItemCosts = [];
  const categoryTotals = {};

  window.RecipeApp.data.categories.forEach(cat => {
    let catSubtotal = 0;
    cat.items.forEach(item => {
      const cost = Math.round((Number(item.finalCost) || 0) * 100) / 100;
      item.finalCost = cost;
      catSubtotal += cost;
      allItemCosts.push(cost);
    });
    categoryTotals[cat.id] = Math.round(catSubtotal * 100) / 100;
  });

  // Precise batch sum
  const batchTotal = Math.round(allItemCosts.reduce((a, b) => a + b, 0) * 100) / 100;
  const totalItemCount = allItemCosts.length;

  const yieldPortions = Number(window.RecipeApp.data.yieldPortions) || 6.5;
  const unitCost = yieldPortions > 0 ? (batchTotal / yieldPortions) : 0;

  const salePrice = Number(window.RecipeApp.data.salePrice) || 280.00;
  const profitPerChile = salePrice - unitCost;
  const grossMargin = salePrice > 0 ? Math.max(0, (profitPerChile / salePrice) * 100) : 0;
  const foodCostRatio = salePrice > 0 ? Math.min(100, (unitCost / salePrice) * 100) : 0;
  const batchProfit = profitPerChile * yieldPortions;

  // Update KPI DOM Elements
  const unitCostEl = document.getElementById('kpi-unit-cost');
  const batchCostEl = document.getElementById('kpi-batch-cost');
  const totalIngCountEl = document.getElementById('kpi-total-ingredients-count');
  const yieldInputEl = document.getElementById('recipe-yield-input');

  if (unitCostEl) unitCostEl.textContent = formatCurrency(unitCost);
  if (batchCostEl) batchCostEl.textContent = formatCurrency(batchTotal);
  if (totalIngCountEl) totalIngCountEl.textContent = `${totalItemCount} ingredientes & insumos`;
  if (yieldInputEl) yieldInputEl.value = yieldPortions;

  const foodCostEl = document.getElementById('kpi-food-cost');
  const foodCostBarEl = document.getElementById('kpi-food-cost-bar');
  const foodCostStatusEl = document.getElementById('kpi-food-cost-status');

  if (foodCostEl) foodCostEl.textContent = `${foodCostRatio.toFixed(1)}%`;
  if (foodCostBarEl) foodCostBarEl.style.width = `${Math.min(100, foodCostRatio)}%`;
  
  if (foodCostStatusEl) {
    if (foodCostRatio <= 32) {
      foodCostStatusEl.textContent = 'Rango gourmet óptimo (< 32%)';
      foodCostStatusEl.className = 'font-medium text-emerald-600';
    } else if (foodCostRatio <= 40) {
      foodCostStatusEl.textContent = 'Rango estándar (32% - 40%)';
      foodCostStatusEl.className = 'font-medium text-amber-600';
    } else {
      foodCostStatusEl.textContent = 'Alerta de costo elevado (> 40%)';
      foodCostStatusEl.className = 'font-medium text-granada-600';
    }
  }

  // Mini Distribution Bars
  if (batchTotal > 0) {
    const nogadaPct = ((categoryTotals['nogada'] || 0) / batchTotal) * 100;
    const rellenoPct = ((categoryTotals['relleno'] || 0) / batchTotal) * 100;
    const extrasPct = ((categoryTotals['extras'] || 0) / batchTotal) * 100;
    const empaquePct = ((categoryTotals['empaque'] || 0) / batchTotal) * 100;

    const bNogada = document.getElementById('bar-nogada');
    const bRelleno = document.getElementById('bar-relleno');
    const bExtras = document.getElementById('bar-extras');
    const bEmpaque = document.getElementById('bar-empaque');

    if (bNogada) bNogada.style.width = `${nogadaPct}%`;
    if (bRelleno) bRelleno.style.width = `${rellenoPct}%`;
    if (bExtras) bExtras.style.width = `${extrasPct}%`;
    if (bEmpaque) bEmpaque.style.width = `${empaquePct}%`;
  }

  // Commercial Simulator DOM Elements
  const salePriceInput = document.getElementById('sale-price-input');
  const profitPerChileEl = document.getElementById('sim-profit-per-chile');
  const grossMarginEl = document.getElementById('sim-gross-margin');
  const batchProfitEl = document.getElementById('sim-batch-profit');
  const costLabelEl = document.getElementById('sim-cost-label');
  const profitLabelEl = document.getElementById('sim-profit-label');
  const simBarCostEl = document.getElementById('sim-bar-cost');
  const simBarProfitEl = document.getElementById('sim-bar-profit');

  if (salePriceInput && document.activeElement !== salePriceInput) {
    salePriceInput.value = salePrice;
  }
  updatePresetButtons(salePrice);

  if (profitPerChileEl) profitPerChileEl.textContent = formatCurrency(profitPerChile);
  if (grossMarginEl) grossMarginEl.textContent = `${grossMargin.toFixed(1)}%`;
  if (batchProfitEl) batchProfitEl.textContent = `${formatCurrency(batchProfit)} MXN`;
  if (costLabelEl) costLabelEl.textContent = formatCurrency(unitCost);
  if (profitLabelEl) profitLabelEl.textContent = formatCurrency(profitPerChile);

  if (simBarCostEl) simBarCostEl.style.width = `${Math.min(100, foodCostRatio)}%`;
  if (simBarProfitEl) simBarProfitEl.style.width = `${Math.max(0, 100 - foodCostRatio)}%`;

  // Category Subtotals in Headers
  window.RecipeApp.data.categories.forEach(cat => {
    const subtotalEl = document.getElementById(`subtotal-${cat.id}`);
    const shareEl = document.getElementById(`share-${cat.id}`);
    const countEl = document.getElementById(`count-${cat.id}`);
    const subtotal = categoryTotals[cat.id] || 0;
    const sharePct = batchTotal > 0 ? ((subtotal / batchTotal) * 100).toFixed(1) : 0;

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (shareEl) shareEl.textContent = `${sharePct}% del lote`;
    if (countEl) countEl.textContent = `${cat.items.length} insumos`;
  });
}

// 5. Interactive Event Handlers
function updateIngredientField(categoryId, itemId, field, value) {
  const category = window.RecipeApp.data.categories.find(c => c.id === categoryId);
  if (!category) return;
  const item = category.items.find(i => i.id === itemId);
  if (!item) return;

  if (field === 'qty' || field === 'generalPrice') {
    const num = parseFloat(value) || 0;
    item[field] = Math.max(0, num);
    recalculateItemCost(item);
    const costInput = document.getElementById(`cost-${item.id}`);
    if (costInput) {
      costInput.value = Number(item.finalCost).toFixed(2);
    }
  } else if (field === 'finalCost') {
    const num = parseFloat(value) || 0;
    item.finalCost = Math.round(Math.max(0, num) * 100) / 100;
    if (item.qty > 0 && item.generalPrice > 0) {
      const effectiveMetric = convertToMetricEquivalent(item.qty, item.unit, item.name);
      item.packageSize = (effectiveMetric * item.generalPrice) / item.finalCost;
    }
  } else if (field === 'unit') {
    item.unit = value;
    recalculateItemCost(item);
    const costInput = document.getElementById(`cost-${item.id}`);
    if (costInput) {
      costInput.value = Number(item.finalCost).toFixed(2);
    }
  } else {
    item[field] = value.trim ? value.trim() : value;
  }

  saveRecipeState();
  recalculateAll();
}

function addNewIngredientRow(categoryId) {
  const category = window.RecipeApp.data.categories.find(c => c.id === categoryId);
  if (!category) return;

  const newItem = {
    id: 'item-' + Date.now(),
    name: 'Nuevo Insumo',
    qty: 100,
    unit: 'gr',
    packageSize: 1000,
    generalPrice: 50.00,
    finalCost: 5.00,
    store: 'Mercado'
  };

  category.items.push(newItem);
  saveRecipeState();
  
  window.RecipeApp.collapsedCards.delete(categoryId);
  window.renderRecipeCards();

  setTimeout(() => {
    const input = document.getElementById(`name-${newItem.id}`);
    if (input) {
      input.focus();
      input.select();
    }
  }, 50);

  if (window.showToast) window.showToast('Nuevo insumo agregado a la receta', 'success');
}

function deleteIngredient(categoryId, itemId) {
  const category = window.RecipeApp.data.categories.find(c => c.id === categoryId);
  if (!category) return;
  category.items = category.items.filter(i => i.id !== itemId);
  saveRecipeState();
  window.renderRecipeCards();
  if (window.showToast) window.showToast('Ingrediente eliminado', 'info');
}

function handleYieldChange(value) {
  const num = parseFloat(value) || 6.5;
  window.RecipeApp.data.yieldPortions = Math.max(0.1, num);
  saveRecipeState();
  recalculateAll();
}

function updatePresetButtons(currentPrice) {
  const buttons = document.querySelectorAll('.preset-price-btn, [data-preset-price]');
  buttons.forEach(btn => {
    const presetVal = parseFloat(btn.getAttribute('data-preset-price'));
    if (!isNaN(presetVal) && Math.abs(presetVal - currentPrice) < 0.01) {
      btn.classList.add('liquid-pill-active');
      btn.classList.remove('font-semibold');
      btn.classList.add('font-bold');
    } else {
      btn.classList.remove('liquid-pill-active');
      btn.classList.remove('font-bold');
      btn.classList.add('font-semibold');
    }
  });
}

function handleSalePriceChange(value) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return;
  window.RecipeApp.data.salePrice = num;
  saveRecipeState();
  recalculateAll();
}

function setSalePrice(price) {
  const num = parseFloat(price) || 280;
  window.RecipeApp.data.salePrice = num;
  saveRecipeState();
  const saleInput = document.getElementById('sale-price-input');
  if (saleInput) {
    saleInput.value = num;
  }
  recalculateAll();
}

function initPresetButtons() {
  const buttons = document.querySelectorAll('.preset-price-btn, [data-preset-price]');
  buttons.forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      const price = parseFloat(this.getAttribute('data-preset-price'));
      if (!isNaN(price)) {
        setSalePrice(price);
      }
    };
  });
}

window.setSalePrice = setSalePrice;
window.handleSalePriceChange = handleSalePriceChange;
window.updatePresetButtons = updatePresetButtons;
window.initPresetButtons = initPresetButtons;

function toggleCardCollapse(categoryId) {
  if (window.RecipeApp.collapsedCards.has(categoryId)) {
    window.RecipeApp.collapsedCards.delete(categoryId);
  } else {
    window.RecipeApp.collapsedCards.add(categoryId);
  }
  const body = document.getElementById(`body-${categoryId}`);
  const chevron = document.getElementById(`chevron-${categoryId}`);
  if (body && chevron) {
    if (window.RecipeApp.collapsedCards.has(categoryId)) {
      body.classList.add('hidden');
      chevron.classList.add('-rotate-90');
      chevron.classList.remove('rotate-0');
    } else {
      body.classList.remove('hidden');
      chevron.classList.remove('-rotate-90');
      chevron.classList.add('rotate-0');
    }
  }
}

function expandAllCategories() {
  window.RecipeApp.collapsedCards.clear();
  window.renderRecipeCards();
}

function collapseAllCategories() {
  window.RecipeApp.data.categories.forEach(c => window.RecipeApp.collapsedCards.add(c.id));
  window.renderRecipeCards();
}

function exportRecipeToCsv() {
  const rows = [];
  rows.push(['Sección', 'Ingrediente / Insumo', 'Cantidad Receta', 'Unidad', 'Precio General Paquete (MXN)', 'Costo en Receta (MXN)', 'Proveedor']);

  window.RecipeApp.data.categories.forEach(cat => {
    cat.items.forEach(item => {
      rows.push([
        `"${cat.title}"`,
        `"${item.name}"`,
        item.qty,
        `"${item.unit}"`,
        item.generalPrice,
        item.finalCost,
        `"${item.store || ''}"`
      ]);
    });
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(r => r.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Presupuesto_Nogadisima_Lote7_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (window.showToast) window.showToast('Escandallo exportado en CSV', 'success');
}
