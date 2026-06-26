import {
  PUBLIC_PROFILE_REPORT_CATEGORIES,
  REPORT_DETAILS_MAX_LENGTH,
  validatePublicProfileReportInput,
} from './reportPolicy.js';

export function buildDefaultPublicProfileReportForm() {
  return {
    category: PUBLIC_PROFILE_REPORT_CATEGORIES[0],
    details: '',
  };
}

export function getPublicProfileReportFormState(input = {}) {
  const validation = validatePublicProfileReportInput(input);
  return {
    ...validation,
    detailsRemaining: Math.max(0, REPORT_DETAILS_MAX_LENGTH - validation.value.details.length),
  };
}
