/* eslint-disable */
/* global WebImporter */

/**
 * Parser for product-slider block.
 * Source: https://growninidaho.com/ - slick carousel of product cards
 * Target: N rows, each with [product image, h3 linked product name]
 * Only uses non-cloned slides (slick-cloned are duplicates)
 */
export default function parse(element, { document }) {
  // Get all non-cloned slides
  const slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned)'));

  const cells = [];
  const seenProducts = new Set();

  for (const slide of slides) {
    const img = slide.querySelector('.card__media img');
    const titleEl = slide.querySelector('.card__title');
    const link = slide.querySelector('a.card-product, a.card');

    if (!titleEl) continue;

    const productName = titleEl.textContent.trim();
    // Deduplicate in case of any remaining duplicates
    if (seenProducts.has(productName)) continue;
    seenProducts.add(productName);

    // Build image cell
    const imgCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || productName;
      imgCell.appendChild(newImg);
    }

    // Build title cell with h3 linked name
    const titleCell = document.createElement('div');
    const h3 = document.createElement('h3');
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = productName;
      h3.appendChild(a);
    } else {
      h3.textContent = productName;
    }
    titleCell.appendChild(h3);

    cells.push([imgCell, titleCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'product-slider', cells });
  element.replaceWith(block);
}
