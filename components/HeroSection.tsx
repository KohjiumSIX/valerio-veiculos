"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
      <img
        src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80"
        alt="Showroom de carros"
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />

      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_40%)]" />

      <Container className="relative z-10 flex w-full pt-28 pb-16">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
          >
            Valério Veículos • confiança, presença e procedência
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl xl:text-7xl"
          >
            Seu próximo carro com apresentação premium e atendimento direto.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg"
          >
            Um site pensado para passar credibilidade, destacar os veículos da
            forma certa e facilitar o contato imediato com a loja.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/veiculos"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90"
            >
              Ver catálogo
            </Link>

            <a
              href="https://wa.me/5547984629584?text=Olá!%20Quero%20atendimento%20sobre%20os%20veículos%20da%20Valério%20Veículos."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Falar no WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
              <p className="text-sm text-white/55">Visual</p>
              <p className="mt-1 text-lg font-semibold">Preto e branco</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
              <p className="text-sm text-white/55">Catálogo</p>
              <p className="mt-1 text-lg font-semibold">Página exclusiva</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur">
              <p className="text-sm text-white/55">Contato</p>
              <p className="mt-1 text-lg font-semibold">Direto no WhatsApp</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}