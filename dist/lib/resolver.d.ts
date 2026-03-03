export type SourceType = 'github' | 'gitlab' | 'generic';
export interface ResolvedSource {
    type: SourceType;
    url: string;
}
export declare function resolveSource(url: string): ResolvedSource;
export declare function buildAuthHeaders(type: SourceType, token: string | undefined): Record<string, string>;
//# sourceMappingURL=resolver.d.ts.map