"use client";

// Components
import Image from "next/image";
import { useTheme } from "next-themes";

// Imagens
import logoNegative from "@/public/logoNegative.png";
import logoPositive from "@/public/logoPositive.png";

export default function Logo() {
    const { theme } = useTheme();

    const dark = theme === "dark";

    return (
        <Image
            alt="Lopes Logo"
            className="h-8 w-auto object-contain"
            src={dark ? logoNegative : logoPositive}
        />
    );
}