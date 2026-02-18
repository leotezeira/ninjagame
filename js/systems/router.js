// js/systems/router.js
// Router cliente para Ninja RPG
import { AuthSystem } from './auth.js';

const routes = {
  '/': () => { if (requireAuth()) navigate('/inicio'); },
  '/login': () => game.showScreen('login-screen'),
  '/inicio': () => { if (requireAuth()) { game.showScreen('village-screen'); game.updateVillageUI(); } },
  '/mundo': () => { if (requireAuth()) game.showScreen('world-screen'); },
  '/batalla': () => { if (requireAuth() && game.currentEnemy) game.showScreen('combat-screen'); else navigate('/inicio'); },
  '/inventario': () => { if (requireAuth()) { game.showScreen('village-screen'); game.showTab('inventory'); } },
  '/tienda': () => { if (requireAuth()) { game.showScreen('village-screen'); game.showTab('shop'); } },
  '/stats': () => { if (requireAuth()) { game.showScreen('village-screen'); game.showTab('stats'); } },
  '/perfil': () => { if (requireAuth()) { game.showScreen('profile-screen'); game.loadMyProfile(); } },
  '/perfil/:id': (params) => { if (requireAuth()) { game.showScreen('profile-screen'); game.loadProfile(params.id); } },
  '/chat-global': () => { if (requireAuth()) { game.showScreen('chat-screen'); game.loadGlobalChat(); } },
  '/chat-aldea': () => { if (requireAuth()) { game.showScreen('chat-screen'); game.loadClanChat(); } },
  '/chat/:userId': (params) => { if (requireAuth()) { game.showScreen('chat-screen'); game.loadPrivateChat(params.userId); } }
};

function requireAuth() {
  if (!AuthSystem.getUser()) {
    navigate('/login');
    return false;
  }
  return true;
}

function matchRoute(path) {
  for (const route in routes) {
    if (!route.includes(':')) {
      if (route === path) return { handler: routes[route], params: {} };
    } else {
      // Soporta un solo parámetro dinámico
      const [base, param] = route.split('/:');
      if (path.startsWith(base + '/')) {
        const value = path.slice(base.length + 1);
        return { handler: routes[route], params: { [param]: value } };
      }
    }
  }
  return null;
}

function navigate(path) {
  window.history.pushState({}, '', path);
  resolveRoute(path);
}

function resolveRoute(path) {
  const match = matchRoute(path);
  if (match) match.handler(match.params || {});
  else navigate('/inicio');
}

function handlePopState() {
  resolveRoute(window.location.pathname + window.location.search);
}

function interceptLinks() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a && a.getAttribute('href')?.startsWith('/') && !a.target) {
      e.preventDefault();
      navigate(a.getAttribute('href'));
    }
  });
}

function init() {
  window.addEventListener('popstate', handlePopState);
  interceptLinks();
  resolveRoute(window.location.pathname);
}

export const Router = { navigate, init, requireAuth };
