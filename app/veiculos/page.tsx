import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import EstoqueClient from "@/app/veiculos/EstoqueClient";
import { getPublishedVehicles } from "@/lib/vehicles";
import { mapVehicleToCard } from "@/lib/mappers";
import type { Car } from "@/lib/data";

export default async function VehiclesPage() {
  const vehicles = await getPublishedVehicles();
  const cards: Car[] = vehicles.map(mapVehicleToCard);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="border-b border-black/10 bg-black pt-32 pb-14 text-white">
        <Container>
          <SectionTitle
            eyebrow="Catálogo"
            title="Todos os veículos disponíveis"
            description="Confira o estoque completo da Valério Veículos. Use a busca e os filtros para encontrar o carro ideal com mais rapidez."
            theme="dark"
          />
        </Container>
      </section>

      <section className="bg-white py-12">
        <Container>
          <div className="mb-8 rounded-[1.75rem] border border-black/10 bg-black p-6 text-white">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/55">
                  Visual
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Catálogo limpo e elegante
                </p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/55">
                  Navegação
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Busca e filtros rápidos
                </p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/55">
                  Próximo passo
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Página do carro com galeria e zoom
                </p>
              </div>
            </div>
          </div>

          <EstoqueClient vehicles={cards} />
        </Container>
      </section>
    </main>
  );
}