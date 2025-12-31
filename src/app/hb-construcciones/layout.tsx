import type { Metadata } from "next";
import { Playfair_Display, Spline_Sans } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair-display' });
const spline = Spline_Sans({ subsets: ["latin"], variable: '--font-spline-sans' });

export const metadata: Metadata = {
    title: "HB Construcciones S.A. - Inicio",
    description: "Construyendo tus sueños, ladrillo a ladrillo.",
};

export default function HBConstruccionesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`min-h-screen bg-hb-bg-light dark:bg-hb-bg-dark text-slate-900 dark:text-hb-bone ${playfair.variable} ${spline.variable} font-display antialiased selection:bg-hb-primary selection:text-hb-bg-dark`}>
            {/* Material Symbols */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            {children}
        </div>
    );
}
