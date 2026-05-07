import React from 'react';
import { Helmet } from 'react-helmet';
import { absoluteUrl, normalizePath } from './paths.js';
import { DEFAULT_OG_IMAGE, DEFAULT_SITE_NAME } from './constants.js';

/**
 * Single source for title, description, canonical, OG/Twitter, and optional JSON-LD blocks.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.path='/'] - URL pathname for canonical (e.g. /roblox-names/cool)
 * @param {string} [props.lang='en']
 * @param {string} [props.ogType='website'] - website | article
 * @param {string} [props.ogImage]
 * @param {string} [props.twitterCard='summary_large_image']
 * @param {boolean} [props.noIndex=false]
 * @param {boolean} [props.skipCanonical=false] - omit canonical (e.g. 404)
 * @param {object[]} [props.jsonLd] - schema.org objects (FAQPage, BreadcrumbList, etc.)
 */
const SeoHead = ({
  title,
  description,
  path = '/',
  lang = 'en',
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  noIndex = false,
  skipCanonical = false,
  jsonLd = [],
}) => {
  const canonical = absoluteUrl(normalizePath(path));
  const image = ogImage || DEFAULT_OG_IMAGE;
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {!skipCanonical && <link rel="canonical" href={canonical} />}

      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={lang === 'es' ? 'es_ES' : 'en_US'} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd.filter(Boolean).map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
