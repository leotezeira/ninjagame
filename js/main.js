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
    const slug = raw
        .toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9._-]/g, '');
    return { raw, slug };
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
    const { data: sessionData, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Supabase session error:', error);
        game.showScreen('auth-screen');
        return;
    }
    const session = sessionData?.session;
    if (!session?.user) {
        game.showScreen('auth-screen');
        return;
    }

    const profile = await fetchProfile(session.user.id);
    game.authUser = session.user;
    game.authProfile = profile;
    if (profile) {
        await markOnline(session.user.id);
    }
    game.showScreen('start-screen');
};

const handleRegister = async () => {
    setAuthError('');
    const { raw, slug } = normalizeUsername(authUsername?.value);
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
    if (!slug) {
        setAuthError('Nombre invalido.');
        return;
    }

    const { data: existing } = await supabase
        .from('players')
        .select('id')
        .ilike('username', raw)
        .limit(1);
    if (existing && existing.length) {
        setAuthError('Ese nombre ya esta en uso.');
        return;
    }

    const email = `${slug}@ninjagame.local`;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        setAuthError(error.message);
        return;
    }
    const user = data?.user;
    if (!user) {
        setAuthError('No se pudo crear el usuario.');
        return;
    }

    const { error: insertError } = await supabase.from('players').insert({
        id: user.id,
        username: raw,
        village: 'unknown',
        clan: null,
        level: 1,
        rank: 'Genin',
        game_state: null,
        is_online: true
    });

    if (insertError) {
        setAuthError(insertError.message);
        return;
    }

    game.authUser = user;
    game.authProfile = await fetchProfile(user.id);
    game.showScreen('start-screen');
};

const handleLogin = async () => {
    setAuthError('');
    const { raw, slug } = normalizeUsername(authUsername?.value);
    const password = (authPassword?.value || '').trim();
    if (!raw || !slug) {
        setAuthError('Ingresa tu nombre de personaje.');
        return;
    }
    if (!password) {
        setAuthError('Ingresa tu contrasena.');
        return;
    }
    const email = `${slug}@ninjagame.local`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        setAuthError('Credenciales incorrectas.');
        return;
    }
    const user = data?.user;
    if (!user) {
        setAuthError('No se pudo iniciar sesion.');
        return;
    }
    game.authUser = user;
    game.authProfile = await fetchProfile(user.id);
    await markOnline(user.id);
    game.showScreen('start-screen');
};

window.addEventListener('load', () => {
    try {
        const hasSave = localStorage.getItem('ninjaRPGSave');
        const loadBtn = document.getElementById('load-btn');
        if (!hasSave && loadBtn) loadBtn.style.display = 'none';
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
