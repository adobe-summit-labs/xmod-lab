/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS — all 14 parsers for every template
import heroParser from './parsers/hero-full.js';
import heroArticleParser from './parsers/hero-article.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import columnsGalleryParser from './parsers/columns-gallery.js';
import columnsNumberedParser from './parsers/columns-numbered.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsSidebarParser from './parsers/columns-sidebar.js';
import columnsAboutParser from './parsers/columns-about.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import tabsTeamParser from './parsers/tabs-team.js';
import tickerParser from './parsers/ticker.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsFeatureParser from './parsers/cards-feature.js';

// TRANSFORMER IMPORTS
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

// PARSER REGISTRY — map every block name to its parser function
const parsers = {
  'hero': heroParser,
  'hero-article': heroArticleParser,
  'columns-featured': columnsFeaturedParser,
  'columns-gallery': columnsGalleryParser,
  'columns-numbered': columnsNumberedParser,
  'columns-promo': columnsPromoParser,
  'columns-sidebar': columnsSidebarParser,
  'columns-about': columnsAboutParser,
  'tabs': tabsActivityParser,
  'tabs-activity': tabsActivityParser,
  'tabs-team': tabsTeamParser,
  'ticker': tickerParser,
  'accordion-faq': accordionFaqParser,
  'cards-article': cardsArticleParser,
  'cards-feature': cardsFeatureParser,
};

