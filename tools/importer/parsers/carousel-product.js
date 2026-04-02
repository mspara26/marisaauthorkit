/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product. Base: carousel.
 * Source: https://www.scholastic.com/home
 * Selectors: .merchandisingcarousel .cmp-merchandisingCarousel, .bookcarousel .cmp-merchandisingCarousel, .lobCarousel
 * Extracts carousel slides with image + title for merchandising/book/LOB carousels.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect carousel type
  const isLobCarousel = element.classList.contains('lobCarousel') || element.querySelector('.cmp-lobCarousel');
  const isMerchCarousel = element.querySelector('.cmp-merchandisingCarousel') || element.querySelector('.cmp-merchandisingteaser');

  if (isLobCarousel) {
    // LOB Carousel: each slide has logo, description, and CTA
    // Only process non-cloned, unique slides (skip slick-cloned duplicates)
    const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned) .lobTeaser');

    slides.forEach((slide) => {
      const logoImg = slide.querySelector('.cmp-lobTeaser__logo img');
      const description = slide.querySelector('.cmp-lobTeaser__description p');
      const ctaLink = slide.querySelector('.cmp-lobTeaser__button a.cmp-title__link');

      const textWrapper = document.createElement('div');
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        textWrapper.append(p);
      }
      if (ctaLink) {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.href = ctaLink.href;
        link.textContent = ctaLink.textContent.trim();
        p.append(link);
        textWrapper.append(p);
      }

      if (logoImg) {
        cells.push([logoImg, textWrapper]);
      } else {
        cells.push([textWrapper]);
      }
    });
  } else if (isMerchCarousel) {
    // Merchandising / Book Carousel: each slide has image + title
    // Only process non-cloned slides to avoid duplicates
    const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned) .cmp-merchandisingteaser');

    slides.forEach((slide) => {
      const image = slide.querySelector('.cmp-merchandisingteaser__image img, .cmp-image__image');
      const titleEl = slide.querySelector('.cmp-merchandisingteaser__title h3, .cmp-merchandisingteaser__title .cmp-title__text');
      const parentLink = slide.querySelector('.cmp-merchandisingteaser__content > a');

      const textWrapper = document.createElement('div');
      if (titleEl) {
        const h3 = document.createElement('h3');
        h3.textContent = titleEl.textContent.trim();
        if (parentLink) {
          const link = document.createElement('a');
          link.href = parentLink.href;
          link.textContent = titleEl.textContent.trim();
          h3.textContent = '';
          h3.append(link);
        }
        textWrapper.append(h3);
      }

      if (image) {
        cells.push([image, textWrapper]);
      } else if (textWrapper.childNodes.length > 0) {
        cells.push([textWrapper]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
