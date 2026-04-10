"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { createClient } from "@/lib/client";
import type { Vehicle as VehicleType } from "@/lib/types";

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const supabase = createClient();
  useEffect(() => {
    let isMounted = true;

    async function loadVehicles() {
      setLoading(true);

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar veículos:", error.message);
        if (isMounted) {
          setVehicles([]);
          setLoading(false);
        }
        return;
      }

      if (!isMounted) return;

      setVehicles((data ?? []) as VehicleType[]);
      setLoading(false);
    }

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      if (!normalizedSearch) return true;

      const haystack = [
        vehicle.title,
        vehicle.brand,
        vehicle.model,
        vehicle.slug,
        vehicle.year?.toString() ?? "",
        vehicle.plate_final ?? "",
        vehicle.body_type ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [vehicles, search]);

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="border-b border-black/10 bg-black pb-10 pt-32 text-white">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                Painel administrativo
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                Gerenciar veículos
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">
                Busque, edite e acompanhe os veículos cadastrados no estoque.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Voltar ao dashboard
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
                <h2 className="mt-2 text-2xl font-bold">
                  Lista de veículos cadastrados
                </h2>
              </div>

              <div className="w-full max-w-md">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por título, marca, modelo, ano..."
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
                />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
              <div className="hidden grid-cols-[1.2fr_auto_auto_auto_auto_auto] gap-4 bg-black px-5 py-4 text-sm font-medium text-white lg:grid">
                <span>Veículo</span>
                <span>Status</span>
                <span>Selo</span>
                <span>Preço</span>
                <span>Acessos</span>
                <span>Ações</span>
              </div>

              {loading ? (
                <div className="px-5 py-8 text-sm text-black/60">
                  Carregando veículos...
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="px-5 py-8 text-sm text-black/60">
                  Nenhum veículo encontrado.
                </div>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const status = vehicle.is_published
                    ? "Publicado"
                    : "Rascunho";

                  const badge = vehicle.is_offer
                    ? "Oferta"
                    : vehicle.is_new_arrival
                    ? "Recém-chegado"
                    : vehicle.is_featured
                    ? "Destaque"
                    : "Sem selo";

                  const formattedPrice =
                    typeof vehicle.price === "number"
                      ? vehicle.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "Sob consulta";

                  return (
                    <div
                      key={vehicle.id}
                      className="grid gap-4 border-t border-black/10 px-5 py-5 lg:grid-cols-[1.2fr_auto_auto_auto_auto_auto] lg:items-center"
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

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-black/50">
                          {vehicle.year ? <span>{vehicle.year}</span> : null}
                          {vehicle.km !== null ? (
                            <span>• {vehicle.km.toLocaleString("pt-BR")} km</span>
                          ) : null}
                          {vehicle.body_type ? (
                            <span>• {vehicle.body_type}</span>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            vehicle.is_published
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div>
                        <span className="inline-flex rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black">
                          {badge}
                        </span>
                      </div>

                      <div className="text-sm font-medium">{formattedPrice}</div>

                      <div className="text-sm text-black/60">
                        👁 {vehicle.views ?? 0}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/veiculos/${vehicle.slug}`}
                          className="rounded-lg border border-black/10 px-3 py-2 text-xs font-medium transition hover:bg-black/5"
                        >
                          Ver
                        </Link>

                        <Link
                          href={`/admin/veiculos/${vehicle.id}`}
                          className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-black/85"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}