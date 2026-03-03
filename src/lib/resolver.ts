export type SourceType = 'github' | 'gitlab' | 'generic';

export interface ResolvedSource {
  type: SourceType;
  url: string;
}

export function resolveSource(url: string): ResolvedSource {
  if (url.includes('raw.githubusercontent.com')) {
    return { type: 'github', url };
  }
  if (
    url.includes('gitlab') &&
    (url.includes('/raw/') || url.includes('/repository/files/'))
  ) {
    return { type: 'gitlab', url };
  }
  return { type: 'generic', url };
}

export function buildAuthHeaders(
  type: SourceType,
  token: string | undefined,
): Record<string, string> {
  if (!token) return {};
  switch (type) {
    case 'github':
      return { Authorization: `token ${token}` };
    case 'gitlab':
      return { 'PRIVATE-TOKEN': token };
    default:
      return { Authorization: `Bearer ${token}` };
  }
}
