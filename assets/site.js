// Image viewer: click a picture to see it large; arrow keys move between pictures on the page.
(() => {
  const dlg = document.querySelector('.viewer');
  const links = [...document.querySelectorAll('a.zoom')];
  if (!dlg || typeof dlg.showModal !== 'function' || !links.length) return;
  const img = dlg.querySelector('img');
  const cap = dlg.querySelector('.viewer-cap');
  let at = 0;

  const show = (i) => {
    at = (i + links.length) % links.length;
    const a = links[at];
    img.src = a.href;
    img.alt = a.querySelector('img')?.alt || '';
    cap.textContent = a.dataset.cap || '';
  };

  links.forEach((a, i) =>
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      show(i);
      dlg.showModal();
    }),
  );
  dlg.querySelector('.viewer-close').addEventListener('click', () => dlg.close());
  dlg.querySelector('.viewer-prev').addEventListener('click', () => show(at - 1));
  dlg.querySelector('.viewer-next').addEventListener('click', () => show(at + 1));
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });
  dlg.addEventListener('close', () => {
    img.removeAttribute('src');
    links[at]?.focus();
  });
})();

// Videos: loops (turnarounds) play while they are on screen; only one other video plays at a time.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loops = document.querySelectorAll('video[data-loop]');
  if (!still && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.play().catch(() => {});
          else e.target.pause();
        }),
      { threshold: 0.35 },
    );
    loops.forEach((v) => io.observe(v));
  }
  const films = [...document.querySelectorAll('video:not([data-loop])')];
  films.forEach((v) =>
    v.addEventListener('play', () => films.forEach((o) => o !== v && o.pause())),
  );
})();
