// ══════════════════════════════════════════════
//  app.js  —  Can Beyler PWA  —  Merkezi Mantık
// ══════════════════════════════════════════════

// ── Storage Anahtarları ───────────────────────
const SK = {
  INFO    : 'cb_info_v3',
  MENU    : 'cb_menu_v3',
  IMAGES  : 'cb_imgs_v3',
  CART    : 'cb_cart_v3',
  PAYMENT : 'cb_pay_v3',
};

// ── Varsayılan Restoran Bilgileri ─────────────
const DEF_INFO = {
  name      : 'Can Beyler',
  tagline   : 'Kızarmış Piliç & Pilav',
  promo     : 'AÇILIŞA ÖZEL UYGUN FİYATLARLA HİZMETİNİZDEYİZ',
  phone     : '05336399706',
  whatsapp  : '905336399706',
  address   : 'Aldere Mah. Mehmet Ali Altun Cad. 397 Sok. No: 6/A Mamak/ANKARA',
  mapsQuery : 'Can+Beyler+Mamak+Ankara',
  hours1    : 'Pzt – Cmt: 10:00 – 22:00',
  hours2    : 'Pazar: 11:00 – 21:00',
  primary   : '#8B0000',
  accent    : '#ff6600',
};

// ── Varsayılan Kategoriler ────────────────────
const DEF_CATS = [
  { id:'yemek',    label:'Yemekler',          emoji:'🍽️', active:true },
  { id:'icecek',   label:'İçecekler',         emoji:'🥤',  active:true },
  { id:'kampanya', label:'Kampanyalı Menüler', emoji:'🔥', active:true },
];

// ── Varsayılan Menü Ürünleri ──────────────────
const DEF_ITEMS = [
  { id:'i1', catId:'yemek',    name:'Tavuklu Nohut Pilav', price:'120', desc:'Günlük taze tavuk, nohut ve buharda pilav',   emoji:'🍚', active:true, badge:''        },
  { id:'i2', catId:'yemek',    name:'Kızarmış Piliç',       price:'220', desc:'Çıtır çıtır, baharatlı, tam porsiyon',       emoji:'🍗', active:true, badge:''        },
  { id:'i3', catId:'yemek',    name:'Kanat Menü',           price:'180', desc:'6 adet kanat + patates kızartması',          emoji:'🍖', active:true, badge:''        },
  { id:'i4', catId:'yemek',    name:'Çorba Çeşitleri',      price:'65',  desc:'Mercimek, domates, tarhana — her gün taze', emoji:'🍲', active:true, badge:''        },
  { id:'i5', catId:'icecek',   name:'Ayran',                price:'20',  desc:'Soğuk, taze ayran',                         emoji:'🥛', active:true, badge:''        },
  { id:'i6', catId:'icecek',   name:'Kola / Gazoz',         price:'30',  desc:'Çeşitli meşrubatlar',                       emoji:'🥤', active:true, badge:''        },
  { id:'i7', catId:'icecek',   name:'Su',                   price:'10',  desc:'0.5 lt soğuk su',                           emoji:'💧', active:true, badge:''        },
  { id:'i8', catId:'kampanya', name:'Aile Paketi',           price:'450', desc:'1 tam piliç + 2 pilav + 2 çorba + 4 ayran', emoji:'👨‍👩‍👧‍👦', active:true, badge:'EN İYİ' },
  { id:'i9', catId:'kampanya', name:'İkili Menü',            price:'280', desc:'2 x tavuklu pilav + 2 ayran',              emoji:'👫', active:true, badge:'FIRSАТ'   },
];

// ── Varsayılan Ödeme Ayarları ─────────────────
const DEF_PAY = {
  cardEnabled   : false,
  provider      : 'iyzico',   // iyzico | paytr | stripe | link
  paymentUrl    : '',          // Hosted ödeme sayfası URL
  apiNote       : '',          // Yönetici notu
  onDelivery    : true,        // Kapıda ödeme
  onDeliveryCard: false,       // Kapıda kart
};

// ═══════════════════════════════════════════════
//  VERİ OKUMA / YAZMA
// ═══════════════════════════════════════════════

function getInfo()    { try { const s=localStorage.getItem(SK.INFO);    return s?Object.assign({},DEF_INFO,JSON.parse(s)):Object.assign({},DEF_INFO);   }catch{return Object.assign({},DEF_INFO);   } }
function saveInfo(v)  { try { localStorage.setItem(SK.INFO,   JSON.stringify(v)); return true; }catch{return false;} }

