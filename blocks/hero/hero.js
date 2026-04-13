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

  // Tag pills: eyebrow p and em-wrapped tags
  const contentDiv = block.querySelector(':scope > div');
  if (contentDiv) {
    const firstP = contentDiv.querySelector(':scope > p:first-child');
    if (firstP && !firstP.querySelector('a, img')) firstP.classList.add('tag-pill');
    contentDiv.querySelectorAll('em').forEach((em) => {
      if (!em.querySelector('a')) em.classList.add('tag-pill');
    });
  }
}
