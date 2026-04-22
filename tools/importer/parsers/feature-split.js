/* eslint-disable */
/* global WebImporter */

/**
 * Parser for feature-split block.
 * Source: https://growninidaho.com/ - two-column section with product image, badge, and text
 * Target: 1 row with [product image, badge image, content cell with h2 + paragraphs + CTA]
 */
export default function parse(element, { document }) {
  // Guard: only match the section that has the centered product image (not the product slider section)
  const hasFeatureImage = element.querySelector('.img-with-aniamtion-wrap.center, .img-with-aniamtion-wrap[class*="custom-width"]');
  if (!hasFeatureImage) return;

  // Left column: product image (the centered image with custom width)
  const productImg = element.querySelector('.img-with-aniamtion-wrap.center img, .vc_col-sm-6:first-of-type .img-with-aniamtion-wrap img');

  // Right column content
  const rightCol = element.querySelector('.vc_col-sm-6:nth-of-type(2) .wpb_wrapper, .vc_col-sm-6 + .vc_col-sm-6 .wpb_wrapper');

  // Badge image (Made with Real Idaho Potatoes)
  let badgeImg = null;
  if (rightCol) {
    badgeImg = rightCol.querySelector('.img-with-aniamtion-wrap img');
  }

  // Heading
  const heading = element.querySelector('h2');

  // Description paragraphs
  const descPs = rightCol ? Array.from(rightCol.querySelectorAll('.wpb_text_column p')) : [];

  // CTA button
  const ctaLink = element.querySelector('a.gii-button');

  // Build content cell (col 3): heading + paragraphs + CTA
  const contentCell = document.createElement('div');
  if (heading) contentCell.appendChild(heading.cloneNode(true));
  descPs.forEach((p) => contentCell.appendChild(p.cloneNode(true)));
  if (ctaLink) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    strong.appendChild(a);
    p.appendChild(strong);
    contentCell.appendChild(p);
  }

  const cells = [];
  cells.push([productImg ? productImg.cloneNode(true) : '', badgeImg ? badgeImg.cloneNode(true) : '', contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'feature-split', cells });
  element.replaceWith(block);
}
