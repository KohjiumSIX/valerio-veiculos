"use client";

type StockFiltersProps = {
  search: string;
  brand: string;
  fuel: string;
  transmission: string;
  onSearchChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onFuelChange: (value: string) => void;
  onTransmissionChange: (value: string) => void;
  brands?: string[];
  fuels?: string[];
  transmissions?: string[];
};

export default function StockFilters({
  search,
  brand,
  fuel,
  transmission,
  onSearchChange,
  onBrandChange,
  onFuelChange,
  onTransmissionChange,
  brands = [],
  fuels = [],
  transmissions = [],
}: StockFiltersProps) {
  return (
    <div className="rounded-[1.75rem] border border-black/10 bg-black p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium text-white/75"
          >
            Buscar
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Ex: Civic, Corolla, SUV..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
          />
        </div>

        <div>
          <label
            htmlFor="brand"
            className="mb-2 block text-sm font-medium text-white/75"
          >
            Marca
          </label>
          <select
            id="brand"
            value={brand}
            onChange={(event) => onBrandChange(event.target.value)}
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
          <label
            htmlFor="fuel"
            className="mb-2 block text-sm font-medium text-white/75"
          >
            Combustível
          </label>
          <select
            id="fuel"
            value={fuel}
            onChange={(event) => onFuelChange(event.target.value)}
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
          <label
            htmlFor="transmission"
            className="mb-2 block text-sm font-medium text-white/75"
          >
            Câmbio
          </label>
          <select
            id="transmission"
            value={transmission}
            onChange={(event) => onTransmissionChange(event.target.value)}
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
      </div>
    </div>
  );
}