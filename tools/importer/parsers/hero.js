/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Source: https://growninidaho.com/ - first section with full-width background image
 * Target: 1 row with [background image, content cell with h1 + text + CTA links]
 */
export default function parse(element, { document }) {
  // Extract background image - try multiple approaches
  let bgImg = element.querySelector('.row-bg-wrap img, .row-bg img');
  if (!bgImg) {
    // Fallback: check for background-image in style or data attributes
    const bgDiv = element.querySelector('.row-bg[style*="background-image"], [data-nectar-img-src]');
    if (bgDiv) {
      const bgUrl = bgDiv.getAttribute('data-nectar-img-src')
        || bgDiv.style.backgroundImage?.replace(/url\(["']?([^"')]+)["']?\)/, '$1');
      if (bgUrl) {
        bgImg = document.createElement('img');
        bgImg.src = bgUrl;
        bgImg.alt = 'French fries from Idaho potatoes';
      }
    }
  }

  // Extract heading
  const heading = element.querySelector('h1');

  // Extract description paragraph
  const descEl = element.querySelector('.nectar-responsive-text p, .wpb_content_element p');

  // Extract CTA buttons
  const ctaLinks = Array.from(element.querySelectorAll('a.gii-button'));

  // Build content cell
  const contentCell = document.createElement('div');
  if (heading) contentCell.appendChild(heading.cloneNode(true));
  if (descEl) contentCell.appendChild(descEl.cloneNode(true));

  // Wrap CTAs: primary (bold), secondary (italic)
  ctaLinks.forEach((cta, i) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.href;
    a.textContent = cta.textContent.trim();
    if (i === 0) {
      const strong = document.createElement('strong');
      strong.appendChild(a);
      p.appendChild(strong);
    } else {
      const em = document.createElement('em');
      em.appendChild(a);
      p.appendChild(em);
    }
    contentCell.appendChild(p);
  });

  const cells = [];
  if (bgImg) cells.push([bgImg]);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
