/* eslint-disable */
/* global WebImporter */

/**
 * Parser for social-feed block.
 * Source: https://growninidaho.com/ - Instagram feed section
 * Target: header row [h2, follow link], content row [4 linked instagram images]
 */
export default function parse(element, { document }) {
  // Header row
  const heading = element.querySelector('.instagram-header h2, h2');
  const followBtn = element.querySelector('a.gii-button[href*="instagram"]');

  const headingCell = document.createElement('div');
  if (heading) headingCell.appendChild(heading.cloneNode(true));

  const followCell = document.createElement('div');
  if (followBtn) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = followBtn.href;
    a.textContent = followBtn.textContent.trim();
    p.appendChild(a);
    followCell.appendChild(p);
  }

  // Content row: Instagram post images as links
  const sbiItems = Array.from(element.querySelectorAll('.sbi_item'));
  const imageCells = [];

  for (const item of sbiItems) {
    // Get the post link
    const postLink = item.querySelector('a.sbi_photo');
    // Get the actual image (skip SVG play buttons)
    const img = item.querySelector('a.sbi_photo img[src*="instagram"], a.sbi_photo img[src*="sb-instagram"], a.sbi_photo img[src*=".webp"], a.sbi_photo img[src*=".jpg"], a.sbi_photo img[src*=".png"]');

    if (!postLink || !img) continue;

    const cell = document.createElement('div');
    const a = document.createElement('a');
    a.href = postLink.href;
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || 'Instagram post';
    a.appendChild(newImg);
    cell.appendChild(a);
    imageCells.push(cell);
  }

  const cells = [];
  cells.push([headingCell, followCell]);
  if (imageCells.length > 0) {
    cells.push(imageCells);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'social-feed', cells });
  element.replaceWith(block);
}
