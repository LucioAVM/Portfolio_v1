export const PROJECT_CATEGORIES = ['dev', 'ciberseguridad', 'impresion3d'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
