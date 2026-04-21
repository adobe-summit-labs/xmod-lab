import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cols = [...row.children];
  const imageCol = cols.find((c) => c.querySelector('picture'));
  const textCol = cols.find((c) => !c.querySelector('picture') || c.querySelector('h2'));

  if (imageCol) {
    imageCol.classList.add('featured-article-image');
    const img = imageCol.querySelector('img');
    if (img) {
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]),
      );
    }
  }

  if (textCol) {
    textCol.classList.add('featured-article-content');
  }
}
