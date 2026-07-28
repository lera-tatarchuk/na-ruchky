// Хочу на ручки — банер згоди на cookies + умовне підвантаження YouTube/Google Fonts
(function () {
  var KEY = 'cookie-consent-v1';
  var FONT = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap';

  function getConsent() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }

  function loadFonts() {
    if (document.getElementById('gfonts')) return;
    var l = document.createElement('link');
    l.id = 'gfonts'; l.rel = 'stylesheet'; l.href = FONT;
    document.head.appendChild(l);
  }
  function loadYouTube() {
    document.querySelectorAll('.yt-ph').forEach(function (ph) {
      if (ph.dataset.loaded) return;
      ph.dataset.loaded = '1';
      var ifr = document.createElement('iframe');
      ifr.src = ph.dataset.yt;
      ifr.title = ph.dataset.title || 'Відео';
      ifr.loading = 'lazy';
      ifr.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      ifr.setAttribute('allowfullscreen', '');
      ph.innerHTML = '';
      ph.appendChild(ifr);
    });
  }
  function apply(c) { if (!c) return; if (c.fonts) loadFonts(); if (c.youtube) loadYouTube(); }

  // застосувати збережений вибір якомога раніше (для тих, хто вже обирав)
  apply(getConsent());

  function save(c) { c.set = true; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} apply(c); }

  function removeEl(id) { var e = document.getElementById(id); if (e) e.remove(); }

  function showBanner() {
    if (document.getElementById('cookie-banner') || document.getElementById('cookie-modal')) return;
    var b = document.createElement('div');
    b.className = 'cookie-banner'; b.id = 'cookie-banner';
    b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Згода на cookies');
    b.innerHTML =
      '<div class="cwrap">' +
        '<p>Ми використовуємо лише технічно потрібні cookies. Вбудовані сервіси (YouTube, Google Fonts) підключаємо <b>за вашою згодою</b>. Докладніше — у <a href="polityka.html">Політиці</a>.</p>' +
        '<div class="cbtns">' +
          '<button type="button" class="btn ghost" data-c="settings">Налаштування</button>' +
          '<button type="button" class="btn ghost" data-c="reject">Відхилити</button>' +
          '<button type="button" class="btn" data-c="accept">Прийняти всі</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(b);
    b.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-c'); if (!a) return;
      if (a === 'accept') { save({ youtube: true, fonts: true }); removeEl('cookie-banner'); }
      else if (a === 'reject') { save({ youtube: false, fonts: false }); removeEl('cookie-banner'); }
      else if (a === 'settings') { removeEl('cookie-banner'); showSettings(); }
    });
  }

  function showSettings() {
    var c = getConsent() || { youtube: false, fonts: false };
    var opener = document.activeElement; // куди повернути фокус після закриття
    var m = document.createElement('div');
    m.className = 'cookie-modal'; m.id = 'cookie-modal';
    m.innerHTML =
      '<div class="cbox" role="dialog" aria-modal="true" aria-label="Налаштування cookies">' +
        '<h3 class="cav">Налаштування cookies</h3>' +
        '<p class="muted" style="margin:0 0 16px">Технічно необхідні cookies працюють завжди. Решту оберіть самі.</p>' +
        '<label class="opt"><input type="checkbox" id="c-fonts"' + (c.fonts ? ' checked' : '') + '> <span><b>Google Fonts</b> — фірмові шрифти сайту (завантажуються з серверів Google).</span></label>' +
        '<label class="opt"><input type="checkbox" id="c-yt"' + (c.youtube ? ' checked' : '') + '> <span><b>YouTube</b> — перегляд відео подкасту прямо на сайті (Google отримує дані про перегляд).</span></label>' +
        '<div class="cbtns" style="margin-top:18px">' +
          '<button type="button" class="btn" data-c="save">Зберегти вибір</button>' +
          '<button type="button" class="btn ghost" data-c="close">Скасувати</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
    var box = m.querySelector('.cbox');

    function focusable() {
      return Array.prototype.slice.call(
        box.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')
      ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    }
    function close() {
      document.removeEventListener('keydown', onKey, true);
      m.remove();
      if (opener && typeof opener.focus === 'function') opener.focus(); // повертаємо фокус на елемент-відкривач
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); if (!getConsent()) showBanner(); return; }
      if (e.key !== 'Tab') return;
      var f = focusable(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      // focus-trap: не випускаємо фокус за межі діалогу
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey, true);

    m.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-c');
      if (e.target === m || a === 'close') { close(); if (!getConsent()) showBanner(); return; }
      if (a === 'save') {
        save({ youtube: document.getElementById('c-yt').checked, fonts: document.getElementById('c-fonts').checked });
        close();
      }
    });

    var f = focusable(); if (f.length) f[0].focus(); // переносимо фокус усередину діалогу
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply(getConsent());
    document.querySelectorAll('.cookie-settings').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); showSettings(); });
    });
    document.querySelectorAll('[data-yt-accept]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var c = getConsent() || { fonts: false };
        c.youtube = true; save(c);
        removeEl('cookie-banner');
      });
    });
    if (!getConsent()) showBanner();
  });

  // дозволити відкривати налаштування програмно
  window.openCookieSettings = showSettings;
})();
