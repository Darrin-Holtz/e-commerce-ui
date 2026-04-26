export const getSafeRedirectPath = (rawRedirectUrl?: string) => {
  if (!rawRedirectUrl) return "/";

  try {
    const decodedRedirect = decodeURIComponent(rawRedirectUrl);

    if (decodedRedirect.startsWith("/")) {
      return decodedRedirect;
    }

    const parsedUrl = new URL(decodedRedirect);
    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}` || "/";
  } catch {
    return "/";
  }
};