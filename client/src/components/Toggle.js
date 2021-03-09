import { useState } from "react";
import DarkModeToggle from "react-dark-mode-toggle";

export default function Toggle({className}) {
  const [isDarkMode, setIsDarkMode] = useState(() => false);

    return (
        <DarkModeToggle
            className={className}
            onChange={setIsDarkMode}
            checked={isDarkMode}
            size={60}
        />
    );
}