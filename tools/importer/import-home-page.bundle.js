var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home-page.js
  var import_home_page_exports = {};
  __export(import_home_page_exports, {
    default: () => import_home_page_default
  });

  // tools/importer/parsers/hero-scholastic.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".cmp-compoundheader__hero > img, .cmp-compoundheader__hero img:first-of-type, .cmp-compoundheader__floatingImage img");
    const heading = element.querySelector(".cmp-compoundheader__headerTitle h2, .cmp-compoundheader__headerTitle .cmp-title__text");
    const ctaLink = element.querySelector(".cmp-compoundheader__actionLink a.cmp-title__link, .cmp-compoundheader__actionLink a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const wrapper = document.createElement("div");
    if (heading) wrapper.append(heading);
    if (ctaLink) {
      const p = document.createElement("p");
      p.append(ctaLink);
      wrapper.append(p);
    }
    if (wrapper.childNodes.length > 0) {
      cells.push([wrapper]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-scholastic", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse2(element, { document }) {
    const heroImage = element.querySelector(".cmp-image__image, .cmp-image img, .image img");
    const heading = element.querySelector(".heading h2, .heading .cmp-title__text, h2.cmp-title__text");
    const ctaContainer = element.querySelector(".button .cmp-title a.cmp-title__link, .button a.cmp-title__link");
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    const wrapper = document.createElement("div");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      wrapper.append(h2);
    }
    if (ctaContainer) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = ctaContainer.href;
      link.textContent = ctaContainer.textContent.trim();
      p.append(link);
      wrapper.append(p);
    }
    if (wrapper.childNodes.length > 0) {
      cells.push([wrapper]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse3(element, { document }) {
    const cells = [];
    const merchCards = element.querySelectorAll(".cmp-threeCardMerchandising__merchandisingCard");
    const isClubsPromo = element.classList.contains("grid-layout") || element.querySelector(".cmp-compoundheader__clubsImage");
    if (merchCards.length > 0) {
      merchCards.forEach((card) => {
        const image = card.querySelector(".cmp-merchandisingCard__image img, .cmp-image__image");
        const parentLink = card.querySelector(":scope > a");
        const rubric = card.querySelector(".cmp-merchandisingCard__rubric .cmp-title__text");
        const title = card.querySelector(".cmp-merchandisingCard__cardTitle h3, .cmp-merchandisingCard__cardTitle .cmp-title__text");
        const desc = card.querySelector(".cmp-merchandisingCard__description p, .cmp-merchandisingCard__description .cmp-text p");
        const ctaText = card.querySelector(".cmp-merchandisingCard__actionLink .cmp-title__text");
        const textWrapper = document.createElement("div");
        if (rubric) {
          const p = document.createElement("p");
          p.textContent = rubric.textContent.trim();
          textWrapper.append(p);
        }
        if (title) {
          const h3 = document.createElement("h3");
          h3.textContent = title.textContent.trim();
          textWrapper.append(h3);
        }
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textWrapper.append(p);
        }
        if (ctaText && parentLink) {
          const p = document.createElement("p");
          const link = document.createElement("a");
          link.href = parentLink.href;
          link.textContent = ctaText.textContent.trim();
          p.append(link);
          textWrapper.append(p);
        }
        if (image) {
          cells.push([image, textWrapper]);
        } else {
          cells.push([textWrapper]);
        }
      });
    } else if (isClubsPromo) {
      const logoImage = element.querySelector(".cmp-compoundheader__logoImage, .cmp-compoundheader__clubsImage img");
      const clubsText = element.querySelector(".cmp-compoundheader__clubsText p, .cmp-compoundheader__clubsText .cmp-text p");
      const ctaLink = element.querySelector(".cmp-compoundheader__button a.cmp-title__link");
      const textWrapper = document.createElement("div");
      if (clubsText) {
        const p = document.createElement("p");
        p.textContent = clubsText.textContent.trim();
        textWrapper.append(p);
      }
      if (ctaLink) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.href = ctaLink.href;
        link.textContent = ctaLink.textContent.trim();
        p.append(link);
        textWrapper.append(p);
      }
      if (logoImage) {
        cells.push([logoImage, textWrapper]);
      } else {
        cells.push([textWrapper]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse4(element, { document }) {
    const cells = [];
    const isLobCarousel = element.classList.contains("lobCarousel") || element.querySelector(".cmp-lobCarousel");
    const isMerchCarousel = element.querySelector(".cmp-merchandisingCarousel") || element.querySelector(".cmp-merchandisingteaser");
    if (isLobCarousel) {
      const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned) .lobTeaser");
      slides.forEach((slide) => {
        const logoImg = slide.querySelector(".cmp-lobTeaser__logo img");
        const description = slide.querySelector(".cmp-lobTeaser__description p");
        const ctaLink = slide.querySelector(".cmp-lobTeaser__button a.cmp-title__link");
        const textWrapper = document.createElement("div");
        if (description) {
          const p = document.createElement("p");
          p.textContent = description.textContent.trim();
          textWrapper.append(p);
        }
        if (ctaLink) {
          const p = document.createElement("p");
          const link = document.createElement("a");
          link.href = ctaLink.href;
          link.textContent = ctaLink.textContent.trim();
          p.append(link);
          textWrapper.append(p);
        }
        if (logoImg) {
          cells.push([logoImg, textWrapper]);
        } else {
          cells.push([textWrapper]);
        }
      });
    } else if (isMerchCarousel) {
      const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned) .cmp-merchandisingteaser");
      slides.forEach((slide) => {
        const image = slide.querySelector(".cmp-merchandisingteaser__image img, .cmp-image__image");
        const titleEl = slide.querySelector(".cmp-merchandisingteaser__title h3, .cmp-merchandisingteaser__title .cmp-title__text");
        const parentLink = slide.querySelector(".cmp-merchandisingteaser__content > a");
        const textWrapper = document.createElement("div");
        if (titleEl) {
          const h3 = document.createElement("h3");
          h3.textContent = titleEl.textContent.trim();
          if (parentLink) {
            const link = document.createElement("a");
            link.href = parentLink.href;
            link.textContent = titleEl.textContent.trim();
            h3.textContent = "";
            h3.append(link);
          }
          textWrapper.append(h3);
        }
        if (image) {
          cells.push([image, textWrapper]);
        } else if (textWrapper.childNodes.length > 0) {
          cells.push([textWrapper]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/scholastic-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-pc-sdk",
        ".onetrust-pc-dark-filter"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header#corp-home-globalNav",
        "footer#corp-home-footer",
        ".footer",
        "noscript",
        "iframe",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/scholastic-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const doc = element.ownerDocument || document;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
            if (sectionEl) break;
          } catch (e) {
          }
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-home-page.js
  var parsers = {
    "hero-scholastic": parse,
    "hero-promo": parse2,
    "cards-promo": parse3,
    "carousel-product": parse4
  };
  var PAGE_TEMPLATE = {
    name: "home-page",
    urls: [
      "https://www.scholastic.com/home"
    ],
    description: "Scholastic homepage with promotional content, featured products, and navigation to key sections",
    blocks: [
      {
        name: "hero-scholastic",
        instances: [".compoundheader .cmp-compoundheader"]
      },
      {
        name: "cards-promo",
        instances: [".cmp-compoundheader .grid-layout", ".cmp-threeCardMerchandising__cards"]
      },
      {
        name: "hero-promo",
        instances: [".responsivegrid .aem-Grid.layout-02-top.layout-02-bottom"]
      },
      {
        name: "carousel-product",
        instances: [".merchandisingcarousel:not(.bookcarousel) .cmp-merchandisingCarousel", ".bookcarousel .cmp-merchandisingCarousel", ".lobCarousel"]
      },
      {
        name: "footer",
        instances: [".footer"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: ".compoundheader",
        style: null,
        blocks: ["hero-scholastic", "cards-promo"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Teacher Promotion Banner",
        selector: ".responsivegrid .aem-Grid.layout-02-top.layout-02-bottom:first-of-type",
        style: "light",
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Scholastic TV Banner",
        selector: ".responsivegrid .aem-Grid.layout-02-top.layout-02-bottom:last-of-type",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Classroom Libraries Carousel",
        selector: ".merchandisingcarousel:not(.bookcarousel)",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: [
          ".cmp-merchandisingCarousel__rubric",
          ".cmp-merchandisingCarousel__cardTitle",
          ".cmp-merchandisingCarousel__description",
          ".cmp-merchandisingCarousel__button"
        ]
      },
      {
        id: "section-5",
        name: "Book Sets Carousel",
        selector: ".bookcarousel.merchandisingcarousel",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: [
          ".cmp-merchandisingCarousel__rubric",
          ".cmp-merchandisingCarousel__cardTitle",
          ".cmp-merchandisingCarousel__description",
          ".cmp-merchandisingCarousel__button"
        ]
      },
      {
        id: "section-6",
        name: "Don't Miss Out Cards",
        selector: ".threeCardMerchandising",
        style: "dark",
        blocks: ["cards-promo"],
        defaultContent: [
          ".cmp-threeCardMerchandising__headerTitle"
        ]
      },
      {
        id: "section-7",
        name: "LOB Carousel",
        selector: ".lobCarousel",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Footer",
        selector: ".footer",
        style: null,
        blocks: ["footer"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
              section: blockDef.section || null
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
  var import_home_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_page_exports);
})();
