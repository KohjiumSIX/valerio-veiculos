"use client";

import { useMemo, useState } from "react";
import VehicleGrid from "@/components/VehicleGrid";
import type { Vehicle } from "@/lib/types";

type EstoqueClientProps = {
  vehicles: Vehicle[];
};

type SortOption =
  | "recentes"
  | "menor-preco"
  | "maior-preco"
  | "menor-km"
  | "maior-km"
  | "mais-novos"
  | "mais-antigos";

export default function EstoqueClient({ vehicles }: EstoqueClientProps) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxKm, setMaxKm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recentes");

  const brands = useMemo(() => {
    return [...new Set(vehicles.map((vehicle) => vehicle.brand))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [vehicles]);

  const fuels = useMemo(() => {
    return [...new Set(vehicles.map((vehicle) => vehicle.fuel ?? ""))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [vehicles]);

  const transmissions = useMemo(() => {
    return [...new Set(vehicles.map((vehicle) => vehicle.transmission ?? ""))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = vehicles.filter((vehicle) => {
      const vehicleBrand = vehicle.brand ?? "";
      const vehiclePrice = vehicle.price ?? 0;
      const vehicleKm = vehicle.km ?? 0;
      const vehicleYear = vehicle.year ?? 0;

      const searchableText = [
        vehicle.title,
        vehicle.brand,
        vehicle.model,
        vehicle.fuel ?? "",
        vehicle.transmission ?? "",
        vehicle.year?.toString() ?? "",
        vehicle.body_type ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      const matchesBrand = !brand || vehicleBrand === brand;
      const matchesFuel = !fuel || vehicle.fuel === fuel;
      const matchesTransmission =
        !transmission || vehicle.transmission === transmission;

      const matchesMaxPrice = !maxPrice || vehiclePrice <= Number(maxPrice);
      const matchesMinYear = !minYear || vehicleYear >= Number(minYear);
      const matchesMaxKm = !maxKm || vehicleKm <= Number(maxKm);

      return (
        matchesSearch &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission &&
        matchesMaxPrice &&
        matchesMinYear &&
        matchesMaxKm
      );
    });

    switch (sortBy) {
      case "menor-preco":
        return [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

      case "maior-preco":
        return [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

      case "menor-km":
        return [...result].sort((a, b) => (a.km ?? 0) - (b.km ?? 0));

      case "maior-km":
        return [...result].sort((a, b) => (b.km ?? 0) - (a.km ?? 0));

      case "mais-novos":
        return [...result].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

      case "mais-antigos":
        return [...result].sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

      default:
        return result;
    }
  }, [
    vehicles,
    search,
    brand,
    fuel,
    transmission,
    maxPrice,
    minYear,
    maxKm,
    sortBy,
  ]);

  const hasActiveFilters =
    !!search ||
    !!brand ||
    !!fuel ||
    !!transmission ||
    !!maxPrice ||
    !!minYear ||
    !!maxKm ||
    sortBy !== "recentes";

  function clearFilters() {
    setSearch("");
    setBrand("");
    setFuel("");
    setTransmission("");
    setMaxPrice("");
    setMinYear("");
    setMaxKm("");
    setSortBy("recentes");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-black/10 bg-black p-5 text-white shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Buscar
            </label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex: Civic, Corolla, SUV..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Marca
            </label>
            <select
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
            >
              <option value="" className="text-black">
                Todas
              </option>
              {brands.map((item) => (
                <option key={item} value={item} className="text-black">
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Combustível
            </label>
            <select
              value={fuel}
              onChange={(event) => setFuel(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
            >
              <option value="" className="text-black">
                Todos
              </option>
              {fuels.map((item) => (
                <option key={item} value={item} className="text-black">
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Câmbio
            </label>
            <select
              value={transmission}
              onChange={(event) => setTransmission(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
            >
              <option value="" className="text-black">
                Todos
              </option>
              {transmissions.map((item) => (
                <option key={item} value={item} className="text-black">
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Preço máximo
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Ex: 100000"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Ano mínimo
            </label>
            <input
              type="number"
              value={minYear}
              onChange={(event) => setMinYear(event.target.value)}
              placeholder="Ex: 2020"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              KM máximo
            </label>
            <input
              type="number"
              value={maxKm}
              onChange={(event) => setMaxKm(event.target.value)}
              placeholder="Ex: 50000"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
            >
              <option value="recentes" className="text-black">
                Mais recentes
              </option>
              <option value="menor-preco" className="text-black">
                Menor preço
              </option>
              <option value="maior-preco" className="text-black">
                Maior preço
              </option>
              <option value="menor-km" className="text-black">
                Menor KM
              </option>
              <option value="maior-km" className="text-black">
                Maior KM
              </option>
              <option value="mais-novos" className="text-black">
                Mais novos
              </option>
              <option value="mais-antigos" className="text-black">
                Mais antigos
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/65">
          <span className="font-semibold text-black">
            {filteredVehicles.length}
          </span>{" "}
          veículo(s) encontrado(s)
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-black/10 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <VehicleGrid vehicles={filteredVehicles} />
    </div>
  );
}