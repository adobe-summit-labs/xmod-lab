# Import Skill Critique: Building Universal, Content-Driven Import Scripts

## What Happened

During the WKND migration (16 pages, ~15 distinct block variants), the skills produced:

- **10 separate "templates"** grouping 16 URLs by URL pattern (`homepage`, `hub-landing-page`, `editorial-section-page`, `community-page`, `sustainability-page`, `about-page`, `faq-page`, `destinations-page`, `expedition-gear-page`, `blog-article`)
- **A 688-line `page-templates.json`** mapping each URL to its template, each template to its blocks and sections
- **10 import scripts** (`import-homepage.js`, `import-blog-article.js`, ...), each embedding one template's block list and section definitions
- **A `findTemplate(url)` function** that matched URLs against template arrays to select which blocks to look for

When asked "do we have a single import script that works for all pages?", the answer was technically "yes" — but the single script internally dispatched to 10 templates by URL. A page at a new URL would fail with "No template found."

The user's correction was simple and profound:

> "There aren't really different templates for this site, all pages are the same template, but are featuring a different set of blocks."

The fix took the working parsers (which were already content-driven and correct), removed all the template/URL machinery, and replaced it with a 30-line `BLOCK_REGISTRY` that scans ANY page's DOM for block signatures. The resulting single `import.js` successfully imports all 16 pages — and would import any new page using the same blocks without modification.

**The parsers were never the problem. The orchestration layer was.**

---

## The Causal Chain

The template-first architecture isn't one mistake — it's a design pattern that cascades through every skill in the pipeline. Each skill reinforces the template assumption:

```
excat-site-analysis (Step 2)
  Groups URLs into templates by URL pattern — before any DOM analysis
  Creates page-templates.json with empty blocks[]
      ↓
excat-page-analysis (Step 3)
  Analyzes ONE page per template (first URL)
  Discovers blocks on that single sample page only
      ↓
block-mapping-manager (Step 4)
  Populates template.blocks[] from analysis
  Derives section styles from screenshot colors (visual, not structural)
  Adds positional selectors (nth-of-type) as fallbacks
  Generates unused defaultContent[] arrays
      ↓
excat-import-infrastructure (Step 5)
  Generates section transformer that reads payload.template.sections
  Skips section transformer if template has < 2 sections
      ↓
excat-import-script (Step 6.3)
  "For each template": generates import-<templateName>.js
  Embeds PAGE_TEMPLATE constant with URL list, block list, section list
  "⚠️ Important: Always use template-specific naming, NEVER generic import.js"
      ↓
excat-content-import (Step 6.4)
  "For each template": bundles and runs import-<templateName>.bundle.js
  Updates page-templates.json with imported URLs
```

**Every skill trusts that templates are the correct abstraction.** No skill questions whether the URL grouping from Step 2 actually reflects distinct page structures. By the time the import script is generated in Step 6, the template is so deeply embedded that removing it requires rewriting most of the pipeline.

### Why the Cascade is Harmful

1. **Templates are created from URL patterns, not DOM analysis.** `excat-site-analysis` groups URLs before any page has been scraped. `/adventures` and `/about` get separate templates because their URLs differ — even if they use identical DOM structures with different block combinations.

2. **One sample page defines the entire template.** `excat-page-analysis` analyzes the first URL per template. If the sample page has blocks A, B, C — the template knows about A, B, C. If another page in the same template has blocks A, D, E — blocks D and E are invisible to the import script.

3. **Each template's import script has tunnel vision.** `findBlocksOnPage(document, template)` only looks for blocks listed in `template.blocks`. A block that exists on the page but isn't in the template list is silently ignored.

4. **The template count multiplies everything.** 10 templates = 10 import scripts to generate, bundle, and maintain. A bug fix in the orchestration logic must be applied to all 10 scripts. A new block variant requires determining which templates need it.

---

## What the Skills Actually Say (Verbatim)

These aren't interpretations — these are direct quotes from the skill source files that encode the template-first pattern:

### `excat-import-script` SKILL.md

> **Purpose**: Generates template-specific `import-<templateName>.js` transformation files

> **Filename Format:** `import-<templateName>.js`
> **⚠️ Important:** Always use template-specific naming, NEVER generic `import.js`

