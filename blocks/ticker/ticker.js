export default function decorate(block) {
  const items = [...block.querySelectorAll('p')];
  if (!items.length) return;

  const track = document.createElement('div');
  track.className = 'ticker-track';

  items.forEach((p) => {
    const span = document.createElement('span');
    span.className = 'ticker-item';
    span.textContent = p.textContent;
    track.append(span);
  });

  // Duplicate for seamless loop
  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('div');
  inner.className = 'ticker-inner';
  inner.append(track, clone);

  block.replaceChildren(inner);
}
