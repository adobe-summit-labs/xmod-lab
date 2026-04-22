# Slicc Project Setup

Convert a Slicc-generated project into a working AEM Edge Delivery Services local environment.

## What is Slicc?

Slicc is the "Experience Modernization Agent" — a Chrome browser extension that:
1. Generates a project from `aem-boilerplate` (https://github.com/adobe/aem-boilerplate)
2. Creates a `drafts/` folder with EDS document format (`.plain.html` files)
3. Decomposes the source page into individual blocks (one preview page per block)
4. Styles each block (including header and footer) with CSS
5. Assembles all blocks into a full page (e.g. `home.plain.html`)

## When to use this skill

Trigger when ANY of these conditions are true:
- `content/` folder is empty but `drafts/` folder has `.plain.html` files
- User mentions "Slicc" or asks to initialize/set up the project
- User asks to create content from drafts
- User says the content folder is empty or nothing shows up

## Project structure (Slicc output)

```
drafts/
├── home.plain.html              # Assembled full page
├── home-preview.html            # Full HTML preview of assembled page
├── nav.plain.html               # Navigation content
├── footer.plain.html            # Footer content
├── hero.plain.html              # Individual block content
├── hero-preview.html            # Block preview page
├── {block-name}.plain.html      # More blocks...
├── {block-name}-preview.html    # More previews...
├── header-preview.html          # Header preview page
├── footer-links-preview.html    # Footer preview page
└── images/                      # All local images
```

## Setup workflow

### Step 1: Inventory the drafts folder

```bash
ls drafts/*.plain.html
ls drafts/images/
```

Identify:
- The **assembled page** (usually `home.plain.html` — the largest file with all blocks)
- The **nav** file (`nav.plain.html`)
- The **footer** file (`footer.plain.html`)
- The **individual block files** (one per block)
- The **images** folder

### Step 2: Create content folder structure

```bash
mkdir -p content/images
cp -r drafts/images/* content/images/
```

### Step 3: Create content .plain.html files

For each assembled page (e.g. `home.plain.html`):

1. Read `drafts/home.plain.html`
2. Create `content/index.plain.html` with the **exact same markup**
3. Replace all image paths: `/drafts/images/` → `/content/images/`
4. Do NOT change any block structure, class names, or HTML nesting

For nav and footer:
1. Copy `drafts/nav.plain.html` → `content/nav.plain.html` (fix image paths)
2. Copy `drafts/footer.plain.html` → `content/footer.plain.html` (fix image paths)

**CRITICAL: Do NOT modify the HTML structure. The blocks are already styled and working. Only change image paths.**

### Step 4: Create root-level nav and footer

The AEM header/footer blocks default to fetching `/nav` and `/footer`. The dev server
resolves these to `nav.plain.html` and `footer.plain.html` at the project root.

```bash
cp content/nav.plain.html nav.plain.html
cp content/footer.plain.html footer.plain.html
```

### Step 5: Create preview HTML files

Preview files are full HTML pages that load the AEM scripts and point to the correct
nav/footer content paths. They allow browsing the content in the dev server UI.

Create these files in `content/`:

**home-preview.html** — Full homepage preview:
```html
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="nav" content="/content/nav">
  <meta name="footer" content="/content/footer">
  <link rel="stylesheet" href="https://use.typekit.net/{TYPEKIT_ID}.css">
  <script nonce="aem" src="/scripts/aem.js" type="module"></script>
  <script nonce="aem" src="/scripts/scripts.js" type="module"></script>
  <link rel="stylesheet" href="/styles/styles.css"/>
  <style>html, body { overflow: auto !important; }</style>
</head>
<body>
  <header></header>
  <main>
    <!-- Paste the exact content from content/index.plain.html here -->
  </main>
  <footer></footer>
</body>
</html>
```

**header-preview.html** — Standalone header preview:
```html
<!-- Same <head> as above -->
<body>
  <header></header>
  <main>
    <div><h1>Header Preview</h1><p>Content below header for context.</p></div>
  </main>
  <footer></footer>
</body>
```

**footer-preview.html** — Standalone footer preview:
```html
<!-- Same <head> as above -->
<body>
  <header></header>
  <main>
    <div><p>Footer preview</p></div>
  </main>
  <footer></footer>
</body>
```

**To find the Typekit ID:** Check the drafts preview files for the `use.typekit.net` URL.
If none exists, omit the Typekit stylesheet line.

### Step 6: Verify

1. Navigate to `http://localhost:3000/content/home-preview` (or `/content/home-preview.html`)
2. Confirm header renders with logo and navigation
3. Confirm all blocks render correctly
4. Confirm footer renders with links and copyright
5. Confirm all images load

## Key rules

- **Never modify block HTML structure** — Slicc has already styled the blocks; changing structure breaks styling
- **Only change image paths** — `/drafts/images/` → `/content/images/`
- **Preview files need explicit meta tags** — `<meta name="nav" content="/content/nav">` and `<meta name="footer" content="/content/footer">`
- **Root nav/footer copies are required** — for default path resolution when pages don't have explicit meta tags
- **The assembled page becomes `index.plain.html`** — the homepage lives at `content/index.plain.html`
- **Don't run the full migration workflow** — Slicc already did the block decomposition and styling. Just copy and wire up the content.

## Checklist

```
- [ ] content/images/ populated from drafts/images/
- [ ] content/index.plain.html created from drafts/home.plain.html (paths fixed)
- [ ] content/nav.plain.html created from drafts/nav.plain.html (paths fixed)
- [ ] content/footer.plain.html created from drafts/footer.plain.html (paths fixed)
- [ ] nav.plain.html at project root (copy of content/nav.plain.html)
- [ ] footer.plain.html at project root (copy of content/footer.plain.html)
- [ ] content/home-preview.html created (full HTML with meta tags)
- [ ] content/header-preview.html created
- [ ] content/footer-preview.html created
- [ ] Preview verified in browser — header, blocks, footer all render
```
