/**
 * Convert a GitHub browser blob URL to a raw content URL.
 * github.com/{owner}/{repo}/blob/{branch}/{path}
 * → raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
 */
export declare function normalizeGitHubUrl(url: string): {
    url: string;
    converted: boolean;
};
export declare function fetchConstitution(rawUrl: string, rawToken: string | undefined): Promise<string>;
//# sourceMappingURL=fetcher.d.ts.map