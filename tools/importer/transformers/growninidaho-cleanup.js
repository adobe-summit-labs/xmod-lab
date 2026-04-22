/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: growninidaho cleanup.
 * Selectors from captured DOM of https://growninidaho.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove accessibility widget (UserWay), cookie/tracking elements
    WebImporter.DOMUtils.remove(element, [
      '.uwy',
      'iframe.uwif',
      '.uw-s10-bottom-ruler-guide',
      '.uw-s10-right-ruler-guide',
      '.uw-s10-left-ruler-guide',
      '.uw-s10-reading-guide',
      '.uw-s12-tooltip',
      'nav.skip-link',
    ]);
  }

  if (hookName === H.after) {
    // Remove header/navigation
    WebImporter.DOMUtils.remove(element, [
      '#header-space',
      '#header-outer',
      'header#top',
      '.bg-color-stripe',
    ]);

    // Remove footer
    WebImporter.DOMUtils.remove(element, [
      '#footer-outer',
    ]);

    // Remove slide-out mobile menu
    WebImporter.DOMUtils.remove(element, [
      '#slide-out-widget-area-bg',
      '#slide-out-widget-area',
    ]);

    // Remove lightbox overlays (Instagram)
    WebImporter.DOMUtils.remove(element, [
      '#sbi_lightboxOverlay',
      '#sbi_lightbox',
    ]);

    // Remove back-to-top button
    WebImporter.DOMUtils.remove(element, [
      'a#to-top',
    ]);

    // Remove iframes, noscript, link elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
    ]);
  }
}
