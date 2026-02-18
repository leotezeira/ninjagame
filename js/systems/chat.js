// js/systems/chat.js
// Sistema de chat para Ninja RPG
import { supabase } from '../main.js';
import { AuthSystem } from './auth.js';

let _currentChannel = null;
let _subscription = null;
let _messages = [];
let _lastSent = 0;

function getChannelDisplayName(channel) {
  if (channel === 'global') return '🌍 Chat Global';
  if (channel.startsWith('clan:')) {
    const clan = channel.split(':')[1];
    const clanNames = { konoha: 'Konoha', suna: 'Suna', kiri: 'Kiri', iwa: 'Iwa', kumo: 'Kumo', ame: 'Ame' };
    return `🏘️ Chat de ${clanNames[clan] || clan}`;
  }
  if (channel.startsWith('dm:')) return '💬 Mensaje directo';
  return 'Chat';
}

function getMessageColor(kekkei) {
  if (kekkei === 'Sharingan') return '#e74c3c';
  if (kekkei === 'Byakugan') return '#9b59b6';
  if (kekkei === 'Rinnegan') return '#8e44ad';
  if (kekkei === 'Bijuu') return '#ff8c00';
  return '#fff';
}

function getRankBadge(rank) {
  const color = {
    Genin: 'green',
    Chunin: 'blue',
    Jonin: 'orange',
    Kage: 'gold'
  }[rank] || 'gray';
  return `<span class="rank-badge rank-${rank?.toLowerCase()}">${rank}</span>`;
}

function renderMessage(msg) {
  const div = document.createElement('div');
  div.className = 'chat-message';
  div.innerHTML = `
    <span style="color:${getMessageColor(msg.kekkei_genkai)};font-weight:bold;">${msg.display_name}</span>
    ${getRankBadge(msg.rank)}
    <span>${msg.village ? ' ' + emojiVillage(msg.village) : ''}</span>
    <span style="margin-left:8px;">${msg.content}</span>
    <span class="chat-time">${relativeTime(msg.created_at)}</span>
  `;
  return div;
}

function emojiVillage(v) {
  return {
    konoha: '🌳', suna: '🏜️', kiri: '💧', iwa: '⛰️', kumo: '⚡', ame: '🌧️', bosque: '🌲', olas: '🌊', valle: '🏞️', nieve: '❄️'
  }[v] || '🏘️';
}

function relativeTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'hace ' + Math.floor(diff) + 's';
  if (diff < 3600) return 'hace ' + Math.floor(diff/60) + 'm';
  if (diff < 86400) return 'hace ' + Math.floor(diff/3600) + 'h';
  return 'ayer';
}

function appendMessage(msg) {
  const el = renderMessage(msg);
  const cont = document.getElementById('chat-messages');
  if (!cont) return;
  cont.appendChild(el);
  _messages.push(msg);
  if (_messages.length > 50) {
    cont.removeChild(cont.firstChild);
    _messages.shift();
  }
  if (cont.scrollHeight - cont.scrollTop - cont.clientHeight < 100) {
    cont.scrollTop = cont.scrollHeight;
  }
}

async function loadMessages(channel) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('channel', channel)
    .order('created_at', { ascending: false })
    .limit(50);
  _messages = (data || []).reverse();
  const cont = document.getElementById('chat-messages');
  if (cont) cont.innerHTML = '';
  _messages.forEach(appendMessage);
  if (cont) cont.scrollTop = cont.scrollHeight;
}

function subscribeToChannel(channel) {
  if (_subscription) _subscription.unsubscribe();
  _subscription = supabase.channel('chat:' + channel)
    .on('postgres_changes', { event: 'INSERT', table: 'messages', filter: `channel=eq.${channel}` }, payload => appendMessage(payload.new))
    .subscribe();
}

async function sendMessage(content) {
  if (!content || !content.trim() || content.length > 500) return;
  if (Date.now() - _lastSent < 2000) return;
  _lastSent = Date.now();
  const profile = await AuthSystem.getProfile();
  if (!profile) return;
  await supabase.from('messages').insert({
    user_id: profile.user_id,
    ninja_name: profile.ninja_name,
    display_name: profile.display_name,
    clan: profile.clan,
    rank: profile.rank,
    kekkei_genkai: profile.kekkei_genkai,
    village: profile.village,
    content: content.trim(),
    channel: _currentChannel
  });
  document.getElementById('chat-input').value = '';
}

function initChat(channel) {
  _currentChannel = channel;
  document.getElementById('chat-channel-name').textContent = getChannelDisplayName(channel);
  loadMessages(channel);
  subscribeToChannel(channel);
}

function unsubscribeChat() {
  if (_subscription) _subscription.unsubscribe();
  _currentChannel = null;
}

function loadGlobalChat() { initChat('global'); }
function loadClanChat() { initChat('clan:' + (game.player?.clan || 'konoha')); }
function loadPrivateChat(userId) {
  const ids = [AuthSystem.getUser().id, userId].sort();
  initChat('dm:' + ids.join('_'));
}

function handleChatInput(event) {
  if (event.key === 'Enter' && !event.shiftKey) sendMessage(event.target.value);
}

export const ChatSystem = {
  getChannelDisplayName,
  getMessageColor,
  getRankBadge,
  renderMessage,
  appendMessage,
  loadMessages,
  subscribeToChannel,
  sendMessage,
  initChat,
  unsubscribeChat,
  loadGlobalChat,
  loadClanChat,
  loadPrivateChat,
  handleChatInput
};
