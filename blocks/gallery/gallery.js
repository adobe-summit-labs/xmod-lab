import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  rows.forEach((row) => {
    const images = row.querySelectorAll('img');
    images.forEach((img) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const pic = img.closest('picture');
      if (pic) {
        item.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
      } else {
        const clone = img.cloneNode(true);
        item.append(clone);
      }
      grid.append(item);
    });
  });

  block.replaceChildren(grid);
}