function getMenu() {
  try {
    const s = localStorage.getItem(SK.MENU);
    if (s) {
      const d = JSON.parse(s);
      return { cats: d.cats || [...DEF_CATS], items: d.items || [...DEF_ITEMS] };
    }
  } catch {}
  return { cats: structuredClone(DEF_CATS), items: structuredClone(DEF_ITEMS) };
}
function saveMenu(v)  { try { localStorage.setItem(SK.MENU,JSON.stringify(v)); return true; }catch{return false;} }

function getImages()  { try { const s=localStorage.getItem(SK.IMAGES);  return s?JSON.parse(s):{};       }catch{return {};} }
function saveImages(v){ try { localStorage.setItem(SK.IMAGES,JSON.stringify(v)); return true; }catch{return false;} }

function getPay()     { try { const s=localStorage.getItem(SK.PAYMENT); return s?Object.assign({},DEF_PAY,JSON.parse(s)):Object.assign({},DEF_PAY); }catch{return Object.assign({},DEF_PAY);} }
function savePay(v)   { try { localStorage.setItem(SK.PAYMENT,JSON.stringify(v)); return true; }catch{return false;} }

function getCart()    { try { const s=localStorage.getItem(SK.CART);    return s?JSON.parse(s):[]; }catch{return [];} }
function saveCart(c)  { try { localStorage.setItem(SK.CART,JSON.stringify(c)); }catch{} }
function clearCart()  { localStorage.removeItem(SK.CART); }

// ═══════════════════════════════════════════════
//  SEPET İŞLEMLERİ
// ═══════════════════════════════════════════════

function addToCart(item) {
  const cart = getCart();
  const ex = cart.find(c => c.id === item.id);
  if (ex) ex.qty++;
  else cart.push({ ...item, qty: 1 });
  saveCart(cart);
  return getCart();
}
function updateQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(c => c.id !== id);
  else { const it = cart.find(c => c.id === id); if (it) it.qty = qty; }
  saveCart(cart);
  return getCart();
}
function cartTotal(cart) {
  return cart.reduce((s, c) => s + parseFloat(c.price || 0) * c.qty, 0);
}
function cartCount(cart) {
  return cart.reduce((s, c) => s + c.qty, 0);
}

// ═══════════════════════════════════════════════
//  WHATSAPP SİPARİŞ URL
// ═══════════════════════════════════════════════

function buildWAUrl(cart, info, payMethod) {
  const lines = cart.map(c =>
    `${c.emoji} *${c.name}* x${c.qty} → ₺${(parseFloat(c.price)*c.qty).toFixed(0)}`
  ).join('\n');
  const total = cartTotal(cart).toFixed(0);
  const maps  = `https://maps.google.com/?q=${encodeURIComponent(info.mapsQuery||info.address)}`;
  const payStr = payMethod === 'card'      ? '💳 Kart ile ödeme'
               : payMethod === 'delivery'  ? '💵 Kapıda nakit'
               : payMethod === 'card_del'  ? '💳 Kapıda kart'
               : '—';
  const msg =
`🛒 *${info.name} — Yeni Sipariş*

${lines}

💰 *Toplam: ₺${total}*
💳 Ödeme: ${payStr}

📍 ${info.address}
🗺️ ${maps}

_Sipariş uygulamadan iletildi._`;

  const wa = info.whatsapp.replace(/\D/g,'');
  return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
}

// ═══════════════════════════════════════════════
//  YARDIMCILAR
// ═══════════════════════════════════════════════

function uid() {
  return 'i' + Math.random().toString(36).slice(2,9);
}

async function compressImage(file, maxW=800, q=0.82) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = e => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const sc = Math.min(1, maxW/img.width);
        const w  = Math.round(img.width*sc), h = Math.round(img.height*sc);
        const cv = document.createElement('canvas');
        cv.width=w; cv.height=h;
        cv.getContext('2d').drawImage(img,0,0,w,h);
        res(cv.toDataURL('image/jpeg',q));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  });
}

function applyTheme(info) {
  document.documentElement.style.setProperty('--primary', info.primary||'#8B0000');
  document.documentElement.style.setProperty('--accent',  info.accent||'#ff6600');
}

// PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  document.querySelectorAll('.pwa-install-btn').forEach(b => {
    b.style.display='inline-flex';
    b.onclick=()=>{ e.prompt(); b.style.display='none'; };
  });
});
