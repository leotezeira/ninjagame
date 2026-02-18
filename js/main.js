

import { createClient } from '@supabase/supabase-js';

// --- Configuración de Supabase (puedes cambiar por localStorage si quieres sin backend) ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || window.SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY
);
window.supabase = supabase;

// --- Estado global del juego ---
const game = {};
window.game = game;

// --- Login simple (solo username y password, sin email) ---
async function simpleLogin(username, password) {
  if (!username || !password) throw 'Completa usuario y contraseña';
  let { data, error } = await supabase.from('players').select('*').eq('username', username).maybeSingle();
  if (error) throw 'Error de conexión';
  if (!data) throw 'Usuario no encontrado';
  if (data.password !== password) throw 'Contraseña incorrecta';
  localStorage.setItem('ninjaUser', JSON.stringify(data));
  return data;
}

async function simpleRegister(username, password) {
  if (!username || !password) throw 'Completa usuario y contraseña';
  let { data } = await supabase.from('players').select('*').eq('username', username).maybeSingle();
  if (data) throw 'Usuario ya existe';
  const { error } = await supabase.from('players').insert([{ username, password }]);
  if (error) throw 'No se pudo registrar';
  return true;
}

function getCurrentUser() {
  const raw = localStorage.getItem('ninjaUser');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function logout() {
  localStorage.removeItem('ninjaUser');
  Router.navigate('/login');
}

// --- Renderizado centralizado de pantallas ---
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(screenId);
  if (el) el.classList.add('active');
}

// --- Router simple y robusto ---
const routes = {
  '/login': () => showScreen('auth-screen'),
  '/name': () => showScreen('name-screen'),
  '/clan': () => showScreen('clan-screen'),
  '/village': () => showScreen('village-select-screen'),
  '/kekkei': () => showScreen('kekkei-screen'),
  '/inicio': () => showScreen('village-screen'),
  '/perfil': () => showScreen('profile-screen'),
  '/inventario': () => showScreen('inventory-screen'),
  '/tienda': () => showScreen('shop-screen'),
  '/stats': () => showScreen('stats-screen'),
  '/chat-global': () => showScreen('chat-screen'),
  // Agrega aquí más rutas dinámicas según tus pantallas
};

const Router = {};
Router.init = function() {
  window.onpopstate = () => Router.resolve(window.location.pathname);
  document.body.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a && a.getAttribute('href')?.startsWith('/')) {
      e.preventDefault();
      Router.navigate(a.getAttribute('href'));
    }
  });
  Router.resolve(window.location.pathname);
};

Router.navigate = function(path) {
  window.history.pushState({}, '', path);
  Router.resolve(path);
};

Router.resolve = function(path) {
  if (routes[path]) routes[path]();
  else showScreen('village-screen');
};

// --- Lógica de arranque ---
window.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  Router.init();
  if (!user) {
    Router.navigate('/login');
  } else {
    Router.navigate('/inicio');
  }
});

// --- Exponer funciones globales para login/register/logout ---
window.simpleLogin = simpleLogin;
window.simpleRegister = simpleRegister;
window.logout = logout;
window.showScreen = showScreen;

