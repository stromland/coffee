/**
 * Generate a cryptographically secure random ID
 * @param prefix - The prefix to use for the ID (e.g., 'session', 'custom')
 * @returns A unique ID in the format: {prefix}-{timestamp}-{randomString}
 */
export const generateSecureId = (prefix: string): string => {
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(6);
  window.crypto.getRandomValues(randomBytes);
  // Convert to hex string with consistent length (12 characters for 6 bytes)
  const randomString = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}-${timestamp}-${randomString}`;
};
