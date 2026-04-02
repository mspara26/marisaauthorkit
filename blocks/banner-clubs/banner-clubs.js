export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const [imageCell, contentCell] = row.children;
  if (imageCell) imageCell.classList.add('banner-clubs-image');
  if (contentCell) contentCell.classList.add('banner-clubs-content');

  // Mark the logo image (first img in content cell)
  const logoImg = contentCell?.querySelector('img');
  if (logoImg) logoImg.classList.add('banner-clubs-logo');

  // Mark the CTA link
  const cta = contentCell?.querySelector('a');
  if (cta) cta.classList.add('banner-clubs-cta');
}
