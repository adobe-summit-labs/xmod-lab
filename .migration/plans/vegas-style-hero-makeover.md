# Figma Accordion Import Plan — FAQ List Block

## Figma Design Analysis

The Figma design (`WKND - Accordion`) shows four accordion states:

| State | Summary BG | Border | Icon Color | Body BG |
|-------|-----------|--------|------------|---------|
| **Closed Default** | `#f2ece3` (cream) | `1px solid #e8651a` (accent) | `#e8651a` (accent) | — |
| **Closed Hover** | `#e8651a` (accent/orange) | `1px solid #0f1a14` (dark) | `#ffffff` (white) | — |
| **Opened Default** | `#f2ece3` (cream) | `1px solid #e8651a` (accent) | `#e8651a` (accent, rotated 45deg) | `#f2ece3` (cream) |
| **Opened Hover** | `#e8651a` (accent/orange) | `1px solid #0f1a14` (dark) | `#f2ece3` (cream) | `#f2ece3` (cream) |

### Key Design Tokens from Figma
- **Border radius:** `16px` (rounded pill)
- **Question font:** Instrument Sans, 600 weight, 18px, line-height 22px
- **Answer font:** Instrument Sans, 400 weight, 16px, line-height 27px, color `#3d4f45`
- **Question padding:** `16px 24px`
- **Answer padding:** `16px 24px`
- **Icon:** `+` character, 20px, rotates 45deg when open
- **Answer border:** top divider between summary and body (in the open default state, body has cream bg; in open hover, header is orange with cream body)

## Current Implementation vs Figma

| Aspect | Current CSS | Figma Design | Change Needed? |
|--------|------------|--------------|----------------|
| Border radius | `16px` | `16px` | No |
| Border color (default) | `var(--border-color-light)` = `#ddd8cf` | `#e8651a` (accent) | **Yes** — default border should be accent |
| Summary BG (default) | transparent | `#f2ece3` (cream) | **Yes** — add cream bg |
| Summary BG (hover) | `var(--faq-hover-bg)` = cream | `#e8651a` (orange) | **Yes** — hover should be orange |
| Summary text (hover) | dark (unchanged) | dark (unchanged) | No |
| Icon color (hover) | accent (unchanged) | `#ffffff` (white) | **Yes** — icon turns white on hover |
| Border (hover) | accent | `#0f1a14` (dark) | **Yes** — border goes dark on hover |
| Open summary BG | cream | cream | No (matches) |
| Open body BG | `#fff` (white) | `#f2ece3` (cream) | **Yes** — body should be cream |
| Open body border-top | `1px solid border-color-light` | none visible | **Yes** — remove divider line |
| Question font/size | 18px, 600 | 18px, 600 | No |
| Answer font/color | 16px, `#3d4f45` | 16px, `#3d4f45` | No |
| + icon rotation | 45deg | 45deg | No |

## Files to Modify

- **`blocks/faq-list/faq-list.css`** — Update styles to match Figma states
- **`blocks/faq-list/faq-list.js`** — No changes needed (structure is correct)
- **`content/index.plain.html`** — No changes needed (content is correct)

## Checklist

- [ ] Update `.faq-list details` default border from `border-color-light` to accent color
- [ ] Add cream background (`var(--cream-color)`) to `.faq-list details summary` default state
- [ ] Change `.faq-list details summary:hover` background to accent orange (`var(--accent-color)`)
- [ ] Add hover rule: summary `::after` icon turns white on hover
- [ ] Add hover rule: border color changes to dark on hover
- [ ] Update `.faq-list details[open] .faq-list-item-body` background from white to cream
- [ ] Remove the `border-top` divider on open body (Figma shows no separator line)
- [ ] Verify preview matches Figma screenshot (all 4 states: closed default, closed hover, open default, open hover)

## Implementation Notes

- All color values already exist as CSS custom properties (`--accent-color`, `--cream-color`, `--dark-color`, `--light-color`)
- No JS changes needed — the `<details>`/`<summary>` structure and animation are already correct
- Changes are CSS-only, scoped entirely to `.faq-list` selectors
- Transitions should remain at `0.15s ease` for background/border changes

> **Ready for implementation.** Switch to Execute mode to apply these CSS changes.
