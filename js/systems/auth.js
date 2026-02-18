// js/systems/auth.js
// Sistema de autenticación para Ninja RPG
import { supabase } from '../main.js';

function validateUsername(username) {
  if (typeof username !== 'string') return 'Nombre inválido';
  if (username.length < 3 || username.length > 20) return 'Debe tener entre 3 y 20 caracteres';
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(username)) return 'Solo letras, números y guión bajo, sin comenzar con número';
  return null;
}

function usernameToEmail(username) {
  return `${username.toLowerCase()}@ninjarpg.game`;
}

async function isUsernameTaken(username) {
  const { data } = await supabase
    .from('profiles')
    .select('ninja_name')
    .eq('ninja_name', username.toLowerCase())
    .single();
  return !!data;
}

async function register(username, password) {
  const error = validateUsername(username);
  if (error) throw error;
  if (await isUsernameTaken(username)) throw 'Ese nombre de ninja ya existe';
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: usernameToEmail(username),
    password
  });
  if (signUpError) throw signUpError.message || 'Error de registro';
  const user = data.user;
  if (!user) throw 'No se pudo crear el usuario';
  const { error: profileError } = await supabase.from('profiles').insert({
    user_id: user.id,
    ninja_name: username.toLowerCase(),
    display_name: username
  });
  if (profileError) throw profileError.message || 'Error creando perfil';
}

async function login(username, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password
  });
  if (error) throw 'Nombre o contraseña incorrectos';
}

async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem('ninjaRPGSave');
  AuthSystem._currentUser = null;
  Router.navigate('/login');
}

function getUser() {
  return supabase.auth.user() || null;
}

async function getProfile() {
  const user = getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  return data || null;
}

function init() {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      game.loadGame();
      Router.navigate('/inicio');
    } else {
      Router.navigate('/login');
    }
  });
  supabase.auth.getSession();
}

export const AuthSystem = {
  validateUsername,
  usernameToEmail,
  isUsernameTaken,
  register,
  login,
  logout,
  getUser,
  getProfile,
  init
};
