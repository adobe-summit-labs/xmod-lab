export default async function decorate(block) {
  // Open Instagram links in new tab
  block.querySelectorAll('a[href*="instagram.com"]').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
}
