(function () {
  'use strict';

  // Normalise Persian/Arabic text for matching: one form of ا ه و ی ک, no diacritics, hamza, tatweel or invisible
  // direction marks, ZWNJ as a space, Latin digits, straight apostrophes.
  function norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/[\u064B-\u065F\u0670\u0640\u0621\u061C\u200B\u200D-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
      .replace(/\u200C/g, ' ')
      .replace(/[آأإٱ]/g, 'ا')
      .replace(/[ةۀ]/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/[يىئ]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); })
      .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
      .replace(/\s+/g, ' ')
      .trim();
  }
  // Matching, shared with search.js: words(query) are the normalised words, each of which must be found;
  // prepare(text) is done once per text and keeps a copy without spaces, so that a Persian word typed joined
  // (پایاننامه, نرمافزار) still finds the spelling with a ZWNJ or a space (پایان‌نامه, نرم‌افزار).
  var arabicScript = /[\u0600-\u06FF]/;
  function words(q) { return norm(q).split(' ').filter(Boolean); }
  function prepare(text) { var t = norm(text); return { text: t, joined: t.replace(/ /g, '') }; }
  function contains(p, word) { return p.text.indexOf(word) !== -1 || (arabicScript.test(word) && p.joined.indexOf(word) !== -1); }
  window.MCTN = { norm: norm, words: words, prepare: prepare, contains: contains };

  // Filters. Markup:
  //   <div data-filter-group="NAME"> <button data-filter="all|TYPE" aria-pressed> … </div>
  //   optional <input data-filter-search="NAME">: every word must be in the item's text (leaving out its buttons,
  //   code and .pub-links row) or in its data-filter-text
  //   inside [data-filter-scope="NAME"] (or the page): items [data-filter-item][data-type="TYPE …"],
  //   sections [data-filter-section] hidden when they have no visible item, [data-filter-empty] shown when nothing matches,
  //   optional live region <p role="status" data-filter-status data-shown="{n} …" data-shown-one="…" data-shown-none="…">
  //   that is told how many items are shown (data-shown-none, if set, when none are).
  var numbers = window.Intl && Intl.NumberFormat ? new Intl.NumberFormat(document.documentElement.lang || 'en') : null;
  var itemTexts = new WeakMap();
  function itemText(item) {
    var p = itemTexts.get(item);
    if (!p) {
      var clone = item.cloneNode(true);
      clone.querySelectorAll('button, pre, .pub-links').forEach(function (el) { el.remove(); });
      itemTexts.set(item, p = prepare(clone.textContent + ' ' + (item.getAttribute('data-filter-text') || '')));
    }
    return p;
  }
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var name = group.getAttribute('data-filter-group');
    var scope = document.querySelector('[data-filter-scope="' + name + '"]') || document;
    var buttons = group.querySelectorAll('[data-filter]');
    var search = document.querySelector('[data-filter-search="' + name + '"]');
    var status = scope.querySelector('[data-filter-status]');
    var current = 'all';
    var timer = 0;

    function apply(typing) {
      var terms = search ? words(search.value) : [];
      var shown = 0;
      scope.querySelectorAll('[data-filter-item]').forEach(function (item) {
        var types = (item.getAttribute('data-type') || '').split(' ');
        var ok = (current === 'all' || types.indexOf(current) !== -1) &&
          terms.every(function (t) { return contains(itemText(item), t); });
        item.hidden = !ok;
        if (ok) shown++;
      });
      scope.querySelectorAll('[data-filter-section]').forEach(function (section) {
        section.hidden = !section.querySelector('[data-filter-item]:not([hidden])');
      });
      scope.querySelectorAll('[data-filter-empty]').forEach(function (empty) { empty.hidden = shown > 0; });
      if (status) announce(shown, typing ? 600 : 100);
    }

    // The region is emptied first, so that the same count is read out again; while typing, once the visitor pauses.
    function announce(n, wait) {
      clearTimeout(timer);
      status.textContent = '';
      timer = setTimeout(function () {
        var text = (n === 0 && status.getAttribute('data-shown-none')) || status.getAttribute(n === 1 ? 'data-shown-one' : 'data-shown') || '';
        status.textContent = text.replace('{n}', numbers ? numbers.format(n) : String(n));
      }, wait);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        current = button.getAttribute('data-filter');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === button ? 'true' : 'false'); });
        apply(false);
      });
    });
    if (search) search.addEventListener('input', function () { apply(true); });
  });

  // BibTeX toggles and copy buttons. A copy button shows its data-copied text for a moment. Its own label is kept
  // from the first click until it is put back, so quick repeat clicks cannot leave the confirmation in place.
  var flashing = new WeakMap();
  function flash(button) {
    var label = button.querySelector('span');
    var done = button.getAttribute('data-copied');
    if (!label || !done) return;
    var f = flashing.get(button);
    if (f) clearTimeout(f.timer); else flashing.set(button, f = { label: label.textContent });
    label.textContent = done;
    f.timer = setTimeout(function () { label.textContent = f.label; flashing.delete(button); }, 1600);
  }
  // The Clipboard API where there is one (https and localhost); without it (plain http), or if it refuses, the older
  // route: select the text in a hidden textarea next to the button and copy, then give focus back.
  function copy(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash(button); }, function () { copyOld(text, button); });
    } else {
      copyOld(text, button);
    }
  }
  function copyOld(text, button) {
    var focus = document.activeElement;
    var box = document.createElement('textarea');
    box.className = 'visually-hidden';
    box.setAttribute('readonly', '');
    box.value = text;
    button.after(box);
    box.focus({ preventScroll: true });
    box.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { /* not supported */ }
    box.remove();
    if (focus && focus.focus) focus.focus({ preventScroll: true });
    if (ok) flash(button);
  }
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-bib-toggle]');
    if (toggle) {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      var box = document.getElementById(toggle.getAttribute('aria-controls'));
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (box) box.hidden = open;
      return;
    }
    var button = e.target.closest('[data-copy]');
    if (button) {
      var source = document.getElementById(button.getAttribute('data-copy'));
      if (source) copy(source.textContent, button);
      return;
    }
    var link = e.target.closest('[data-copy-url]');
    if (link) {
      // The page's canonical address: no #main left by the skip link, no query string.
      var canonical = document.querySelector('link[rel="canonical"]');
      copy(canonical ? canonical.href : location.href.replace(/[?#].*$/, ''), link);
    }
  });

  // On phones the menu scrolls sideways. Bring the current item into view, and each item that gets keyboard focus;
  // focus from a mouse or a tap is left alone, so the strip never moves under the pointer. Only the strip scrolls,
  // never the page.
  var menu = document.querySelector('.site-nav ul');
  function reveal(a) {
    var r = a.getBoundingClientRect();
    var m = menu.getBoundingClientRect();
    var dx = r.left < m.left ? r.left - m.left : (r.right > m.right ? r.right - m.right : 0);
    if (dx) menu.scrollBy(dx, 0);
  }
  function keyboardFocus(el) {
    try { return el.matches(':focus-visible'); } catch (err) { return true; }
  }
  if (menu) {
    var here = menu.querySelector('[aria-current]');
    if (here) reveal(here);
    menu.addEventListener('focusin', function (e) {
      var a = e.target.closest('a');
      if (a && keyboardFocus(a)) reveal(a);
    });
  }

  // Visitors who prefer reduced motion get the packet parked at its resting place: data-rest="x y" on the moving element.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('animateMotion').forEach(function (anim) {
      var el = anim.parentNode;
      anim.remove();
      var rest = el && el.getAttribute('data-rest');
      if (rest) el.setAttribute('transform', 'translate(' + rest + ')');
    });
  }
})();
