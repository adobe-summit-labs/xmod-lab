/* eslint-disable */
/* global WebImporter */
/** Parser for hero-adventure. Base: hero. Source: wknd-adventures.com. */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('.hero-bg img, img[alt]');
  const heading = element.querySelector('.hero-content-inner h1, h1');
  const lead = element.querySelector('.hero-content-inner .paragraph-xl, .hero-lead, .hero-content p:not(.tag)');
  const tag = element.querySelector('.hero-content-inner .tag, .hero-content p.tag');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, .hero-content a'));

  const cells = [];
  if (bgImage) cells.push([bgImage]);

  const contentCell = [];
  if (tag) contentCell.push(tag);
  if (heading) contentCell.push(heading);
  if (lead) contentCell.push(lead);
  contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-adventure', cells });
  element.replaceWith(block);
}
