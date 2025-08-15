// Utility functions for location privacy protection

/**
 * Masks a full address to show only general area for privacy
 * Examples:
 * "1315 Morreene Rd, Apt 4" -> "Morreene Rd area"
 * "929 Morreene Rd" -> "Morreene Rd area"
 * "Campus Housing Building A" -> "Campus Housing Building A" (unchanged)
 */
export const maskDetailedAddress = (location: string | undefined): string => {
  if (!location) return '';
  
  // If it contains common campus/dorm keywords, don't mask it
  const campusKeywords = ['campus', 'dorm', 'hall', 'building', 'residence', 'student center'];
  const lowerLocation = location.toLowerCase();
  
  if (campusKeywords.some(keyword => lowerLocation.includes(keyword))) {
    return location;
  }
  
  // Extract street name and add "area" suffix
  // Remove house numbers (digits at the start)
  const streetNameMatch = location.match(/^\d+\s+(.+?)(?:,|$)/);
  if (streetNameMatch) {
    const streetName = streetNameMatch[1].trim();
    return `${streetName} area`;
  }
  
  // If no house number pattern, show first part before comma
  const firstPart = location.split(',')[0].trim();
  return firstPart.includes('area') ? firstPart : `${firstPart} area`;
};

/**
 * Determines if a user should see the full address
 * Full address is shown to:
 * - The listing owner
 * - Users who have started a conversation about this listing
 * - Admins
 */
export const shouldShowFullAddress = (
  userId: string | undefined,
  listingOwnerId: string,
  isInConversation: boolean = false,
  isAdmin: boolean = false
): boolean => {
  if (!userId) return false;
  return userId === listingOwnerId || isInConversation || isAdmin;
};

/**
 * Gets the appropriate location text based on privacy settings
 */
export const getPrivacyAwareLocation = (
  location: string | undefined,
  userId: string | undefined,
  listingOwnerId: string,
  isInConversation: boolean = false,
  isAdmin: boolean = false
): string => {
  if (!location) return '';
  
  if (shouldShowFullAddress(userId, listingOwnerId, isInConversation, isAdmin)) {
    return location;
  }
  
  return maskDetailedAddress(location);
};