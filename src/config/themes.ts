export interface DashboardTheme {
  id: string;
  name: string;
  description: string;
  colorScheme: "light" | "dark";
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    muted: string;
    border: string;
  };
}

export const DASHBOARD_THEMES: DashboardTheme[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and minimal light theme",
    colorScheme: "light",
    colors: {
      background: "#fafafa",
      surface: "#ffffff",
      primary: "#18181b",
      accent: "#7c3aed",
      text: "#18181b",
      muted: "#71717a",
      border: "#e4e4e7",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep dark theme for focused work",
    colorScheme: "dark",
    colors: {
      background: "#0a0a0b",
      surface: "#18181b",
      primary: "#fafafa",
      accent: "#818cf8",
      text: "#fafafa",
      muted: "#a1a1aa",
      border: "#27272a",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool blue tones inspired by the sea",
    colorScheme: "light",
    colors: {
      background: "#f0f9ff",
      surface: "#ffffff",
      primary: "#0c4a6e",
      accent: "#0ea5e9",
      text: "#0c4a6e",
      muted: "#64748b",
      border: "#bae6fd",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural green tones for calm vibes",
    colorScheme: "light",
    colors: {
      background: "#f0fdf4",
      surface: "#ffffff",
      primary: "#14532d",
      accent: "#22c55e",
      text: "#14532d",
      muted: "#6b7280",
      border: "#bbf7d0",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm amber and orange tones",
    colorScheme: "light",
    colors: {
      background: "#fffbeb",
      surface: "#ffffff",
      primary: "#78350f",
      accent: "#f59e0b",
      text: "#78350f",
      muted: "#92400e",
      border: "#fde68a",
    },
  },
  {
    id: "neon",
    name: "Neon",
    description: "Cyberpunk dark theme with vivid accents",
    colorScheme: "dark",
    colors: {
      background: "#0f0f23",
      surface: "#1a1a2e",
      primary: "#e0e0ff",
      accent: "#f72585",
      text: "#e0e0ff",
      muted: "#7b7b9e",
      border: "#2a2a4a",
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    description: "Soft purple tones for creativity",
    colorScheme: "light",
    colors: {
      background: "#faf5ff",
      surface: "#ffffff",
      primary: "#581c87",
      accent: "#a855f7",
      text: "#581c87",
      muted: "#7e22ce",
      border: "#e9d5ff",
    },
  },
];

export function getThemeById(id: string): DashboardTheme {
  return DASHBOARD_THEMES.find((t) => t.id === id) || DASHBOARD_THEMES[0];
}
