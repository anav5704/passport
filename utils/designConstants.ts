/**
 * Design constants for consistent styling across the app
 */

export const COLORS = {
    // Brand Colors
    primary: "#009ca3", // Teal accent color
    danger: "#F43F5E", // Tailwind rose-500

    // Neutral Colors
    white: "#ffffff",
    black: "#000000",

    // Gray Scale
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1f2937",
    gray900: "#111827",

    // Legacy colors (to be replaced with theme colors)
    borderLight: "#f4f4f5",
    textDark: "#333333",
    textMedium: "#666666",
} as const;

export const BORDER_RADIUS = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999, // For pill-shaped elements
} as const;

export const FONT_SIZE = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
} as const;

export const FONT_WEIGHT = {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
} as const;

export const SPACING = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
    "4xl": 40,
    "5xl": 48,
    "6xl": 64,
} as const;

export const PADDING = {
    // Horizontal padding
    h_xs: SPACING.xs,
    h_sm: SPACING.sm,
    h_md: SPACING.md,
    h_lg: SPACING.lg,
    h_xl: SPACING.xl,

    // Vertical padding
    v_xs: SPACING.xs,
    v_sm: SPACING.sm,
    v_md: SPACING.md,
    v_lg: SPACING.lg,
    v_xl: SPACING.xl,

    // Common combinations
    button: {
        horizontal: SPACING.lg,
        vertical: SPACING.lg,
    },
    input: {
        horizontal: SPACING.lg,
        vertical: SPACING.md,
    },
} as const;

export const MARGINS = {
    xs: SPACING.xs,
    sm: SPACING.sm,
    md: SPACING.md,
    lg: SPACING.lg,
    xl: SPACING.xl,
} as const;

export const SHADOWS = {
    sm: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
} as const;

export const OPACITY = {
    disabled: 0.6,
    overlay: 0.5,
} as const;

// Type definitions for better TypeScript support
export type ColorKey = keyof typeof COLORS;
export type BorderRadiusKey = keyof typeof BORDER_RADIUS;
export type FontSizeKey = keyof typeof FONT_SIZE;
export type FontWeightKey = keyof typeof FONT_WEIGHT;
export type SpacingKey = keyof typeof SPACING;
