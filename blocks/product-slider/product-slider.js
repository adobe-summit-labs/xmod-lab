export default async function decorate(block) {
  const rows = [...block.children];

  // Build slider track from rows
  const track = document.createElement('div');
  track.className = 'slider-track';

  rows.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const titleCell = cells[1];

    const card = document.createElement('a');
    card.className = 'product-card';

    // Extract link from title cell
    const link = titleCell?.querySelector('a');
    if (link) {
      card.href = link.href;
    }

    // Image
    const img = imageCell?.querySelector('img');
    if (img) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'card-image';
      const picture = imageCell.querySelector('picture') || document.createElement('picture');
      if (picture.parentElement !== imageDiv) {
        imageDiv.appendChild(picture);
      }
      card.appendChild(imageDiv);
    }

    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    titleDiv.textContent = link ? link.textContent : (titleCell?.textContent || '');
    card.appendChild(titleDiv);

    track.appendChild(card);
  });

  // Clear block and set up slider
  block.textContent = '';
  block.appendChild(track);

  // Add navigation arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'slider-nav prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'slider-nav next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#10095;';

  block.appendChild(prevBtn);
  block.appendChild(nextBtn);

  // Slider logic
  const cards = track.querySelectorAll('.product-card');
  const totalCards = cards.length;
  let currentIndex = 0;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w < 600) return 1;
    if (w < 900) return 2;
    return 3;
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, totalCards - visibleCount);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const gap = 22; // matches --slider-gap
    const cardWidth = (track.offsetWidth - gap * (visibleCount - 1)) / visibleCount;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    nextBtn.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
    nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
  }

  prevBtn.addEventListener('click', () => {
    currentIndex -= 1;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex += 1;
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);
  updateSlider();
}