> **One Template = One Import Script**
> Each page template requires a dedicated import script:
> - Template "product-page" → `import-product-page.js`
> - Template "blog-post" → `import-blog-post.js`

> **Why Embed?**
> - ✅ Clear association: one template = one import script

The generated `findBlocksOnPage` function:
```javascript
function findBlocksOnPage(document, template) {
  template.blocks.forEach(blockDef => {       // ← only looks for blocks in THIS template
    blockDef.instances.forEach(selector => {
      // ...
    });
  });
}
```

The generated `executeTransformers` function:
```javascript
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE    // ← passes the embedded template to transformers
  };
  // ...
}
```

### `excat-import-infrastructure` — generate-import-transformer.md

> **Section transformers** run only in `afterTransform` and use `payload.template.sections`.

> **When:** Only if `template.sections && template.sections.length > 1` in page-templates.

This means: (a) a single-section page with a background style gets NO section metadata, (b) the section list is fixed per template, and (c) section styles are pre-baked, not detected at import time.

### `excat-site-migration` SKILL.md

Step 6.3:
> **For each template:**
> 1. Check if `tools/importer/import-<templateName>.js` exists
> 2. If exists: Ask: "Import script for [template] exists. Use existing or regenerate?"
> 3. **Invoke `excat-import-script` skill** (provides template name, sample URL)

Step 6.4:
> **For each template:**
> **Invoke `excat-content-import` skill**

The orchestrator loops per template. It has no concept of "one script for all pages."

### `block-mapping-manager` SKILL.md

Section style derivation:
```javascript
function mapColorToStyle(backgroundColor, sectionName) {
  // Very dark colors (near black)
  if (r < 50 && g < 50 && b < 50) {
    if (r === 0 && g === 0 && b === 0) return 'dark';
    return 'charcoal';          // ← "creative" names from pixel colors
  }
  // ...
  if (b > r && b > g) {
    if (b > 200) return 'sky-blue';
    if (b > 100) return 'navy-blue';
    return 'deep-blue';
  }
  // ...
  return 'accent';              // ← fallback for unrecognized colors
}
```

The skill encourages "creative, descriptive" style names mapped from RGB values. This means the same CSS class (`inverse-section` with `background: #1a1a1a`) could get different names depending on which page was analyzed first, or slight color variations between pages.

Meanwhile, the source DOM already has a class name that IS the style identity:
```html
<section class="inverse-section">   →   style: "dark"
<section class="accent-section">    →   style: "accent"
<section class="secondary-section"> →   style: "secondary"
```

The class name is deterministic, consistent across pages, and available at import time. The pixel color is none of those things.

### `excat-site-analysis` SKILL.md

> **Group URLs by template type based on:**
> - URL path patterns (e.g., `/products/*`, `/blog/*`, `/about`)
> - Page type identification from initial analysis

This happens BEFORE any DOM analysis. The grouping is based on URL structure alone.

### `excat-page-analysis` SKILL.md

> **Step 3: Determine page URL** (URL List Mode: first URL from each template)

Only ONE page per template is analyzed. All other pages in the template are assumed to have the same block composition.

### `excat-content-import` — content-import.md

Step 5 (after import):
```bash
node add-urls-to-template.js --template <templateName> --urls <url-file>
```

Even the post-import step updates `page-templates.json` — reinforcing the template as the organizing principle.

### Parser validation hook (generate-import-parser.md)

> 2. Matches the parser filename to a block in `page-templates.json`
> 3. Loads the source URL in a browser
> 4. Finds DOM elements matching the selector from page-templates.json

The parser validator itself depends on `page-templates.json` to find the test URL and selector. Without a template mapping, the hook can't validate parsers.

---

## The Core Misconception: "Template" vs. "DOM Vocabulary"

The skills conflate two concepts:

| Concept | What it means | Example |
|---------|---------------|---------|
| **Page Template** (layout) | The structural HTML wrapper: header/footer placement, overall grid, how `<section>` elements are arranged | A site has 1-3 templates: "standard page", "landing page", "blog article" |
| **Block Composition** (content) | Which blocks appear on a given page and in what combination | The homepage has hero + cards + tabs. The about page has hero + columns + accordion. Both use the same template. |

