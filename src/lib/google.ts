export const GOOGLE_PROFILE = {
  rating: null as number | null,
  reviewCount: 0,
  reviewsUrl: null as string | null,
};

export const GOOGLE_REVIEWS: { author: string; text: string; when: string }[] = [];

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
