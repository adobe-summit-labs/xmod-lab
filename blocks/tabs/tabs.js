// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;

    button.innerHTML = tab.innerHTML;

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);

  // Restructure card-like content in panels into individual card divs
  block.querySelectorAll('.tabs-panel').forEach((panel) => {
    const wrapper = panel.querySelector(':scope > div');
    if (!wrapper) return;
    // Only restructure if content looks like cards (images + headings)
    if (!wrapper.querySelector('img') || !wrapper.querySelector('h3, h4, h5')) return;

    const children = [...wrapper.children];
    const cards = [];
    let card = null;

    children.forEach((child) => {
      if (child.querySelector('img')) {
        card = document.createElement('div');
        card.className = 'tabs-card';
        cards.push(card);
      }
      if (card) card.append(child);
    });

    if (cards.length > 1) {
      wrapper.remove();
      cards.forEach((c) => panel.append(c));
    }
  });
}
