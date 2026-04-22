import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footerContent = document.createElement('div');
  while (fragment.firstElementChild) footerContent.append(fragment.firstElementChild);

  // Find the content wrapper inside the section
  const dcw = footerContent.querySelector('.default-content-wrapper');
  if (dcw) {
    const lists = dcw.querySelectorAll('ul');

    // Mark social links list and add aria-labels
    if (lists.length >= 1) {
      lists[0].classList.add('footer-social');
      lists[0].querySelectorAll('a').forEach((a) => {
        const name = a.textContent.trim();
        a.setAttribute('aria-label', name);
        a.textContent = '';
        const abbr = document.createElement('span');
        abbr.className = 'social-icon';
        abbr.textContent = name.charAt(0);
        abbr.setAttribute('aria-hidden', 'true');
        a.append(abbr);
      });
    }

    // Mark nav links list
    if (lists.length >= 2) {
      lists[1].classList.add('footer-nav');
    }

    // Build bottom bar with nav links + copyright
    const lastP = dcw.querySelector(':scope > p:last-of-type');
    if (lists.length >= 2 && lastP) {
      const bottomBar = document.createElement('div');
      bottomBar.className = 'footer-bottom';
      bottomBar.append(lists[1]);
      bottomBar.append(lastP);
      dcw.append(bottomBar);
    }
  }

  block.append(footerContent);
}
