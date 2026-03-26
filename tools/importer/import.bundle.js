var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import.js
  var import_exports = {};
  __export(import_exports, {
    default: () => import_default
  });

  // tools/importer/parsers/hero-full.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".hero-bg img");
    const eyebrow = element.querySelector(".hero-eyebrow");
    const heading = element.querySelector("h1, .h1-heading");
    const description = element.querySelector(".hero-lead, .paragraph-xl");
    const ctaLinks = element.querySelectorAll(".button-group a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    ctaLinks.forEach((link) => {
      const label = link.querySelector(".button-label");
      if (label) {
        link.textContent = label.textContent.trim();
      }
      contentCell.push(link);
    });
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-article.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const bgImg = element.querySelector(".hero-bg img");
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentWrapper = document2.createElement("div");
    const breadcrumbs = element.querySelector(".breadcrumbs");
    if (breadcrumbs) {
      const breadcrumbP = document2.createElement("p");
      const links = breadcrumbs.querySelectorAll("a");
      const spans = breadcrumbs.querySelectorAll("span:not(:empty)");
      const parts = [];
      breadcrumbs.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
          const text = node.textContent.trim();
          if (text) parts.push(text);
        } else if (node.tagName === "A") {
          const a = node.cloneNode(true);
          parts.push(a.outerHTML);
        } else if (node.tagName === "SPAN" && node.textContent.trim()) {
          parts.push(node.textContent.trim());
        }
      });
      breadcrumbP.innerHTML = parts.join(" ");
      contentWrapper.appendChild(breadcrumbP);
    }
    const tagEl = element.querySelector(".tag.blog-hero-tag");
    if (tagEl) {
      const tagP = document2.createElement("p");
      tagP.textContent = tagEl.textContent.trim();
      contentWrapper.appendChild(tagP);
    }
    const h1 = element.querySelector("h1");
    if (h1) {
      const heading = document2.createElement("h1");
      heading.textContent = h1.textContent.trim();
      contentWrapper.appendChild(heading);
    }
    const byline = element.querySelector(".article-byline");
    if (byline) {
      const bylineDiv = document2.createElement("div");
      const avatar = byline.querySelector(".avatar img");
      if (avatar) {
        bylineDiv.appendChild(avatar.cloneNode(true));
      }
      const name = byline.querySelector(".article-byline-name");
      if (name) {
        const nameP = document2.createElement("p");
        nameP.innerHTML = `<strong>${name.textContent.trim()}</strong>`;
        bylineDiv.appendChild(nameP);
      }
      const meta = byline.querySelector(".article-byline-meta");
      if (meta) {
        const metaP = document2.createElement("p");
        metaP.textContent = meta.textContent.trim();
        bylineDiv.appendChild(metaP);
      }
      contentWrapper.appendChild(bylineDiv);
    }
    cells.push([contentWrapper]);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Hero (hero-article)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse3(element, { document: document2 }) {
    const image = element.querySelector(".featured-article-image img, :scope > a img");
    const tag = element.querySelector(".tag");
    const heading = element.querySelector("h2, .h2-heading");
    const description = element.querySelector(".paragraph-lg");
    const avatar = element.querySelector(".avatar img");
    const bylineName = element.querySelector(".article-byline-name");
    const bylineMeta = element.querySelector(".article-byline-meta");
    const contentCol = [];
    if (tag) contentCol.push(tag);
    if (heading) contentCol.push(heading);
    if (description) contentCol.push(description);
    if (avatar || bylineName || bylineMeta) {
      const bylineP = document2.createElement("p");
      if (avatar) bylineP.append(avatar);
      if (bylineName) bylineP.append(document2.createTextNode(" " + bylineName.textContent));
      if (bylineMeta) {
        bylineP.append(document2.createElement("br"));
        bylineP.append(document2.createTextNode(bylineMeta.textContent));
      }
      contentCol.push(bylineP);
    }
    const ctaLink = element.querySelector(".featured-article-footer > a, .article-byline + a");
    if (ctaLink) {
      const label = ctaLink.querySelector(".button-label");
      if (label) ctaLink.textContent = label.textContent.trim();
      contentCol.push(ctaLink);
    }
    const cells = [
      [image || "", contentCol]
    ];
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-featured)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-gallery.js
  function parse4(element, { document: document2 }) {
    const images = element.querySelectorAll(".gallery-img, :scope > img");
    const row = [];
    images.forEach((img) => {
      row.push(img);
    });
    const cells = [];
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Gallery",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-numbered.js
  function parse5(element, { document: document2 }) {
    const items = element.querySelectorAll(".editorial-index-item");
    const cells = [];
    items.forEach((item) => {
      const number = item.querySelector(".editorial-index-number");
      const content = item.querySelector(":scope > div");
      cells.push([number || "", content || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-numbered)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse6(element, { document: document2 }) {
    const cells = [];
    const cards = element.querySelectorAll(".card");
    if (cards.length > 0) {
      const row = [];
      cards.forEach((card) => {
        const col = document2.createElement("div");
        const eyebrow = card.querySelector(".hero-eyebrow");
        if (eyebrow) {
          const p = document2.createElement("p");
          p.innerHTML = `<em>${eyebrow.textContent.trim()}</em>`;
          col.appendChild(p);
        }
        const heading = card.querySelector("h3");
        if (heading) {
          const h3 = document2.createElement("h3");
          h3.textContent = heading.textContent.trim();
          col.appendChild(h3);
        }
        const desc = card.querySelector(".paragraph-lg");
        if (desc) {
          const p = document2.createElement("p");
          p.textContent = desc.textContent.trim();
          col.appendChild(p);
        }
        const link = card.querySelector('a[class*="button"]');
        if (link) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
          a.href = link.getAttribute("href");
          const label = link.querySelector(".button-label");
          a.textContent = label ? label.textContent.trim() : link.textContent.trim();
          p.appendChild(a);
          col.appendChild(p);
        }
        row.push(col);
      });
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-promo)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-sidebar.js
  function parse7(element, { document: document2 }) {
    const cells = [];
    const children = element.children;
    const col1 = document2.createElement("div");
    const firstChild = children[0];
    if (firstChild) {
      const heading = firstChild.querySelector("h3");
      if (heading) {
        const h3 = document2.createElement("h3");
        h3.textContent = heading.textContent.trim();
        col1.appendChild(h3);
      }
      const list = firstChild.querySelector("ul");
      if (list) {
        col1.appendChild(list.cloneNode(true));
      }
    }
    const col2 = document2.createElement("div");
    const secondChild = children[1];
    if (secondChild) {
      const pullQuote = secondChild.querySelector(".pull-quote");
      if (pullQuote) {
        const blockquote = document2.createElement("blockquote");
        const quoteBody = pullQuote.querySelector(".pull-quote-body");
        if (quoteBody) {
          blockquote.textContent = quoteBody.textContent.trim();
        }
        col2.appendChild(blockquote);
        const attribution = pullQuote.querySelector(".pull-quote-attribution");
        if (attribution) {
          const cite = document2.createElement("p");
          cite.innerHTML = `<em>${attribution.textContent.trim()}</em>`;
          col2.appendChild(cite);
        }
      }
    }
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-sidebar)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-about.js
  function parse8(element, { document: document2 }) {
    const cells = [];
    const col1 = document2.createElement("div");
    const children = element.children;
    if (children[0]) {
      const heading = children[0].querySelector("h2");
      if (heading) {
        const h2 = document2.createElement("h2");
        h2.textContent = heading.textContent.trim();
        col1.appendChild(h2);
      }
      const paragraphs = children[0].querySelectorAll("p");
      paragraphs.forEach((p) => {
        const newP = document2.createElement("p");
        newP.textContent = p.textContent.trim();
        col1.appendChild(newP);
      });
    }
    const col2 = document2.createElement("div");
    if (children[1]) {
      const img = children[1].querySelector("img");
      if (img) {
        col2.appendChild(img.cloneNode(true));
      }
    }
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Columns (columns-about)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-activity.js
  function parse9(element, { document: document2 }) {
    const tabButtons = element.querySelectorAll(".tab-menu-link");
    const tabPanes = element.querySelectorAll(".tab-pane");
    const cells = [];
    tabButtons.forEach((btn, i) => {
      const pane = tabPanes[i];
      if (!pane) return;
      const label = btn.textContent.trim();
      cells.push([label, pane]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Tabs",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-team.js
  function parse10(element, { document: document2 }) {
    const cells = [];
    const tabButtons = element.querySelectorAll(".tab-menu .tab-menu-link");
    const tabPanes = element.querySelectorAll(".tab-pane");
    tabButtons.forEach((button, i) => {
      const tabLabel = document2.createElement("div");
      tabLabel.textContent = button.textContent.trim();
      const tabContent = document2.createElement("div");
      const pane = tabPanes[i];
      if (pane) {
        const profileImg = pane.querySelector(".profile-circle img");
        if (profileImg) {
          const img = profileImg.cloneNode(true);
          tabContent.appendChild(img);
        }
        const name = pane.querySelector(".profile-name");
        if (name) {
          const h3 = document2.createElement("h3");
          h3.textContent = name.textContent.trim();
          tabContent.appendChild(h3);
        }
        const role = pane.querySelector(".profile-name + p");
        if (role) {
          const em = document2.createElement("em");
          em.textContent = role.textContent.trim();
          const p = document2.createElement("p");
          p.appendChild(em);
          tabContent.appendChild(p);
        }
        const bioContainer = pane.querySelector(".team-profile-bio");
        if (bioContainer) {
          const paragraphs = bioContainer.querySelectorAll("p");
          paragraphs.forEach((para) => {
            const newP = document2.createElement("p");
            newP.textContent = para.textContent.trim();
            tabContent.appendChild(newP);
          });
        }
      }
      cells.push([tabLabel, tabContent]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Tabs (tabs-team)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/ticker.js
  function parse11(element, { document: document2 }) {
    const track = element.querySelector(".ticker-track");
    const seen = /* @__PURE__ */ new Set();
    const items = [];
    if (track) {
      const allText = track.textContent;
      const parts = allText.split("\xB7").map((s) => s.trim()).filter(Boolean);
      parts.forEach((text) => {
        if (!seen.has(text)) {
          seen.add(text);
          items.push(text);
        }
      });
    }
    const wrapper = document2.createElement("div");
    items.forEach((item) => {
      const p = document2.createElement("p");
      p.textContent = item;
      wrapper.appendChild(p);
    });
    const cells = [[wrapper]];
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "ticker",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse12(element, { document: document2 }) {
    const faqItems = element.querySelectorAll(".faq-item");
    const cells = [];
    faqItems.forEach((item) => {
      const questionEl = item.querySelector(".faq-question");
      let questionText = "";
      if (questionEl) {
        const clone = questionEl.cloneNode(true);
        const icon = clone.querySelector(".faq-icon");
        if (icon) icon.remove();
        questionText = clone.textContent.trim();
      }
      const answer = item.querySelector(".faq-answer");
      const questionDiv = document2.createElement("div");
      const questionP = document2.createElement("p");
      questionP.textContent = questionText;
      questionDiv.appendChild(questionP);
      cells.push([questionDiv, answer || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "accordion-faq",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse13(element, { document: document2 }) {
    const cards = element.querySelectorAll(".article-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img");
      const col1 = document2.createElement("div");
      if (img) {
        col1.appendChild(img.cloneNode(true));
      }
      const col2 = document2.createElement("div");
      const tag = card.querySelector(".tag");
      if (tag) {
        const tagP = document2.createElement("p");
        tagP.textContent = tag.textContent.trim();
        col2.appendChild(tagP);
      }
      const title = card.querySelector("h3, h5");
      if (title) {
        const h3 = document2.createElement("h3");
        h3.textContent = title.textContent.trim();
        col2.appendChild(h3);
      }
      const desc = card.querySelector(".paragraph-sm");
      if (desc) {
        const descP = document2.createElement("p");
        descP.textContent = desc.textContent.trim();
        col2.appendChild(descP);
      }
      const authorDate = card.querySelector(".utility-text-secondary");
      if (authorDate) {
        const authorP = document2.createElement("p");
        authorP.innerHTML = `<em>${authorDate.textContent.trim()}</em>`;
        col2.appendChild(authorP);
      }
      const href = card.getAttribute("href");
      if (href) {
        const linkP = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = "Read More";
        linkP.appendChild(a);
        col2.appendChild(linkP);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Cards (cards-article)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse14(element, { document: document2 }) {
    const cells = [];
    const cards = element.querySelectorAll(".feature-card");
    cards.forEach((card) => {
      const row = document2.createElement("div");
      const heading = card.querySelector("h3");
      if (heading) {
        const h3 = document2.createElement("h3");
        h3.textContent = heading.textContent.trim();
        row.appendChild(h3);
      }
      const desc = card.querySelector("p");
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.trim();
        row.appendChild(p);
      }
      const link = card.querySelector("a");
      if (link) {
        const a = document2.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        row.appendChild(a);
      }
      cells.push([row]);
    });
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "Cards (cards-feature)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar",
        ".footer",
        ".skip-link",
        "noscript",
        "link",
        "iframe"
      ]);
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
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
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
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import.js
  var parsers = {
    "hero": parse,
    "hero-article": parse2,
    "columns-featured": parse3,
    "columns-gallery": parse4,
    "columns-numbered": parse5,
    "columns-promo": parse6,
    "columns-sidebar": parse7,
    "columns-about": parse8,
    "tabs": parse9,
    "tabs-activity": parse9,
    "tabs-team": parse10,
    "ticker": parse11,
    "accordion-faq": parse12,
    "cards-article": parse13,
    "cards-feature": parse14
  };
  var TEMPLATES = [
    {
      name: "homepage",
      urls: ["https://gabrielwalt.github.io/wknd/index.html"],
      description: "Homepage with hero, featured content, activity browser, stories gallery, FAQ, and onboarding sections",
      blocks: [
        { name: "hero", instances: ["section.hero-section.hero-section--full"] },
        { name: "columns-featured", instances: [".featured-article"] },
        { name: "tabs-activity", instances: [".tab-container.tab-container--wide"] },
        { name: "ticker", instances: [".ticker-strip"] },
        { name: "accordion-faq", instances: [".faq-list"] },
        { name: "columns-numbered", instances: [".editorial-index"] },
        { name: "columns-gallery", instances: [".inverse-section .grid-layout.desktop-3-column"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section.hero-section--full", style: null, blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "Featured Article", selector: "section.section.secondary-section:has(.featured-article)", style: "secondary", blocks: ["columns-featured"], defaultContent: [] },
        { id: "section-3", name: "Browse by Activity", selector: "section.section:has(.tab-container)", style: null, blocks: ["tabs-activity"], defaultContent: [".section-heading h2"] },
        { id: "section-4", name: "Ticker Strip", selector: ".ticker-strip", style: "dark", blocks: ["ticker"], defaultContent: [] },
        { id: "section-5", name: "Start Here", selector: "section.section.inverse-section:has(.hero-eyebrow)", style: "dark, narrow", blocks: [], defaultContent: [".hero-eyebrow", "h2.h2-heading", "p.paragraph-lg", ".button-group"] },
        { id: "section-6", name: "Quick Answers", selector: "section.section:has(.faq-list)", style: null, blocks: ["accordion-faq"], defaultContent: [".section-heading h2", ".section-heading .text-button"] },
        { id: "section-7", name: "How We Work", selector: "section.section.secondary-section:has(.editorial-index)", style: "secondary", blocks: ["columns-numbered"], defaultContent: [".section-heading h2"] },
        { id: "section-8", name: "In the Field", selector: "section.section.inverse-section:has(.gallery-img)", style: "dark", blocks: ["columns-gallery"], defaultContent: [".section-heading h2", ".section-heading .text-button", ".utility-margin-top-lg .gallery-img--wide"] },
        { id: "section-9", name: "CTA Banner", selector: "section.section.accent-section", style: "accent", blocks: [], defaultContent: ["h2.h2-heading", "p.paragraph-xl", ".button-group"] }
      ]
    },
    {
      name: "hub-landing-page",
      urls: ["https://gabrielwalt.github.io/wknd/adventures.html"],
      description: "Category hub page with hero, featured spotlight, category cards/grid, educational content, and cross-promotion links",
      blocks: [
        { name: "hero", instances: ["section.hero-section.hero-section--full"] },
        { name: "columns-featured", instances: [".featured-article"] },
        { name: "tabs-activity", instances: [".tab-container.tab-container--wide"] },
        { name: "columns-numbered", instances: [".editorial-index"] },
        { name: "cards-article", instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)"] },
        { name: "columns-promo", instances: [".grid-layout.grid-layout--2col"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section.hero-section--full", style: "dark", blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "Accent Banner", selector: "section.section.accent-section", style: "accent", blocks: [], defaultContent: ["h2.h2-heading", "p.paragraph-xl"] },
        { id: "section-3", name: "Featured Article", selector: "section.section.secondary-section:has(.featured-article)", style: "secondary", blocks: ["columns-featured"], defaultContent: [] },
        { id: "section-4", name: "Browse by Activity", selector: "section.section:has(.tab-container)", style: null, blocks: ["tabs-activity"], defaultContent: ["h2.section-heading"] },
        { id: "section-5", name: "Choosing Your Adventure", selector: "section.section.secondary-section:has(.container--narrow):not(:has(.featured-article)):not(:has(.editorial-index))", style: "secondary", blocks: [], defaultContent: ["h2.h2-heading", "p.paragraph-lg"] },
        { id: "section-6", name: "Recent Reports", selector: "section.section:has(.grid-gap-lg > .article-card)", style: null, blocks: ["cards-article"], defaultContent: ["h2.section-heading"] },
        { id: "section-7", name: "Adventure by Skill Level", selector: "section.section.secondary-section:has(.editorial-index)", style: "secondary", blocks: ["columns-numbered", "columns-promo"], defaultContent: ["h2.section-heading"] },
        { id: "section-8", name: "Gear CTA", selector: "section.section.inverse-section", style: "dark", blocks: [], defaultContent: ["h2.h2-heading", "p.paragraph-lg", "a.button"] }
      ]
    },
    {
      name: "editorial-section-page",
      urls: ["https://gabrielwalt.github.io/wknd/field-notes"],
      description: "Editorial section page with hero, featured story, editorial philosophy, and engagement CTAs",
      blocks: [
        { name: "hero", instances: ["section.hero-section"] },
        { name: "columns-featured", instances: [".featured-article"] },
        { name: "columns-promo", instances: [".grid-layout.grid-layout--2col"] },
        { name: "tabs-activity", instances: [".tab-container.tab-container--wide"] },
        { name: "columns-numbered", instances: [".editorial-index"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section", style: "dark", blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "Statement", selector: "section.section.inverse-section:has(.container--centered):not(:has(.editorial-index))", style: "dark", blocks: [], defaultContent: ["h2.h2-heading", "p.paragraph-xl"] },
        { id: "section-2b", name: "Numbered Principles", selector: "section.section:has(.editorial-index)", style: null, blocks: ["columns-numbered"], defaultContent: ["h2.section-heading", "h2.h2-heading"] },
        { id: "section-3", name: "Featured Article", selector: "section.section.secondary-section:has(.featured-article)", style: "secondary", blocks: ["columns-featured"], defaultContent: [] },
        { id: "section-4", name: "Editorial Content", selector: "section.section.inverse-section:has(.container--narrow:not(.container--centered))", style: "dark", blocks: [], defaultContent: ["h2.h2-heading", "p.paragraph-lg"] },
        { id: "section-5", name: "Promo Cards", selector: "section.section.secondary-section:has(.grid-layout--2col)", style: "secondary", blocks: ["columns-promo"], defaultContent: [] },
        { id: "section-6", name: "Essential Reading", selector: "section.section:has(.tab-container)", style: null, blocks: ["tabs-activity"], defaultContent: ["h2.h2-heading"] },
        { id: "section-7", name: "CTA", selector: "section.section.inverse-section:last-of-type", style: "dark", blocks: [], defaultContent: ["h2.h2-heading", "p.paragraph-lg", "a.button"] }
      ]
    },
    {
      name: "community-page",
      urls: ["https://gabrielwalt.github.io/wknd/community.html"],
      description: "Community page with hero, featured reader story, submission guidelines, dispatches, editorial standards, FAQ, and CTA",
      blocks: [
        { name: "hero", instances: ["section.hero-section"] },
        { name: "columns-featured", instances: [".featured-article"] },
        { name: "columns-numbered", instances: [".editorial-index"] },
        { name: "cards-article", instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)"] },
        { name: "columns-promo", instances: [".accent-section .grid-layout.tablet-1-column:has(.card)"] },
        { name: "accordion-faq", instances: [".faq-list"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section", style: "dark", blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "Statement", selector: "section:nth-of-type(2)", style: "dark", blocks: [], defaultContent: ["h2", "p"] },
        { id: "section-3", name: "Featured Story + How to Submit", selector: "section:nth-of-type(3)", style: "secondary", blocks: ["columns-featured", "columns-numbered"], defaultContent: [] },
        { id: "section-4", name: "From the Wild", selector: "section:nth-of-type(4)", style: null, blocks: ["cards-article"], defaultContent: ["h2", "p"] },
        { id: "section-5", name: "Reader Dispatches", selector: "section:nth-of-type(5)", style: "secondary", blocks: ["columns-featured", "cards-article"], defaultContent: ["h2", "p"] },
        { id: "section-6", name: "What Makes a Great Dispatch", selector: "section:nth-of-type(6)", style: "dark", blocks: [], defaultContent: ["h2", "p"] },
        { id: "section-7", name: "Join In", selector: "section:nth-of-type(7)", style: "accent", blocks: ["columns-promo"], defaultContent: ["h2"] },
        { id: "section-8", name: "Submission FAQ", selector: "section:nth-of-type(8)", style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
        { id: "section-9", name: "CTA", selector: "section:nth-of-type(9)", style: "dark", blocks: [], defaultContent: ["h2", ".button-group"] }
      ]
    },
    {
      name: "sustainability-page",
      urls: ["https://gabrielwalt.github.io/wknd/sustainability.html"],
      description: "Sustainability page with hero, wild ethics principles, featured story, topic tabs, editorial content, ethics guidelines, articles, practical steps, pledge, and CTA",
      blocks: [
        { name: "hero", instances: ["section.hero-section"] },
        { name: "columns-numbered", instances: [".editorial-index"] },
        { name: "columns-featured", instances: [".featured-article"] },
        { name: "tabs-team", instances: ["section.section:has(.tab-menu)"] },
        { name: "cards-feature", instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)"] },
        { name: "cards-article", instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section", style: "dark", blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "Wild Ethics", selector: "section:nth-of-type(2)", style: "secondary", blocks: ["columns-numbered"], defaultContent: ["h2"] },
        { id: "section-3", name: "Featured Story", selector: "section:nth-of-type(3)", style: "secondary", blocks: ["columns-featured"], defaultContent: [] },
        { id: "section-4", name: "By Topic", selector: "section:nth-of-type(4)", style: null, blocks: ["tabs-team"], defaultContent: ["h2"] },
        { id: "section-5", name: "The Adventurer's Responsibility", selector: "section:nth-of-type(5)", style: null, blocks: [], defaultContent: ["h2", "p"] },
        { id: "section-6", name: "The WKND Wild Ethics", selector: "section:nth-of-type(6)", style: "secondary", blocks: ["cards-feature"], defaultContent: ["h2"] },
        { id: "section-7", name: "Places That Need Our Care", selector: "section:nth-of-type(7)", style: "secondary", blocks: ["cards-article"], defaultContent: ["h2"] },
        { id: "section-8", name: "Practical Steps", selector: "section:nth-of-type(8)", style: "accent", blocks: [], defaultContent: ["h2", "p", "ul"] },
        { id: "section-9", name: "This Is Not Optional", selector: "section:nth-of-type(9)", style: "dark", blocks: [], defaultContent: ["h2", "p", "blockquote"] },
        { id: "section-10", name: "CTA", selector: "section:nth-of-type(10)", style: "accent", blocks: [], defaultContent: ["h2", ".button-group"] }
      ]
    },
    {
      name: "about-page",
      urls: ["https://gabrielwalt.github.io/wknd/about.html"],
      description: "About page with hero, statement, origin story, values, team profiles, editorial standard, funding, editor picks, and CTA",
      blocks: [
        { name: "hero", instances: ["section.hero-section"] },
        { name: "columns-about", instances: [".grid-layout.grid-gap-xxl.tablet-1-column"] },
        { name: "cards-feature", instances: [".inverse-section .grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)"] },
        { name: "tabs-team", instances: ["section.section:has(.tab-menu)"] },
        { name: "cards-article", instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section", style: "dark", blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "Statement", selector: "section.section.accent-section:has(> div.container--narrow)", style: "accent", blocks: [], defaultContent: ["h2.h2-heading", "p.paragraph-xl"] },
        { id: "section-3", name: "How It Started", selector: "section.section:has(.grid-gap-xxl)", style: null, blocks: ["columns-about"], defaultContent: [] },
        { id: "section-4", name: "What We Believe", selector: "section.section.inverse-section:has(.feature-card)", style: "dark", blocks: ["cards-feature"], defaultContent: ["h2.h2-heading"] },
        { id: "section-5", name: "The Team", selector: "section.section:has(.tab-menu)", style: null, blocks: ["tabs-team"], defaultContent: ["h2.h2-heading"] },
        { id: "section-6", name: "Editorial Standard", selector: "section.section.secondary-section", style: "secondary", blocks: [], defaultContent: ["h2.h2-heading", "p"] },
        { id: "section-7", name: "How We Fund Our Work", selector: "section.section.inverse-section:not(:has(.feature-card))", style: "dark", blocks: [], defaultContent: ["h2.h2-heading", "p"] },
        { id: "section-8", name: "From Our Editors", selector: "section.section:has(.article-card)", style: null, blocks: ["cards-article"], defaultContent: ["h2.h2-heading"] },
        { id: "section-9", name: "CTA", selector: "section.section.accent-section:not(:has(> div.container--narrow))", style: "accent", blocks: [], defaultContent: ["h2.h2-heading", "p", ".button-group"] }
      ]
    },
    {
      name: "faq-page",
      urls: ["https://gabrielwalt.github.io/wknd/faq.html"],
      description: "FAQ page with hero, category cards, alternating FAQ accordion sections, popular articles, and CTA",
      blocks: [
        { name: "hero", instances: ["section.hero-section"] },
        { name: "columns-promo", instances: [".accent-section .grid-layout.tablet-1-column:has(.card)"] },
        { name: "accordion-faq", instances: [".faq-list"] },
        { name: "cards-article", instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section", style: "dark", blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "FAQ Categories", selector: "section.section.accent-section", style: "accent", blocks: ["columns-promo"], defaultContent: [] },
        { id: "section-3", name: "Planning & Adventures FAQ", selector: "section:nth-of-type(3)", style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
        { id: "section-4", name: "Contributing Stories FAQ", selector: "section:nth-of-type(4)", style: "secondary", blocks: ["accordion-faq"], defaultContent: ["h2"] },
        { id: "section-5", name: "Planning Your Trip FAQ", selector: "section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
        { id: "section-6", name: "About WKND Content FAQ", selector: "section:nth-of-type(6)", style: "secondary", blocks: ["accordion-faq"], defaultContent: ["h2"] },
        { id: "section-7", name: "Contributing & Community FAQ", selector: "section:nth-of-type(7)", style: null, blocks: ["accordion-faq"], defaultContent: ["h2"] },
        { id: "section-8", name: "Popular Starting Points", selector: "section:nth-of-type(8)", style: "secondary", blocks: ["cards-article"], defaultContent: ["h2"] },
        { id: "section-9", name: "CTA", selector: "section.section.inverse-section", style: "dark", blocks: [], defaultContent: ["h2", "p", ".button-group"] }
      ]
    },
    {
      name: "destinations-page",
      urls: ["https://gabrielwalt.github.io/wknd/destinations.html"],
      description: "Destinations page with hero, flagship expedition, article cards, editorial indexes, tabbed content, checklist, and CTAs",
      blocks: [
        { name: "hero", instances: ["section.hero-section"] },
        { name: "cards-article", instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.article-card)"] },
        { name: "columns-numbered", instances: [".editorial-index"] },
        { name: "tabs-activity", instances: [".tab-container.tab-container--wide"] },
        { name: "columns-promo", instances: [".grid-layout.grid-layout--2col:has(.card)"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section", style: "dark", blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "Flagship Expedition", selector: "section:nth-of-type(2)", style: "accent", blocks: [], defaultContent: ["h2", "p"] },
        { id: "section-3", name: "Our Expeditions", selector: "section:nth-of-type(3)", style: null, blocks: ["cards-article"], defaultContent: ["h2"] },
        { id: "section-4", name: "What an Expedition Demands", selector: "section:nth-of-type(4)", style: "secondary", blocks: ["columns-numbered"], defaultContent: ["h2", "p"] },
        { id: "section-5", name: "Full Accounts", selector: "section:nth-of-type(5)", style: null, blocks: ["tabs-activity"], defaultContent: ["h2"] },
        { id: "section-6", name: "The Gear You'll Actually Need", selector: "section:nth-of-type(6)", style: "secondary", blocks: ["columns-numbered"], defaultContent: ["h2"] },
        { id: "section-7", name: "Pre-Departure Checklist", selector: "section:nth-of-type(7)", style: "accent", blocks: [], defaultContent: ["h2", "ul", ".button-group"] },
        { id: "section-8", name: "What's Next", selector: "section:nth-of-type(8)", style: "dark", blocks: [], defaultContent: ["h2", "p"] },
        { id: "section-9", name: "Two-Card CTA", selector: "section:nth-of-type(9)", style: "dark", blocks: ["columns-promo"], defaultContent: [] }
      ]
    },
    {
      name: "expedition-gear-page",
      urls: [
        "https://gabrielwalt.github.io/wknd/expeditions.html",
        "https://gabrielwalt.github.io/wknd/gear.html"
      ],
      description: "Expedition/gear page with hero, tagline, featured article, activity tabs, wide content tabs, editorial index, gear lists, feature cards, and CTA",
      blocks: [
        { name: "hero", instances: ["section.hero-section"] },
        { name: "columns-featured", instances: [".featured-article"] },
        { name: "tabs", instances: ["section.section:not(:has(.tab-container)):has(.tab-menu)"] },
        { name: "tabs-activity", instances: [".tab-container.tab-container--wide"] },
        { name: "columns-numbered", instances: [".editorial-index"] },
        { name: "cards-feature", instances: [".grid-layout.desktop-3-column.grid-gap-lg:has(.feature-card)"] }
      ],
      sections: [
        { id: "section-1", name: "Hero", selector: "section.hero-section", style: "dark", blocks: ["hero"], defaultContent: [] },
        { id: "section-2", name: "Accent Tagline", selector: "section:nth-of-type(2)", style: "accent", blocks: [], defaultContent: ["h2", "p"] },
        { id: "section-3", name: "Featured Article", selector: "section:nth-of-type(3)", style: "secondary", blocks: ["columns-featured"], defaultContent: [] },
        { id: "section-4", name: "Activity Tabs", selector: "section:nth-of-type(4)", style: null, blocks: ["tabs"], defaultContent: ["h2"] },
        { id: "section-5", name: "Wide Tabs + Editorial", selector: "section:nth-of-type(5)", style: "secondary", blocks: ["tabs-activity"], defaultContent: ["h2", "p"] },
        { id: "section-6", name: "Editorial Index", selector: "section:nth-of-type(6)", style: null, blocks: ["columns-numbered"], defaultContent: ["h2"] },
        { id: "section-7", name: "Gear Lists", selector: "section:nth-of-type(7)", style: "secondary", blocks: [], defaultContent: ["h2", "h3", "p", "ul"] },
        { id: "section-8", name: "Feature Cards", selector: "section:nth-of-type(8)", style: "dark", blocks: ["cards-feature"], defaultContent: ["h2"] },
        { id: "section-9", name: "CTA", selector: "section:nth-of-type(9)", style: "accent", blocks: [], defaultContent: ["h2", "p", ".button-group"] }
      ]
    },
    {
      name: "blog-article",
      urls: [
        "https://gabrielwalt.github.io/wknd/blog/patagonia-trek.html",
        "https://gabrielwalt.github.io/wknd/blog/kayaking-norway.html",
        "https://gabrielwalt.github.io/wknd/blog/alpine-cycling.html",
        "https://gabrielwalt.github.io/wknd/blog/yosemite-rock-climbing.html",
        "https://gabrielwalt.github.io/wknd/blog/mountain-photography.html",
        "https://gabrielwalt.github.io/wknd/blog/ultralight-backpacking.html"
      ],
      description: "Long-form blog article with hero image, metadata tags, day-by-day narrative, inline images, author attribution, and related links",
      blocks: [
        { name: "hero-article", instances: ["section.hero-section"] },
        { name: "columns-sidebar", instances: [".secondary-section .grid-layout.desktop-3-column.grid-align-center"] },
        { name: "columns-gallery", instances: [".inverse-section .grid-layout.desktop-3-column"] },
        { name: "cards-article", instances: ["section.section:last-of-type:not(.inverse-section) .grid-layout.desktop-3-column"] }
      ],
      sections: [
        { id: "section-1", name: "Article Hero", selector: "section.hero-section", style: "dark", blocks: ["hero-article"], defaultContent: [] },
        { id: "section-2", name: "Article Body", selector: "section.section.blog-article-section", style: null, blocks: [], defaultContent: [".blog-content.blog-content-body"] },
        { id: "section-3", name: "Sidebar Summary", selector: "section.section.secondary-section", style: "secondary", blocks: ["columns-sidebar"], defaultContent: [] },
        { id: "section-4", name: "In the Field Gallery", selector: "section.section.inverse-section", style: "dark", blocks: ["columns-gallery"], defaultContent: [".section-heading h2", ".section-heading .text-button", ".utility-margin-top-lg .gallery-img--wide"] },
        { id: "section-5", name: "More Stories", selector: "section.section:last-of-type:not(.inverse-section)", style: null, blocks: ["cards-article"], defaultContent: ["h2.section-heading"] }
      ]
    }
  ];
  function normalizeUrl(url) {
    try {
      const u = new URL(url);
      let path = u.pathname.replace(/\/$/, "").replace(/\.html$/, "");
      return `${u.origin}${path}`;
    } catch {
      return url;
    }
  }
  function findTemplate(url) {
    const normalized = normalizeUrl(url);
    for (const template of TEMPLATES) {
      for (const templateUrl of template.urls) {
        if (normalizeUrl(templateUrl) === normalized) {
          return template;
        }
      }
    }
    try {
      const u = new URL(url);
      const path = u.pathname;
      for (const template of TEMPLATES) {
        for (const templateUrl of template.urls) {
          const tu = new URL(templateUrl);
          const tPath = tu.pathname.replace(/[^/]*$/, "");
          if (tPath.length > 1 && path.startsWith(tPath) && u.origin === tu.origin) {
            return template;
          }
        }
      }
    } catch {
    }
    console.warn(`No template found for URL: ${url}`);
    return null;
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  function executeTransformers(hookName, element, payload, template) {
    const transformers = [
      transform,
      ...template.sections && template.sections.length > 1 ? [transform2] : []
    ];
    const enhancedPayload = {
      ...payload,
      template
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const originalURL = params.originalURL || url;
      const template = findTemplate(originalURL);
      if (!template) {
        console.error(`No template matched for ${originalURL}. Returning raw body.`);
        return [{
          element: document2.body,
          path: WebImporter.FileUtils.sanitizePath(
            new URL(originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
          )
        }];
      }
      console.log(`Matched template: ${template.name} for ${originalURL}`);
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload, template);
      const pageBlocks = findBlocksOnPage(document2, template);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload, template);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: template.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_exports);
})();
