/* 第 06 页：官网核验演示。三种结果对应右侧三张状态卡，点击任一处都会同步。 */
(function () {
  var input = document.getElementById('verify-id');
  var result = document.getElementById('verify-result');
  if (!input || !result) return;

  var states = document.querySelectorAll('.g6-state');
  var chips = document.querySelectorAll('.g6-quick [data-verify]');

  var ICON = {
    wechat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 4C4.9 4 1.6 6.8 1.6 10.2c0 1.9 1 3.6 2.7 4.8l-.7 2.2 2.6-1.3c.9.3 1.8.4 2.8.4h.5a5.6 5.6 0 0 1-.2-1.5c0-3.4 3.2-6.1 7.2-6.1h.5C16.3 6 13 4 9 4Zm-2.4 4.4a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.8 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"/><path d="M22.4 14.8c0-2.8-2.7-5-6-5s-6 2.2-6 5 2.7 5 6 5c.7 0 1.4-.1 2-.3l2.1 1.1-.6-1.8c1.5-1 2.5-2.4 2.5-4Zm-7.9-.8a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm3.8 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 20.4l1.2-4A8.4 8.4 0 1 1 8 19.3Z"/><path d="M9 8.6c0 3.4 3 6.4 6.4 6.4l1-1.6-2-1-1 .8a4.6 4.6 0 0 1-2.6-2.6l.8-1-1-2Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.4"/><path d="m3.6 6.4 8.4 6.4 8.4-6.4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  var directory = {
    'RG-1024': { state: 'ok', name: '张经理', role: '客户经理 · 华语客户部', since: '2023-03 入职' },
    'RG-0877': { state: 'leave', name: '刘经理', role: '原客户经理 · 华语客户部', since: '2026-08 离职' }
  };

  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function okCard(id, p) {
    return '<div class="g6-id"><i class="g6-ava">' + esc(p.name.charAt(0)) + '</i><div><b>' + esc(p.name) + ' <small>' + esc(id) + '</small></b><span>' + esc(p.role) + ' · ' + esc(p.since) + '</span></div><em class="g6-pill ok">' + ICON.check + '在职 · 已核实</em></div>' +
      '<ul class="g6-ch">' +
      '<li><span class="wx">' + ICON.wechat + '</span><div><small>微信</small><b>RG_Zhang****</b></div><i>' + ICON.check + '已登记</i></li>' +
      '<li><span class="wa">' + ICON.wa + '</span><div><small>WhatsApp</small><b>+64 ** *** 1024</b></div><i>' + ICON.check + '已登记</i></li>' +
      '<li><span class="ml">' + ICON.mail + '</span><div><small>官方邮箱</small><b>zhang.w@rockglobal.co.nz</b></div><i>' + ICON.check + '已登记</i></li>' +
      '</ul>' +
      '<p class="g6-foot ok">如果对方联系你的账号不在上面，请不要继续沟通。</p>';
  }

  function leaveCard(id, p) {
    return '<div class="g6-id"><i class="g6-ava muted">' + esc(p.name.charAt(0)) + '</i><div><b>' + esc(p.name) + ' <small>' + esc(id) + '</small></b><span>' + esc(p.role) + ' · ' + esc(p.since) + '</span></div><em class="g6-pill leave">已离职</em></div>' +
      '<div class="g6-handoff"><p>你的服务关系已由官方承接，账户与资金不受人员变动影响。</p>' +
      '<div class="g6-new"><i class="g6-ava">陈</i><div><small>新对接人</small><b>陈经理 <small>RG-1102</small></b></div><em class="g6-pill ok">' + ICON.check + '在职</em></div></div>' +
      '<div class="g6-acts"><span class="primary">查看新对接人 ' + ICON.arrow + '</span><span>联系官方客服</span></div>' +
      '<p class="g6-foot leave">原经理个人账号发来的转账、换平台请求，一律不要处理。</p>';
  }

  function noneCard(id) {
    return '<div class="g6-id"><i class="g6-ava warn">!</i><div><b>未查到编号 <small>' + esc(id || '—') + '</small></b><span>RockGlobal 没有这位客户经理</span></div><em class="g6-pill none">需要警惕</em></div>' +
      '<ul class="g6-warn">' +
      '<li><span>' + ICON.x + '</span>不要向对方转账或入金</li>' +
      '<li><span>' + ICON.x + '</span>不要提供账户密码、验证码</li>' +
      '<li><span>' + ICON.x + '</span>不要点击对方发来的下载链接</li>' +
      '</ul>' +
      '<div class="g6-acts"><span class="danger">联系官方客服核实 ' + ICON.arrow + '</span><span>举报该账号</span></div>';
  }

  function verify() {
    var id = input.value.trim().toUpperCase();
    var p = directory[id];
    var state = p ? p.state : 'none';
    result.className = 'g6-result is-' + state;
    result.innerHTML = state === 'ok' ? okCard(id, p) : state === 'leave' ? leaveCard(id, p) : noneCard(id);
    states.forEach(function (el) { el.classList.toggle('is-on', el.classList.contains(state)); });
    chips.forEach(function (el) { el.classList.toggle('is-on', el.dataset.verify === id); });
  }

  document.getElementById('verify-submit').addEventListener('click', verify);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') verify(); });
  document.querySelectorAll('.g6-page [data-verify]').forEach(function (btn) {
    btn.addEventListener('click', function () { input.value = btn.dataset.verify; verify(); });
  });
  verify();
})();
