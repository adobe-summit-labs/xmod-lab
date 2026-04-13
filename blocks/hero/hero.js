export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length >= 2) {
    const imageRow = rows[0];
    const contentRow = rows[1];
    const img = imageRow.querySelector('img');
    const contentCell = contentRow.querySelector(':scope > div') || contentRow;

    if (img) {
      const picture = document.createElement('picture');
      picture.append(img);
      block.replaceChildren(picture, contentCell);
    } else {
      block.replaceChildren(contentCell);
    }
  }
}
