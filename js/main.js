import { createGame } from './systems/game.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://bydufkvgicwiaybrfcpg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZHVma3ZnaWN3aWF5YnJmY3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzY5NDAsImV4cCI6MjA4Njk1Mjk0MH0.YNxeF2mOMy4xzXrL4uFy9fh5BSAkxZIGRRwijVlnQr8';

const game = createGame();
window.game = game;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
game.supabase = supabase;

const authError = document.getElementById('auth-error');
const authUsername = document.getElementById('auth-username');
const authPassword = document.getElementById('auth-password');
const authLoginBtn = document.getElementById('auth-login-btn');
const authRegisterBtn = document.getElementById('auth-register-btn');
const authSessionKey = 'ninjaAuthUserId';

const setAuthError = (message) => {
    if (!authError) return;
    if (message) {
        authError.style.display = 'block';
        authError.textContent = message;
    } else {
        authError.style.display = 'none';
        authError.textContent = '';
    }
};

const normalizeUsername = (value) => {
    const raw = (value || '').trim();
    return { raw };
};

const hashPassword = async (value) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

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
