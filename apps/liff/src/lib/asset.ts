/** Resolves a file in public/ against Vite's relative base, so it works on any host path. */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
