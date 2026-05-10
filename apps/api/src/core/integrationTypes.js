/**
 * Minimal Integration Layer contracts.
 * Consumers like Pinterest, Discord, and n8n share the same identity language.
 *
 * @typedef {object} IdentityExportRequest
 * @property {'png'|'svg'|'json'} format
 * @property {string} [variant] banner | card | kit | kr | default
 * @property {Record<string, unknown>} [payload] Identity Engine data, opaque to transport
 */

/**
 * @typedef {object} IntegrationResult
 * @property {boolean} ok
 * @property {string} [error]
 * @property {Record<string, unknown>} [data]
 */

export const API_VERSION = 'v1';

export const API_LAYER = 'identity-infrastructure';

export const INTEGRATION_STATUS = {
  RESERVED: 'reserved',
  READY_FOR_CONFIGURATION: 'ready_for_configuration',
  CONFIGURED: 'configured',
  NOT_IMPLEMENTED: 'not_implemented',
};
