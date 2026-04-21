export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const contentRow = rows[1];

  // Build background image from picture or plain img
  const pic = imageRow.querySelector('picture') || imageRow.querySelector('img');
  if (pic) {
    const bg = document.createElement('div');
    bg.className = 'hero-bg';
    bg.append(pic);
    block.prepend(bg);
  }
  imageRow.remove();

  // Content container
  const content = contentRow.querySelector('div') || contentRow;
  content.classList.add('hero-content');
  if (contentRow !== content) {
    block.append(content);
    contentRow.remove();
  }
}
