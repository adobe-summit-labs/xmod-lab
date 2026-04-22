export default async function decorate(block) {
  const rows = [...block.children];

  // Find heading, subtitle, card rows, and CTA
  let heading = null;
  let subtitle = null;
  const cardRows = [];
  let ctaRow = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const firstCell = cells[0];

    // Check if this row has an h2 (heading row)
    if (firstCell && firstCell.querySelector('h2')) {
      heading = firstCell.querySelector('h2');
      // Subtitle is the next p after h2
      subtitle = firstCell.querySelector('p');
      row.remove();
      return;
    }

    // Check if this row has an image (card row)
    if (firstCell && firstCell.querySelector('img')) {
      cardRows.push(row);
      return;
    }

    // Check if this is the CTA row (has a link but no image)
    if (firstCell && firstCell.querySelector('a') && !firstCell.querySelector('img')) {
      ctaRow = row;
    }
  });

  // Clear block and rebuild
  block.textContent = '';

  // Add heading
  if (heading) {
    block.appendChild(heading);
  }

  // Add subtitle
  if (subtitle) {
    block.appendChild(subtitle);
  }

  // Create cards grid
  const grid = document.createElement('div');
  grid.className = 'cards-grid';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const textCell = cells[1];

    // Create card link
    const link = textCell ? textCell.querySelector('a') : null;
    const card = document.createElement('a');
    card.className = 'card';
    card.href = link ? link.href : '#';

    // Card image
    const cardImage = document.createElement('div');
    cardImage.className = 'card-image';
    const img = imageCell ? imageCell.querySelector('img') : null;
    if (img) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        cardImage.appendChild(picture);
      } else {
        cardImage.appendChild(img);
      }
    }
    card.appendChild(cardImage);

    // Card content
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    const h3 = textCell ? textCell.querySelector('h3') : null;
    if (h3) {
      cardContent.appendChild(h3);
    }

    // Meta info (first p that's not a link container)
    const paragraphs = textCell ? [...textCell.querySelectorAll('p')] : [];
    paragraphs.forEach((p) => {
      if (!p.querySelector('a') && p.textContent.trim()) {
        const meta = document.createElement('p');
        meta.className = 'meta';
        meta.textContent = p.textContent;
        cardContent.appendChild(meta);
      }
    });

    card.appendChild(cardContent);
    grid.appendChild(card);
  });

  block.appendChild(grid);

  // Add CTA button
  if (ctaRow) {
    const ctaLink = ctaRow.querySelector('a');
    if (ctaLink) {
      ctaLink.className = 'cta-button';
      block.appendChild(ctaLink);
    }
  }
}
