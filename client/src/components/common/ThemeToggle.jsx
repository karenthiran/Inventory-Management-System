import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  };

  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="
        relative p-2 rounded-lg
        bg-gray-100 dark:bg-gray-800
        
        
        
        flex items-center justify-center
      "
    >
      {dark ? (
        <Sun
          size={20}
          strokeWidth={2.2}
          className="
            text-amber-500
            drop-shadow-sm
            transition-all duration-300
          "
        />
      ) : (
        <Moon
          size={20}
          strokeWidth={2.2}
          className="
            text-indigo-600
            transition-all duration-300
          "
        />
      )}
    </button>
  );
};

export default ThemeToggle;
