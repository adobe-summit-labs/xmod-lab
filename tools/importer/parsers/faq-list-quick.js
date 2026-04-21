/* eslint-disable */
/* global WebImporter */
/** Parser for faq-list-quick. Base: faq-list. Source: wknd-adventures.com. */
export default function parse(element, { document }) {
  const faqItems = Array.from(element.querySelectorAll('.faq-item'));
  const cells = [];

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question span:first-child, .faq-question');
    const answerDiv = item.querySelector('.faq-answer');

    const questionText = questionBtn ? questionBtn.textContent.trim().replace(/\s*[+\-×]\s*$/, '') : '';
    const answerText = answerDiv ? answerDiv.textContent.trim() : '';

    const questionP = document.createElement('p');
    questionP.textContent = questionText;
    const answerP = document.createElement('p');
    answerP.textContent = answerText;

    cells.push([[questionP], [answerP]]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'faq-list-quick', cells });
  element.replaceWith(block);
}
