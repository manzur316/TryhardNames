import { absoluteUrl } from './paths.js';

/**
 * JSON-LD helpers — Google-compliant FAQPage / BreadcrumbList
 */

/**
 * @param {Array<{ question: string, answer: string }>} pairs
 */
export function faqPageSchema(pairs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * @param {Array<{ name: string, path: string }>} items — paths are pathname suffixes e.g. /roblox-names
 */
export function breadcrumbListSchema(items) {
  const elements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: absoluteUrl('/'),
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: elements,
  };
}
