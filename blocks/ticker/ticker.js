export default function decorate(block) {
  const items = [...block.children].map((row) => row.textContent.trim());
  block.textContent = '';

  const track = document.createElement('div');
  track.className = 'ticker-track';

  // Create items with separators, duplicated for seamless loop
  const content = items.join(' · ');
  const span1 = document.createElement('span');
  span1.textContent = `${content} · `;
  const span2 = document.createElement('span');
  span2.textContent = `${content} · `;

  track.append(span1, span2);
  block.append(track);
}
