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

      // зібрати дані; поля з однаковим name (checkbox-групи) → масив
      var fd = new FormData(form);
      var all = {};
      fd.forEach(function (v, k) {
        if (all[k] !== undefined) {
          if (!Array.isArray(all[k])) all[k] = [all[k]];
          all[k].push(v);
        } else { all[k] = v; }
      });
      // непозначені обовʼязкові чекбокси-згоди → false
      form.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        if (all[cb.name] === undefined && !cb.name.endsWith('[]')) all[cb.name] = cb.checked;
      });

      var data;
      if (form.dataset.mode === 'payload') {
        // велика анкета: контактні поля — на верхній рівень, решта — у JSONB payload
        data = {
          name: all.name || null,
          email: all.email || null,
          phone: all.phone || null,
          oblast: all.oblast || null,
          wants_retreat: (all.wants_retreat === 'так' || all.wants_retreat === true),
          payload: all
        };
      } else {
        data = all;
      }

      var btn = form.querySelector('button[type="submit"]');
      var oldText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Надсилаємо…'; }

      var res = await sb.from(table).insert([data]);
      if (res.error) {
        console.error(res.error);
        if (btn) { btn.disabled = false; btn.textContent = oldText; }
        alert('Не вдалося надіслати. Спробуйте ще раз або напишіть нам на пошту na-ruchky@tvoya-opora.org.ua');
        return;
      }
      var box = form.parentNode;
      form.innerHTML = '<p style="font-size:18px;color:#2F4A3F">Дякуємо! Ми отримали ваші відповіді і зв\'яжемося з вами щодо результатів. 💛</p>';
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
});
