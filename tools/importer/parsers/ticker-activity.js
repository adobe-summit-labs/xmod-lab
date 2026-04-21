/* eslint-disable */
/* global WebImporter */
/** Parser for ticker-activity. Base: ticker. Source: wknd-adventures.com. */
export default function parse(element, { document }) {
  const spans = Array.from(element.querySelectorAll('.ticker-track span:not(.ticker-sep)'));

  const seen = new Set();
  const uniqueItems = [];
  spans.forEach((span) => {
    const text = span.textContent.trim();
    if (text && !seen.has(text)) {
      seen.add(text);
      uniqueItems.push(text);
    }
  });

  const container = document.createElement('div');
  uniqueItems.forEach((item) => {
    const p = document.createElement('p');
    p.textContent = item;
    container.appendChild(p);
  });

  const cells = [[container]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'ticker-activity', cells });
  element.replaceWith(block);
}
