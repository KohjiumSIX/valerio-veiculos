import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import EstoqueClient from "@/app/veiculos/EstoqueClient";
import { getPublishedVehicles } from "@/lib/vehicles";
import type { Vehicle } from "@/lib/types";

export default async function VehiclesPage() {
  const vehicles = await getPublishedVehicles();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="border-b border-black/10 bg-black pb-14 pt-32 text-white">
        <Container>
          <SectionTitle
            eyebrow="Catálogo"
            title="Nosso estoque de veículos selecionados"
            description="Conheça o estoque da Valério Veículos e encontre veículos selecionados, com procedência e atendimento de confiança desde 2009. Use a busca e os filtros para encontrar a melhor opção para você."
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
                  QUALIDADE
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Veículos selecionados com mais critério
                </p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/55">
                  FACILIDADE
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Encontre o carro ideal com mais rapidez
                </p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/55">
                  TRANSPARÊNCIA
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Fotos, detalhes e informações completas
                </p>
              </div>
            </div>
          </div>

          <EstoqueClient vehicles={vehicles as Vehicle[]} />
        </Container>
      </section>
    </main>
  );
}