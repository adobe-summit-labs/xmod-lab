/* eslint-disable */
/* global WebImporter */
/** Parser for editorial-index-process. Base: editorial-index. Source: wknd-adventures.com. */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.editorial-index-item'));
  const cells = [];

  items.forEach((item) => {
    const numberEl = item.querySelector('.editorial-index-number, :scope > span');
    const heading = item.querySelector('h3, .h4-heading');
    const description = item.querySelector('p.paragraph-lg, p');

    const numberP = document.createElement('p');
    numberP.textContent = numberEl ? numberEl.textContent.trim() : '';

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);

    cells.push([[numberP], contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'editorial-index-process', cells });
  element.replaceWith(block);
}
