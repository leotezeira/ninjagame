# ninjagame
Juego Ninja (HTML estático).

## Ejecutar local
- Opción simple: abrir `ninjagame.html` en el navegador.
- Opción recomendada (evita problemas de rutas/CORS):
	- `python3 -m http.server 8000`
	- abrir `http://localhost:8000/` (redirige a `ninjagame.html`)

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
