/* eslint-disable */
/* global WebImporter */

/**
 * Parser for recipe-cards block.
 * Source: https://growninidaho.com/ - featured recipes section (dark-brown background)
 * Target: header row [h2 + subtitle], N recipe rows [image, h3 + meta + link], footer row [CTA]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Header row: h2 heading + subtitle from .wpb_text_column
  const heading = element.querySelector('.wpb_text_column h2');
  const subtitle = element.querySelector('.wpb_text_column p');
  const headerCell = document.createElement('div');
  if (heading) headerCell.appendChild(heading.cloneNode(true));
  if (subtitle) headerCell.appendChild(subtitle.cloneNode(true));
  cells.push([headerCell]);

  // Recipe cards from article elements
  const articles = Array.from(element.querySelectorAll('article.recipe-item'));
  for (const article of articles) {
    const img = article.querySelector('.card__media img');
    const title = article.querySelector('.card__title');
    const meta = article.querySelector('.card__meta');
    const link = article.querySelector('a.card');

    // Image cell
    const imgCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || (title ? title.textContent.trim() : '');
      imgCell.appendChild(newImg);
    }

    // Content cell: h3 + metadata + link
    const contentCell = document.createElement('div');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      contentCell.appendChild(h3);
    }
    if (meta) {
      const p = document.createElement('p');
      p.textContent = meta.textContent.trim();
      contentCell.appendChild(p);
    }
    if (link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = 'View Recipe';
      p.appendChild(a);
      contentCell.appendChild(p);
    }

    cells.push([imgCell, contentCell]);
  }

  // Footer row: View All Recipes CTA
  const viewAllBtn = element.querySelector('.gii-buttons-stacked a.gii-button, a.gii-button[href*="recipes"]');
  if (viewAllBtn) {
    const footerCell = document.createElement('div');
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = viewAllBtn.href;
    a.textContent = viewAllBtn.textContent.trim();
    strong.appendChild(a);
    p.appendChild(strong);
    footerCell.appendChild(p);
    cells.push([footerCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'recipe-cards', cells });
  element.replaceWith(block);
}