Most modern websites built on component libraries (React, AEM, WordPress with blocks, Drupal with paragraphs, etc.) have **very few templates** but **many block compositions**. The WKND site has ONE template (sections of content with optional background styles) and ~15 block variants used in varying combinations.

The skills treat each unique block composition as a separate template. This is wrong because:
- The number of compositions grows combinatorially with the number of blocks
- A site with 10 block types could have hundreds of valid compositions
- Adding a new block variant means potentially updating every "template"

The correct unit of organization is the **DOM vocabulary**: the set of CSS classes, element structures, and naming conventions used by the source site. A single import script should handle any page that uses that vocabulary.

---

## Why a Single Flexible Import Script Matters

The template-per-script approach doesn't just create maintenance overhead — it makes the import fundamentally brittle in ways that surface the moment a customer's site doesn't conform to the assumptions baked into the analysis phase. A single content-driven import script solves this structurally.

### Block Order Independence

A template-based script implicitly encodes the block arrangement of the sample page that was analyzed. If the homepage was analyzed and it had hero → ticker → tabs → cards, that's the block list embedded in the `homepage` template. But a new page might have hero → cards → ticker (no tabs). With the template approach, this page either:
- Gets assigned to the wrong template (because URL matching is a guess)
- Gets assigned to a template that expects blocks it doesn't have (triggering "selector not found" warnings)
- Falls through all templates and fails entirely

A content-driven registry doesn't care about order. It runs every selector against the entire document independently. Whether the hero is first or last, whether the page has 3 blocks or 12, whether blocks appear in an order never seen before — the registry finds what's there and ignores what isn't. Each block is detected on its own merit, not as part of an expected sequence.

### Pages Don't Follow Templates — Authors Do What They Want

In the real world of content authoring, pages drift from their original "template" constantly:
- An author duplicates a page and removes half the blocks
- A new campaign landing page uses blocks from three different "templates"
- A redesign adds a new section style to existing pages
- A block that only appeared on one page starts appearing on five others
- Seasonal content pages mix and match blocks in novel combinations

Template-based import scripts break on all of these because they assume a fixed relationship between URL patterns and block compositions. Content-driven detection handles all of them because it asks "what's on this page?" not "which template is this page?"

### Scaling to Customer Sites

For customer migrations at scale, this matters enormously:

**Small site (20 pages, 3 "templates"):** The template approach works passably. The overhead of 3 import scripts is manageable. But even here, pages that don't fit neatly into a template cause friction.

**Medium site (200 pages, 10+ URL patterns):** The template approach creates 10+ import scripts, each analyzing one sample page. Pages that deviate from their template's sample (different block count, different section order, a block that only appears on 3 pages) fail silently. Debugging requires figuring out which template a URL was assigned to, what blocks that template expected, and why the actual page differs.

**Large site (1000+ pages, continuous authoring):** The template approach collapses. New pages are published weekly. URL patterns evolve. Blocks are added, removed, rearranged. The template mapping becomes stale almost immediately. Re-running site analysis to update templates means re-generating import scripts, re-bundling, and re-testing — for what should be a zero-effort operation.

A single content-driven script handles all three scales identically. New pages with known blocks import correctly with no changes. New block variants require adding one parser and one registry entry. The existing infrastructure is never invalidated by content changes.

### The Acid Test

The acid test for an import script is simple:

> Given a page the script has never seen before, using blocks it already knows about, arranged in any order, with any combination of section styles — does it correctly identify and parse every block?

A template-based script fails this test by definition: it can only process pages whose URLs match known templates.

A content-driven script passes this test by design: it scans the DOM for block signatures regardless of URL, block order, section count, or page history. This is the standard every import script should meet.

### When a Single Script Isn't Enough

A single script reaches its limit only when the DOM vocabulary itself changes — meaning the HTML element structures, CSS class naming conventions, or component patterns are fundamentally different. Concrete examples:

- **Half the site is server-rendered HTML, half is a React SPA** with client-rendered DOM, `data-reactid` attributes, and completely different class names
- **A subdomain runs a different CMS** (e.g., blog on WordPress, main site on custom CMS) with no shared CSS classes
- **A legacy section of the site** uses table-based layouts while the modern section uses semantic HTML

