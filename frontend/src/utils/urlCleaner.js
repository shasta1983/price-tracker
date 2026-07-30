// src/utils/urlCleaner.js
export function cleanProductUrl(rawUrl) {
    if (!rawUrl) return '';

    try {
        const url = new URL(rawUrl.trim());
        const hostname = url.hostname.toLowerCase();

        if (hostname.includes('amazon')) {
            const asinMatch = rawUrl.match(/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
            if (asinMatch) {
                return `https://${url.hostname}/dp/${asinMatch[1]}`;
            }
        }

        if (hostname.includes('ebay')) {
            const ebayMatch = rawUrl.match(/\/itm\/(\d+)/);
            if (ebayMatch) {
                return `https://${url.hostname}/itm/${ebayMatch[1]}`;
            }
        }

        return `${url.origin}${url.pathname}`;
    } catch (e) {
        return rawUrl;
    }
}