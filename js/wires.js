/* 第 04 页：把左右两侧的注解卡，用曲线连到样机图里对应的那条聊天消息。
   落点用图片内的百分比坐标（data-ax / data-ay）定位，图片怎么缩放都不会错位。 */
(function () {
  var stage = document.querySelector('.g4-stage');
  var svg = stage && stage.querySelector('.g4-wires');
  var shot = stage && stage.querySelector('.g4-shot');
  if (!stage || !svg || !shot) return;

  var NS = 'http://www.w3.org/2000/svg';

  function draw() {
    var box = stage.getBoundingClientRect();
    var img = shot.getBoundingClientRect();
    if (!box.width || !img.width) return;

    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    svg.setAttribute('width', box.width);
    svg.setAttribute('height', box.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // 移动端堆叠排版时不画线
    if (window.matchMedia('(max-width:860px)').matches) return;

    stage.querySelectorAll('.g4-note[data-ax]').forEach(function (note) {
      var left = note.classList.contains('l');
      var n = note.getBoundingClientRect();

      // 起点：卡片朝向样机那一侧的边缘中点
      var sx = (left ? n.right : n.left) - box.left;
      var sy = n.top + n.height / 2 - box.top;
      // 终点：样机图内的百分比坐标（手机外沿 × 那条消息的中线）
      var ex = img.left + img.width * (parseFloat(note.dataset.ax) / 100) - box.left;
      var ey = img.top + img.height * (parseFloat(note.dataset.ay) / 100) - box.top;

      var dx = (ex - sx) * 0.55;
      var d = 'M' + sx + ',' + sy + ' C' + (sx + dx) + ',' + sy +
              ' ' + (ex - dx) + ',' + ey + ' ' + ex + ',' + ey;

      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'g4-wire');
      svg.appendChild(path);

      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', ex);
      dot.setAttribute('cy', ey);
      dot.setAttribute('r', 4);
      dot.setAttribute('class', 'g4-wire-dot');
      svg.appendChild(dot);
    });
  }

  // 兜底：有些情况（全屏切换、浏览器缩放、扩展改布局）不会派发 resize，
  // 所以定期比一下尺寸，变了就重画。开销极小。
  var lastSig = '';
  function signature() {
    var b = stage.getBoundingClientRect(), i = shot.getBoundingClientRect();
    return [b.width, b.height, i.left, i.top, i.width, i.height].map(Math.round).join(',');
  }
  setInterval(function () {
    var sig = signature();
    if (sig !== lastSig) { lastSig = sig; draw(); }
  }, 400);

  // 改变窗口大小后布局要几帧才稳定，只画一次会漂，所以连画几次
  var frame = 0, timer = 0;
  function schedule() {
    if (!frame) {
      frame = requestAnimationFrame(function () {
        frame = 0;
        requestAnimationFrame(draw);
      });
    }
    clearTimeout(timer);
    timer = setTimeout(draw, 160);
  }

  draw();
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  // 图片是异步解码的，画好之前它的尺寸还是 0
  if (shot.complete) schedule(); else shot.addEventListener('load', schedule);
  // 翻到这一页的那一刻必须是准的
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) schedule(); });
    }, { threshold: [0, 0.2, 0.6] }).observe(stage);
  }
  setTimeout(schedule, 900);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(schedule);
    ro.observe(stage);
    ro.observe(shot);
    stage.querySelectorAll('.g4-note[data-ax]').forEach(function (n) { ro.observe(n); });
  }
})();
