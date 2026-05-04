import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
      aria-label="Toggle theme"
    >
      <span className="hidden dark:block text-sm">☀️</span>
      <span className="block dark:hidden text-sm">🌙</span>
    </button>
  );
};

export default ThemeToggle;
