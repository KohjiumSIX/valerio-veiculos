"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WHATSAPP_NUMBER } from "@/lib/constants";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  const homeActive = isActive(pathname, "/");
  const catalogActive = isActive(pathname, "/veiculos");

  return (
    <header className="w-full pt-4">
      <div className="mx-auto w-full max-w-7xl px-4">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-[1.8rem] bg-black px-4 py-4 md:px-7">
          {/* LOGO */}
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src="/logo-valerio.png"
              alt="Valério Veículos"
              className="h-6 w-auto object-contain md:h-8"
            />
          </Link>

          {/* LINKS */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition md:px-4 ${
                homeActive
                  ? "bg-white text-black"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              Início
            </Link>

            <Link
              href="/veiculos"
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition md:px-4 ${
                catalogActive
                  ? "bg-white text-black"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              Catálogo
            </Link>
          </div>

          {/* BOTÃO WHATSAPP */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/90 md:px-5"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}