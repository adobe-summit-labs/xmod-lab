export default async function decorate(block) {
  // The hero has one row with two cells: [image, text]
  // The image cell becomes a background, the text cell overlays it
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  const imageCell = cells[0];
  const textCell = cells[1];

  if (imageCell) {
    imageCell.classList.add('hero-image');
  }

  if (textCell) {
    textCell.classList.add('hero-content');
  }
}
