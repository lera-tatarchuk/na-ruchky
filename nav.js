// Хочу на ручки — мобільне меню + фавікон
document.addEventListener('DOMContentLoaded', function () {
  // favicon
  var fav = document.createElement('link');
  fav.rel = 'icon';
  fav.type = 'image/svg+xml';
  fav.href = 'favicon.svg';
  document.head.appendChild(fav);

  // mobile menu toggle
  var nav = document.querySelector('header .nav');
  var menu = document.querySelector('header .menu');
  if (!nav || !menu) return;

  var btn = document.createElement('button');
  btn.className = 'navtoggle';
  btn.setAttribute('aria-label', 'Відкрити меню');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '☰';
  nav.appendChild(btn);

  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    btn.textContent = open ? '✕' : '☰';
  });

  // close menu after clicking a link
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Відкрити меню');
      btn.textContent = '☰';
    }
  });
});
