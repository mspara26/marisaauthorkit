/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo. Base: cards.
 * Source: https://www.scholastic.com/home
 * Selectors: .cmp-compoundheader .grid-layout, .cmp-threeCardMerchandising__cards
 * Extracts promotional cards with image, rubric, title, description, and CTA.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which instance: threeCardMerchandising or compoundheader clubs promo
  // Only select the outer card containers to avoid duplicates
  const merchCards = element.querySelectorAll('.cmp-threeCardMerchandising__merchandisingCard');
  const isClubsPromo = element.classList.contains('grid-layout') || element.querySelector('.cmp-compoundheader__clubsImage');

  if (merchCards.length > 0) {
    // Three Card Merchandising variant: multiple promo cards
    merchCards.forEach((card) => {
      const image = card.querySelector('.cmp-merchandisingCard__image img, .cmp-image__image');
      const parentLink = card.querySelector(':scope > a');
      const rubric = card.querySelector('.cmp-merchandisingCard__rubric .cmp-title__text');
      const title = card.querySelector('.cmp-merchandisingCard__cardTitle h3, .cmp-merchandisingCard__cardTitle .cmp-title__text');
      const desc = card.querySelector('.cmp-merchandisingCard__description p, .cmp-merchandisingCard__description .cmp-text p');
      const ctaText = card.querySelector('.cmp-merchandisingCard__actionLink .cmp-title__text');

      // Build text cell
      const textWrapper = document.createElement('div');
      if (rubric) {
        const p = document.createElement('p');
        p.textContent = rubric.textContent.trim();
        textWrapper.append(p);
      }
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textWrapper.append(h3);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textWrapper.append(p);
      }
      if (ctaText && parentLink) {
        const p = document.createElement('p');
        const link = document.createElement('a');
        link.href = parentLink.href;
        link.textContent = ctaText.textContent.trim();
        p.append(link);
        textWrapper.append(p);
      }

      if (image) {
        cells.push([image, textWrapper]);
      } else {
        cells.push([textWrapper]);
      }
    });
  } else if (isClubsPromo) {
    // Book Clubs promo single card
    const logoImage = element.querySelector('.cmp-compoundheader__logoImage, .cmp-compoundheader__clubsImage img');
    const clubsText = element.querySelector('.cmp-compoundheader__clubsText p, .cmp-compoundheader__clubsText .cmp-text p');
    const ctaLink = element.querySelector('.cmp-compoundheader__button a.cmp-title__link');

    const textWrapper = document.createElement('div');
    if (clubsText) {
      const p = document.createElement('p');
      p.textContent = clubsText.textContent.trim();
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

    if (logoImage) {
      cells.push([logoImage, textWrapper]);
    } else {
      cells.push([textWrapper]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
