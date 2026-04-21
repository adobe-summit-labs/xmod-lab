export default function decorate(block) {
  const rows = [...block.children];
  const list = document.createElement('div');
  list.className = 'editorial-index-list';

  rows.forEach((row) => {
    const cols = [...row.children];
    const item = document.createElement('div');
    item.className = 'editorial-index-item';

    const number = document.createElement('div');
    number.className = 'editorial-index-number';
    number.textContent = cols[0]?.textContent.trim() || '';

    const content = document.createElement('div');
    content.className = 'editorial-index-content';
    if (cols[1]) content.innerHTML = cols[1].innerHTML;

    item.append(number, content);
    list.append(item);
  });

  block.replaceChildren(list);
}
