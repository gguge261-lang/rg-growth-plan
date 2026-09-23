/* 第 05 页：左侧原文与右侧拆解按 data-row 联动高亮；播放按钮做一次加速的示意回放。 */
(function () {
  var page = document.querySelector('.g5-page');
  if (!page) return;

  var call = page.querySelector('.g5-call');
  var lines = page.querySelectorAll('.g5-lines li');
  var rows = page.querySelectorAll('.g5-rows article');
  var bars = page.querySelectorAll('.g5-wave i');
  var clock = page.querySelector('.g5-time b');
  var btn = page.querySelector('.g5-play');
  var TOTAL = 336;
  var SPEED = 24;

  function mark(row) {
    [lines, rows].forEach(function (list) {
      list.forEach(function (el) { el.classList.toggle('is-on', el.dataset.row === row); });
    });
  }

  [lines, rows].forEach(function (list) {
    list.forEach(function (el) {
      el.addEventListener('mouseenter', function () { if (!timer) mark(el.dataset.row); });
      el.addEventListener('mouseleave', function () { if (!timer) mark(null); });
    });
  });

  var timer = null;
  var t = 0;

  function fmt(s) {
    s = Math.floor(s);
    return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function render() {
    var p = t / TOTAL;
    bars.forEach(function (b, i) { b.classList.toggle('on', i / bars.length < p); });
    clock.textContent = fmt(t);
    var cur = null;
    lines.forEach(function (li) { if (t >= +li.dataset.t) cur = li.dataset.row; });
    mark(cur);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    call.classList.remove('is-playing');
    btn.setAttribute('aria-label', '播放示意录音');
  }

  btn.addEventListener('click', function () {
    if (timer) return stop();
    if (t >= TOTAL) t = 0;
    call.classList.add('is-playing');
    btn.setAttribute('aria-label', '暂停');
    timer = setInterval(function () {
      t = Math.min(TOTAL, t + SPEED / 10);
      render();
      if (t >= TOTAL) stop();
    }, 100);
  });
})();
