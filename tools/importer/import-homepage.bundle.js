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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-adventure.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".hero-bg img, img[alt]");
    const heading = element.querySelector(".hero-content-inner h1, h1");
    const lead = element.querySelector(".hero-content-inner .paragraph-xl, .hero-lead, .hero-content p:not(.tag)");
    const tag = element.querySelector(".hero-content-inner .tag, .hero-content p.tag");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, .hero-content a"));
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (tag) contentCell.push(tag);
    if (heading) contentCell.push(heading);
    if (lead) contentCell.push(lead);
    contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-adventure", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/featured-article-story.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".featured-article-image img, img");
    const tag = element.querySelector(".tag, p.tag");
    const heading = element.querySelector("h2");
    const description = element.querySelector("p.paragraph-lg, .utility-text-secondary");
    const cta = element.querySelector(".featured-article-footer a, a.button, a[href]");
    const imageCell = [];
    if (image) imageCell.push(image);
    const contentCell = [];
    if (tag) contentCell.push(tag);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "featured-article-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-activity.js
  function parse3(element, { document: document2 }) {
    const tabButtons = element.querySelectorAll('.tab-menu-link, [role="tab"]');
    const tabPanes = element.querySelectorAll('.tab-pane, [role="tabpanel"]');
    const fragment = document2.createDocumentFragment();
    const parentSection = element.closest(".section, section");
    if (parentSection) {
      const sectionHeading = parentSection.querySelector(".section-heading, .section-title");
      if (sectionHeading) {
        const h2 = document2.createElement("h2");
        h2.textContent = sectionHeading.textContent.trim();
        fragment.appendChild(h2);
        fragment.appendChild(document2.createElement("hr"));
        sectionHeading.remove();
      }
    }
    tabButtons.forEach((btn, i) => {
      const pane = tabPanes[i];
      if (!pane) return;
      const label = btn.textContent.trim();
      const section = document2.createElement("div");
      const h3 = document2.createElement("h3");
      h3.textContent = label;
      section.appendChild(h3);
      const articleCards = pane.querySelectorAll(".article-card");
      const cardCells = [];
      articleCards.forEach((card) => {
        const img = card.querySelector(".article-card-image img");
        const bodyCol = document2.createElement("div");
        const tag = card.querySelector(".tag");
        if (tag) {
          const tagP = document2.createElement("p");
          tagP.textContent = tag.textContent.trim();
          bodyCol.appendChild(tagP);
        }
        const heading = card.querySelector("h3, h4, h5, h6");
        if (heading) {
          const h = document2.createElement("h3");
          const href = card.getAttribute("href");
          if (href) {
            const a = document2.createElement("a");
            a.href = href;
            a.textContent = heading.textContent.trim();
            h.appendChild(a);
          } else {
            h.textContent = heading.textContent.trim();
          }
          bodyCol.appendChild(h);
        }
        const desc = card.querySelector(".article-card-body p");
        if (desc) {
          const p = document2.createElement("p");
          p.textContent = desc.textContent.trim();
          bodyCol.appendChild(p);
        }
        cardCells.push([img || "", bodyCol]);
      });
      if (cardCells.length > 0) {
        const cardsBlock = WebImporter.Blocks.createBlock(document2, {
          name: "Cards (cards-article)",
          cells: cardCells
        });
        section.appendChild(cardsBlock);
      }
      const metaTable = WebImporter.Blocks.createBlock(document2, {
        name: "Section Metadata",
        cells: [["style", "tabs"]]
      });
      section.appendChild(metaTable);
      section.appendChild(document2.createElement("hr"));
      fragment.appendChild(section);
    });
    element.replaceWith(fragment);
  }

  // tools/importer/parsers/ticker-activity.js
  function parse4(element, { document: document2 }) {
    const spans = Array.from(element.querySelectorAll(".ticker-track span:not(.ticker-sep)"));
    const seen = /* @__PURE__ */ new Set();
    const uniqueItems = [];
    spans.forEach((span) => {
      const text = span.textContent.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        uniqueItems.push(text);
      }
    });
    const container = document2.createElement("div");
    uniqueItems.forEach((item) => {
      const p = document2.createElement("p");
      p.textContent = item;
      container.appendChild(p);
    });
    const cells = [[container]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "ticker-activity", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/faq-list-quick.js
  function parse5(element, { document: document2 }) {
    const faqItems = Array.from(element.querySelectorAll(".faq-item"));
    const cells = [];
    faqItems.forEach((item) => {
      const questionBtn = item.querySelector(".faq-question span:first-child, .faq-question");
      const answerDiv = item.querySelector(".faq-answer");
      const questionText = questionBtn ? questionBtn.textContent.trim().replace(/\s*[+\-×]\s*$/, "") : "";
      const answerText = answerDiv ? answerDiv.textContent.trim() : "";
      const questionP = document2.createElement("p");
      questionP.textContent = questionText;
      const answerP = document2.createElement("p");
      answerP.textContent = answerText;
      cells.push([[questionP], [answerP]]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "faq-list-quick", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/editorial-index-process.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".editorial-index-item"));
    const cells = [];
    items.forEach((item) => {
      const numberEl = item.querySelector(".editorial-index-number, :scope > span");
      const heading = item.querySelector("h3, .h4-heading");
      const description = item.querySelector("p.paragraph-lg, p");
      const numberP = document2.createElement("p");
      numberP.textContent = numberEl ? numberEl.textContent.trim() : "";
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      cells.push([[numberP], contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "editorial-index-process", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/gallery-field.js
  function parse7(element, { document: document2 }) {
    const section = element.closest("section") || element.parentElement;
    const gridImages = Array.from(element.querySelectorAll("img"));
    const wideWrapper = section.querySelector(".utility-margin-top-lg");
    const wideImg = wideWrapper ? wideWrapper.querySelector("img") : null;
    const cells = [];
    if (gridImages.length > 0) cells.push(gridImages);
    if (wideImg) cells.push([wideImg]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "gallery-field", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        "nav",
        "header",
        '[role="navigation"]',
        ".footer",
        "footer",
        '[role="contentinfo"]',
        ".skip-link",
        '[class*="skip"]',
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll(".button-group").forEach((group) => {
        const { document: document2 } = payload;
        const labels = group.querySelectorAll(".button-label");
        if (labels.length > 0) {
          const count = labels.length;
          [...labels].forEach((label, i) => {
            const link = label.closest("a");
            const text = label.textContent.trim();
            const href = link ? link.getAttribute("href") || "" : "";
            const isGhost = link && link.classList.contains("button--ghost");
            const a = document2.createElement("a");
            a.href = href;
            a.textContent = text;
            const p = document2.createElement("p");
            if (!isGhost && (count === 1 || i === 0)) {
              const strong = document2.createElement("strong");
              strong.appendChild(a);
              p.appendChild(strong);
            } else {
              const em = document2.createElement("em");
              em.appendChild(a);
              p.appendChild(em);
            }
            group.before(p);
          });
        } else {
          const links = [...group.querySelectorAll("a")];
          links.forEach((link, i) => {
            const a = document2.createElement("a");
            a.href = link.getAttribute("href") || "";
            a.textContent = link.textContent.trim();
            const p = document2.createElement("p");
            if (links.length === 1 || i === 0) {
              const strong = document2.createElement("strong");
              strong.appendChild(a);
              p.appendChild(strong);
            } else {
              const em = document2.createElement("em");
              em.appendChild(a);
              p.appendChild(em);
            }
            group.before(p);
          });
        }
        group.remove();
      });
    }
    if (hookName === TransformHook.afterTransform) {
      const sourceUrl = payload.params && payload.params.originalURL;
      if (sourceUrl) {
        element.querySelectorAll("img").forEach((img) => {
          const src = img.getAttribute("src");
          if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("blob:")) {
            try {
              img.setAttribute("src", new URL(src, sourceUrl).href);
            } catch (e) {
            }
          }
        });
      }
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var STYLE_MAP = {
    "inverse-section": "dark",
    "secondary-section": "secondary",
    "accent-section": "accent",
    "hero-section": "dark"
  };
  var COMPOUND_MAP = {
    "container--narrow": "narrow",
    "utility-text-align-center": "center",
    "text-center": "center"
  };
  function detectSectionStyle(sectionEl) {
    let style = null;
    for (const [cssClass, edsStyle] of Object.entries(STYLE_MAP)) {
      if (sectionEl.classList.contains(cssClass)) {
        style = edsStyle;
        break;
      }
    }
    const compounds = [];
    for (const [childClass, modifier] of Object.entries(COMPOUND_MAP)) {
      if (sectionEl.querySelector(`.${childClass}`)) {
        compounds.push(modifier);
      }
    }
    const unique = [...new Set(compounds)];
    if (style && unique.length > 0) {
      return `${style}, ${unique.join(", ")}`;
    }
    if (style) return style;
    if (unique.length > 0) return unique.join(", ");
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const sections = element.querySelectorAll("section");
    if (sections.length === 0) return;
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = sections[i];
      const style = detectSectionStyle(sectionEl);
      if (style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style }
        });
        sectionEl.after(metaBlock);
      }
      if (i > 0) {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-adventure": parse,
    "featured-article-story": parse2,
    "tabs-activity": parse3,
    "ticker-activity": parse4,
    "faq-list-quick": parse5,
    "editorial-index-process": parse6,
    "gallery-field": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template for WKND Adventures site",
    urls: ["https://wknd-adventures.com/"],
    blocks: [
      { name: "hero-adventure", instances: ["section.hero-section.hero-section--full"] },
      { name: "featured-article-story", instances: [".featured-article"] },
      { name: "tabs-activity", instances: [".tab-container.tab-container--wide"] },
      { name: "ticker-activity", instances: ["div.ticker-strip"] },
      { name: "faq-list-quick", instances: [".faq-list"] },
      { name: "editorial-index-process", instances: [".editorial-index"] },
      { name: "gallery-field", instances: [".grid-layout.desktop-3-column.grid-images"] }
    ],
    sections: [
      { id: "section-1-hero", name: "Hero", selector: "section.hero-section.hero-section--full", style: null, blocks: ["hero-adventure"], defaultContent: [] },
      { id: "section-2-featured", name: "Featured Article", selector: "section.section.secondary-section:has(.featured-article)", style: "secondary", blocks: ["featured-article-story"], defaultContent: [] },
      { id: "section-3-browse", name: "Browse by Activity", selector: "section.section:has(.tab-container)", style: null, blocks: ["tabs-activity"], defaultContent: [".section-heading h2"] },
      { id: "section-ticker", name: "Ticker Strip", selector: "div.ticker-strip", style: null, blocks: ["ticker-activity"], defaultContent: [] },
      { id: "section-4-start", name: "Not Sure Where to Start", selector: ["section.section.inverse-section:has(.container--narrow)", "section.section.inverse-section:nth-of-type(1)"], style: "dark", blocks: [], defaultContent: [".tag", "h2", "p", ".button-group a"] },
      { id: "section-5-faq", name: "Quick Answers", selector: "section.section:has(.faq-list)", style: null, blocks: ["faq-list-quick"], defaultContent: [".section-heading h2"] },
      { id: "section-6-how", name: "How We Work", selector: "section.section.secondary-section:has(.editorial-index)", style: "secondary", blocks: ["editorial-index-process"], defaultContent: [".section-heading h2"] },
      { id: "section-7-gallery", name: "In the Field", selector: "section.section.inverse-section:has(.grid-images)", style: "dark", blocks: ["gallery-field"], defaultContent: [".section-heading h2", ".section-heading a"] },
      { id: "section-8-cta", name: "Call to Action", selector: "section.section.accent-section", style: "accent", blocks: [], defaultContent: ["h2", "p", ".button-group a"] }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        let elements;
        try {
          elements = document2.querySelectorAll(selector);
        } catch (e) {
          return;
        }
        elements.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name}:`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
