// ══════════════════════════════════════════════
//  BROŞÜR TOKEN SİSTEMİ — app.js
// ══════════════════════════════════════════════

const STORAGE_KEY = 'brosur_tokens_v1';

// ── Varsayılan Token Değerleri ────────────────
const DEFAULT_TOKENS = {

  /* ─── RESTORAN BİLGİLERİ ─── */
  RESTAURANT_NAME : "CAN BEYLER",
  TAGLINE         : "kızarmış piliç & pilav",
  PROMO_TEXT      : "AÇILIŞA ÖZEL UYGUN FİYATLARLA HİZMETİNİZDEYİZ",

  /* ─── MENÜ ITEM 1 ─── */
  MENU_1_NAME  : "TAVUKLU NOHUT PİLAV",
  MENU_1_PRICE : "₺120",
  MENU_1_DESC  : "Günlük taze tavuk, nohut ve buharda pilav",

  /* ─── MENÜ ITEM 2 ─── */
  MENU_2_NAME  : "ÇORBA ÇEŞİTLERİ",
  MENU_2_PRICE : "₺65",
  MENU_2_DESC  : "Mercimek, domates, tarhana — her gün taze",

  /* ─── MENÜ ITEM 3 ─── */
  MENU_3_NAME  : "KIZARMIŞ PİLİÇ",
  MENU_3_PRICE : "₺220",
  MENU_3_DESC  : "Çıtır çıtır, baharatlı, tam porsiyon",

  /* ─── MENÜ ITEM 4 ─── */
  MENU_4_NAME  : "KANAT MENU",
  MENU_4_PRICE : "₺180",
  MENU_4_DESC  : "6 adet kanat + patates kızartması",

  /* ─── İLETİŞİM ─── */
  DELIVERY_TITLE : "ALO PAKET",
  PHONE          : "0533 639 97 06",
  ADDRESS_LINE1  : "Aldere Mah. Mehmet Ali Altun Cad. 397 Sok. No: 6/A",
  ADDRESS_LINE2  : "Mamak / ANKARA",

  /* ─── ÇALIŞMA SAATLERİ ─── */
  HOURS_WEEKDAY  : "Pzt–Cmt: 10:00 – 22:00",
  HOURS_WEEKEND  : "Pazar:   11:00 – 21:00",

  /* ─── SOSYAL MEDYA ─── */
  INSTAGRAM      : "@canbeyler",
  WHATSAPP       : "0533 639 97 06",

  /* ─── TEMA RENKLERİ ─── */
  PRIMARY_COLOR  : "#8B0000",
  ACCENT_COLOR   : "#ff6600",
  BG_COLOR       : "#0d0500",
};

// ── Token Okuma / Yazma ───────────────────────
function getTokens() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      // Varsayılanlarla birleştir (yeni eklenen tokenlar için)
      return Object.assign({}, DEFAULT_TOKENS, JSON.parse(saved));
    }
  } catch (e) {}
  return Object.assign({}, DEFAULT_TOKENS);
}

function saveTokens(tokens) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    return true;
  } catch (e) {
    return false;
  }
}

function resetTokens() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Token → DOM Uygulama ──────────────────────
// data-token="TOKEN_KEY" olan tüm elementlere değer yazar
function applyTokensToDOM(tokens) {
  document.querySelectorAll('[data-token]').forEach(el => {
    const key = el.dataset.token;
    if (tokens[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = tokens[key];
      } else if (el.dataset.tokenProp === 'style-color') {
        el.style.color = tokens[key];
      } else if (el.dataset.tokenProp === 'style-background') {
        el.style.background = tokens[key];
      } else {
        el.textContent = tokens[key];
      }
    }
  });

  // CSS değişkenlerini uygula
  if (tokens.PRIMARY_COLOR) document.documentElement.style.setProperty('--primary', tokens.PRIMARY_COLOR);
  if (tokens.ACCENT_COLOR)  document.documentElement.style.setProperty('--accent',  tokens.ACCENT_COLOR);
  if (tokens.BG_COLOR)      document.documentElement.style.setProperty('--bg',      tokens.BG_COLOR);
}

// ── Token Meta Bilgileri (Editor için) ────────
const TOKEN_META = {
  RESTAURANT_NAME : { label: 'Restoran Adı',         group: 'Restoran', type: 'text' },
  TAGLINE         : { label: 'Alt Slogan',            group: 'Restoran', type: 'text' },
  PROMO_TEXT      : { label: 'Kampanya Metni',        group: 'Restoran', type: 'textarea' },

  MENU_1_NAME     : { label: 'Menü 1 – Adı',         group: 'Menü',     type: 'text' },
  MENU_1_PRICE    : { label: 'Menü 1 – Fiyat',        group: 'Menü',     type: 'text' },
  MENU_1_DESC     : { label: 'Menü 1 – Açıklama',     group: 'Menü',     type: 'textarea' },

  MENU_2_NAME     : { label: 'Menü 2 – Adı',         group: 'Menü',     type: 'text' },
  MENU_2_PRICE    : { label: 'Menü 2 – Fiyat',        group: 'Menü',     type: 'text' },
  MENU_2_DESC     : { label: 'Menü 2 – Açıklama',     group: 'Menü',     type: 'textarea' },

  MENU_3_NAME     : { label: 'Menü 3 – Adı',         group: 'Menü',     type: 'text' },
  MENU_3_PRICE    : { label: 'Menü 3 – Fiyat',        group: 'Menü',     type: 'text' },
  MENU_3_DESC     : { label: 'Menü 3 – Açıklama',     group: 'Menü',     type: 'textarea' },

  MENU_4_NAME     : { label: 'Menü 4 – Adı',         group: 'Menü',     type: 'text' },
  MENU_4_PRICE    : { label: 'Menü 4 – Fiyat',        group: 'Menü',     type: 'text' },
  MENU_4_DESC     : { label: 'Menü 4 – Açıklama',     group: 'Menü',     type: 'textarea' },

  DELIVERY_TITLE  : { label: 'Paket Servis Başlığı',  group: 'İletişim', type: 'text' },
  PHONE           : { label: 'Telefon',                group: 'İletişim', type: 'tel' },
  WHATSAPP        : { label: 'WhatsApp',               group: 'İletişim', type: 'tel' },
  ADDRESS_LINE1   : { label: 'Adres Satır 1',          group: 'İletişim', type: 'text' },
  ADDRESS_LINE2   : { label: 'Adres Satır 2',          group: 'İletişim', type: 'text' },
  INSTAGRAM       : { label: 'Instagram',              group: 'İletişim', type: 'text' },

  HOURS_WEEKDAY   : { label: 'Hafta içi saatler',     group: 'Saatler',  type: 'text' },
  HOURS_WEEKEND   : { label: 'Hafta sonu saatler',    group: 'Saatler',  type: 'text' },

  PRIMARY_COLOR   : { label: 'Ana Renk',              group: 'Tema',     type: 'color' },
  ACCENT_COLOR    : { label: 'Vurgu Rengi',           group: 'Tema',     type: 'color' },
  BG_COLOR        : { label: 'Arka Plan Rengi',       group: 'Tema',     type: 'color' },
};

// ── PWA Kurulum Prompt ────────────────────────
let _deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredPrompt = e;
  document.querySelectorAll('.pwa-install-btn').forEach(btn => {
    btn.style.display = 'flex';
    btn.addEventListener('click', () => {
      _deferredPrompt.prompt();
      _deferredPrompt = null;
      btn.style.display = 'none';
    });
  });
});

// ── Service Worker Kayıt ──────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
