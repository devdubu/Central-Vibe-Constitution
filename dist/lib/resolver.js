export function resolveSource(url) {
    if (url.includes('raw.githubusercontent.com')) {
        return { type: 'github', url };
    }
    if (url.includes('gitlab') &&
        (url.includes('/raw/') || url.includes('/repository/files/'))) {
        return { type: 'gitlab', url };
    }
    return { type: 'generic', url };
}
export function buildAuthHeaders(type, token) {
    if (!token)
        return {};
    switch (type) {
        case 'github':
            return { Authorization: `token ${token}` };
        case 'gitlab':
            return { 'PRIVATE-TOKEN': token };
        default:
            return { Authorization: `Bearer ${token}` };
    }
}
//# sourceMappingURL=resolver.js.map