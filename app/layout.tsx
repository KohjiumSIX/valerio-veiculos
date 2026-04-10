import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valério Veículos",
  description:
    "Catálogo de veículos com apresentação premium, atendimento rápido e experiência moderna para o cliente.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}