/**
 * @file SEO.jsx
 * @description SEO head manager using React 19 native document metadata.
 * No external library needed — React 19 hoists these tags to <head> automatically.
 */

const DEFAULT_TITLE = 'Profynus';
const DEFAULT_DESCRIPTION = 'Your professional platform — Profynus.';
const DEFAULT_IMAGE = '/og-image.png';
const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://profynus.com';

function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  canonical,
  noIndex = false,
  type = 'website',
}) {
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const canonicalURL = canonical ? `${SITE_URL}${canonical}` : null;

  return (
    <>
      {/* ── Primary ───────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalURL && <link rel="canonical" href={canonicalURL} />}

      {/* ── Open Graph ────────────────────────── */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:type" content={type} />
      {canonicalURL && <meta property="og:url" content={canonicalURL} />}
      <meta property="og:site_name" content={DEFAULT_TITLE} />

      {/* ── Twitter Card ──────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
    </>
  );
}

export default SEO;