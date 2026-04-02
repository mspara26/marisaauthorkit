/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-scholastic. Base: hero.
 * Source: https://www.scholastic.com/home
 * Selector: .compoundheader .cmp-compoundheader
 * Extracts main hero banner with background image, heading, and CTA.
 */
export default function parse(element, { document }) {
  // Row 1: Background image - try multiple selectors for hero bg
  const bgImage = element.querySelector('.cmp-compoundheader__hero > img, .cmp-compoundheader__hero img:first-of-type, .cmp-compoundheader__floatingImage img');

  // Row 2: Heading + CTA in one cell
  const heading = element.querySelector('.cmp-compoundheader__headerTitle h2, .cmp-compoundheader__headerTitle .cmp-title__text');
  const ctaLink = element.querySelector('.cmp-compoundheader__actionLink a.cmp-title__link, .cmp-compoundheader__actionLink a');

  const cells = [];

  // Row 1: background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: single cell with heading + CTA
  const wrapper = document.createElement('div');
  if (heading) wrapper.append(heading);
  if (ctaLink) {
    const p = document.createElement('p');
    p.append(ctaLink);
    wrapper.append(p);
  }
  if (wrapper.childNodes.length > 0) {
    cells.push([wrapper]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-scholastic', cells });
  element.replaceWith(block);
}
