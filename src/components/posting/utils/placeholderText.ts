
export const getTitlePlaceholder = (
  listingType: 'offer' | 'wanted',
  category: 'marketplace' | 'housing' | 'services'
) => {
  if (listingType === 'wanted') {
    switch (category) {
      case 'marketplace':
        return 'Looking for twin mattress in good condition';
      case 'housing':
        return 'Looking for 2-bedroom apartment near campus';
      case 'services':
        return 'Need math tutoring for calculus';
      default:
        return 'What are you looking for?';
    }
  } else {
    switch (category) {
      case 'marketplace':
        return 'Twin Mattress - Like New Condition';
      case 'housing':
        return '2-Bedroom Apartment Available for Spring Semester';
      case 'services':
        return 'Math Tutoring - Calculus & Statistics';
      default:
        return 'Enter title here...';
    }
  }
};

export const getDescriptionPlaceholder = (
  listingType: 'offer' | 'wanted',
  category: 'marketplace' | 'housing' | 'services'
) => {
  if (listingType === 'wanted') {
    switch (category) {
      case 'marketplace':
        return 'I\'m looking for a twin mattress in good condition for my dorm room. Preferably memory foam or hybrid, no stains or odors. Must be clean and comfortable. Willing to meet on campus or arrange pickup. Budget is flexible for the right mattress.';
      case 'housing':
        return 'Looking for a 2-bedroom apartment or house within walking distance of campus. Need it for the spring semester (January-May). Prefer furnished or partially furnished. Must allow pets (small dog). Budget is flexible for the right place.';
      case 'services':
        return 'I need help with Calculus I - specifically with derivatives and integration. Looking for someone who can meet twice a week, preferably in the evenings. Can meet at the library or virtually. Please mention your experience and availability.';
      default:
        return 'Please provide detailed information about what you\'re looking for, including specifications, preferred condition, timeline, and any other requirements...';
    }
  } else {
    switch (category) {
      case 'marketplace':
        return 'Twin mattress in excellent condition, used for only 6 months. Memory foam with cooling gel layer. No stains, odors, or damage. Always used with mattress protector. Great for dorm rooms or small spaces. Includes mattress protector.';
      case 'housing':
        return 'Beautiful 2-bedroom apartment available for spring semester sublease. Fully furnished with modern appliances. 10-minute walk to campus. Includes utilities (water, electricity, internet). Pet-friendly building with laundry facilities. Available January 1st.';
      case 'services':
        return 'Experienced math tutor offering help with Calculus, Statistics, and Algebra. I\'m a senior math major with 3+ years of tutoring experience. Available weekday evenings and weekends. Can meet at the library, your place, or conduct sessions online.';
      default:
        return 'Describe your listing in detail. Include condition, features, availability, and any important information buyers should know...';
    }
  }
};

export const getLocationPlaceholder = (listingType: 'offer' | 'wanted') => {
  if (listingType === 'wanted') {
    return 'Campus library, dorms, or anywhere on campus';
  }
  return 'North Campus, Student Union, Main Library area';
};
