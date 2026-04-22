export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    // Expect 3 cells: [product-image, badge-image, text-content]
    if (cells.length >= 3) {
      const [imageCell, badgeCell, textCell] = cells;

      // Style the image column
      imageCell.classList.add('image-col');

      // Move the badge into the text cell (prepend)
      const badgeContent = badgeCell.querySelector('picture') || badgeCell.querySelector('img');
      if (badgeContent) {
        const badgeWrapper = document.createElement('div');
        badgeWrapper.classList.add('badge-img');
        badgeWrapper.appendChild(badgeContent);
        textCell.prepend(badgeWrapper);
      }

      // Remove the now-empty badge cell
      badgeCell.remove();

      // Style the text column
      textCell.classList.add('text-col');
    }
  });
}
