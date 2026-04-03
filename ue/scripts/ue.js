/**
 * Universal Editor support script.
 * Loaded only when the page is opened in the Universal Editor (.ue.da.live).
 * Use this for DOM modifications that need special handling in UE context,
 * such as preserving instrumentation on decorated blocks.
 */
export default function ue() {
  // Expand accordions so authors can see all content
  document.querySelectorAll('.accordion details').forEach((details) => {
    details.open = true;
  });

  // Show all carousel slides for authoring
  document.querySelectorAll('.carousel-product-slide').forEach((slide) => {
    slide.style.display = '';
  });

  // Show all tab panels for authoring
  document.querySelectorAll('.advanced-tabs .section').forEach((panel) => {
    panel.classList.add('is-visible');
  });
}
