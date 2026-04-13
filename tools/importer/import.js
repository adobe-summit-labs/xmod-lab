/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS — all 14 parsers
import heroParser from './parsers/hero-full.js';
import heroArticleParser from './parsers/hero-article.js';
import featuredArticleParser from './parsers/featured-article.js';
import columnsGalleryParser from './parsers/columns-gallery.js';
import editorialIndexParser from './parsers/editorial-index.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsPullquoteParser from './parsers/columns-sidebar.js';
import columnsAboutParser from './parsers/columns-about.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import tabsTeamParser from './parsers/tabs-team.js';
import tickerParser from './parsers/ticker.js';
import faqListParser from './parsers/faq-list.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsFeatureParser from './parsers/cards-feature.js';

// TRANSFORMER IMPORTS
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

/**
 * BLOCK_REGISTRY — content-driven block detection.
 * Each entry defines CSS selectors that identify a block on ANY page.
 * Order matters: more specific selectors first to prevent false matches.
 * Matched elements are tracked to avoid double-parsing.
 */
const BLOCK_REGISTRY = [
  // Hero variants — article-specific first (has .article-byline inside hero)
  { name: 'hero-article', selectors: ['section.hero-section:has(.article-byline)'], parser: heroArticleParser },
  { name: 'hero', selectors: ['section.hero-section'], parser: heroParser },

  // Tabs — containers first so descendant filter excludes nested cards
  { name: 'tabs-activity', selectors: ['.tab-container.tab-container--wide'], parser: tabsActivityParser },
  { name: 'tabs-team', selectors: ['section:has(.tab-menu):has(.profile-circle)'], parser: tabsTeamParser },
  { name: 'tabs', selectors: ['section:has(.tab-menu):not(:has(.tab-container)):not(:has(.profile-circle))'], parser: tabsActivityParser },

  // Featured article (standalone block, was columns-featured)
  { name: 'featured-article', selectors: ['.featured-article'], parser: featuredArticleParser },

  // Editorial index (standalone block, was columns-numbered)
  { name: 'editorial-index', selectors: ['.editorial-index'], parser: editorialIndexParser },

  // Columns variants
  { name: 'columns-promo', selectors: ['.grid-layout.grid-layout--2col', '.accent-section .grid-layout.tablet-1-column:has(.card)'], parser: columnsPromoParser },
  { name: 'columns-pullquote', selectors: ['.secondary-section .grid-layout.desktop-3-column.grid-align-center'], parser: columnsPullquoteParser },
  { name: 'columns-about', selectors: ['.grid-layout.grid-gap-xl.tablet-1-column'], parser: columnsAboutParser },

  // Cards — before columns-gallery to prevent false matches on .desktop-3-column grids
  { name: 'cards-feature', selectors: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.card.card-body)'], parser: cardsFeatureParser },
  { name: 'cards-article', selectors: ['.grid-layout.desktop-3-column:has(.article-card)'], parser: cardsArticleParser },

  // Gallery must come after cards to avoid matching card grids
  { name: 'gallery', selectors: ['.inverse-section .grid-layout.desktop-3-column:not(:has(.article-card)):not(:has(.card.card-body))'], parser: columnsGalleryParser },

  // Standalone blocks
  { name: 'ticker', selectors: ['.ticker-strip'], parser: tickerParser },
  { name: 'faq-list', selectors: ['.faq-list'], parser: faqListParser },
];

/**
 * Check if an element is a descendant of any element in the matched set.
 */
function isDescendantOfMatched(el, matched) {
  let parent = el.parentElement;
  while (parent) {
    if (matched.has(parent)) return true;
    parent = parent.parentElement;
  }
  return false;
}

/**
 * Find all blocks on the page by scanning the DOM against the block registry.
 * Elements are tracked to prevent duplicate matches.
 * Elements nested inside already-matched blocks are skipped to avoid
 * double-parsing (e.g., cards inside tabs).
 */
function findBlocksOnPage(document) {
  const pageBlocks = [];
  const matched = new Set();

  for (const entry of BLOCK_REGISTRY) {
    for (const selector of entry.selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (!matched.has(el) && !isDescendantOfMatched(el, matched)) {
            matched.add(el);
            pageBlocks.push({ name: entry.name, element: el, parser: entry.parser });
          }
        });
      } catch (e) {
        console.warn(`Invalid selector for ${entry.name}: ${selector}`, e);
      }
    }
  }

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const transformers = [wkndCleanupTransformer, wkndSectionsTransformer];

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, payload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const originalURL = params.originalURL || url;

    const main = document.body;

    // 1. Execute beforeTransform transformers (cleanup + section breaks)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find and parse all blocks on page (content-driven detection)
    const pageBlocks = findBlocksOnPage(document);

    pageBlocks.forEach((block) => {
      try {
        block.parser(block.element, { document, url, params });
      } catch (e) {
        console.error(`Failed to parse ${block.name}:`, e);
      }
    });

    // 3. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload);

    // 4. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url);

    // 5. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
