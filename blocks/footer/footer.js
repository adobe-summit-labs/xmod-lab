import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Label sections
  const sections = footer.querySelectorAll(':scope > .section');
  if (sections.length >= 2) {
    sections[0].classList.add('footer-top');
    sections[sections.length - 1].classList.add('footer-bottom');
  }

  // Restructure footer-top: label columns and inject brand logo
  const footerTop = footer.querySelector('.footer-top');
  if (footerTop) {
    // EDS creates rows as direct children: div > div (row > cell)
    // or a single .default-content-wrapper with all content flat
    const wrapper = footerTop.querySelector('.default-content-wrapper');
    const rows = wrapper
      ? null
      : [...footerTop.querySelectorAll(':scope > div > div')];

    if (wrapper) {
      // Flat structure: group content into columns
      const children = [...wrapper.children];
      const columns = [];

      const col1 = document.createElement('div');
      col1.className = 'footer-col';
      const brandP = children.find((el) => el.tagName === 'P' && el.querySelector('a'));
      const taglineP = children.find(
        (el) => el.tagName === 'P' && !el.querySelector('a') && el.textContent.trim().length > 0,
      );
      if (brandP) col1.append(brandP);
      if (taglineP) col1.append(taglineP);
      columns.push(col1);

      const remaining = children.filter((el) => el !== brandP && el !== taglineP);
      let currentCol = null;
      remaining.forEach((el) => {
        if (el.tagName === 'H4') {
          if (currentCol) columns.push(currentCol);
          currentCol = document.createElement('div');
          currentCol.className = 'footer-col';
          currentCol.append(el);
        } else if (currentCol) {
          currentCol.append(el);
        }
      });
      if (currentCol) columns.push(currentCol);

      wrapper.remove();
      columns.forEach((col) => footerTop.append(col));
    } else if (rows && rows.length > 0) {
      // Row/cell structure: each row's inner div is a column
      rows.forEach((cell, i) => {
        cell.classList.add('footer-col');
        if (i === 0) cell.classList.add('footer-col-brand');
      });
      // Flatten: move cells directly into footer-top, remove row wrappers
      const rowWrappers = [...footerTop.querySelectorAll(':scope > div')];
      rowWrappers.forEach((row) => {
        const cell = row.querySelector('.footer-col');
        if (cell) {
          footerTop.append(cell);
          row.remove();
        }
      });
    }
  }

  // Restructure brand column: add logo icon + strip button classes
  const brandCol = footer.querySelector('.footer-col-brand') || footer.querySelector('.footer-col:first-child');
  if (brandCol) {
    const brandLink = brandCol.querySelector('a');
    if (brandLink) {
      brandLink.className = 'footer-brand-link';
      brandLink.innerHTML = `<span class="footer-logo-icon" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 33 33" preserveAspectRatio="xMidYMid meet">
          <path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="currentColor"/>
        </svg>
      </span><span class="footer-logo-text">WKND<br>Adventures</span>`;
      const btnWrapper = brandLink.closest('.button-wrapper');
      if (btnWrapper) btnWrapper.className = '';
      const btnContainer = brandLink.closest('.button-container');
      if (btnContainer) btnContainer.className = '';
    }
  }

  block.append(footer);
}
