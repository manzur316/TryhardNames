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
  const origin = 'https://tryhardnames.com';
  const elements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${origin}/`,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.name,
      item: `${origin}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: elements,
  };
}
