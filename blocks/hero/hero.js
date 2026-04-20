function createSnowfall(container) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-snow';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width;
  let height;
  const flakes = [];
  const COUNT = 80;

  function resize() {
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function seed() {
    for (let i = 0; i < COUNT; i += 1) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1.2 + 0.3,
        drift: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    flakes.forEach((f) => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
      ctx.fill();

      f.y += f.speed;
      f.x += f.drift + Math.sin(f.y * 0.01) * 0.3;

      if (f.y > height) {
        f.y = -f.r;
        f.x = Math.random() * width;
      }
      if (f.x > width) f.x = 0;
      if (f.x < 0) f.x = width;
    });
    requestAnimationFrame(draw);
  }

  // Defer start until hero has layout dimensions
  requestAnimationFrame(() => {
    resize();
    seed();
    draw();
  });
  window.addEventListener('resize', resize);
}

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length >= 2) {
    const imageRow = rows[0];
    const contentRow = rows[1];
    const contentCell = contentRow.querySelector(':scope > div') || contentRow;

    // Preserve existing <picture> with its <source> elements; fall back to wrapping bare <img>
    const picture = imageRow.querySelector('picture');
    if (picture) {
      block.replaceChildren(picture, contentCell);
    } else {
      const img = imageRow.querySelector('img');
      if (img) {
        const pic = document.createElement('picture');
        pic.append(img);
        block.replaceChildren(pic, contentCell);
      } else {
        block.replaceChildren(contentCell);
      }
    }
  }

  // Tag pills: eyebrow p and em-wrapped tags
  const contentDiv = block.querySelector(':scope > div');
  if (contentDiv) {
    const firstP = contentDiv.querySelector(':scope > p:first-child');
    if (firstP && !firstP.querySelector('a, img')) firstP.classList.add('tag-pill');
    contentDiv.querySelectorAll('em').forEach((em) => {
      if (!em.querySelector('a')) em.classList.add('tag-pill');
    });
  }

  // Snowfall — skip for article variant and reduced-motion preference
  if (!block.classList.contains('article')
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    createSnowfall(block);
  }
}
