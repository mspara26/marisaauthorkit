/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo. Base: hero.
 * Source: https://www.scholastic.com/home
 * Selector: .responsivegrid .aem-Grid.layout-02-top.layout-02-bottom
 * Extracts promotional banners with image, heading, and CTA button.
 */
export default function parse(element, { document }) {
  // Row 1: Hero image - main content image (teacher reading, child watching TV, etc.)
  const heroImage = element.querySelector('.cmp-image__image, .cmp-image img, .image img');

  // Row 2: Heading + CTA in one cell
  const heading = element.querySelector('.heading h2, .heading .cmp-title__text, h2.cmp-title__text');
  const ctaContainer = element.querySelector('.button .cmp-title a.cmp-title__link, .button a.cmp-title__link');

  const cells = [];

  // Row 1: hero image
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: single cell with heading + CTA
  const wrapper = document.createElement('div');
  if (heading) {
    // Extract the text content into a clean h2
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    wrapper.append(h2);
  }
  if (ctaContainer) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = ctaContainer.href;
    link.textContent = ctaContainer.textContent.trim();
    p.append(link);
    wrapper.append(p);
  }
  if (wrapper.childNodes.length > 0) {
    cells.push([wrapper]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
