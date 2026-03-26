export default async function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  // cells[0] = image (picture)
  // cells[1] = text (tag, h2, description)
  // cells[2] = avatar (picture)
  // cells[3] = byline info (name, meta, CTA link)

  const imageCell = cells[0];
  const textCell = cells[1];
  const avatarCell = cells[2];
  const bylineCell = cells[3];

  // Build footer with byline and CTA
  const footer = document.createElement('div');
  footer.className = 'fa-footer';

  // Build byline
  const byline = document.createElement('div');
  byline.className = 'fa-byline';

  // Avatar
  if (avatarCell) {
    const avatarPic = avatarCell.querySelector('picture');
    if (avatarPic) {
      byline.appendChild(avatarPic);
    }
  }

  // Name + meta
  if (bylineCell) {
    const paragraphs = bylineCell.querySelectorAll('p');
    const bylineInfo = document.createElement('div');
    bylineInfo.className = 'fa-byline-info';

    paragraphs.forEach((p) => {
      // Skip the button-wrapper paragraph (CTA)
      if (p.classList.contains('button-wrapper') || p.querySelector('a.button')) return;
      const clone = p.cloneNode(true);
      clone.className = '';
      bylineInfo.appendChild(clone);
    });

    byline.appendChild(bylineInfo);
  }

  footer.appendChild(byline);

  // CTA button
  if (bylineCell) {
    const ctaLink = bylineCell.querySelector('a');
    if (ctaLink) {
      const ctaWrap = document.createElement('div');
      ctaWrap.className = 'fa-cta';
      ctaWrap.appendChild(ctaLink);
      footer.appendChild(ctaWrap);
    }
  }

  // Append footer to text cell
  textCell.appendChild(footer);

  // Remove avatar and byline cells (now merged)
  if (avatarCell) avatarCell.remove();
  if (bylineCell) bylineCell.remove();
}
