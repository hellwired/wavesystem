import type { Metadata } from "next";
import { Manrope, Lora } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: '--font-manrope' });
const lora = Lora({ subsets: ["latin"], variable: '--font-lora' });

export const metadata: Metadata = {
    title: "LE♕LINAJE ESCOGIDO - Elegancia Real",
    description: "Moda femenina diseñada para la mujer que conoce su valor.",
};

export default function LinajeEscogidoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`min-h-screen bg-le-bg-light dark:bg-le-bg-dark text-[#111418] dark:text-le-bone-white ${manrope.variable} ${lora.variable} font-display antialiased overflow-x-hidden`}>
            {/* Material Symbols */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            {children}
        </div>
    );
}
