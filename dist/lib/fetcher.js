import { resolveSource, buildAuthHeaders } from './resolver.js';
import { resolveToken } from './config.js';
export async function fetchConstitution(url, rawToken) {
    const source = resolveSource(url);
    const token = resolveToken(rawToken);
    const headers = buildAuthHeaders(source.type, token);
    const response = await fetch(url, { headers });
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            throw new Error(`Authentication failed (${response.status}). Check your token with: cvc config set --token <TOKEN>`);
        }
        if (response.status === 404) {
            throw new Error(`Constitution file not found (404). Check your URL with: cvc config set --url <URL>`);
        }
        throw new Error(`Failed to fetch constitution: HTTP ${response.status} ${response.statusText}`);
    }
    return response.text();
}
//# sourceMappingURL=fetcher.js.map