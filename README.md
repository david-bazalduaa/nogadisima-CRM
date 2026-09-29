# Nogadísima — CRM & Motor de Presupuesto de Receta

Sistema web interactivo y motor de costeo unitario / presupuesto de receta para el negocio gastronómico de temporada **Chiles en Nogada**.

Diseñado bajo una estética de **Cristal Líquido / Frosted Glassmorphism** de alta fidelidad inspirada en interfaces analíticas de última generación, incorporando la identidad gráfica y paleta de color de la marca Nogadísima.

---

## Estructura Modular del Proyecto

El proyecto está diseñado con arquitectura limpia y desacoplada, 100% estática y compatible de forma nativa con **GitHub Pages**:

```text
nogadisima-CRM/
├── index.html                   # Shell principal de la SPA y markup semántico
├── Logo.png                     # Isotipo e identidad oficial Nogadísima
├── README.md                    # Documentación técnica y de despliegue
├── css/
│   └── liquid-glass.css         # Tokens de cristal líquido, refracciones y sombras
└── js/
    ├── background-canvas.js     # Motor de lienzo fluido ambiental a 60fps con paralaje
    ├── recipe-engine.js         # Motor matemático, conversor culinario y persistencia
    └── app.js                   # Coordinador de vistas, navegación de pestañas y toasts
```

---

## Características de Diseño (Liquid Glassmorphism)

1. **Lienzo Fluido Ambiental Dinámico (`js/background-canvas.js`)**:
   - Renderiza un gradiente de malla líquida en movimiento a 60fps (`canvas 2D`) con tonos crema perla cálido, rubí de granada, ámbar y salvia.
   - Responde al movimiento del cursor con sutil paralaje físico para maximizar la refracción del cristal superior a lo largo de todo el viewport.
2. **Master Full-Width Glass Shell (`.liquid-shell`)**:
   - Contenedor inmersivo al 100% del ancho del navegador con desenfoque de 40px, bordes de refracción continua y cero cortes laterales o inferiores.
3. **Tarjeta Comercial Elevada (`.liquid-dark-card`)**:
   - Tarjeta en gradiente Grafito / Carbón Ahumado traslúcido (`#1E222B` / `rgba(28, 31, 38, 0.88)`), inspirada en el Centro de Control de Apple, con borde biselado reflectante, relieve interior de luz especular y métricas en esmeralda menta para el simulador PVP.
4. **Píldoras y Controles de Cristal (`.liquid-pill`, `.liquid-btn-dark`, `.liquid-input`)**:
   - Píldoras interactivas estilo cápsula de vidrio esmerilado con respuesta elástica cubic-bezier.
   - Botones de estado activo en carbón ahumado con resplandor superior de borde blanco y tipografía blanca nítida.
   - Entradas de tabla suaves que se funden con el fondo hasta recibir foco.

---

## Motor de Costeo y Conversiones

- **Conversión Culinaria Multi-Unidad**: Soporta gramos (`gr`), mililitros (`ml`), tazas (`taza`), cucharadas (`cda`) y piezas (`pza`) con compensación de densidad para frutos secos, líquidos y sólidos.
- **Edición en Tabla en Tiempo Real**: Cualquier ajuste en cantidades, unidades o precios recalcula instantáneamente:
  - Costo unitario por chile terminado (alimento + empaque).
  - Costo total de lote (7 piezas base).
  - Food Cost Ratio gastronómico contra PVP sugerido.
  - Proyección de margen bruto y utilidad neta por pieza y por lote.
- **Persistencia**: Sincronización continua en `localStorage`.
- **Exportación**: Descarga directa de escandallo detallado en archivo `.csv`.

---

## Despliegue en GitHub Pages

1. Sube los archivos al repositorio en la rama `main`.
2. En GitHub ve a **Settings > Pages**.
3. En **Build and deployment > Source**, selecciona `Deploy from a branch` y elige la rama `main` en la carpeta `/ (root)`.
4. El sistema estará disponible en línea de inmediato.