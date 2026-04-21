/* eslint-disable */
/* global WebImporter */
/** Parser for gallery-field. Base: gallery. Source: wknd-adventures.com. */
export default function parse(element, { document }) {
  const section = element.closest('section') || element.parentElement;

  // Row 1: Grid of 3 images
  const gridImages = Array.from(element.querySelectorAll('img'));

  // Row 2: Wide image (sibling element after the grid)
  const wideWrapper = section.querySelector('.utility-margin-top-lg');
  const wideImg = wideWrapper ? wideWrapper.querySelector('img') : null;

  const cells = [];
  if (gridImages.length > 0) cells.push(gridImages);
  if (wideImg) cells.push([wideImg]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'gallery-field', cells });
  element.replaceWith(block);
}
