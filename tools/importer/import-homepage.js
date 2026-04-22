/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import featureSplitParser from './parsers/feature-split.js';
import productSliderParser from './parsers/product-slider.js';
import recipeCardsParser from './parsers/recipe-cards.js';
import socialFeedParser from './parsers/social-feed.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/growninidaho-cleanup.js';
import sectionsTransformer from './transformers/growninidaho-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'feature-split': featureSplitParser,
  'product-slider': productSliderParser,
  'recipe-cards': recipeCardsParser,
  'social-feed': socialFeedParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage template for Grown in Idaho - main landing page',
  urls: [
    'https://growninidaho.com/',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.wpb_row.top-level.first-section'],
    },
    {
      name: 'feature-split',
      instances: ['.wpb_row.gii-divider-beige'],
    },
    {
      name: 'product-slider',
      instances: ['#slick-product-slider'],
    },
    {
      name: 'recipe-cards',
      instances: ['.wpb_row.gii-divider-brown'],
    },
    {
      name: 'social-feed',
      instances: ['.wpb_row.instagram-section'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      selector: '.wpb_row.top-level.first-section',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Feature Split Section',
      selector: '.wpb_row.gii-divider-beige',
      style: 'beige',
      blocks: ['feature-split'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Product Slider Section',
      selector: '#slick-product-slider',
      style: 'light-beige',
      blocks: ['product-slider'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Recipe Cards Section',
      selector: '.wpb_row.gii-divider-brown',
      style: 'dark-brown',
      blocks: ['recipe-cards'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Social Feed Section',
      selector: '.wpb_row.instagram-section',
      style: 'light-beige',
      blocks: ['social-feed'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
