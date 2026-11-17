/* One of Ours — test storefront logic
   Prices: D2C "Selling Price Ladder" in Unit_Economics_Final_with_CAC_LTV_v3.xlsx
   (per-pouch selling price incl. GST, by recipe, pack size and bundle size). */

const BUNDLES = [5, 10, 20, 30, 60];
const SIZES = [100, 300, 500, 1000];
const FIRST_ORDER_DISCOUNT = 0.10; // Inputs tab: first-order discount 10%

const RECIPES = {
  cr: {
    id: 'cr', name: 'Chicken & Rice', full: 'Chicken, Rice & Vegetables',
    color: '#8FB3C4', ink: '#1F3D2E',
    blurb: 'Our everyday classic. Tender chicken, soft-cooked rice and garden vegetables, gently cooked in small batches.',
    tag: 'Everyday favourite',
    ingredients: ['Chicken', 'Rice', 'Seasonal vegetables'],
    prices: { 100: [110, 107, 104, 101, 98], 300: [210, 205, 200, 195, 190], 500: [340, 330, 320, 310, 300], 1000: [625, 600, 580, 570, null] }
  },
  cl: {
    id: 'cl', name: 'Chicken & Lentils', full: 'Chicken, Lentils & Vegetables',
    color: '#9BA88A', ink: '#1F3D2E',
    blurb: 'A grain-free take on our chicken recipe, with protein-rich lentils in place of rice and plenty of vegetables.',
    tag: 'Grain-free',
    ingredients: ['Chicken', 'Lentils', 'Seasonal vegetables'],
    prices: { 100: [115, 112, 109, 106, 103], 300: [220, 215, 210, 205, 200], 500: [350, 340, 330, 320, 310], 1000: [635, 610, 590, 580, null] }
  },
  ll: {
    id: 'll', name: 'Lamb & Lentils', full: 'Lamb, Lentils & Vegetables',
    color: '#A94E2C', ink: '#F3EBDD',
    blurb: 'Our richest recipe. Slow-cooked lamb with lentils and vegetables, for the ones who like their dinner hearty.',
    tag: 'Rich & hearty',
    ingredients: ['Lamb', 'Lentils', 'Seasonal vegetables'],
    prices: { 100: [130, 127, 124, 121, 118], 300: [270, 265, 260, 255, 250], 500: [420, 410, 400, 390, 380], 1000: [770, 750, 730, 710, null] }
  }
};

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const sizeLabel = g => g >= 1000 ? (g / 1000) + ' kg' : g + ' g';
const unitPrice = (r, size, bundle) => RECIPES[r].prices[size][BUNDLES.indexOf(bundle)];
const fromPrice = r => Math.min(...SIZES.map(s => RECIPES[r].prices[s][0] / s * 100)); // per 100 g, 5-bundle

function lockup(cls = '') {
  return `<span class="lockup ${cls}"><span class="word">One of<br>Ours</span><span class="mark"></span></span>`;
}
function pouch(r, lg = false) {
  const R = RECIPES[r];
  return `<div class="pouch ${lg ? 'lg' : ''}" aria-hidden="true"><div class="sticker">${lockup()}<div class="rname" style="background:${R.color};color:${R.ink}">${R.full}</div></div></div>`;
}

const ICONS = {
  pot: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 10h20M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2"/></svg>',
  pouch: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 3h12l1 17a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M7 6h10M9 12h6"/></svg>',
  door: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
  leaf: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19 13 11"/></svg>',
  heart: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  recycle: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4l3-5M17 19h3l-3-5M12 4l-2 3h4z"/><path d="M8.5 9 6 13M15.5 9 18 13M9 19h6"/></svg>',
  calendar: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
  bowl: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 11h18a9 9 0 0 1-18 0zM8 7c0-1 1-1 1-2M12 7c0-1 1-1 1-2M16 7c0-1 1-1 1-2"/></svg>',
  truck: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
  box: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 8l9-4 9 4v9l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v9"/></svg>',
  check: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F3D2E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7"/></svg>',
  lock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A94E2C" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>'
};

