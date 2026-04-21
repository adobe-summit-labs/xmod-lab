import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Groups consecutive sections with style "tabs" into a tabbed interface.
 * Each tab section should have an h3 as the tab label, followed by content.
 * @param {Element} main The main element
 */
function buildTabs(main) {
  const sections = [...main.querySelectorAll('.section.tabs')];
  if (!sections.length) return;

  // Group consecutive tab sections
  const groups = [];
  let current = [];
  sections.forEach((section) => {
    if (current.length && section.previousElementSibling !== current[current.length - 1]) {
      groups.push(current);
      current = [];
    }
    current.push(section);
  });
  if (current.length) groups.push(current);

  groups.forEach((group) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'section tabs-wrapper';

    // Insert wrapper before the first tab section (while it's still in the DOM)
    group[0].parentElement.insertBefore(wrapper, group[0]);

    const tabList = document.createElement('div');
    tabList.className = 'tabs-nav';
    tabList.setAttribute('role', 'tablist');

    const panels = document.createElement('div');
    panels.className = 'tabs-panels';

    group.forEach((section, i) => {
      const heading = section.querySelector('.default-content-wrapper h3')
        || section.querySelector('h3');
      const label = heading ? heading.textContent.trim() : `Tab ${i + 1}`;

      const btn = document.createElement('button');
      btn.className = 'tabs-tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-controls', `tab-panel-${i}`);
      btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
      btn.textContent = label;
      tabList.append(btn);

      const panel = document.createElement('div');
      panel.className = 'tabs-panel';
      panel.setAttribute('role', 'tabpanel');
      panel.id = `tab-panel-${i}`;
      panel.hidden = i !== 0;

      // Move section content into panel, skip section-metadata
      [...section.children].forEach((child) => {
        if (!child.classList.contains('section-metadata')) {
          panel.append(child);
        }
      });
      // Remove the heading used as tab label
      if (heading) {
        const headingWrapper = heading.closest('.default-content-wrapper');
        if (headingWrapper) headingWrapper.remove();
        else heading.remove();
      }
      panels.append(panel);
      section.remove();
    });

    // Tab click handler
    tabList.addEventListener('click', (e) => {
      const tab = e.target.closest('.tabs-tab');
      if (!tab) return;
      tabList.querySelectorAll('.tabs-tab').forEach((t) => {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      panels.querySelectorAll('.tabs-panel').forEach((p) => { p.hidden = true; });
      const target = panels.querySelector(`#${tab.getAttribute('aria-controls')}`);
      if (target) target.hidden = false;
    });

    // Keyboard navigation
    tabList.addEventListener('keydown', (e) => {
      const tabs = [...tabList.querySelectorAll('.tabs-tab')];
      const idx = tabs.indexOf(document.activeElement);
      let next;
      if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (next) {
        e.preventDefault();
        next.focus();
        next.click();
      }
    });

    const inner = document.createElement('div');
    inner.append(tabList, panels);
    wrapper.append(inner);
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  buildTabs(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
