const STATUS_LABELS = Object.freeze({
  draft_private: 'Private draft / Not published',
  unpublished: 'Unpublished',
  published: 'Published',
  suspended: 'Suspended',
});

export function getAccountPassportSummary(passport) {
  if (!passport) return null;
  return {
    alias: (typeof passport.alias === 'string' && passport.alias.trim()) || 'Your Gaming Passport',
    status: Object.hasOwn(STATUS_LABELS, passport.status) ? STATUS_LABELS[passport.status] : 'Status unavailable',
    updatedAt: Number.isFinite(Date.parse(passport.updatedAt)) ? passport.updatedAt : null,
  };
}
