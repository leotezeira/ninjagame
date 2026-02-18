
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

Router.init();
AuthSystem.init();

const fetchProfile = async (userId) => {
    const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
    if (error) throw error;
    return data || null;
};

const markOnline = async (userId) => {
    await supabase
        .from('players')
        .update({ is_online: true, last_seen: new Date().toISOString() })
        .eq('id', userId);
};

const initAuthSession = async () => {
    const userId = localStorage.getItem(authSessionKey);
    if (!userId) {
        game.showScreen('auth-screen');
        return;
    }
    const profile = await fetchProfile(userId);
    if (!profile) {
        localStorage.removeItem(authSessionKey);
        game.showScreen('auth-screen');
        return;
    }
    game.authUser = { id: userId };
    game.authProfile = profile;
    await markOnline(userId);
    const hasSave = localStorage.getItem('ninjaRPGSave');
    if (hasSave) {
        game.loadGame();
    } else {
        game.showNameScreen();
    }
};

const handleRegister = async () => {
    setAuthError('');
    const { raw } = normalizeUsername(authUsername?.value);
    const password = (authPassword?.value || '').trim();

    if (!raw || raw.length < 3) {
        setAuthError('Nombre invalido. Usa al menos 3 caracteres.');
        return;
    }
    if (raw.length > 20) {
        setAuthError('Nombre invalido. Maximo 20 caracteres.');
        return;
    }
    if (!/^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(raw)) {
        setAuthError('Usa solo letras, numeros y espacios.');
        return;
    }
    if (!password || password.length < 6) {
        setAuthError('Contrasena muy corta (minimo 6).');
        return;
    }

    const { data: existing, error: lookupError } = await supabase
        .from('players')
        .select('id,username')
        .eq('username', raw)
        .limit(1);
    if (lookupError) {
        setAuthError('No se pudo validar el nombre.');
        return;
    }
    if (existing && existing.length) {
        setAuthError('Ese nombre ya esta en uso.');
        return;
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();

    const { error: insertError } = await supabase.from('players').insert({
        id: userId,
        username: raw,
        village: 'unknown',
        clan: null,
        level: 1,
        rank: 'Genin',
        game_state: null,
        password_hash: passwordHash,
        is_online: true
    });

    if (insertError) {
        setAuthError(insertError.message);
        return;
    }

    localStorage.setItem(authSessionKey, userId);
    game.authUser = { id: userId };
    game.authProfile = await fetchProfile(userId);
    game.showNameScreen();
};

const handleLogin = async () => {
    setAuthError('');
    const { raw } = normalizeUsername(authUsername?.value);
    const password = (authPassword?.value || '').trim();
        if (!raw) {
        setAuthError('Ingresa tu nombre de personaje.');
        return;
    }
    if (!password) {
        setAuthError('Ingresa tu contrasena.');
        return;
    }
    const { data, error } = await supabase
        .from('players')
        .select('id,username,password_hash')
        .eq('username', raw)
        .maybeSingle();
    if (error || !data) {
        setAuthError('Credenciales incorrectas.');
        return;
    }
    const passwordHash = await hashPassword(password);
    if (passwordHash !== data.password_hash) {
        setAuthError('Credenciales incorrectas.');
        return;
    }

    localStorage.setItem(authSessionKey, data.id);
    game.authUser = { id: data.id };
    game.authProfile = await fetchProfile(data.id);
    await markOnline(data.id);
    const hasSave = localStorage.getItem('ninjaRPGSave');
    if (hasSave) {
        game.loadGame();
    } else {
        game.showNameScreen();
    }
};

window.addEventListener('load', () => {
    try {
        // no-op
    } catch (e) {
        // ignore
    }

    initAuthSession();
});

if (authLoginBtn) authLoginBtn.addEventListener('click', handleLogin);
if (authRegisterBtn) authRegisterBtn.addEventListener('click', handleRegister);

window.addEventListener('beforeunload', () => {
    if (game.authUser?.id) {
        supabase.from('players')
            .update({ is_online: false, last_seen: new Date().toISOString() })
            .eq('id', game.authUser.id);
    }
});

