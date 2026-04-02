/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroScholasticParser from './parsers/hero-scholastic.js';
import heroPromoParser from './parsers/hero-promo.js';
import cardsPromoParser from './parsers/cards-promo.js';
import carouselProductParser from './parsers/carousel-product.js';

// TRANSFORMER IMPORTS
import scholasticCleanupTransformer from './transformers/scholastic-cleanup.js';
import scholasticSectionsTransformer from './transformers/scholastic-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-scholastic': heroScholasticParser,
  'hero-promo': heroPromoParser,
  'cards-promo': cardsPromoParser,
  'carousel-product': carouselProductParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'home-page',
  urls: [
    'https://www.scholastic.com/home',
  ],
  description: 'Scholastic homepage with promotional content, featured products, and navigation to key sections',
  blocks: [
    {
      name: 'hero-scholastic',
      instances: ['.compoundheader .cmp-compoundheader'],
    },
    {
      name: 'cards-promo',
      instances: ['.cmp-compoundheader .grid-layout', '.cmp-threeCardMerchandising__cards'],
    },
    {
      name: 'hero-promo',
      instances: ['.responsivegrid .aem-Grid.layout-02-top.layout-02-bottom'],
    },
    {
      name: 'carousel-product',
      instances: ['.merchandisingcarousel:not(.bookcarousel) .cmp-merchandisingCarousel', '.bookcarousel .cmp-merchandisingCarousel', '.lobCarousel'],
    },
    {
      name: 'footer',
      instances: ['.footer'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      selector: '.compoundheader',
      style: null,
      blocks: ['hero-scholastic', 'cards-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Teacher Promotion Banner',
      selector: '.responsivegrid .aem-Grid.layout-02-top.layout-02-bottom:first-of-type',
      style: 'light',
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Scholastic TV Banner',
      selector: '.responsivegrid .aem-Grid.layout-02-top.layout-02-bottom:last-of-type',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Classroom Libraries Carousel',
      selector: '.merchandisingcarousel:not(.bookcarousel)',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [
        '.cmp-merchandisingCarousel__rubric',
        '.cmp-merchandisingCarousel__cardTitle',
        '.cmp-merchandisingCarousel__description',
        '.cmp-merchandisingCarousel__button',
      ],
    },
    {
      id: 'section-5',
      name: 'Book Sets Carousel',
      selector: '.bookcarousel.merchandisingcarousel',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [
        '.cmp-merchandisingCarousel__rubric',
        '.cmp-merchandisingCarousel__cardTitle',
        '.cmp-merchandisingCarousel__description',
        '.cmp-merchandisingCarousel__button',
      ],
    },
    {
      id: 'section-6',
      name: "Don't Miss Out Cards",
      selector: '.threeCardMerchandising',
      style: 'dark',
      blocks: ['cards-promo'],
      defaultContent: [
        '.cmp-threeCardMerchandising__headerTitle',
      ],
    },
    {
      id: 'section-7',
      name: 'LOB Carousel',
      selector: '.lobCarousel',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Footer',
      selector: '.footer',
      style: null,
      blocks: ['footer'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  scholasticCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [scholasticSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
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
 * Find all blocks on the page based on embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
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
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`, e);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
