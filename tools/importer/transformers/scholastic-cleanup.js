/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Scholastic site cleanup.
 * Removes non-authorable content: header, footer, cookie consent, navigation.
 * Selectors from captured DOM of https://www.scholastic.com/home
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent / OneTrust SDK (blocks parsing)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-pc-sdk',
      '.onetrust-pc-dark-filter',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      'header#corp-home-globalNav',
      'footer#corp-home-footer',
      '.footer',
      'noscript',
      'iframe',
      'link',
    ]);
  }
}
