import type { Metadata } from "next";
import { Playfair_Display, Spline_Sans } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair-display' });
const spline = Spline_Sans({ subsets: ["latin"], variable: '--font-spline-sans' });

export const metadata: Metadata = {
    title: "VetaPura - Mobiliario de Autor",
    description: "Diseño exclusivo y artesanía de autor para los espacios más exigentes.",
};

export default function VetapuraLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`min-h-screen bg-vp-bg-light dark:bg-vp-bg-dark text-vp-text dark:text-white ${playfair.variable} ${spline.variable} font-display antialiased overflow-x-hidden`}>
            {/* Material Symbols */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            {children}
        </div>
    );
}
