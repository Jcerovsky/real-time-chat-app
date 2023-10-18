const getThemeFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const item = localStorage.getItem(key);
    if (!item) {
      const preferredTheme = prefersDarkMode ? "dark" : "light";
      localStorage.setItem("theme", preferredTheme);
      return preferredTheme;
    }
    return JSON.parse(item);
  }
};

export default getThemeFromLocalStorage;
