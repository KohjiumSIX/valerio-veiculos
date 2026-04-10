"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { createClient } from "@/lib/client";
import { formatPrice } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

const supabase = createClient();

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos status");
  const [badgeFilter, setBadgeFilter] = useState("Todos destaques");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVehicles() {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setVehicles((data ?? []) as Vehicle[]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os veículos.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const status = vehicle.is_published ? "Publicado" : "Rascunho";
      const badge = vehicle.is_offer
        ? "Oferta"
        : vehicle.is_new_arrival
          ? "Recém-chegado"
          : vehicle.is_featured
            ? "Destaque"
            : "Sem selo";

      const matchesSearch =
        !normalizedSearch ||
        vehicle.title.toLowerCase().includes(normalizedSearch) ||
        vehicle.brand.toLowerCase().includes(normalizedSearch) ||
        vehicle.model.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos status" || status === statusFilter;

      const matchesBadge =
        badgeFilter === "Todos destaques" || badge === badgeFilter;

      return matchesSearch && matchesStatus && matchesBadge;
    });
  }, [vehicles, search, statusFilter, badgeFilter]);

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="border-b border-black/10 bg-black pt-32 pb-12 text-white">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                Painel
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                Gerenciar veículos
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">
                Organize o estoque, publique novos carros e mantenha os anúncios
                da Valério Veículos sempre atualizados.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Voltar ao painel
              </Link>

              <Link
                href="/admin/veiculos/novo"
                className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90"
              >
                Novo veículo
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-black/40">
                  Estoque
                </p>
                <h2 className="mt-2 text-2xl font-bold">Lista de veículos</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Buscar veículo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm outline-none transition placeholder:text-black/35 focus:border-black/25 focus:bg-white"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm outline-none transition focus:border-black/25 focus:bg-white"
                >
                  <option>Todos status</option>
                  <option>Publicado</option>
                  <option>Rascunho</option>
                </select>

                <select
                  value={badgeFilter}
                  onChange={(e) => setBadgeFilter(e.target.value)}
                  className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-sm outline-none transition focus:border-black/25 focus:bg-white"
                >
                  <option>Todos destaques</option>
                  <option>Destaque</option>
                  <option>Oferta</option>
                  <option>Recém-chegado</option>
                  <option>Sem selo</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm text-black/55">
                {loading
                  ? "Carregando veículos..."
                  : `${filteredVehicles.length} veículo(s) encontrado(s)`}
              </p>

              <button
                type="button"
                onClick={loadVehicles}
                className="rounded-xl border border-black/10 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
              >
                Atualizar
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/10">
              <div className="hidden grid-cols-[1.2fr_auto_auto_auto_auto] gap-4 border-b border-black/10 bg-black px-5 py-4 text-sm font-medium text-white lg:grid">
                <span>Veículo</span>
                <span>Status</span>
                <span>Selo</span>
                <span>Preço</span>
                <span>Ações</span>
{filteredVehicles.map((vehicle) => (
  <div key={vehicle.id}>
    <p>{vehicle.title}</p>

    <div className="text-sm text-black/50">
      👁 {vehicle.views ?? 0}
    </div>
  </div>
))}
              </div>

              <div className="divide-y divide-black/10">
                {!loading && filteredVehicles.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <p className="text-lg font-semibold">
                      Nenhum veículo encontrado
                    </p>
                    <p className="mt-2 text-sm text-black/55">
                      Ajuste a busca, os filtros ou cadastre um novo veículo.
                    </p>
                  </div>
                )}

                {filteredVehicles.map((vehicle) => {
                  const status = vehicle.is_published ? "Publicado" : "Rascunho";
                  const badge = vehicle.is_offer
                    ? "Oferta"
                    : vehicle.is_new_arrival
                      ? "Recém-chegado"
                      : vehicle.is_featured
                        ? "Destaque"
                        : "Sem selo";

                  return (
                    <div
                      key={vehicle.id}
                      className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_auto_auto_auto_auto] lg:items-center"
                    >
                      <div>
                        <p className="font-semibold">{vehicle.title}</p>
                        <p className="mt-1 text-sm text-black/50">
                          {vehicle.brand} • {vehicle.model}
                          {vehicle.updated_at
                            ? ` • Atualizado: ${new Date(
                                vehicle.updated_at
                              ).toLocaleString("pt-BR")}`
                            : ""}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            status === "Publicado"
                              ? "bg-black text-white"
                              : "bg-black/5 text-black"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div>
                        <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black">
                          {badge}
                        </span>
                      </div>

                      <div className="font-semibold">
                        {formatPrice(Number(vehicle.price))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/veiculos/${vehicle.id}`}
                          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium transition hover:bg-black/5"
                        >
                          Editar
                        </Link>

                        <Link
                          href={`/veiculos/${vehicle.slug}`}
                          className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-black/85"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}