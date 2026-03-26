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
      block.classList.add('no-image');
      block.replaceChildren(contentCell);
    }
  } else if (rows.length === 1) {
    block.classList.add('no-image');
  }

  // Decorate CTA links as buttons (links not wrapped in strong/em)
  const content = block.querySelector(':scope > div');
  if (content) {
    let pastHeading = false;
    let ctaIndex = 0;
    [...content.children].forEach((child) => {
      if (child.matches('h1, h2, h3')) pastHeading = true;
      if (pastHeading && child.matches('p')
        && child.children.length === 1
        && child.firstElementChild?.tagName === 'A') {
        const link = child.firstElementChild;
        link.classList.add('button');
        link.classList.add(ctaIndex === 0 ? 'accent' : 'secondary');
        child.classList.add('button-wrapper');
        ctaIndex += 1;
      }
    });
  }
}
