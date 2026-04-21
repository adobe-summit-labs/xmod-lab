/* eslint-disable */
/* global WebImporter */

import heroAdventureParser from './parsers/hero-adventure.js';
import featuredArticleStoryParser from './parsers/featured-article-story.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import tickerActivityParser from './parsers/ticker-activity.js';
import faqListQuickParser from './parsers/faq-list-quick.js';
import editorialIndexProcessParser from './parsers/editorial-index-process.js';
import galleryFieldParser from './parsers/gallery-field.js';

import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'hero-adventure': heroAdventureParser,
  'featured-article-story': featuredArticleStoryParser,
  'tabs-activity': tabsActivityParser,
  'ticker-activity': tickerActivityParser,
  'faq-list-quick': faqListQuickParser,
  'editorial-index-process': editorialIndexProcessParser,
  'gallery-field': galleryFieldParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage template for WKND Adventures site',
  urls: ['https://wknd-adventures.com/'],
  blocks: [
    { name: 'hero-adventure', instances: ['section.hero-section.hero-section--full'] },
    { name: 'featured-article-story', instances: ['.featured-article'] },
    { name: 'tabs-activity', instances: ['.tab-container.tab-container--wide'] },
    { name: 'ticker-activity', instances: ['div.ticker-strip'] },
    { name: 'faq-list-quick', instances: ['.faq-list'] },
    { name: 'editorial-index-process', instances: ['.editorial-index'] },
    { name: 'gallery-field', instances: ['.grid-layout.desktop-3-column.grid-images'] },
  ],
  sections: [
    { id: 'section-1-hero', name: 'Hero', selector: 'section.hero-section.hero-section--full', style: null, blocks: ['hero-adventure'], defaultContent: [] },
    { id: 'section-2-featured', name: 'Featured Article', selector: 'section.section.secondary-section:has(.featured-article)', style: 'secondary', blocks: ['featured-article-story'], defaultContent: [] },
    { id: 'section-3-browse', name: 'Browse by Activity', selector: 'section.section:has(.tab-container)', style: null, blocks: ['tabs-activity'], defaultContent: ['.section-heading h2'] },
    { id: 'section-ticker', name: 'Ticker Strip', selector: 'div.ticker-strip', style: null, blocks: ['ticker-activity'], defaultContent: [] },
    { id: 'section-4-start', name: 'Not Sure Where to Start', selector: ['section.section.inverse-section:has(.container--narrow)', 'section.section.inverse-section:nth-of-type(1)'], style: 'dark', blocks: [], defaultContent: ['.tag', 'h2', 'p', '.button-group a'] },
    { id: 'section-5-faq', name: 'Quick Answers', selector: 'section.section:has(.faq-list)', style: null, blocks: ['faq-list-quick'], defaultContent: ['.section-heading h2'] },
    { id: 'section-6-how', name: 'How We Work', selector: 'section.section.secondary-section:has(.editorial-index)', style: 'secondary', blocks: ['editorial-index-process'], defaultContent: ['.section-heading h2'] },
    { id: 'section-7-gallery', name: 'In the Field', selector: 'section.section.inverse-section:has(.grid-images)', style: 'dark', blocks: ['gallery-field'], defaultContent: ['.section-heading h2', '.section-heading a'] },
    { id: 'section-8-cta', name: 'Call to Action', selector: 'section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['h2', 'p', '.button-group a'] },
  ],
};

const transformers = [
  wkndCleanupTransformer,
  wkndSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn.call(null, hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements;
      try { elements = document.querySelectorAll(selector); }
      catch (e) { return; }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try { parser(block.element, { document, url, params }); }
        catch (e) { console.error(`Failed to parse ${block.name}:`, e); }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
