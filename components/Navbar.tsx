"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        <nav className="flex items-center justify-between rounded-[1.8rem] bg-black px-5 py-4 md:px-7">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex shrink-0 items-center">
              <img
                src="logo-valerio.png"
                alt="Valério Veículos"
                className="h-7 w-auto object-contain md:h-8"
              />
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  homeActive
                    ? "bg-white text-black"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                Início
              </Link>

              <Link
                href="/veiculos"
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  catalogActive
                    ? "bg-white text-black"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                Catálogo
              </Link>
            </div>
          </div>

          <a
            href="https://wa.me/5547984629584"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 md:px-5"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}