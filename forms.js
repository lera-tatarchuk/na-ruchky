// Хочу на ручки — підключення форм до Supabase
const SUPABASE_URL = 'https://xfnjxcbnbhqjhsguldnw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZuZI9ySWyA8hFs2T9kAlIg_M5ttOm_l';

document.addEventListener('DOMContentLoaded', function () {
  if (!window.supabase) { console.error('Supabase library not loaded'); return; }
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  document.querySelectorAll('form.sb-form').forEach(function (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var table = form.dataset.table;
      var fd = new FormData(form);
      var data = Object.fromEntries(fd.entries());
      var consent = form.querySelector('[name="consent"]');
      if (consent) data.consent = consent.checked;

      var btn = form.querySelector('button[type="submit"]');
      var oldText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Надсилаємо…'; }

      var res = await sb.from(table).insert([data]);
      if (res.error) {
        console.error(res.error);
        if (btn) { btn.disabled = false; btn.textContent = oldText; }
        alert('Не вдалося надіслати. Спробуйте ще раз або напишіть нам на пошту.');
        return;
      }
      form.innerHTML = '<p style="font-size:18px;color:#2F4A3F">Дякуємо! Ми отримали ваші дані і зв\'яжемося з вами. 💛</p>';
    });
  });
});