In these cases, the block registry's selectors physically cannot match across both DOM vocabularies, and a second import script (with its own registry, parsers, and transformers) is warranted. But this is rare — most sites built on a single platform share one DOM vocabulary across all pages, even when pages look very different visually.

---

## Recommended Architecture

### The Working Solution

Here is the architecture that successfully imports all 16 WKND pages with a single script:

```
tools/importer/
├── import.js                 # ONE script — universal block detection
├── import.bundle.js          # Bundled output (esbuild, IIFE format)
├── urls.txt                  # ALL URLs in one file
├── parsers/                  # One parser per block variant
│   ├── hero-full.js          #   (unchanged — parsers were already correct)
│   ├── hero-article.js
│   ├── cards-article.js
│   ├── cards-feature.js
│   ├── columns-*.js          #   (6 variants)
│   ├── tabs-activity.js
│   ├── tabs-team.js
│   ├── ticker.js
│   └── accordion-faq.js
└── transformers/
    ├── wknd-cleanup.js       # Remove nav, footer, noscript (beforeTransform)
    └── wknd-sections.js      # Detect sections from CSS classes (beforeTransform)
```

No `page-templates.json`. No `import-<templateName>.js` files. No `findTemplate()`. No URL matching.

### Block Registry

The import script has a flat `BLOCK_REGISTRY` array. Each entry has a block name, CSS selectors that identify it, and the parser function:

```javascript
const BLOCK_REGISTRY = [
  // 1. Container blocks first (descendants will be excluded)
  { name: 'tabs-activity', selectors: ['.tab-container.tab-container--wide'], parser: tabsActivityParser },
  { name: 'tabs-team', selectors: ['section:has(.tab-menu):has(.profile-circle)'], parser: tabsTeamParser },

  // 2. More specific variants before generic
  { name: 'hero-article', selectors: ['section.hero-section:has(.article-byline)'], parser: heroArticleParser },
  { name: 'hero', selectors: ['section.hero-section'], parser: heroParser },

  // 3. Disambiguate overlapping selectors with :has() / :not(:has())
  { name: 'cards-feature', selectors: ['.grid:has(.feature-card)'], parser: cardsFeatureParser },
  { name: 'cards-article', selectors: ['.grid:has(.article-card)'], parser: cardsArticleParser },
  { name: 'columns-gallery', selectors: ['.grid:not(:has(.feature-card)):not(:has(.article-card))'], parser: columnsGalleryParser },

  // 4. Standalone blocks (unique selectors, no ordering concerns)
  { name: 'ticker', selectors: ['.ticker-strip'], parser: tickerParser },
  { name: 'accordion-faq', selectors: ['.faq-list'], parser: accordionFaqParser },
];
```

Detection runs all selectors against the page DOM. Matched elements are tracked in a `Set`. Elements nested inside already-matched parents are skipped (descendant filtering). No template, no URL, no prior knowledge required.

### Registry Ordering Rules

These were discovered through debugging and are critical for correctness:

1. **Containers before children.** Tabs can contain card grids. If cards match before tabs, the descendant filter can't exclude them. Tabs must be in the registry BEFORE cards.

2. **Specific variants before generic.** `hero-article` (has `.article-byline`) must come before `hero` (any `.hero-section`). Otherwise `hero` matches first and `hero-article` never triggers.

3. **Overlapping selectors: use `:not(:has())`.** Cards and columns-gallery both match `.desktop-3-column` grids. Cards use `:has(.feature-card)` / `:has(.article-card)`. Gallery uses `:not(:has(.feature-card)):not(:has(.article-card))` to match only grids without card-specific children.

### Generic Section Transformer

The section transformer iterates ALL `<section>` elements and derives styles from CSS classes:

```javascript
const STYLE_MAP = {
  'inverse-section': 'dark',
  'secondary-section': 'secondary',
  'accent-section': 'accent',
  'hero-section': 'dark',
};

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const sections = element.querySelectorAll('section');
  if (sections.length === 0) return;
  // Process ALL sections — even single-section pages may need style metadata
  for (let i = sections.length - 1; i >= 0; i--) {
    const style = detectStyleFromClasses(sections[i]);
    if (style) { /* insert Section Metadata block */ }
    if (i > 0) { /* insert <hr> section break */ }
  }
}
```

