import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AetherCore",
  description: "Simulador Industrial de Estratégia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#020617] text-slate-100 overflow-hidden select-none`}>
        {children}
      </body>
    </html>
  );
}