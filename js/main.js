(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var lang = store.get('lang');
  if (!window.I18N[lang]) lang = 'ru';
  var t = function (k) { return (window.I18N[lang] || {})[k] || window.I18N.ru[k] || k; };

  /* ---------- Procedural building art (brand navy, A-shaped accents) ---------- */
  function art(kind, w, h) {
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">';
    var base = h - 10;
    function win(x, y, bw, bh, lit) {
      var o = '';
      for (var yy = y + 14; yy < y + bh - 10; yy += 16)
        for (var xx = x + 10; xx < x + bw - 12; xx += 14)
          o += '<rect x="' + xx + '" y="' + yy + '" width="6" height="8" fill="currentColor" opacity="' + (((xx * 7 + yy * 3) % 5 === 0 && lit) ? .9 : .18) + '"/>';
      return o;
    }
    function bld(x, bw, bh, lit) { return '<rect x="' + x + '" y="' + (base - bh) + '" width="' + bw + '" height="' + bh + '" fill="var(--b)"/>' + win(x, base - bh, bw, bh, lit); }
    if (kind === 'vatan') {
      s += '<path d="M' + (w * .12) + ' ' + base + 'L' + (w * .12) + ' ' + (h * .52) + 'L' + (w * .38) + ' ' + (h * .26) + 'L' + (w * .38) + ' ' + base + 'Z" fill="var(--b)"/>';
      s += '<path d="M' + (w * .40) + ' ' + base + 'L' + (w * .40) + ' ' + (h * .30) + 'L' + (w * .50) + ' ' + (h * .16) + 'L' + (w * .60) + ' ' + (h * .30) + 'L' + (w * .60) + ' ' + base + 'Z" fill="var(--b2)"/>';
      s += '<path d="M' + (w * .62) + ' ' + base + 'L' + (w * .62) + ' ' + (h * .26) + 'L' + (w * .88) + ' ' + (h * .52) + 'L' + (w * .88) + ' ' + base + 'Z" fill="var(--b)"/>';
      s += win(w * .12, h * .5, w * .26, h * .5, true) + win(w * .40, h * .3, w * .2, h * .7, true) + win(w * .62, h * .5, w * .26, h * .5, true);
    } else if (kind === 'tower') {
      s += bld(w * .18, w * .2, h * .5, 0) + bld(w * .4, w * .22, h * .85, 1) + bld(w * .64, w * .18, h * .6, 0);
      s += '<path d="M' + (w * .4) + ' ' + (base - h * .85) + 'L' + (w * .51) + ' ' + (base - h * .98) + 'L' + (w * .62) + ' ' + (base - h * .85) + 'Z" fill="var(--b2)"/>';
    } else if (kind === 'slab') {
      s += bld(w * .1, w * .8, h * .42, 1) + bld(w * .22, w * .56, h * .62, 0);
    } else if (kind === 'stepped') {
      s += bld(w * .1, w * .24, h * .45, 0) + bld(w * .3, w * .24, h * .65, 1) + bld(w * .5, w * .24, h * .85, 0) + bld(w * .7, w * .2, h * .55, 1);
    } else {
      s += bld(w * .08, w * .26, h * .4, 1) + bld(w * .36, w * .26, h * .58, 0) + bld(w * .64, w * .28, h * .46, 1);
    }
    s += '<rect x="0" y="' + base + '" width="' + w + '" height="10" fill="var(--b2)"/></svg>';
    return s;
  }

  /* ---------- i18n ---------- */
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
    $$('.lang button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.lang === lang); });
    renderProjects(); renderHistory(); renderNews(); calc();
  }
  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { lang = b.dataset.lang; store.set('lang', lang); applyLang(); });
  });

  /* ---------- Projects ---------- */
  var filter = 'all';
  function renderProjects() {
    var g = $('#projectGrid');
    g.innerHTML = window.DATA.projects.filter(function (p) {
      return filter === 'all' || p.cat === filter || (filter === 'done' && p.status === 'done');
    }).map(function (p) {
      var cls = 'card' + (p.kind === 'vatan' ? ' card--vatan' : '');
      var price = p.from ? '<span class="card__price">' + t('price.from') + ' $' + p.from + '/m²</span>' : '';
      return '<article class="' + cls + ' reveal in"><div class="card__art">' + art(p.kind, 400, 260) + '<span class="badge badge--' + p.status + '">' + t('status.' + p.status) + '</span></div>' +
        '<div class="card__body"><h3>' + p.name[lang] + '</h3><p>' + p.desc[lang] + '</p>' +
        '<div class="card__foot"><span>' + p.year + '</span>' + price + '<a href="#" class="card__link">' + t('projects.more') + ' →</a></div></div></article>';
    }).join('');
  }
  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    filter = b.dataset.f;
    $$('#filters .chip').forEach(function (c) { c.classList.toggle('is-on', c === b); });
    renderProjects();
  });

  /* ---------- Carousels ---------- */
  function renderHistory() {
    $('#history-car').innerHTML = window.DATA.history.map(function (h) {
      return '<div class="slide slide--year"><b>' + h.y + '</b><h3>' + h.t[lang] + '</h3><p>' + h.d[lang] + '</p></div>';
    }).join('');
  }
  function renderNews() {
    $('#news-car').innerHTML = window.DATA.news.map(function (n, i) {
      var d = new Date(n.date).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
      return '<a href="#" class="slide slide--news"><div class="slide__art">' + art(['vatan', 'stepped', 'tower', 'blocks'][i % 4], 300, 160) + '</div><small>' + d + '</small><h3>' + n.t[lang] + '</h3><p>' + n.d[lang] + '</p></a>';
    }).join('');
  }
  $$('[data-car]').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = $('#' + b.dataset.car + '-car');
      c.scrollBy({ left: c.clientWidth * 0.7 * Number(b.dataset.dir), behavior: 'smooth' });
    });
  });

  /* ---------- Calculator ---------- */
  var cur = 'USD';
  function fmt(v) {
    var n = Math.round(v).toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU').replace(/ /g, ' ');
    return cur === 'USD' ? '$' + n : n + ' ' + t('cur.suffix');
  }
  function calc() {
    var area = +$('#cArea').value || 0, price = +$('#cPrice').value || 0;
    var downPct = +$('#cDown').value, n = +$('#cTerm').value;
    $('#cDownV').textContent = downPct + '%'; $('#cTermV').textContent = n;
    var total = area * price, down = total * downPct / 100, rest = total - down, m = rest / n;
    var g = 0.15, d = 0.13;
    var propVal = total * Math.pow(1 + g, n / 12);
    var bank = down * Math.pow(1 + d, n / 12), mr = Math.pow(1 + d, 1 / 12) - 1;
    for (var i = 1; i <= n; i++) bank += m * Math.pow(1 + mr, n - i);
    $('#oAd').textContent = fmt(propVal); $('#oAdG').textContent = '+' + fmt(propVal - total);
    $('#oBank').textContent = fmt(bank); $('#oBankG').textContent = '+' + fmt(bank - total);
    $('#oTotal').textContent = fmt(total); $('#oMonth').textContent = fmt(m);
    var diff = propVal - bank; $('#oDiff').textContent = (diff >= 0 ? '+' : '') + fmt(diff);
  }
  $('#cur').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.dataset.cur === cur) return;
    var rate = +$('#cRate').value || 1, p = +$('#cPrice').value;
    cur = b.dataset.cur;
    $$('#cur button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
    $('#cPrice').value = cur === 'UZS' ? Math.round(p * rate) : Math.round(p / rate);
    calc();
  });
  $$('#calcForm input').forEach(function (i) { i.addEventListener('input', calc); });

  /* ---------- Counters & reveal ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(countUp);
    });
  }, { threshold: .15 }) : null;
  function countUp(el) {
    var end = +el.dataset.count, t0 = null, dur = 1400;
    function f(ts) {
      t0 = t0 || ts; var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e).toLocaleString('ru-RU').replace(/ /g, ' ');
      if (p < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  $$('.reveal').forEach(function (el) { if (io) io.observe(el); else { el.classList.add('in'); $$('[data-count]', el).forEach(countUp); } });

  /* ---------- Header, menu, to-top ---------- */
  var header = $('#header'), toTop = $('#toTop');
  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 40);
    toTop.classList.toggle('is-on', window.scrollY > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  $('#burger').addEventListener('click', function () {
    var o = document.body.classList.toggle('menu-open'); this.setAttribute('aria-expanded', o);
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-open'); }); });

  /* ---------- Modal & cookie ---------- */
  var modal = $('#callModal');
  $$('[data-open-call]').forEach(function (b) {
    b.addEventListener('click', function () { $('#callOk').hidden = true; modal.showModal(); });
  });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  $('#callForm').addEventListener('submit', function (e) {
    e.preventDefault(); $('#callOk').hidden = false; // demo: nothing is sent
    setTimeout(function () { modal.close(); e.target.reset(); }, 1800);
  });
  if (!store.get('cookie')) $('#cookie').hidden = false;
  $('#cookieOk').addEventListener('click', function () { store.set('cookie', '1'); $('#cookie').hidden = true; });

  $('#heroArt').innerHTML = art('stepped', 1200, 600).replace('<svg ', '<svg class="hero__svg" ') + art('tower', 900, 520).replace('<svg ', '<svg class="hero__svg hero__svg--b" ');

  applyLang();
})();