Key differences from the skill-generated version:
- Runs in `beforeTransform`, not `afterTransform` (section boundaries must exist before parsers call `replaceWith`)
- Iterates actual DOM `<section>` elements, not a pre-defined template list
- Processes pages with ANY number of sections (including 1)
- Derives styles from CSS classes, not from screenshot colors

### The STYLE_MAP Is the Only Site-Specific Configuration

For the entire import infrastructure, only two things are truly site-specific:
1. The `STYLE_MAP` / `COMPOUND_MAP` in the section transformer (maps source CSS classes to EDS style names)
2. The cleanup transformer's removal selectors (which elements are non-authorable chrome)

Everything else — block detection, section iteration, the registry pattern, descendant filtering — is generic and reusable.

---

## Specific Skill Changes Required

### 1. `excat-import-script` — The Largest Change

**Current design (template-per-script):**
```
"⚠️ Important: Always use template-specific naming, NEVER generic import.js"
"One Template = One Import Script"
```

**Required design (single universal script):**

The skill should produce ONE `import.js` that:
- Imports ALL parsers (not just those for one template)
- Imports ALL transformers
- Has a `BLOCK_REGISTRY` array with entries for every known block variant
- Has `findBlocksOnPage(document)` that takes NO template parameter
- Has `isDescendantOfMatched()` for nested block prevention
- Has NO `PAGE_TEMPLATE` constant, NO `findTemplate()`, NO URL matching

**The skill should NOT:**
- Embed a template object
- Generate `import-<templateName>.js` filenames
- Conditionally include/exclude parsers or transformers based on template
- Conditionally include/exclude the section transformer based on section count
- Pass `template` to transformers via `enhancedPayload`

**New prerequisite:** Instead of `page-templates.json`, the skill needs:
- A list of all discovered block variants with their detection selectors
- The parser file for each variant
- The transformer files

**The `BLOCK_REGISTRY` ordering is non-trivial.** The skill must:
- Place container blocks (tabs, accordions with nested content) before their potential children
- Place specific variants before generic fallbacks within the same block family
- Add `:not(:has())` exclusions where selectors overlap

**Detection selector quality is critical.** Selectors must be content-based (match CSS classes, child element patterns) not position-based (`nth-of-type`, `first-child`, `last-of-type`). See the Selector Quality section below.

### 2. `excat-import-infrastructure` — Section Transformer Changes

**Current design:**
```
"Section transformers run only in afterTransform and use payload.template.sections"
"Only if template.sections && template.sections.length > 1"
```

**Required changes to `generate-import-transformer.md`:**

