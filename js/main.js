
import { createClient } from '@supabase/supabase-js';
import { AuthSystem } from './systems/auth.js';
import { Router } from './systems/router.js';
import { ChatSystem } from './systems/chat.js';
import { createGame } from './systems/game.js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || window.SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY
);

window.supabase = supabase;

const game = createGame();
Object.assign(game, AuthSystem, ChatSystem);
game.router = Router;
window.game = game;
window.Router = Router;

// --- FLUJO ROBUSTO DE INICIO Y NAVEGACIÓN ---
async function startApp() {
  const user = await AuthSystem.getUser();
  if (!user) {
    Router.init();
    Router.navigate('/login');
    return;
  }
  const profile = await AuthSystem.getProfile();
  Router.init();
  if (!profile) {
    Router.navigate('/name'); // Ruta de creación de personaje
    return;
  }
  Router.navigate('/inicio');
}

window.addEventListener('DOMContentLoaded', startApp);

