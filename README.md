# Nogadísima — Culinary ERP & Financial Operating System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-emerald?style=for-the-badge&logo=github)](https://david-bazalduaa.github.io/nogadisima-CRM/)
[![Architecture](https://img.shields.io/badge/Architecture-Local--First%20%7C%20Zero--Dependency-blue?style=for-the-badge)](https://github.com/david-bazalduaa/nogadisima-CRM)
[![Cloud Sync](https://img.shields.io/badge/Cloud%20Sync-Firebase%20Realtime%20Database-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![UI Style](https://img.shields.io/badge/Design%20System-Apple%20Liquid%20Glass-black?style=for-the-badge&logo=apple)](https://developer.apple.com/)

> **High-Performance Culinary ERP, Real-Time Cloud Synchronization Engine & Financial Operating System** engineered for the seasonal gourmet culinary brand *Chiles en Nogada*. Built with pure Vanilla JavaScript, an ambient 60 FPS HTML5 Canvas fluid shader, sub-millisecond local state management, and real-time multi-client cloud persistence via Firebase Realtime Database.

---

## Live Application

- **Production URL**: [https://david-bazalduaa.github.io/nogadisima-CRM/](https://david-bazalduaa.github.io/nogadisima-CRM/)
- **Hosting Infrastructure**: Static GitHub Pages (`main` branch root).
- **Access Gate**: Client-side session gate (Apple-inspired lock screen).

---

## Executive Summary & Problem Space

Seasonal gourmet culinary production (*Chiles en Nogada*) presents high-stakes operational and financial constraints:
1. **Volatile Spot Commodity Pricing**: Key ingredients (Castile walnuts, pomegranate, aged cheese, poblano chiles) fluctuate significantly throughout the harvest season.
2. **Tiered Packaging Economics**: Packaging costs and profit margins vary depending on whether orders are packaged as individual units, 2-packs, or 4-packs.
3. **Multi-User Operational Friction**: Simultaneous order intake, kitchen dispatching, and inventory custody across distributed operators without race conditions or data loss.
4. **Rigorous Margin Control**: Strict food-cost-ratio auditing (target 32%–40%) required to guarantee net business profitability across peak sales volume.

**Nogadísima CRM** solves these operational challenges through a modular, zero-dependency, local-first single-page application (SPA). It provides sub-millisecond UI reactivity, real-time multi-device cloud synchronization, automated culinary unit conversions, an algorithmic packaging bundle solver, and complete multi-year audited financial records.

---

## Key Engineering Highlights

### 1. Zero-Dependency Vanilla JS Architecture
- **Framework-Free Performance**: 100% vanilla ECMAScript (ES6+) with zero build step, zero Node.js runtime requirement, and zero npm bundle overhead.
- **Microsecond Cold Start**: Instant page loads with native DOM manipulation, document fragments, and targeted reactive updates that avoid blanket DOM reflows.
- **Long-Term Maintainability**: Independent of framework version lifecycles, ensuring decades of stability without breaking dependency updates.

### 2. Multi-User Real-Time Cloud Synchronization (Firebase Realtime Database)
- **Bi-directional Reactive Store (`js/global-store.js`)**: Connects to Firebase Realtime Database via CDN-loaded compat modules with optimistic local updates.
- **Live Connection Jewel**: Interactive visual indicator showing instant status transitions:
  - **En vivo (Sincronizado)**: Active WebSocket listener syncing changes across multiple remote computers in real time.
  - **Sincronizando...**: In-flight payload write with automatic debounce to throttle network requests.
  - **Modo local**: Graceful fallback to `localStorage` when offline or disconnected.
- **Conflict-Resistant State Isolation**: Multi-year namespace isolation (`/nogadisima_crm/{year}`) allowing concurrent multi-season auditing without cross-year state pollution.

### 3. Greedy Tiered Packaging Pricing Engine (`js/orders-engine.js`)
- **Algorithmic Bundle Solver**: Computes optimal tiered pricing for any batch of $N$ chiles using a greedy packaging breakdown:
  $$\text{pack4} = \lfloor N / 4 \rfloor, \quad r_1 = N \pmod 4$$
  $$\text{pack2} = \lfloor r_1 / 2 \rfloor, \quad \text{singles} = r_1 \pmod 2$$
  $$\text{SuggestedPrice} = (\text{pack4} \times P_4) + (\text{pack2} \times P_2) + (\text{singles} \times P_1)$$
- **Manual Price & Discount Overrides**: Real-time override options with dynamic margin delta calculation and order balance tracking (Anticipo vs. Liquidado).

### 4. Culinary Metric & Volumetric Conversion Engine (`js/recipe-engine.js`)
- **Density-Compensated Escandallo Engine**: Accurately converts volumetric kitchen measurements (cups, tablespoons) to standardized metric units (grams, milliliters) compensating for ingredient density (e.g., dry nuts vs. liquids vs. fresh produce).
- **Dynamic KPI Yield Calculator**: Instantly recalculates:
  - Unit cost per finished chile (food cost + packaging cost).
  - Base batch cost (standard 7-portion batch).
  - Food Cost Ratio vs. retail suggested price ($280.00 MXN).
  - Theoretical vs. real kitchen yield accounting for culinary shrinkage.

### 5. Ambient 60 FPS Fluid Mesh Shader (`js/background-canvas.js`)
- **HTML5 Canvas 2D Ambient Physics**: Procedurally animates an organic liquid mesh gradient with brand tones (pearl cream, ruby pomegranate, amber, sage green).
- **Cursor Parallax Interaction**: Tracks cursor velocity and applies smooth physical interpolation to maximize the specular refraction of the glass shell overlay without dropping frames.

### 6. Apple-Grade Liquid Glass Design System (`css/liquid-glass.css`)
- **Frosted Glassmorphism**: Multi-layer backdrop filters (`backdrop-filter: blur(40px)`), diffuse drop shadows, and microscopic specular white border highlights (`border: 1px solid rgba(255, 255, 255, 0.75)`).
- **Control Center Dark Cards**: High-contrast graphite/charcoal cards (`#1E222B` / `rgba(28, 31, 38, 0.88)`) with emerald-mint metric indicators designed for mission-critical commercial metrics.
- **Zero-Emoji Professional UI**: Curated SVG iconography, tabular numeric typography, and sleek status badges.

---

## Project Architecture

```text
nogadisima-CRM/
├── index.html                   # Master SPA shell, modal gates, and semantic UI markup
├── Logo.png                     # Official Nogadísima brand identity mark
├── Amazon.png                   # Supplier integration icon: Amazon
├── BodegaAurrera.png            # Supplier integration icon: Bodega Aurrera
├── LaComer.png                  # Supplier integration icon: La Comer
├── MercadoLibre.png             # Supplier integration icon: Mercado Libre
├── Walmart.png                  # Supplier integration icon: Walmart Supercenter
├── README.md                    # System architecture and portfolio documentation
├── css/
│   └── liquid-glass.css         # Liquid glass design system, refraction tokens & keyframes
└── js/
    ├── app.js                   # Application bootstrap, tab routing & notification bus
    ├── background-canvas.js     # 60 FPS HTML5 ambient fluid gradient shader with parallax
    ├── global-store.js          # Central state store, Firebase cloud sync & multi-year manager
    ├── recipe-engine.js         # Culinary escandallo costing, density formulas & CSV exporter
    ├── investment-engine.js     # Financial ledger, expense categorization & spend analytics
    ├── orders-engine.js         # Order management, tiered pricing algorithm & delivery pipeline
    └── inventory-engine.js      # Stock movements, threshold alerts & supplier custody ledger
```

---

## Functional Modules

### 1. Presupuesto de Receta (Recipe Budgeting & Costing)
- Standardized ingredient costing for Picadillo, Nogada Sauce, Garnish, and Premium Packaging.
- Live cost-per-chile breakdown: distinguishes pure raw food cost from packaging supplies.
- Target food cost ratio benchmarks (32%–40% standard gastronomic range).
- Dedicated **[Exportar CSV]** button to export complete escandallo spreadsheets.

### 2. Inversión & Gastos (Financial Expense Ledger)
- 108 verified, audited 2026 expense entries totaling $34,926.46 MXN in historical investments.
- 4-category taxonomy: **Ingredientes**, **Empaque**, **Logística**, and **Operativo**.
- Dynamic search, multi-filter by category and store, sorting by amount/date, and live balance reconciliation.
- Instant CSV financial reporting.

### 3. Control de Pedidos & Ganancias (Order Dispatch & Revenue)
- 95 verified, audited 2026 sales orders totaling $86,625.00 MXN in seasonal revenue.
- Multi-tier package calculator with automated price recommendations.
- Delivery status tracking pipeline: *Pendiente*, *En Preparación*, *En Ruta*, *Entregado*, *Cancelado*.
- Payment state monitoring: *Pendiente*, *Anticipo Recibido*, *Liquidado*.
- Individual customer order history, CSV export, and live profit metric computation.

### 4. Inventario & Custodia (Inventory Custody)
- Stock ledger tracking physical raw materials, dry goods, and branded packaging units.
- Minimum threshold triggers with automated restock warnings.
- Direct supplier tagging (Costco, Sam's Club, Central de Abastos, Walmart, etc.).
- CSV stock audit export.

### 5. Multi-Year Historical Isolation & Cloud Backup
- Built-in multi-year switcher: **2026** (audited historical benchmark), **2027**, **2028**, **2029**, **2030**.
- Isolated state partitions guaranteeing that future seasons never overwrite past audited results.
- Cloud snapshot backups with one-click JSON restore and reset capabilities.

---

## Security & Client Session Gate

- **Session Gate**: Built-in Apple-inspired frosted lock screen requiring credential authentication.
- **Zero-Flicker Session Persistence**: Authenticated sessions are preserved in `sessionStorage` with instant unlock on page refresh.
- **Top Bar Lock Button**: Instant lock capability in the top navigation header for privacy during shared kitchen operations.

---

## Getting Started & Local Development

No package manager, compiler, or build tooling is required. Simply clone and serve statically:

### Prerequisites
- Any modern web browser (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge).
- A basic local HTTP server (Python, Node.js, or VS Code Live Server).

### Quickstart
```bash
# 1. Clone the repository
git clone https://github.com/david-bazalduaa/nogadisima-CRM.git

# 2. Navigate to the project root
cd nogadisima-CRM

# 3. Start a lightweight local server (Python 3)
python3 -m http.server 8080

# 4. Open in your browser
open http://localhost:8080/index.html
```

---

## Deployment to GitHub Pages

This repository is optimized for out-of-the-box static hosting:
1. Push all code to the `main` branch:
   ```bash
   git add .
   git commit -m "feat: portfolio-grade system release"
   git push origin main
   ```
2. Navigate to your repository on GitHub: **Settings > Pages**.
3. Under **Build and deployment > Source**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. GitHub Pages will build and deploy the application within seconds.

---

## Author & Engineering Profile

**David Bazaldúa Méndez**  
*Full-Stack Engineer & Frontend Architect*

- **GitHub**: [@david-bazalduaa](https://github.com/david-bazalduaa)
- **Repository**: [https://github.com/david-bazalduaa/nogadisima-CRM](https://github.com/david-bazalduaa/nogadisima-CRM)
- **Live Application**: [https://david-bazalduaa.github.io/nogadisima-CRM/](https://david-bazalduaa.github.io/nogadisima-CRM/)

---

*Designed and engineered with passion for high-precision culinary operations and software craftsmanship.*