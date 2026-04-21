/* eslint-disable */
/* global WebImporter */
/** Parser for featured-article-story. Base: featured-article. Source: wknd-adventures.com. */
export default function parse(element, { document }) {
  const image = element.querySelector('.featured-article-image img, img');
  const tag = element.querySelector('.tag, p.tag');
  const heading = element.querySelector('h2');
  const description = element.querySelector('p.paragraph-lg, .utility-text-secondary');
  const cta = element.querySelector('.featured-article-footer a, a.button, a[href]');

  const imageCell = [];
  if (image) imageCell.push(image);

  const contentCell = [];
  if (tag) contentCell.push(tag);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  const cells = [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'featured-article-story', cells });
  element.replaceWith(block);
}
