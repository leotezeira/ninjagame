# ninjagame
Juego Ninja (HTML estático).

## Estructura
- [ninjagame.html](ninjagame.html): UI (pantallas) + links a assets.
- [css/style.css](css/style.css): estilos.
- [js/main.js](js/main.js): bootstrap (expone `window.game`).
- [js/systems/game.js](js/systems/game.js): lógica/sistemas del juego.
- [js/content/data.js](js/content/data.js): contenido/datos (clanes, jutsus, misiones, enemigos, etc.).

## Últimas Actualizaciones (Redesign UI/UX)

### Nuevas Características de Interfaz ✨

#### Academia Ninja Reorganizada
- **4 Secciones temáticas** en lugar de 16 tabs sin agrupar:
  - 📊 **Jutsus por Rango**: Genin, Chunin, Jonin, Maestro
  - ⚔️ **Especialidades**: Taijutsu, Genjutsu, Escape
  - 🌀 **Elementos Chakra**: Katon, Suiton, Futon, Doton, Raiton
  - ✨ **Kekkei Genkai**: Sharingan, Byakugan, Rinnegan, Bijuu

#### Mejor Visual Hierarchy
- Tarjetas de jutsu con **indicadores de estado visual**:
  - 🟢 Verde: **Aprendido**
  - 🔵 Azul: **Disponible para aprender**
  - ⚪ Gris: **Bloqueado** (requisitos no cumplidos)
- Badges de tipo con colores por rango (Genin/Chunin/Jonin/Master)
- Información de requisitos incumplidos visible en cada jutsu bloqueado

#### Mejoras Visuales & Animaciones
- Botones con efecto hover mejorado y sombras dinámicas
- Transiciones suaves entre tabs (fade-in 0.3s)
- Efecto shine en hover para tarjetas
- Bordes activos para tabs con indicador visual (línea inferior)
- Mejor espaciado y padding en toda la interfaz
- Contraste mejorado manteniendo color scheme original

#### Responsividad Optimizada
- Diseño adaptable para mobile/tablet
- Tabs reducidos en tamaño en pantallas pequeñas
- Mejor distribución de elementos en grillas responsive
- Iconos y badges escalables

### Colores Mantenidos
- ✅ Color naranja principal (#ff8c00) preservado
- ✅ Azul secundario para chakra (#3498db)
- ✅ Rojo para sangre/daño (#e74c3c)
- ✅ Verde para éxito/aprendido (#2ecc71)
- ✅ Oro para premium/Kekkei Genkai (#ffd700)

### Qué NO Cambió
- ❌ Sin imágenes ni sprites
- ❌ Sin librerías externas (vanilla CSS/JS)
- ❌ Toda la lógica y mecánicas de juego intactas
- ❌ Todas las 150+ funciones y sistemas preservadas

## Ejecutar local
- Opción simple: abrir `ninjagame.html` en el navegador.
- Opción recomendada (evita problemas de rutas/CORS):
	- `python3 -m http.server 8000`
	- abrir `http://localhost:8000/` (redirige a `ninjagame.html`)

Nota: como el JS usa módulos (`<script type="module">`), es importante abrirlo vía HTTP (no `file://`).

## Deploy en Vercel
Este repo incluye `index.html` (redirige a `ninjagame.html`) y `vercel.json` (rewrite de `/` a `ninjagame.html`).

### Opción A: Importar desde GitHub (GUI)
1. Subí los cambios a GitHub.
2. En Vercel: **Add New → Project**.
3. Elegí el repo `leotezeira/ninjagame`.
4. Framework Preset: **Other** (sitio estático).
5. Deploy.

### Opción B: Vercel CLI
1. Instalar CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
