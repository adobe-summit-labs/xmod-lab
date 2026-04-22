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

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    var _a;
    let bgImg = element.querySelector(".row-bg-wrap img, .row-bg img");
    if (!bgImg) {
      const bgDiv = element.querySelector('.row-bg[style*="background-image"], [data-nectar-img-src]');
      if (bgDiv) {
        const bgUrl = bgDiv.getAttribute("data-nectar-img-src") || ((_a = bgDiv.style.backgroundImage) == null ? void 0 : _a.replace(/url\(["']?([^"')]+)["']?\)/, "$1"));
        if (bgUrl) {
          bgImg = document.createElement("img");
          bgImg.src = bgUrl;
          bgImg.alt = "French fries from Idaho potatoes";
        }
      }
    }
    const heading = element.querySelector("h1");
    const descEl = element.querySelector(".nectar-responsive-text p, .wpb_content_element p");
    const ctaLinks = Array.from(element.querySelectorAll("a.gii-button"));
    const contentCell = document.createElement("div");
    if (heading) contentCell.appendChild(heading.cloneNode(true));
    if (descEl) contentCell.appendChild(descEl.cloneNode(true));
    ctaLinks.forEach((cta, i) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      if (i === 0) {
        const strong = document.createElement("strong");
        strong.appendChild(a);
        p.appendChild(strong);
      } else {
        const em = document.createElement("em");
        em.appendChild(a);
        p.appendChild(em);
      }
      contentCell.appendChild(p);
    });
    const cells = [];
    if (bgImg) cells.push([bgImg]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/feature-split.js
  function parse2(element, { document }) {
    const hasFeatureImage = element.querySelector('.img-with-aniamtion-wrap.center, .img-with-aniamtion-wrap[class*="custom-width"]');
    if (!hasFeatureImage) return;
    const productImg = element.querySelector(".img-with-aniamtion-wrap.center img, .vc_col-sm-6:first-of-type .img-with-aniamtion-wrap img");
    const rightCol = element.querySelector(".vc_col-sm-6:nth-of-type(2) .wpb_wrapper, .vc_col-sm-6 + .vc_col-sm-6 .wpb_wrapper");
    let badgeImg = null;
    if (rightCol) {
      badgeImg = rightCol.querySelector(".img-with-aniamtion-wrap img");
    }
    const heading = element.querySelector("h2");
    const descPs = rightCol ? Array.from(rightCol.querySelectorAll(".wpb_text_column p")) : [];
    const ctaLink = element.querySelector("a.gii-button");
    const contentCell = document.createElement("div");
    if (heading) contentCell.appendChild(heading.cloneNode(true));
    descPs.forEach((p) => contentCell.appendChild(p.cloneNode(true)));
    if (ctaLink) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      const a = document.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      strong.appendChild(a);
      p.appendChild(strong);
      contentCell.appendChild(p);
    }
    const cells = [];
    cells.push([productImg ? productImg.cloneNode(true) : "", badgeImg ? badgeImg.cloneNode(true) : "", contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "feature-split", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/product-slider.js
  function parse3(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".slick-slide:not(.slick-cloned)"));
    const cells = [];
    const seenProducts = /* @__PURE__ */ new Set();
    for (const slide of slides) {
      const img = slide.querySelector(".card__media img");
      const titleEl = slide.querySelector(".card__title");
      const link = slide.querySelector("a.card-product, a.card");
      if (!titleEl) continue;
      const productName = titleEl.textContent.trim();
      if (seenProducts.has(productName)) continue;
      seenProducts.add(productName);
      const imgCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || productName;
        imgCell.appendChild(newImg);
      }
      const titleCell = document.createElement("div");
      const h3 = document.createElement("h3");
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = productName;
        h3.appendChild(a);
      } else {
        h3.textContent = productName;
      }
      titleCell.appendChild(h3);
      cells.push([imgCell, titleCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "product-slider", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/recipe-cards.js
  function parse4(element, { document }) {
    const cells = [];
    const heading = element.querySelector(".wpb_text_column h2");
    const subtitle = element.querySelector(".wpb_text_column p");
    const headerCell = document.createElement("div");
    if (heading) headerCell.appendChild(heading.cloneNode(true));
    if (subtitle) headerCell.appendChild(subtitle.cloneNode(true));
    cells.push([headerCell]);
    const articles = Array.from(element.querySelectorAll("article.recipe-item"));
    for (const article of articles) {
      const img = article.querySelector(".card__media img");
      const title = article.querySelector(".card__title");
      const meta = article.querySelector(".card__meta");
      const link = article.querySelector("a.card");
      const imgCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || (title ? title.textContent.trim() : "");
        imgCell.appendChild(newImg);
      }
      const contentCell = document.createElement("div");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        contentCell.appendChild(h3);
      }
      if (meta) {
        const p = document.createElement("p");
        p.textContent = meta.textContent.trim();
        contentCell.appendChild(p);
      }
      if (link) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = "View Recipe";
        p.appendChild(a);
        contentCell.appendChild(p);
      }
      cells.push([imgCell, contentCell]);
    }
    const viewAllBtn = element.querySelector('.gii-buttons-stacked a.gii-button, a.gii-button[href*="recipes"]');
    if (viewAllBtn) {
      const footerCell = document.createElement("div");
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      const a = document.createElement("a");
      a.href = viewAllBtn.href;
      a.textContent = viewAllBtn.textContent.trim();
      strong.appendChild(a);
      p.appendChild(strong);
      footerCell.appendChild(p);
      cells.push([footerCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "recipe-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/social-feed.js
  function parse5(element, { document }) {
    const heading = element.querySelector(".instagram-header h2, h2");
    const followBtn = element.querySelector('a.gii-button[href*="instagram"]');
    const headingCell = document.createElement("div");
    if (heading) headingCell.appendChild(heading.cloneNode(true));
    const followCell = document.createElement("div");
    if (followBtn) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = followBtn.href;
      a.textContent = followBtn.textContent.trim();
      p.appendChild(a);
      followCell.appendChild(p);
    }
    const sbiItems = Array.from(element.querySelectorAll(".sbi_item"));
    const imageCells = [];
    for (const item of sbiItems) {
      const postLink = item.querySelector("a.sbi_photo");
      const img = item.querySelector('a.sbi_photo img[src*="instagram"], a.sbi_photo img[src*="sb-instagram"], a.sbi_photo img[src*=".webp"], a.sbi_photo img[src*=".jpg"], a.sbi_photo img[src*=".png"]');
      if (!postLink || !img) continue;
      const cell = document.createElement("div");
      const a = document.createElement("a");
      a.href = postLink.href;
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "Instagram post";
      a.appendChild(newImg);
      cell.appendChild(a);
      imageCells.push(cell);
    }
    const cells = [];
    cells.push([headingCell, followCell]);
    if (imageCells.length > 0) {
      cells.push(imageCells);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "social-feed", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/growninidaho-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".uwy",
        "iframe.uwif",
        ".uw-s10-bottom-ruler-guide",
        ".uw-s10-right-ruler-guide",
        ".uw-s10-left-ruler-guide",
        ".uw-s10-reading-guide",
        ".uw-s12-tooltip",
        "nav.skip-link"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "#header-space",
        "#header-outer",
        "header#top",
        ".bg-color-stripe"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#footer-outer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#slide-out-widget-area-bg",
        "#slide-out-widget-area"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#sbi_lightboxOverlay",
        "#sbi_lightbox"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "a#to-top"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/growninidaho-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        let sectionEl = null;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "feature-split": parse2,
    "product-slider": parse3,
    "recipe-cards": parse4,
    "social-feed": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template for Grown in Idaho - main landing page",
    urls: [
      "https://growninidaho.com/"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".wpb_row.top-level.first-section"]
      },
      {
        name: "feature-split",
        instances: [".wpb_row.gii-divider-beige"]
      },
      {
        name: "product-slider",
        instances: ["#slick-product-slider"]
      },
      {
        name: "recipe-cards",
        instances: [".wpb_row.gii-divider-brown"]
      },
      {
        name: "social-feed",
        instances: [".wpb_row.instagram-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: ".wpb_row.top-level.first-section",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Feature Split Section",
        selector: ".wpb_row.gii-divider-beige",
        style: "beige",
        blocks: ["feature-split"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Product Slider Section",
        selector: "#slick-product-slider",
        style: "light-beige",
        blocks: ["product-slider"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Recipe Cards Section",
        selector: ".wpb_row.gii-divider-brown",
        style: "dark-brown",
        blocks: ["recipe-cards"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Social Feed Section",
        selector: ".wpb_row.instagram-section",
        style: "light-beige",
        blocks: ["social-feed"],
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
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
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
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
