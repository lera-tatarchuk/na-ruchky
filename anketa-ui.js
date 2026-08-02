// Навігація довгою анкетою: лише візуальний прогрес, без зміни даних форми.
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('anketa');
  var progress = document.querySelector('.anketa-progress');
  if (!form || !progress) return;

  var sections = Array.prototype.slice.call(form.querySelectorAll('.fblock[data-step-label]'));
  var links = Array.prototype.slice.call(progress.querySelectorAll('.anketa-steps a'));
  var steps = progress.querySelector('.anketa-steps');
  var label = document.getElementById('anketa-progress-label');
  var bar = progress.querySelector('.anketa-progress-bar');
  var scheduled = false;

  function visibleSections() {
    return sections.filter(function (section) {
      return section.offsetParent !== null;
    });
  }

  function syncOptionalStep() {
    var retreat = document.getElementById('block6');
    var retreatLink = progress.querySelector('a[href="#block6"]');
    if (retreat && retreatLink) retreatLink.hidden = retreat.offsetParent === null;
  }

  function update() {
    scheduled = false;
    syncOptionalStep();
    var visible = visibleSections();
    if (!visible.length) return;

    var marker = progress.getBoundingClientRect().bottom + 24;
    var active = visible[0];
    visible.forEach(function (section) {
      if (section.getBoundingClientRect().top <= marker) active = section;
    });

    var index = visible.indexOf(active);
    if (label) label.textContent = active.getAttribute('data-step-label') || 'Анкета';
    if (bar) bar.style.width = (((index + 1) / visible.length) * 100) + '%';
    links.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + active.id;
      link.classList.toggle('active', isActive);
      if (isActive && steps) {
        var targetLeft = link.offsetLeft - ((steps.clientWidth - link.clientWidth) / 2);
        steps.scrollTo({left:Math.max(0, targetLeft), behavior:'smooth'});
      }
    });
  }

  function requestUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  links.forEach(function (link) {
    link.addEventListener('click', requestUpdate);
  });
  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', requestUpdate);

  var retreat = document.getElementById('block6');
  if (retreat && window.MutationObserver) {
    new MutationObserver(requestUpdate).observe(retreat, {attributes:true, attributeFilter:['style', 'class']});
  }
  update();
});
