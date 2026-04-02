import { getConfig } from '../../scripts/ak.js';

const LOGO_URL = 'https://www.scholastic.com/content/dam/corp-home/asset.jpg/scholastic-logo-white-outline.png';

const LEGAL_LINKS = [
  { text: 'Privacy Policy', href: 'https://www.scholastic.com/privacy.htm', className: 'privacy' },
  { text: 'Terms of Use', href: 'https://www.scholastic.com/terms.htm' },
  { text: 'Do Not Sell My Info', href: 'https://www.scholastic.com/content/corp-home/donotsell.html' },
  { text: 'California Privacy Notice', href: 'https://www.scholastic.com/site/privacy.html#7' },
  { text: 'About Scholastic', href: 'https://www.scholastic.com/aboutscholastic' },
];

const COPYRIGHT = 'TM \u00AE & \u00A9 2026 Scholastic Inc. All Rights Reserved.';

function parseFooterContent() {
  const footerHeading = document.querySelector('main h2#footer');
  if (!footerHeading) return null;

  const wrapper = footerHeading.parentElement;
  const elements = [];
  let current = footerHeading;
  while (current) {
    elements.push(current);
    current = current.nextElementSibling;
  }

  // First element is the "Footer" heading - skip it
  // Second element is the social icons paragraph
  const socialEl = elements[1];
  const socialLinks = socialEl ? [...socialEl.querySelectorAll('a')].map((a) => ({
    href: a.href,
    imgSrc: a.querySelector('img')?.src,
    alt: a.querySelector('img')?.alt || '',
  })) : [];

  // Parse columns: h2 headings followed by link paragraphs
  const columns = [];
  for (let i = 2; i < elements.length; /* increment in body */) {
    const elem = elements[i];
    if (elem.tagName === 'H2') {
      const column = { heading: elem.textContent.trim(), links: [] };
      i += 1;
      // Skip down arrow paragraph
      if (i < elements.length && elements[i]?.querySelector('img[alt="Down Arrow"]')) i += 1;
      // Collect links until next h2 or end
      while (i < elements.length && elements[i].tagName !== 'H2') {
        const link = elements[i].querySelector('a');
        if (link) {
          column.links.push({ text: link.textContent.trim(), href: link.href });
        }
        // Skip non-link elements (expand/collapse icons, More/Less text)
        i += 1;
      }
      columns.push(column);
    } else {
      i += 1;
    }
  }

  // Remove footer content from the page
  elements.forEach((el) => el.remove());
  // Remove the wrapper if it's now empty
  if (wrapper && wrapper.children.length === 0) wrapper.remove();

  return { socialLinks, columns };
}

function buildFooter(data) {
  const container = document.createElement('div');
  container.className = 'footer-content';

  // Social icons row
  const socialDiv = document.createElement('div');
  socialDiv.className = 'footer-social';
  data.socialLinks.forEach(({ href, imgSrc, alt }) => {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', alt);
    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = alt;
      img.loading = 'lazy';
      a.append(img);
    }
    socialDiv.append(a);
  });
  container.append(socialDiv);

  // Columns grid
  const columnsDiv = document.createElement('div');
  columnsDiv.className = 'footer-columns';
  data.columns.forEach((col) => {
    const colDiv = document.createElement('div');
    colDiv.className = 'footer-column';

    const heading = document.createElement('h2');
    heading.textContent = col.heading;
    colDiv.append(heading);

    const ul = document.createElement('ul');
    col.links.forEach(({ text, href }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      li.append(a);
      ul.append(li);
    });
    colDiv.append(ul);
    columnsDiv.append(colDiv);
  });
  container.append(columnsDiv);

  // Bottom bar
  const bottomDiv = document.createElement('div');
  bottomDiv.className = 'footer-bottom';

  const logoLink = document.createElement('a');
  logoLink.href = 'https://www.scholastic.com';
  logoLink.className = 'footer-logo';
  const logoImg = document.createElement('img');
  logoImg.src = LOGO_URL;
  logoImg.alt = 'Scholastic';
  logoImg.loading = 'lazy';
  logoLink.append(logoImg);
  bottomDiv.append(logoLink);

  const legalDiv = document.createElement('div');
  legalDiv.className = 'footer-legal';
  LEGAL_LINKS.forEach(({ text, href, className }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    if (className) a.className = className;
    legalDiv.append(a);
  });
  bottomDiv.append(legalDiv);

  const copyrightP = document.createElement('p');
  copyrightP.className = 'footer-copyright';
  copyrightP.textContent = COPYRIGHT;
  bottomDiv.append(copyrightP);

  container.append(bottomDiv);

  return container;
}

export default async function init(el) {
  getConfig();
  const data = parseFooterContent();
  if (!data) return;
  const footer = buildFooter(data);
  el.append(footer);
}
