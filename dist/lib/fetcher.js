import { resolveSource, buildAuthHeaders } from './resolver.js';
import { resolveToken } from './config.js';
/**
 * Convert a GitHub browser blob URL to a raw content URL.
 * github.com/{owner}/{repo}/blob/{branch}/{path}
 * → raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
 */
export function normalizeGitHubUrl(url) {
    const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/);
    if (match) {
        return {
            url: `https://raw.githubusercontent.com/${match[1]}/${match[2]}/${match[3]}`,
            converted: true,
        };
    }
    return { url, converted: false };
}
export async function fetchConstitution(rawUrl, rawToken) {
    const { url } = normalizeGitHubUrl(rawUrl);
    const source = resolveSource(url);
    const token = resolveToken(rawToken);
    const headers = buildAuthHeaders(source.type, token);
    const response = await fetch(url, { headers });
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error(`Authentication failed (${response.status}). Set a token with: cvc config set --token <TOKEN>`);
        }
        if (response.status === 404) {
            throw new Error(`Constitution file not found (404). Check your URL with: cvc config set --url <URL>`);
        }
        throw new Error(`Failed to fetch constitution: HTTP ${response.status} ${response.statusText}`);
    }
    return response.text();
}
//# sourceMappingURL=fetcher.js.map