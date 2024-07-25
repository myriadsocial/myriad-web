export const OPENGRAPH_URL = `/api/opengraph?text=`;

export function createOpenGraphImageUrl(appUrl: string, text: string) {
  const encodedText = encodeURIComponent(text);
  return `${appUrl}${OPENGRAPH_URL}${encodedText}`;
}
