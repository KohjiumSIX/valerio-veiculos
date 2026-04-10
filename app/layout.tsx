import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valério Veículos",
  description:
    "Catálogo de veículos com apresentação premium, atendimento rápido e experiência moderna para o cliente.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}