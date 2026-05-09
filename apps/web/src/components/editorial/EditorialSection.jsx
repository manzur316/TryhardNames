import React from 'react';
import EditorialMicroGuides from '@/components/EditorialMicroGuides.jsx';

export default function EditorialSection({ blocks, category, keyword, pageSlug, onLinkClick }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <EditorialMicroGuides
      blocks={blocks}
      category={category}
      keyword={keyword}
      pageSlug={pageSlug}
      onLinkClick={onLinkClick}
    />
  );
}

