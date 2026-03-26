const WKND_LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" aria-hidden="true"><path d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z" fill="#ffffff"/></svg>';

export default async function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.classList.add('footer-links-grid');

  // Column 1: logo + tagline (from row 0's two cells)
  const col1 = document.createElement('div');
  if (rows[0]) {
    const cells = [...rows[0].children];
    cells.forEach((cell) => col1.append(...cell.children));
  }

  // Replace the icon span with inline SVG
  const iconSpan = col1.querySelector('.icon.icon-wknd-logo');
  if (iconSpan) {
    iconSpan.innerHTML = WKND_LOGO_SVG;
  }

  grid.append(col1);

  // Columns 2-4: Explore, Recent Stories, Info (from rows 1-3, each has 1 cell)
  for (let i = 1; i < rows.length; i++) {
    const col = document.createElement('div');
    if (rows[i]) {
      const cells = [...rows[i].children];
      cells.forEach((cell) => col.append(...cell.children));
    }
    grid.append(col);
  }

  // Replace block content with the grid
  block.textContent = '';
  block.append(grid);
}
