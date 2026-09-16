"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Icon from "./icon";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {Icon(theme === "light" ? "light_mode" : "dark_mode", "text-[20px]")}
        </button>
    );
}