// ALL PAGE TEMPLATES — embedded from page-templates.json
const TEMPLATES = [
  {
    name: 'homepage',
    urls: ['https://gabrielwalt.github.io/wknd/index.html'],
    description: 'Homepage with hero, featured content, activity browser, stories gallery, FAQ, and onboarding sections',
    blocks: [
      { name: 'hero', instances: ['section.hero-section.hero-section--full'] },
      { name: 'columns-featured', instances: ['.featured-article'] },
      { name: 'tabs-activity', instances: ['.tab-container.tab-container--wide'] },
      { name: 'ticker', instances: ['.ticker-strip'] },
      { name: 'accordion-faq', instances: ['.faq-list'] },
      { name: 'columns-numbered', instances: ['.editorial-index'] },
      { name: 'columns-gallery', instances: ['.inverse-section .grid-layout.desktop-3-column'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section.hero-section--full', style: null, blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'Featured Article', selector: 'section.section.secondary-section:has(.featured-article)', style: 'secondary', blocks: ['columns-featured'], defaultContent: [] },
      { id: 'section-3', name: 'Browse by Activity', selector: 'section.section:has(.tab-container)', style: null, blocks: ['tabs-activity'], defaultContent: ['.section-heading h2'] },
      { id: 'section-4', name: 'Ticker Strip', selector: '.ticker-strip', style: 'dark', blocks: ['ticker'], defaultContent: [] },
      { id: 'section-5', name: 'Start Here', selector: 'section.section.inverse-section:has(.hero-eyebrow)', style: 'dark, narrow', blocks: [], defaultContent: ['.hero-eyebrow', 'h2.h2-heading', 'p.paragraph-lg', '.button-group'] },
      { id: 'section-6', name: 'Quick Answers', selector: 'section.section:has(.faq-list)', style: null, blocks: ['accordion-faq'], defaultContent: ['.section-heading h2', '.section-heading .text-button'] },
      { id: 'section-7', name: 'How We Work', selector: 'section.section.secondary-section:has(.editorial-index)', style: 'secondary, narrow', blocks: ['columns-numbered'], defaultContent: ['.section-heading h2'] },
      { id: 'section-8', name: 'In the Field', selector: 'section.section.inverse-section:has(.gallery-img)', style: 'dark', blocks: ['columns-gallery'], defaultContent: ['.section-heading h2', '.section-heading .text-button', '.utility-margin-top-lg .gallery-img--wide'] },
      { id: 'section-9', name: 'CTA Banner', selector: 'section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['h2.h2-heading', 'p.paragraph-xl', '.button-group'] },
    ],
  },
  {
    name: 'hub-landing-page',
    urls: ['https://gabrielwalt.github.io/wknd/adventures.html'],
    description: 'Category hub page with hero, featured spotlight, category cards/grid, educational content, and cross-promotion links',
    blocks: [
      { name: 'hero', instances: ['section.hero-section.hero-section--full'] },
      { name: 'columns-featured', instances: ['.featured-article'] },
      { name: 'tabs-activity', instances: ['.tab-container.tab-container--wide'] },
      { name: 'columns-numbered', instances: ['.editorial-index'] },
      { name: 'cards-article', instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'] },
      { name: 'columns-promo', instances: ['.grid-layout.grid-layout--2col'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section.hero-section--full', style: 'dark', blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'Accent Banner', selector: 'section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['h2.h2-heading', 'p.paragraph-xl'] },
      { id: 'section-3', name: 'Featured Article', selector: 'section.section.secondary-section:has(.featured-article)', style: 'secondary', blocks: ['columns-featured'], defaultContent: [] },
      { id: 'section-4', name: 'Browse by Activity', selector: 'section.section:has(.tab-container)', style: null, blocks: ['tabs-activity'], defaultContent: ['h2.section-heading'] },
      { id: 'section-5', name: 'Choosing Your Adventure', selector: 'section.section.secondary-section:has(.container--narrow):not(:has(.featured-article)):not(:has(.editorial-index))', style: 'secondary', blocks: [], defaultContent: ['h2.h2-heading', 'p.paragraph-lg'] },
      { id: 'section-6', name: 'Recent Reports', selector: 'section.section:has(.grid-gap-lg > .article-card)', style: null, blocks: ['cards-article'], defaultContent: ['h2.section-heading'] },
      { id: 'section-7', name: 'Adventure by Skill Level', selector: 'section.section.secondary-section:has(.editorial-index)', style: 'secondary', blocks: ['columns-numbered', 'columns-promo'], defaultContent: ['h2.section-heading'] },
      { id: 'section-8', name: 'Gear CTA', selector: 'section.section.inverse-section', style: 'dark', blocks: [], defaultContent: ['h2.h2-heading', 'p.paragraph-lg', 'a.button'] },
    ],
  },
  {
    name: 'editorial-section-page',
    urls: ['https://gabrielwalt.github.io/wknd/field-notes'],
    description: 'Editorial section page with hero, featured story, editorial philosophy, and engagement CTAs',
    blocks: [
      { name: 'hero', instances: ['section.hero-section'] },
      { name: 'columns-featured', instances: ['.featured-article'] },
      { name: 'columns-promo', instances: ['.grid-layout.grid-layout--2col'] },
      { name: 'tabs-activity', instances: ['.tab-container.tab-container--wide'] },
      { name: 'columns-numbered', instances: ['.editorial-index'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section', style: 'dark', blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'Statement', selector: 'section.section.inverse-section:has(.container--centered):not(:has(.editorial-index))', style: 'dark', blocks: [], defaultContent: ['h2.h2-heading', 'p.paragraph-xl'] },
      { id: 'section-2b', name: 'Numbered Principles', selector: 'section.section:has(.editorial-index)', style: null, blocks: ['columns-numbered'], defaultContent: ['h2.section-heading', 'h2.h2-heading'] },
      { id: 'section-3', name: 'Featured Article', selector: 'section.section.secondary-section:has(.featured-article)', style: 'secondary', blocks: ['columns-featured'], defaultContent: [] },
      { id: 'section-4', name: 'Editorial Content', selector: 'section.section.inverse-section:has(.container--narrow:not(.container--centered))', style: 'dark', blocks: [], defaultContent: ['h2.h2-heading', 'p.paragraph-lg'] },
      { id: 'section-5', name: 'Promo Cards', selector: 'section.section.secondary-section:has(.grid-layout--2col)', style: 'secondary', blocks: ['columns-promo'], defaultContent: [] },
      { id: 'section-6', name: 'Essential Reading', selector: 'section.section:has(.tab-container)', style: null, blocks: ['tabs-activity'], defaultContent: ['h2.h2-heading'] },
      { id: 'section-7', name: 'CTA', selector: 'section.section.inverse-section:last-of-type', style: 'dark', blocks: [], defaultContent: ['h2.h2-heading', 'p.paragraph-lg', 'a.button'] },
    ],
  },
  {
    name: 'community-page',
    urls: ['https://gabrielwalt.github.io/wknd/community.html'],
    description: 'Community page with hero, featured reader story, submission guidelines, dispatches, editorial standards, FAQ, and CTA',
    blocks: [
      { name: 'hero', instances: ['section.hero-section'] },
      { name: 'columns-featured', instances: ['.featured-article'] },
      { name: 'columns-numbered', instances: ['.editorial-index'] },
      { name: 'cards-article', instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'] },
      { name: 'columns-promo', instances: ['.accent-section .grid-layout.tablet-1-column:has(.card)'] },
      { name: 'accordion-faq', instances: ['.faq-list'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section', style: 'dark', blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'Statement', selector: 'section:nth-of-type(2)', style: 'dark', blocks: [], defaultContent: ['h2', 'p'] },
      { id: 'section-3', name: 'Featured Story + How to Submit', selector: 'section:nth-of-type(3)', style: 'secondary', blocks: ['columns-featured', 'columns-numbered'], defaultContent: [] },
      { id: 'section-4', name: 'From the Wild', selector: 'section:nth-of-type(4)', style: null, blocks: ['cards-article'], defaultContent: ['h2', 'p'] },
      { id: 'section-5', name: 'Reader Dispatches', selector: 'section:nth-of-type(5)', style: 'secondary', blocks: ['columns-featured', 'cards-article'], defaultContent: ['h2', 'p'] },
      { id: 'section-6', name: 'What Makes a Great Dispatch', selector: 'section:nth-of-type(6)', style: 'dark', blocks: [], defaultContent: ['h2', 'p'] },
      { id: 'section-7', name: 'Join In', selector: 'section:nth-of-type(7)', style: 'accent', blocks: ['columns-promo'], defaultContent: ['h2'] },
      { id: 'section-8', name: 'Submission FAQ', selector: 'section:nth-of-type(8)', style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
      { id: 'section-9', name: 'CTA', selector: 'section:nth-of-type(9)', style: 'dark', blocks: [], defaultContent: ['h2', '.button-group'] },
    ],
  },
  {
    name: 'sustainability-page',
    urls: ['https://gabrielwalt.github.io/wknd/sustainability.html'],
    description: 'Sustainability page with hero, wild ethics principles, featured story, topic tabs, editorial content, ethics guidelines, articles, practical steps, pledge, and CTA',
    blocks: [
      { name: 'hero', instances: ['section.hero-section'] },
      { name: 'columns-numbered', instances: ['.editorial-index'] },
      { name: 'columns-featured', instances: ['.featured-article'] },
      { name: 'tabs-team', instances: ['section.section:has(.tab-menu)'] },
      { name: 'cards-feature', instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)'] },
      { name: 'cards-article', instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section', style: 'dark', blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'Wild Ethics', selector: 'section:nth-of-type(2)', style: 'secondary', blocks: ['columns-numbered'], defaultContent: ['h2'] },
      { id: 'section-3', name: 'Featured Story', selector: 'section:nth-of-type(3)', style: 'secondary', blocks: ['columns-featured'], defaultContent: [] },
      { id: 'section-4', name: 'By Topic', selector: 'section:nth-of-type(4)', style: null, blocks: ['tabs-team'], defaultContent: ['h2'] },
      { id: 'section-5', name: 'The Adventurer\'s Responsibility', selector: 'section:nth-of-type(5)', style: null, blocks: [], defaultContent: ['h2', 'p'] },
      { id: 'section-6', name: 'The WKND Wild Ethics', selector: 'section:nth-of-type(6)', style: 'secondary', blocks: ['cards-feature'], defaultContent: ['h2'] },
      { id: 'section-7', name: 'Places That Need Our Care', selector: 'section:nth-of-type(7)', style: 'secondary', blocks: ['cards-article'], defaultContent: ['h2'] },
      { id: 'section-8', name: 'Practical Steps', selector: 'section:nth-of-type(8)', style: 'accent', blocks: [], defaultContent: ['h2', 'p', 'ul'] },
      { id: 'section-9', name: 'This Is Not Optional', selector: 'section:nth-of-type(9)', style: 'dark', blocks: [], defaultContent: ['h2', 'p', 'blockquote'] },
      { id: 'section-10', name: 'CTA', selector: 'section:nth-of-type(10)', style: 'accent', blocks: [], defaultContent: ['h2', '.button-group'] },
    ],
  },
  {
    name: 'about-page',
    urls: ['https://gabrielwalt.github.io/wknd/about.html'],
    description: 'About page with hero, statement, origin story, values, team profiles, editorial standard, funding, editor picks, and CTA',
    blocks: [
      { name: 'hero', instances: ['section.hero-section'] },
      { name: 'columns-about', instances: ['.grid-layout.grid-gap-xxl.tablet-1-column'] },
      { name: 'cards-feature', instances: ['.inverse-section .grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)'] },
      { name: 'tabs-team', instances: ['section.section:has(.tab-menu)'] },
      { name: 'cards-article', instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section', style: 'dark', blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'Statement', selector: 'section.section.accent-section:has(> div.container--narrow)', style: 'accent', blocks: [], defaultContent: ['h2.h2-heading', 'p.paragraph-xl'] },
      { id: 'section-3', name: 'How It Started', selector: 'section.section:has(.grid-gap-xxl)', style: null, blocks: ['columns-about'], defaultContent: [] },
      { id: 'section-4', name: 'What We Believe', selector: 'section.section.inverse-section:has(.feature-card)', style: 'dark', blocks: ['cards-feature'], defaultContent: ['h2.h2-heading'] },
      { id: 'section-5', name: 'The Team', selector: 'section.section:has(.tab-menu)', style: null, blocks: ['tabs-team'], defaultContent: ['h2.h2-heading'] },
      { id: 'section-6', name: 'Editorial Standard', selector: 'section.section.secondary-section', style: 'secondary', blocks: [], defaultContent: ['h2.h2-heading', 'p'] },
      { id: 'section-7', name: 'How We Fund Our Work', selector: 'section.section.inverse-section:not(:has(.feature-card))', style: 'dark', blocks: [], defaultContent: ['h2.h2-heading', 'p'] },
      { id: 'section-8', name: 'From Our Editors', selector: 'section.section:has(.article-card)', style: null, blocks: ['cards-article'], defaultContent: ['h2.h2-heading'] },
      { id: 'section-9', name: 'CTA', selector: 'section.section.accent-section:not(:has(> div.container--narrow))', style: 'accent', blocks: [], defaultContent: ['h2.h2-heading', 'p', '.button-group'] },
    ],
  },
  {
    name: 'faq-page',
    urls: ['https://gabrielwalt.github.io/wknd/faq.html'],
    description: 'FAQ page with hero, category cards, alternating FAQ accordion sections, popular articles, and CTA',
    blocks: [
      { name: 'hero', instances: ['section.hero-section'] },
      { name: 'columns-promo', instances: ['.accent-section .grid-layout.tablet-1-column:has(.card)'] },
      { name: 'accordion-faq', instances: ['.faq-list'] },
      { name: 'cards-article', instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section', style: 'dark', blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'FAQ Categories', selector: 'section.section.accent-section', style: 'accent', blocks: ['columns-promo'], defaultContent: [] },
      { id: 'section-3', name: 'Planning & Adventures FAQ', selector: 'section:nth-of-type(3)', style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
      { id: 'section-4', name: 'Contributing Stories FAQ', selector: 'section:nth-of-type(4)', style: 'secondary', blocks: ['accordion-faq'], defaultContent: ['h2'] },
      { id: 'section-5', name: 'Planning Your Trip FAQ', selector: 'section:nth-of-type(5)', style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
      { id: 'section-6', name: 'About WKND Content FAQ', selector: 'section:nth-of-type(6)', style: 'secondary', blocks: ['accordion-faq'], defaultContent: ['h2'] },
      { id: 'section-7', name: 'Contributing & Community FAQ', selector: 'section:nth-of-type(7)', style: null, blocks: ['accordion-faq'], defaultContent: ['h2'] },
      { id: 'section-8', name: 'Popular Starting Points', selector: 'section:nth-of-type(8)', style: 'secondary', blocks: ['cards-article'], defaultContent: ['h2'] },
      { id: 'section-9', name: 'CTA', selector: 'section.section.inverse-section', style: 'dark', blocks: [], defaultContent: ['h2', 'p', '.button-group'] },
    ],
  },
  {
    name: 'destinations-page',
    urls: ['https://gabrielwalt.github.io/wknd/destinations.html'],
    description: 'Destinations page with hero, flagship expedition, article cards, editorial indexes, tabbed content, checklist, and CTAs',
    blocks: [
      { name: 'hero', instances: ['section.hero-section'] },
      { name: 'cards-article', instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)'] },
      { name: 'columns-numbered', instances: ['.editorial-index'] },
      { name: 'tabs-activity', instances: ['.tab-container.tab-container--wide'] },
      { name: 'columns-promo', instances: ['.grid-layout.grid-layout--2col:has(.card)'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section', style: 'dark', blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'Flagship Expedition', selector: 'section:nth-of-type(2)', style: 'accent', blocks: [], defaultContent: ['h2', 'p'] },
      { id: 'section-3', name: 'Our Expeditions', selector: 'section:nth-of-type(3)', style: null, blocks: ['cards-article'], defaultContent: ['h2'] },
      { id: 'section-4', name: 'What an Expedition Demands', selector: 'section:nth-of-type(4)', style: 'secondary', blocks: ['columns-numbered'], defaultContent: ['h2', 'p'] },
      { id: 'section-5', name: 'Full Accounts', selector: 'section:nth-of-type(5)', style: null, blocks: ['tabs-activity'], defaultContent: ['h2'] },
      { id: 'section-6', name: 'The Gear You\'ll Actually Need', selector: 'section:nth-of-type(6)', style: 'secondary', blocks: ['columns-numbered'], defaultContent: ['h2'] },
      { id: 'section-7', name: 'Pre-Departure Checklist', selector: 'section:nth-of-type(7)', style: 'accent', blocks: [], defaultContent: ['h2', 'ul', '.button-group'] },
      { id: 'section-8', name: 'What\'s Next', selector: 'section:nth-of-type(8)', style: 'dark', blocks: [], defaultContent: ['h2', 'p'] },
      { id: 'section-9', name: 'Two-Card CTA', selector: 'section:nth-of-type(9)', style: 'dark', blocks: ['columns-promo'], defaultContent: [] },
    ],
  },
  {
    name: 'expedition-gear-page',
    urls: [
      'https://gabrielwalt.github.io/wknd/expeditions.html',
      'https://gabrielwalt.github.io/wknd/gear.html',
    ],
    description: 'Expedition/gear page with hero, tagline, featured article, activity tabs, wide content tabs, editorial index, gear lists, feature cards, and CTA',
    blocks: [
      { name: 'hero', instances: ['section.hero-section'] },
      { name: 'columns-featured', instances: ['.featured-article'] },
      { name: 'tabs', instances: ['section.section:not(:has(.tab-container)):has(.tab-menu)'] },
      { name: 'tabs-activity', instances: ['.tab-container.tab-container--wide'] },
      { name: 'columns-numbered', instances: ['.editorial-index'] },
      { name: 'cards-feature', instances: ['.grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)'] },
    ],
    sections: [
      { id: 'section-1', name: 'Hero', selector: 'section.hero-section', style: 'dark', blocks: ['hero'], defaultContent: [] },
      { id: 'section-2', name: 'Accent Tagline', selector: 'section:nth-of-type(2)', style: 'accent', blocks: [], defaultContent: ['h2', 'p'] },
      { id: 'section-3', name: 'Featured Article', selector: 'section:nth-of-type(3)', style: 'secondary', blocks: ['columns-featured'], defaultContent: [] },
      { id: 'section-4', name: 'Activity Tabs', selector: 'section:nth-of-type(4)', style: null, blocks: ['tabs'], defaultContent: ['h2'] },
      { id: 'section-5', name: 'Wide Tabs + Editorial', selector: 'section:nth-of-type(5)', style: 'secondary', blocks: ['tabs-activity'], defaultContent: ['h2', 'p'] },
      { id: 'section-6', name: 'Editorial Index', selector: 'section:nth-of-type(6)', style: null, blocks: ['columns-numbered'], defaultContent: ['h2'] },
      { id: 'section-7', name: 'Gear Lists', selector: 'section:nth-of-type(7)', style: 'secondary', blocks: [], defaultContent: ['h2', 'h3', 'p', 'ul'] },
      { id: 'section-8', name: 'Feature Cards', selector: 'section:nth-of-type(8)', style: 'dark', blocks: ['cards-feature'], defaultContent: ['h2'] },
      { id: 'section-9', name: 'CTA', selector: 'section:nth-of-type(9)', style: 'accent', blocks: [], defaultContent: ['h2', 'p', '.button-group'] },
    ],
  },
  {
    name: 'blog-article',
    urls: [
      'https://gabrielwalt.github.io/wknd/blog/patagonia-trek.html',
      'https://gabrielwalt.github.io/wknd/blog/kayaking-norway.html',
      'https://gabrielwalt.github.io/wknd/blog/alpine-cycling.html',
      'https://gabrielwalt.github.io/wknd/blog/yosemite-rock-climbing.html',
      'https://gabrielwalt.github.io/wknd/blog/mountain-photography.html',
      'https://gabrielwalt.github.io/wknd/blog/ultralight-backpacking.html',
    ],
    description: 'Long-form blog article with hero image, metadata tags, day-by-day narrative, inline images, author attribution, and related links',
    blocks: [
      { name: 'hero-article', instances: ['section.hero-section'] },
      { name: 'columns-sidebar', instances: ['.secondary-section .grid-layout.desktop-3-column.grid-align-center'] },
      { name: 'columns-gallery', instances: ['.inverse-section .grid-layout.desktop-3-column'] },
      { name: 'cards-article', instances: ['section.section:last-of-type:not(.inverse-section) .grid-layout.desktop-3-column'] },
    ],
    sections: [
      { id: 'section-1', name: 'Article Hero', selector: 'section.hero-section', style: 'dark', blocks: ['hero-article'], defaultContent: [] },
      { id: 'section-2', name: 'Article Body', selector: 'section.section.blog-article-section', style: null, blocks: [], defaultContent: ['.blog-content.blog-content-body'] },
      { id: 'section-3', name: 'Sidebar Summary', selector: 'section.section.secondary-section', style: 'secondary', blocks: ['columns-sidebar'], defaultContent: [] },
      { id: 'section-4', name: 'In the Field Gallery', selector: 'section.section.inverse-section', style: 'dark', blocks: ['columns-gallery'], defaultContent: ['.section-heading h2', '.section-heading .text-button', '.utility-margin-top-lg .gallery-img--wide'] },
      { id: 'section-5', name: 'More Stories', selector: 'section.section:last-of-type:not(.inverse-section)', style: null, blocks: ['cards-article'], defaultContent: ['h2.section-heading'] },
    ],
  },
];

/**
 * Normalize a URL for matching: strip trailing slash, .html extension, and query/hash
 */
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    let path = u.pathname.replace(/\/$/, '').replace(/\.html$/, '');
    return `${u.origin}${path}`;
  } catch {
    return url;
  }
}

/**
 * Find the matching template for a given URL.
 * First tries exact URL match, then falls back to path-prefix matching for blog articles.
 */
function findTemplate(url) {
  const normalized = normalizeUrl(url);

  // Exact URL match
  for (const template of TEMPLATES) {
    for (const templateUrl of template.urls) {
      if (normalizeUrl(templateUrl) === normalized) {
        return template;
      }
    }
  }

  // Path-prefix match (e.g., /blog/* → blog-article)
  try {
    const u = new URL(url);
    const path = u.pathname;
    for (const template of TEMPLATES) {
      for (const templateUrl of template.urls) {
        const tu = new URL(templateUrl);
        const tPath = tu.pathname.replace(/[^/]*$/, ''); // directory part
        if (tPath.length > 1 && path.startsWith(tPath) && u.origin === tu.origin) {
          return template;
        }
      }
    }
  } catch { /* ignore */ }

  console.warn(`No template found for URL: ${url}`);
  return null;
}

/**
 * Find all blocks on the page based on a template's block definitions
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload, template) {
  const transformers = [
    wkndCleanupTransformer,
    ...(template.sections && template.sections.length > 1 ? [wkndSectionsTransformer] : []),
  ];

  const enhancedPayload = {
    ...payload,
    template,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const originalURL = params.originalURL || url;

    // 1. Find the matching template for this URL
    const template = findTemplate(originalURL);
    if (!template) {
      console.error(`No template matched for ${originalURL}. Returning raw body.`);
      return [{
        element: document.body,
        path: WebImporter.FileUtils.sanitizePath(
          new URL(originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
        ),
      }];
    }

    console.log(`Matched template: ${template.name} for ${originalURL}`);

    const main = document.body;

    // 2. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload, template);

    // 3. Find blocks on page using the matched template
    const pageBlocks = findBlocksOnPage(document, template);

    // 4. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 5. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload, template);

    // 6. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url);

    // 7. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: template.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
