(function () {
  'use strict';

  // Site search. Markup and every string come from layouts/_default/search.html: data-* attributes on [data-srch]
  // and <template> blocks per result type. Results are built with createElement/textContent only.
  var root = document.querySelector('[data-srch]');
  if (!root || !window.fetch || !window.history || !window.URLSearchParams) return;

  var form = root.querySelector('[data-srch-form]');
  var input = root.querySelector('[data-srch-input]');
  var summary = root.querySelector('[data-srch-summary]');
  var pills = root.querySelector('[data-srch-pills]');
  var results = root.querySelector('[data-srch-results]');
  if (!form || !input || !summary || !pills || !results) return;

  // Matching comes from site.js (Persian-aware: one spelling per letter, joined words); without it, plain lower case.
  var match = window.MCTN || {
    prepare: function (s) { var t = String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); return { text: t, joined: t }; },
    contains: function (p, word) { return p.text.indexOf(word) !== -1; },
    words: function (q) { return match.prepare(q).text.split(' ').filter(Boolean); }
  };
  var pageLang = document.documentElement.lang || 'en';
  var numbers = window.Intl && Intl.NumberFormat ? new Intl.NumberFormat(pageLang) : null;
  var arabicScript = /[\u0600-\u06FF]/;

  // Result types in display order, each with its group <template>.
  var groups = [];
  root.querySelectorAll('template[data-srch-group]').forEach(function (t) {
    groups.push({ type: t.getAttribute('data-srch-group'), label: t.getAttribute('data-label') || '', item: t.getAttribute('data-item'), tpl: t });
  });
  var items = {};
  root.querySelectorAll('template[data-srch-item]').forEach(function (t) { items[t.getAttribute('data-srch-item')] = t; });

  var index = null;      // [{ e: entry, i: position, head: title + alt, all: everything; both prepared for matching }]
  var loading = null;    // pending fetch
  var lastQuery = null;
  var hitsByType = {};
  var current = 'all';
  var timer = 0;
  var baseTitle = document.title;
  var altUrl = root.getAttribute('data-alt-url') || '';

  function str(name) { return root.getAttribute('data-' + name) || ''; }
  function num(n) { return numbers ? numbers.format(n) : String(n); }
  // Replacer functions, so that a query such as $& or $' is shown as typed.
  function fill(template, n, q) {
    return template.replace('{n}', function () { return num(n); }).replace('{q}', function () { return q; });
  }

  function load() {
    if (!loading) {
      loading = fetch(str('index'), { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (data) {
          index = (Array.isArray(data) ? data : []).filter(function (e) {
            return e && e.title && typeof e.url === 'string' && /^(\/|https?:)/.test(e.url);
          }).map(function (e, i) {
            var head = [e.title, e.alt].join(' ');
            return { e: e, i: i, head: match.prepare(head), all: match.prepare(head + ' ' + (e.text || '')) };
          });
          return index;
        });
      loading.catch(function () { loading = null; });
    }
    return loading;
  }

  // Every term must appear; entries whose title has all the terms come first, then those whose title has some.
  function search(q) {
    var terms = match.words(q);
    var hits = [];
    if (!terms.length) return hits;
    index.forEach(function (x) {
      var inTitle = 0;
      for (var k = 0; k < terms.length; k++) {
        if (!match.contains(x.all, terms[k])) return;
        if (match.contains(x.head, terms[k])) inTitle++;
      }
      hits.push({ x: x, rank: inTitle === terms.length ? 0 : (inTitle ? 1 : 2) });
    });
    hits.sort(function (a, b) { return a.rank - b.rank || a.x.i - b.x.i; });
    return hits.map(function (h) { return h.x.e; });
  }

  // Text keeps its own language: an English title on a Persian page is set left to right, and the other way round.
  function markLanguage(el, text) {
    var lang = arabicScript.test(text) ? 'fa' : 'en';
    if (lang !== pageLang) {
      el.setAttribute('lang', lang);
      el.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    }
  }

  function renderItem(kind, e) {
    var tpl = items[kind] || items.row;
    var node = tpl.content.firstElementChild.cloneNode(true);
    var title = node.querySelector('[data-slot="title"]');
    var link = document.createElement('a');
    link.setAttribute('href', e.url);
    if (title.getAttribute('data-link')) link.className = title.getAttribute('data-link');
    link.textContent = e.title;
    title.appendChild(link);
    markLanguage(title, e.title);
    var text = node.querySelector('[data-slot="text"]');
    if (e.text) {
      text.textContent = e.text;
      markLanguage(text, e.text);
    } else {
      text.remove();
    }
    return node;
  }

  function renderGroup(g, list) {
    var section = g.tpl.content.firstElementChild.cloneNode(true);
    var heading = section.querySelector('h2');
    heading.id = 'srch-g-' + g.type;
    section.setAttribute('aria-labelledby', heading.id);
    section.querySelector('[data-slot="count"]').textContent = num(list.length);
    var box = section.querySelector('[data-slot="items"]');
    list.forEach(function (e) { box.appendChild(renderItem(g.item, e)); });
    return section;
  }

  function renderGroups() {
    results.textContent = '';
    groups.forEach(function (g) {
      var list = hitsByType[g.type];
      if (list && (current === 'all' || current === g.type)) results.appendChild(renderGroup(g, list));
    });
  }

  function pill(type, label, count) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pill';
    b.setAttribute('data-type', type);
    b.setAttribute('aria-pressed', type === current ? 'true' : 'false');
    b.setAttribute('aria-controls', results.id);
    var name = document.createElement('span');
    name.textContent = label;
    var n = document.createElement('span');
    n.className = 'count';
    n.textContent = num(count);
    b.appendChild(name);
    b.appendChild(n);
    return b;
  }

  function render(q) {
    var hits = search(q);
    hitsByType = {};
    hits.forEach(function (e) { (hitsByType[e.type] = hitsByType[e.type] || []).push(e); });
    var present = groups.filter(function (g) { return hitsByType[g.type]; });
    if (current !== 'all' && !hitsByType[current]) current = 'all';

    summary.textContent = '';
    if (hits.length) {
      var strong = document.createElement('strong');
      strong.textContent = fill(str(hits.length === 1 ? 'results-one' : 'results'), hits.length, q);
      summary.appendChild(strong);
      summary.appendChild(document.createTextNode(' ' + fill(str('for'), hits.length, q)));
    } else {
      summary.textContent = fill(str('none'), 0, q);
    }

    pills.textContent = '';
    if (present.length) {
      pills.appendChild(pill('all', str('all'), hits.length));
      present.forEach(function (g) { pills.appendChild(pill(g.type, g.label, hitsByType[g.type].length)); });
    }
    pills.hidden = !present.length;
    renderGroups();
  }

  function clear() {
    hitsByType = {};
    summary.textContent = '';
    pills.textContent = '';
    pills.hidden = true;
    results.textContent = '';
  }

  // Keep the address bar, the tab title and the language switch in step with the query.
  function remember(q) {
    try {
      var params = new URLSearchParams(location.search);
      if (q) params.set('q', q); else params.delete('q');
      var qs = params.toString();
      history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    } catch (err) { /* address bar unchanged */ }
    document.title = q ? q + ' \u2014 ' + baseTitle : baseTitle;
    if (altUrl) {
      document.querySelectorAll('a[hreflang]').forEach(function (a) {
        var base = a.getAttribute('data-srch-base');
        if (base === null) {
          if (a.getAttribute('href') !== altUrl) return;
          base = altUrl;
          a.setAttribute('data-srch-base', base);
        }
        a.setAttribute('href', q ? base + '?q=' + encodeURIComponent(q) : base);
      });
    }
  }

  function run(raw) {
    var q = String(raw || '').replace(/\s+/g, ' ').trim();
    if (q === lastQuery) return;
    lastQuery = q;
    remember(q);
    if (!q) { clear(); return; }
    if (index) { render(q); return; }
    summary.textContent = str('loading');
    load().then(function () {
      if (lastQuery === q) render(q);
    }, function () {
      if (lastQuery === q) { clear(); summary.textContent = str('error'); lastQuery = null; }
    });
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () { run(input.value); }, 250);
  });
  input.addEventListener('focus', function () { load().catch(function () {}); }, { once: true });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearTimeout(timer);
    run(input.value);
  });
  pills.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-type]');
    if (!b) return;
    current = b.getAttribute('data-type');
    pills.querySelectorAll('button[data-type]').forEach(function (other) {
      other.setAttribute('aria-pressed', other === b ? 'true' : 'false');
    });
    renderGroups();
  });

  var initial = new URLSearchParams(location.search).get('q') || '';
  if (initial) {
    input.value = initial;
    run(initial);
  }
})();
