import type { Metadata } from "next";
import { Inter, Playfair_Display, Spline_Sans } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair-display' });
const spline = Spline_Sans({ subsets: ["latin"], variable: '--font-spline-sans' });

export const metadata: Metadata = {
    title: "Irova Hotel - Posadas, Misiones",
    description: "Un refugio de lujo orgánico donde la naturaleza abraza la sofisticación.",
};

export default function IrovaHotelLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`min-h-screen bg-irova-bg-light dark:bg-irova-bg-dark text-[#181811] dark:text-white ${inter.variable} ${playfair.variable} ${spline.variable} font-display`}>
            {/* Material Symbols */}
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            {children}
        </div>
    );
}
