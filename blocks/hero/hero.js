export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length >= 2) {
    const imageRow = rows[0];
    const contentRow = rows[1];
    const contentCell = contentRow.querySelector(':scope > div') || contentRow;

    // Preserve existing <picture> with its <source> elements; fall back to wrapping bare <img>
    const picture = imageRow.querySelector('picture');
    if (picture) {
      block.replaceChildren(picture, contentCell);
    } else {
      const img = imageRow.querySelector('img');
      if (img) {
        const pic = document.createElement('picture');
        pic.append(img);
        block.replaceChildren(pic, contentCell);
      } else {
        block.replaceChildren(contentCell);
      }
    }
  }

  // Inject flamingo feathers and Vegas glitz particles
  const FEATHER_COUNT = 6;
  const GLITZ_COUNT = 9;
  for (let i = 0; i < FEATHER_COUNT; i += 1) {
    const feather = document.createElement('span');
    feather.classList.add('hero-feather');
    feather.setAttribute('aria-hidden', 'true');
    block.append(feather);
  }
  for (let i = 0; i < GLITZ_COUNT; i += 1) {
    const glitz = document.createElement('span');
    glitz.classList.add('hero-glitz');
    glitz.setAttribute('aria-hidden', 'true');
    block.append(glitz);
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
