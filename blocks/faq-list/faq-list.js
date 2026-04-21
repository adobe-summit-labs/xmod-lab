export default function decorate(block) {
  const rows = [...block.children];
  const dl = document.createElement('dl');
  dl.className = 'faq-list-items';

  rows.forEach((row, i) => {
    const cols = [...row.children];
    const question = cols[0]?.textContent.trim();
    const answer = cols[1]?.innerHTML;

    const dt = document.createElement('dt');
    dt.className = 'faq-list-question';
    dt.setAttribute('role', 'button');
    dt.setAttribute('tabindex', '0');
    dt.setAttribute('aria-expanded', 'false');
    dt.setAttribute('aria-controls', `faq-answer-${i}`);

    const questionText = document.createElement('span');
    questionText.textContent = question;
    const icon = document.createElement('span');
    icon.className = 'faq-list-icon';
    icon.textContent = '+';
    dt.append(questionText, icon);

    const dd = document.createElement('dd');
    dd.className = 'faq-list-answer';
    dd.id = `faq-answer-${i}`;
    dd.hidden = true;
    dd.innerHTML = answer;

    function toggle() {
      const expanded = dt.getAttribute('aria-expanded') === 'true';
      dt.setAttribute('aria-expanded', String(!expanded));
      dd.hidden = expanded;
      icon.textContent = expanded ? '+' : '−';
    }

    dt.addEventListener('click', toggle);
    dt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    dl.append(dt, dd);
  });

  block.replaceChildren(dl);
}
