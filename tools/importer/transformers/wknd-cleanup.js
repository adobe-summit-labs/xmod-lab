/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND cleanup.
 * Removes non-authorable site chrome from the WKND source pages.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // No cookie banners or overlays detected in WKND source
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (header nav, footer, skip link)
    // Found in captured DOM: <div class="navbar">, <footer class="footer">, <a class="skip-link">
    WebImporter.DOMUtils.remove(element, [
      '.navbar',
      '.footer',
      '.skip-link',
      'noscript',
      'link',
      'iframe',
    ]);
  }
}