/* ---------- cart (localStorage, guarded) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } }
};
const cart = {
  items() { return store.get('ooo_cart', []); },
  save(items) { store.set('ooo_cart', items); renderCount(); },
  add(r, size, bundle, qty = 1) {
    const items = cart.items();
    const key = `${r}-${size}-${bundle}`;
    const hit = items.find(i => i.key === key);
    hit ? hit.qty += qty : items.push({ key, r, size, bundle, qty });
    cart.save(items);
  },
  setQty(key, qty) {
    let items = cart.items();
    items = qty <= 0 ? items.filter(i => i.key !== key) : items.map(i => i.key === key ? { ...i, qty } : i);
    cart.save(items);
  },
  clear() { cart.save([]); },
  lineTotal(i) { return unitPrice(i.r, i.size, i.bundle) * i.bundle * i.qty; },
  totals() {
    const items = cart.items();
    const subtotal = items.reduce((s, i) => s + cart.lineTotal(i), 0);
    const mrp = items.reduce((s, i) => s + RECIPES[i.r].prices[i.size][0] * i.bundle * i.qty, 0);
    const bundleSaving = mrp - subtotal;
    const discount = Math.round(subtotal * FIRST_ORDER_DISCOUNT);
    const shipping = 0;
    const total = subtotal - discount + shipping;
    const pouches = items.reduce((s, i) => s + i.bundle * i.qty, 0);
    return { items, subtotal, mrp, bundleSaving, discount, shipping, total, pouches };
  }
};
function renderCount() {
  const n = cart.items().reduce((s, i) => s + i.qty, 0);
  $$('.cart-link .count').forEach(el => el.textContent = n);
}

/* ---------- shared chrome ---------- */
function chrome() {
  const head = $('#site-head');
  if (head) head.outerHTML = `
    <div class="testbar">Test site · prices are draft · no real payments are taken</div>
    <header class="site-head"><div class="wrap">
      <a href="index.html" aria-label="One of Ours home">${lockup()}</a>
      <nav class="nav" aria-label="Main">
        <a href="shop.html">Shop</a>
        <a class="hide-sm" href="index.html#how">How it works</a>
        <a class="hide-sm" href="index.html#story">Our story</a>
        <a class="hide-sm" href="index.html#faq">FAQ</a>
        <a class="cart-link" href="cart.html">Cart <span class="count">0</span></a>
      </nav>
    </div></header>`;
  const foot = $('#site-foot');
  if (foot) foot.outerHTML = `
    <footer class="site-foot"><div class="wrap">
      <div class="grid">
        <div>${lockup()}<div class="hand">Real food for the ones we love.</div></div>
        <div><h4>Shop</h4><ul>
          <li><a href="product.html?r=cr">Chicken &amp; Rice</a></li>
          <li><a href="product.html?r=cl">Chicken &amp; Lentils</a></li>
          <li><a href="product.html?r=ll">Lamb &amp; Lentils</a></li>
          <li><a href="shop.html">All recipes</a></li></ul></div>
        <div><h4>Help</h4><ul>
          <li><a href="index.html#how">How it works</a></li>
          <li><a href="index.html#faq">FAQ</a></li>
          <li><a href="mailto:hello@oneofours.co.in">hello@oneofours.co.in</a></li></ul></div>
        <div><h4>Company</h4><ul>
          <li><a href="index.html#story">Our story</a></li>
          <li>Bengaluru, India</li></ul></div>
      </div>
      <div class="base"><span>© ${new Date().getFullYear()} One of Ours. Test build.</span><span>Prices include GST.</span></div>
    </div></footer>`;
  renderCount();
}

function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.innerHTML = msg;
  t.classList.add('on');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('on'), 3200);
}

/* ---------- pages ---------- */
function recipeCard(r) {
  const R = RECIPES[r];
  return `<a class="recipe" href="product.html?r=${r}" data-r="${r}">
    <div class="pouch-wrap" style="background:${R.color}22">${pouch(r)}</div>
    <div class="body">
      <span class="tag" style="background:${R.color};color:${R.ink};align-self:flex-start">${R.tag}</span>
      <h3>${R.name}</h3>
      <p style="font-size:14px;margin:0">${R.blurb}</p>
      <div class="from"><span>From <b>${inr(fromPrice(r))}</b> / 100 g</span><span aria-hidden="true">→</span></div>
    </div></a>`;
}