- Section transformer must run in `beforeTransform` (before block parsers call `replaceWith`, which disrupts section element boundaries)
- Section transformer must iterate ALL `<section>` elements on the page, not a pre-defined list
- Section transformer must derive styles from CSS class names on `<section>` elements using a `STYLE_MAP`
- Section transformer must process any number of sections (1, 5, 20 — doesn't matter)
- Section transformer must NOT read from `payload.template.sections`
- Section transformer must NOT be conditional on section count

**New responsibility:** During initial site analysis, the infrastructure skill should:
1. Scan the source site's `<section>` elements for CSS class patterns
2. Generate a `STYLE_MAP` mapping those classes to EDS style names
3. Optionally generate a `COMPOUND_MAP` for child-element modifiers
4. Embed these maps in the section transformer

**The validator must also change.** Currently, the section transformer validator reads from `page-templates.json` to determine expected section counts. It should instead validate that:
- The transformer finds `<section>` elements on the test page
- Each section with a recognized CSS class gets a Section Metadata block
- `<hr>` breaks are inserted between sections

### 3. `excat-site-migration` — Orchestrator Workflow Changes

**Current workflow:**
```
Step 2: Site Analysis    →  Group URLs into templates by URL pattern
Step 3: Page Analysis    →  Analyze first URL per template
Step 4: Block Mapping    →  Populate template.blocks[] from analysis
Step 5: Infrastructure   →  Generate parsers/transformers (per template)
Step 6: Content Import   →  For each template: generate script, bundle, import
```

**Required workflow:**

```
Step 1: Project Setup     →  (unchanged)
Step 2: Sample Analysis   →  Pick 1-3 representative pages. Analyze each.
                              Accumulate block variants and section styles.
Step 3: Infrastructure    →  Generate parsers for all discovered variants.
                              Generate section transformer with STYLE_MAP.
                              Generate cleanup transformer.
Step 4: Import Script     →  Generate ONE import.js with BLOCK_REGISTRY
                              covering all discovered variants.
                              Bundle it once.
Step 5: Content Import    →  Import ALL URLs using the single bundled script.
                              All URLs in one urls.txt file.
Step 6: Verify            →  Check for import failures.
                              If a page has an unknown block: go back to Step 2
                              for that page, add the new variant, rebuild.
```

Key differences:
- No template grouping step (Step 2 is gone / replaced with sample analysis)
- No per-template loop in content import
- Single URL file, single import script, single bundle
- Incremental: new blocks are discovered and added without rebuilding everything

**The orchestrator should NOT:**
- Create `page-templates.json` as a runtime dependency
- Loop "for each template" during content import
- Generate separate URL files per template
- Ask "Import all templates or select specific ones?"

**`page-templates.json` can still exist** as a documentation/analysis artifact (tracking which URLs have been analyzed, which blocks were found where). But it must NOT be a runtime input to import scripts or transformers. The import script works without it.

### 4. `block-mapping-manager` — Section Style Changes

**Current design:**
```javascript
// Maps backgroundColor RGB to creative names
function mapColorToStyle(backgroundColor, sectionName) {
  if (r < 50 && g < 50 && b < 50) return 'charcoal';
  if (b > 200) return 'sky-blue';
  return 'accent';
}
```

**Required design:**
```javascript
// Maps CSS class names to consistent EDS style names
function mapClassToStyle(sectionElement) {
  const classes = sectionElement.className;
  if (classes.includes('inverse-section')) return 'dark';
  if (classes.includes('accent-section')) return 'accent';
  if (classes.includes('secondary-section')) return 'secondary';
  return null;
}
```

CSS classes are:
- **Deterministic** — same class always produces the same style name
- **Consistent** — same style on every page uses the same class
- **Available at import time** — no pre-analysis needed
- **Author-intended** — the class name IS the style identity the developer chose

Pixel colors are none of these things. A dark section at `#1a1a1a` on one page and `#1c1c1c` on another could get different names.

**The skill should also stop generating `defaultContent[]` arrays.** Default content (headings, paragraphs, images, links outside blocks) passes through the Helix Importer naturally. No selector array is needed, and no code ever reads it.

### 5. `excat-page-analysis` — Accumulation Instead of Isolation

**Current design:** Analyzes one page per template, producing analysis tied to that template.

**Required change:** Analysis should accumulate into a growing inventory of known block variants and section styles. Each analyzed page may discover NEW variants not seen on previous pages, which get added to the inventory. The analysis should NOT be scoped to a template.

**The block variant inventory** should track:
- Variant name (e.g., `cards-feature`)
- Detection selector(s) — content-based, not positional
- Parser file path
- Which pages it was found on (for documentation, not for runtime)

When analyzing a new page, the skill should:
1. Scan for blocks already in the inventory (they'll match by selector)
2. Identify any NEW blocks not yet in the inventory
3. For new blocks: create parser, add to inventory
4. For existing blocks: verify the parser still works on this new instance

### 6. `excat-content-import` — Simplification

**Current design:**
```bash
# Per template: bundle and import
aem-import-bundle.sh --importjs tools/importer/import-<templateName>.js
run-bulk-import.js --import-script import-<templateName>.bundle.js --urls urls-<templateName>.txt
add-urls-to-template.js --template <templateName> --urls ...
```

**Required design:**
```bash
# Once: bundle the universal script
aem-import-bundle.sh --importjs tools/importer/import.js
# Once: import all URLs
run-bulk-import.js --import-script import.bundle.js --urls tools/importer/urls.txt
```

No per-template loop. No template parameter. No `add-urls-to-template.js` post-step.

### 7. Parser Validation Hook — Decouple from Templates

**Current design (generate-import-parser.md):**
> 2. Matches the parser filename to a block in `page-templates.json`
> 3. Loads the source URL in a browser
> 4. Finds DOM elements matching the selector from page-templates.json

**Required design:** The validator needs a simpler data source:
- A mapping of parser filename → test URL + detection selector
- This could live in a `parser-registry.json` or be derived from the `BLOCK_REGISTRY` in `import.js`
- The validator should NOT depend on `page-templates.json`

---

## Selector Quality Guidelines

The quality of detection selectors is the single biggest factor in whether a universal import script works. Bad selectors produce false matches, missed blocks, or position-dependent behavior.

### Content-Based vs. Position-Based

| Bad (Positional) | Good (Content-Based) | Why |
|---|---|---|
| `section:nth-of-type(3)` | `section.secondary-section` | Works regardless of section order |
| `div:nth-child(2) > .grid` | `.grid-layout.desktop-3-column:has(.article-card)` | Matches the content pattern, not position |
| `main > section:last-of-type` | `section.accent-section:has(.faq-list)` | Works even if more sections are added |
| `.hero-section + section .grid` | `.grid-layout:has(.feature-card)` | Independent of sibling relationships |

### Discriminating Between Similar Blocks

When two block variants share a common structural pattern, use `:has()` to test for distinguishing children:

```javascript
// Both use .grid.desktop-3-column — distinguished by child content
{ name: 'cards-feature', selectors: ['.grid.desktop-3-column:has(.feature-card)'] }
{ name: 'cards-article', selectors: ['.grid.desktop-3-column:has(.article-card)'] }
// Generic fallback with exclusions
{ name: 'columns-gallery', selectors: ['.grid.desktop-3-column:not(:has(.article-card)):not(:has(.feature-card))'] }
```

### Selector Robustness Checklist

For every detection selector generated by the skills, verify:

- [ ] **No positional pseudo-classes** (`nth-of-type`, `nth-child`, `first-of-type`, `last-of-type`)
- [ ] **No sibling combinators** (`+`, `~`) that depend on element order
- [ ] **Uses CSS classes from the source DOM** (not guessed, not inferred from screenshot)
- [ ] **Works regardless of section count or order** on the page
- [ ] **Works regardless of which other blocks** appear on the same page
- [ ] **Distinguishes from similar blocks** using `:has()` / `:not(:has())`
- [ ] **Multiple selectors for the same block** if it appears in different contexts (e.g., inside an accent section vs. standalone)

### When Selectors Fail: The Edge Case Protocol

If a block's CSS classes are too generic or identical to another block's classes, and `:has()` discrimination isn't possible because children are also identical:

1. **First, check if they're truly the same block.** If two "different" blocks have identical structure and styling, they might just be the same block variant used in different sections. The section style (dark/accent/secondary) already captures the context.

2. **If they're genuinely different blocks with identical selectors,** use compound selectors that combine the element's classes with its section context: `section.accent-section .generic-grid` vs. `section.inverse-section .generic-grid`.

3. **If even the section context is identical,** these blocks need a single parser that handles both cases internally, with conditional logic based on available content.

---

## Incremental Discovery: How the Registry Grows

A key advantage of the universal approach is incremental growth. The migration doesn't need to discover every block upfront.

### Initial Analysis (Pages 1-3)

Analyze 1-3 representative pages. Discover, say, 10 block variants. Generate parsers, build the BLOCK_REGISTRY with 10 entries, create the import script, bundle it.

### Bulk Import (All Pages)

Run the import against all URLs. Most pages succeed. A few may have blocks not yet in the registry — the import script logs "Found 0 block instances" for those elements, and they pass through as default content (which may or may not be correct).

### Iteration

Review the import results. For pages with missing blocks:
1. Analyze the failing page
2. Discover the new variant(s)
3. Generate new parser(s)
4. Add new entry/entries to the BLOCK_REGISTRY
5. Re-bundle, re-import just the affected pages

The existing parsers, transformers, and registry entries are untouched. Only additive changes.

### When to Stop

Import is "complete" when:
- All URLs import with the expected block count (logged in the report)
- No blocks are silently missed (compare source page visually with imported preview)
- The BLOCK_REGISTRY covers all distinct block variants on the site

---

## What the Skills Get Right

To be fair, several aspects of the current skills are well-designed:

1. **Parser architecture is already content-driven.** Parsers receive a DOM element, query its internal structure, and produce a block table. They have no template knowledge. This is exactly right and should not change.

2. **Parser function signature is correct.** `parse(element, { document })` with `element.replaceWith(block)` — clean, self-contained, no side effects.

3. **Transformer hook pattern is sound.** `beforeTransform` / `afterTransform` with `(hookName, element, payload)` is a good separation of concerns. The section transformer just needs to read from the DOM instead of `payload.template`.

4. **Block variant naming is correct.** Kebab-case variants (`hero-article`, `cards-feature`) that map to CSS classes and block folder names. The naming convention works.

5. **The esbuild bundling step is necessary and correct.** Import scripts must be bundled as IIFE for the Helix Importer runtime. This doesn't change.

6. **Selectors from captured DOM is a good rule.** `generate-import-parser.md` explicitly says "ALL selectors MUST come from the actual DOM of the page being migrated. Never guess selectors." This should also apply to detection selectors.

---

## Summary of Changes by Priority

### P0: Must Change (Breaks Scalability)

1. **`excat-import-script`**: Produce ONE `import.js` with `BLOCK_REGISTRY`, not per-template scripts. Remove the "NEVER generic import.js" rule. Remove `PAGE_TEMPLATE` embedding. Remove `findTemplate()`.

2. **`generate-import-transformer.md`**: Section transformer reads CSS classes from DOM, not `payload.template.sections`. Runs in `beforeTransform`. Processes any number of sections.

3. **`excat-site-migration`**: Remove per-template loop in Step 6. Single import script, single bundle, single URL file, single import run.

### P1: Should Change (Causes Inconsistency)

4. **`block-mapping-manager`**: Derive section styles from CSS class names, not screenshot pixel colors. Drop `defaultContent[]` generation.

5. **`excat-site-analysis`**: Templates-as-documentation is OK, templates-as-runtime-dependency is not. The skill can still group URLs for organizational purposes, but the grouping should not affect import script generation.

6. **Parser validation hook**: Decouple from `page-templates.json`. Use a lighter-weight registry for test URLs and selectors.

### P2: Nice to Have (Improves Workflow)

7. **`excat-page-analysis`**: Support incremental block discovery across pages. Analysis results accumulate into a growing inventory, not isolated per-template artifacts.

8. **`excat-content-import`**: Remove per-template bundling loop. Bundle once, import all.

---

## Principles for Content-Driven Import

1. **Detect, don't match.** Import scripts scan the DOM for content patterns. They never look up URLs in a mapping table.

2. **One script per DOM vocabulary.** If the source site uses the same CSS classes and component structures across all pages, one import script handles everything. Create a second script only when the HTML vocabulary is fundamentally different (different CMS, different framework, different class naming conventions).

3. **Sections are self-describing.** Section styles come from CSS class names on `<section>` elements. Not from pre-analyzed screenshot colors. Not from positional selectors. Not from a pre-defined template list.

4. **Blocks are self-identifying.** Each block variant has a unique DOM signature (CSS classes, child element patterns) that distinguishes it from every other variant. The import script tests for these signatures, in priority order, with descendant filtering.

5. **Order in the registry, not on the page.** The BLOCK_REGISTRY's ordering handles specificity (specific variants before generic) and nesting (containers before children). The page's own section order or block arrangement is irrelevant.

6. **Parsers are already right.** `parse(element, { document })` — self-contained, content-driven, no template knowledge. Don't change this.

7. **Accumulate, don't partition.** Block variants are discovered incrementally across pages and added to a single growing registry. They're not partitioned into templates that each contain a subset.

8. **No dead weight.** Don't generate artifacts no code consumes (`defaultContent[]`, URL mapping tables, template names embedded in scripts). Every generated artifact should have a consumer.

9. **Selectors must be content-based.** Never use positional pseudo-classes (`nth-of-type`, `nth-child`), sibling combinators (`+`, `~`), or any selector that depends on document position. Use CSS classes, `:has()`, `:not(:has())`, and structural patterns.

10. **The import script is a detector, not a lookup table.** Given a page it has never seen before, with blocks it already knows about, it should correctly identify and parse every block. This is the acid test.
