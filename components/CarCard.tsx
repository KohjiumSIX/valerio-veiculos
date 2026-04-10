"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Car } from "@/lib/data";

export default function CarCard({ car }: { car: Car }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-sm transition"
    >
      <Link href={`/veiculos/${car.slug}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={car.image}
            alt={car.title}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

          {car.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white shadow">
              {car.badge}
            </span>
          )}
        </div>

        <div className="p-6">
          <div>
            <h3 className="text-xl font-bold text-black">
              {car.title}
            </h3>
            <p className="mt-1 text-sm text-black/60">
              {car.subtitle}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Info label="Ano" value={String(car.year)} />
            <Info label="KM" value={car.km} />
            <Info label="Combustível" value={car.fuel} />
            <Info label="Câmbio" value={car.transmission} />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xl font-bold text-black">
              {car.price}
            </span>

            <span className="rounded-xl border border-black/10 bg-black px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-black/85">
              Ver detalhes
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/5 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-black/40">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-black">
        {value}
      </p>
    </div>
  );
}