function pageHome() {
  const g = $('#recipe-grid');
  if (g) g.innerHTML = Object.keys(RECIPES).map(recipeCard).join('');
  const t = $('#ladder-body');
  if (t) {
    const p = RECIPES.cr.prices[300];
    t.innerHTML = BUNDLES.map((b, i) => `<tr><td>${b} pouches</td><td>${inr(p[i])} each</td><td>${i ? `<span>save ${Math.round((1 - p[i] / p[0]) * 100)}%</span>` : '—'}</td></tr>`).join('');
  }
}

function pageShop() {
  const grid = $('#shop-grid');
  const draw = f => grid.innerHTML = Object.keys(RECIPES).filter(r => f === 'all' || r === f).map(recipeCard).join('');
  draw('all');
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.setAttribute('aria-pressed', 'false'));
    c.setAttribute('aria-pressed', 'true');
    draw(c.dataset.f);
  }));
}

function pageProduct() {
  const params = new URLSearchParams(location.search);
  const r = RECIPES[params.get('r')] ? params.get('r') : 'cr';
  const R = RECIPES[r];
  document.title = `${R.name} · One of Ours`;
  let size = 300, bundle = 10, qty = 1;

  $('#pdp').innerHTML = `
    <div class="pdp-art" style="background:${R.color}">${pouch(r, true)}</div>
    <div>
      <div class="crumbs"><a href="shop.html">Shop</a> / ${R.name}</div>
      <span class="tag" style="background:${R.color};color:${R.ink}">${R.tag}</span>
      <h1 style="margin-top:14px">${R.full}</h1>
      <p class="sub">${R.blurb}</p>
      <div class="opt-label"><b>Pouch size</b><span id="size-note"></span></div>
      <div class="opts" id="sizes">${SIZES.map(s => `<button class="opt" data-s="${s}"><b>${sizeLabel(s)}</b><small>${inr(R.prices[s][0])}</small></button>`).join('')}</div>
      <div class="opt-label"><b>Bundle</b><span>more pouches, lower price each</span></div>
      <div class="opts five" id="bundles"></div>
      <div class="price-box">
        <div class="total"><span>Bundle price</span><b id="p-total"></b></div>
        <div class="meta"><span id="p-unit"></span><span id="p-save" class="save"></span></div>
      </div>
      <div class="buy-row">
        <div class="qty"><button id="q-minus" aria-label="Fewer">−</button><span id="q">1</span><button id="q-plus" aria-label="More">+</button></div>
        <button class="btn" id="add">Add to cart</button>
      </div>
      <p style="font-size:13px;margin-top:14px;opacity:.8">10% off your first order, applied at checkout.</p>
      <div class="facts">
        <div>${ICONS.bowl}<span><b>What’s inside:</b> ${R.ingredients.join(', ')}. Full ingredient list and feeding guide coming soon.</span></div>
        <div>${ICONS.box}<span><b>Packed to last:</b> gently cooked and sealed in single-serve pouches. Open, serve, done.</span></div>
        <div>${ICONS.truck}<span><b>Delivery:</b> currently delivering across Bengaluru.</span></div>
      </div>
    </div>`;

  const update = () => {
    $$('#sizes .opt').forEach(b => b.setAttribute('aria-pressed', +b.dataset.s === size));
    if (size === 1000 && bundle === 60) bundle = 30;
    $('#bundles').innerHTML = BUNDLES.map((b, i) => {
      const p = R.prices[size][i];
      return `<button class="opt" data-b="${b}" ${p ? '' : 'disabled'} aria-pressed="${b === bundle}"><b>${b}</b><small>${p ? inr(p) + ' ea' : 'n/a'}</small></button>`;
    }).join('');
    $$('#bundles .opt').forEach(btn => btn.addEventListener('click', () => { bundle = +btn.dataset.b; update(); }));
    const u = unitPrice(r, size, bundle), base = R.prices[size][0];
    $('#p-total').textContent = inr(u * bundle * qty);
    $('#p-unit').textContent = `${bundle * qty} pouches × ${inr(u)} · ${inr(u / size * 100)} per 100 g`;
    $('#p-save').textContent = u < base ? `You save ${inr((base - u) * bundle * qty)}` : '';
    $('#size-note').textContent = { 100: 'a topper or snack', 300: 'a small meal', 500: 'a medium meal', 1000: 'big appetites' }[size];
    $('#q').textContent = qty;
  };
  $$('#sizes .opt').forEach(b => b.addEventListener('click', () => { size = +b.dataset.s; update(); }));
  $('#q-minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); update(); });
  $('#q-plus').addEventListener('click', () => { qty = Math.min(20, qty + 1); update(); });
  $('#add').addEventListener('click', () => {
    cart.add(r, size, bundle, qty);
    toast(`Added ${R.name}, ${bundle} × ${sizeLabel(size)} <a href="cart.html">View cart →</a>`);
  });
  update();
}

function pageCart() {
  const draw = () => {
    const t = cart.totals();
    const root = $('#cart');
    if (!t.items.length) {
      root.innerHTML = `<div class="empty"><div class="mark"></div><h2>Your cart is empty</h2><p style="margin:14px 0 28px">Every bowl starts somewhere.</p><a class="btn" href="shop.html">Browse recipes</a></div>`;
      return;
    }
    root.innerHTML = `<div class="cart-grid">
      <div>${t.items.map(i => {
        const R = RECIPES[i.r];
        return `<div class="line">
          <div class="thumb" style="background:${R.color}"><div class="mark" style="color:${R.ink}"></div></div>
          <div><h3>${R.full}</h3><div class="desc">${i.bundle} pouches × ${sizeLabel(i.size)} · ${inr(unitPrice(i.r, i.size, i.bundle))} each</div></div>
          <div class="right"><b>${inr(cart.lineTotal(i))}</b>
            <div class="qty"><button data-k="${i.key}" data-d="-1" aria-label="Fewer">−</button><span>${i.qty}</span><button data-k="${i.key}" data-d="1" aria-label="More">+</button></div>
            <button class="link-btn" data-rm="${i.key}">Remove</button></div>
        </div>`;
      }).join('')}
      <p style="margin-top:22px"><a href="shop.html">← Keep shopping</a></p></div>
      <aside class="summary">
        <h3 style="margin-bottom:16px">Order summary</h3>
        <div class="row"><span>Subtotal (${t.pouches} pouches)</span><span>${inr(t.subtotal)}</span></div>
        ${t.bundleSaving ? `<div class="row save"><span>Bundle savings included</span><span>−${inr(t.bundleSaving)}</span></div>` : ''}
        <div class="row"><span>First-order discount (10%)</span><span>−${inr(t.discount)}</span></div>
        <div class="row"><span>Delivery</span><span>Free</span></div>
        <div class="row total"><span>Total</span><span>${inr(t.total)}</span></div>
        <a class="btn block" href="checkout.html" style="margin-top:18px">Checkout</a>
        <div class="fine">Prices include GST. Delivery fee is a placeholder for the test build.</div>
      </aside></div>`;
    $$('[data-d]').forEach(b => b.addEventListener('click', () => {
      const it = cart.items().find(i => i.key === b.dataset.k);
      cart.setQty(b.dataset.k, it.qty + +b.dataset.d); draw();
    }));
    $$('[data-rm]').forEach(b => b.addEventListener('click', () => { cart.setQty(b.dataset.rm, 0); draw(); }));
  };
  draw();
}

function pageCheckout() {
  const t = cart.totals();
  if (!t.items.length) { location.href = 'cart.html'; return; }
  $('#co-summary').innerHTML = `
    <h3 style="margin-bottom:16px">Your order</h3>
    ${t.items.map(i => `<div class="row"><span>${RECIPES[i.r].name}<br><small style="opacity:.75">${i.qty > 1 ? i.qty + ' × ' : ''}${i.bundle} × ${sizeLabel(i.size)}</small></span><span>${inr(cart.lineTotal(i))}</span></div>`).join('')}
    <div class="row" style="border-top:1px solid var(--line);margin-top:8px;padding-top:14px"><span>Subtotal</span><span>${inr(t.subtotal)}</span></div>
    <div class="row"><span>First-order discount</span><span>−${inr(t.discount)}</span></div>
    <div class="row"><span>Delivery</span><span>Free</span></div>
    <div class="row total"><span>Total</span><span>${inr(t.total)}</span></div>
    <div class="fine">Prices include GST.</div>`;
  $('#pay-amt').textContent = inr(t.total);

  // payment method tabs
  const panels = {
    upi: `<div class="upi-apps">${['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(a => `<button type="button" class="chip" data-app>${a}</button>`).join('')}</div>
          <label class="field">UPI ID<input id="upi" placeholder="yourname@okbank" autocomplete="off"></label>
          <p style="font-size:13px;margin:12px 0 0;opacity:.8">Any value works in test mode.</p>`,
    card: `<div class="form-grid">
          <label class="field full">Card number<input id="cc" inputmode="numeric" placeholder="4111 1111 1111 1111" autocomplete="off"></label>
          <label class="field">Expiry<input placeholder="MM / YY" autocomplete="off"></label>
          <label class="field">CVV<input placeholder="123" autocomplete="off"></label>
          <label class="field full">Name on card<input autocomplete="off"></label></div>
          <p style="font-size:13px;margin:12px 0 0;opacity:.8">Don’t enter a real card. Nothing is sent anywhere.</p>`,
    qr: `<div style="display:flex;gap:22px;align-items:center;flex-wrap:wrap"><div class="qr" aria-label="Sample QR code"></div><p style="margin:0;font-size:14px;max-width:260px">Scan with any UPI app to pay. This is a placeholder pattern, not a real QR code.</p></div>`,
    cod: `<p style="margin:0">Pay in cash or UPI when your order arrives. Available across Bengaluru.</p>`
  };
  const setTab = k => {
    $$('.pay-tabs .opt').forEach(b => b.setAttribute('aria-pressed', b.dataset.m === k));
    $('#pay-panel').innerHTML = panels[k];
    $$('[data-app]').forEach(a => a.addEventListener('click', () => { $$('[data-app]').forEach(x => x.setAttribute('aria-pressed', 'false')); a.setAttribute('aria-pressed', 'true'); }));
    $('#pay-btn').dataset.m = k;
    $('#pay-label').textContent = k === 'cod' ? 'Place order' : 'Pay';
  };
  $$('.pay-tabs .opt').forEach(b => b.addEventListener('click', () => setTab(b.dataset.m)));
  setTab('upi');

  $$('#co-form [required]').forEach(inp => inp.addEventListener('input', () => inp.closest('.field').classList.remove('err')));
  $('#co-form').addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('#co-form [required]').forEach(inp => {
      const bad = !inp.value.trim() || (inp.id === 'pin' && !/^\d{6}$/.test(inp.value.trim())) || (inp.id === 'phone' && !/^\d{10}$/.test(inp.value.replace(/\D/g, '').slice(-10)));
      inp.closest('.field').classList.toggle('err', bad);
      if (bad) ok = false;
    });
    if (!ok) { toast('Please fill in the highlighted fields'); $('.field.err input').focus(); return; }
    $('.overlay').classList.add('on');
    setTimeout(() => {
      const order = {
        id: 'OOO-' + Date.now().toString().slice(-6),
        name: $('#fname').value.trim(),
        method: { upi: 'UPI', card: 'Card', qr: 'UPI QR', cod: 'Pay on delivery' }[$('#pay-btn').dataset.m],
        ...cart.totals()
      };
      store.set('ooo_last_order', order);
      cart.clear();
      location.href = 'success.html';
    }, 1800);
  });
}

function pageSuccess() {
  const o = store.get('ooo_last_order', null);
  if (!o) { $('#receipt').innerHTML = '<p>No recent order found.</p>'; return; }
  $('#who').textContent = o.name ? `Thank you, ${o.name.split(' ')[0]}.` : 'Thank you.';
  $('#receipt').innerHTML = `
    <div class="row"><b>Order</b><b>${o.id}</b></div>
    ${o.items.map(i => `<div class="row"><span>${RECIPES[i.r].name} · ${i.qty > 1 ? i.qty + ' × ' : ''}${i.bundle} × ${sizeLabel(i.size)}</span><span>${inr(cart.lineTotal(i))}</span></div>`).join('')}
    <div class="row"><span>First-order discount</span><span>−${inr(o.discount)}</span></div>
    <div class="row" style="border-top:1px solid var(--line);margin-top:8px;padding-top:12px"><b>Total paid (test)</b><b>${inr(o.total)}</b></div>
    <div class="row"><span>Payment</span><span>${o.method} · simulated</span></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  chrome();
  ({ home: pageHome, shop: pageShop, product: pageProduct, cart: pageCart, checkout: pageCheckout, success: pageSuccess })[document.body.dataset.page]?.();
});
