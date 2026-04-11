import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import VehicleGallery from "@/components/VehicleGallery";
import WhatsAppButton from "@/components/WhatsAppButton";
import { createClient } from "@/lib/server";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { getVehicleBySlug } from "@/lib/vehicles";
import { WHATSAPP_NUMBER } from "@/lib/constants";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatVehiclePrice(price: number | null) {
  if (typeof price !== "number" || Number.isNaN(price)) {
    return "Sob consulta";
  }

  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Veículo não encontrado | Valério Veículos",
      description: "O veículo procurado não foi encontrado.",
    };
  }

  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year} à venda | Valério Veículos`;
  const description = `${vehicle.brand} ${vehicle.model} ${vehicle.year} com ${
    vehicle.km ? `${vehicle.km.toLocaleString("pt-BR")} km` : "quilometragem sob consulta"
  }. Veículo disponível na Valério Veículos em Rio Negro PR.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      url: `https://www.valerioveiculos.com.br/veiculos/${vehicle.slug}`,
      images: vehicle.cover_image ? [vehicle.cover_image] : [],
    },
  };
}

export default async function VehicleDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  await supabase.rpc("increment_vehicle_views", {
    vehicle_id: vehicle.id,
  });

  const images = vehicle.images?.length
    ? vehicle.images
    : vehicle.cover_image
      ? [vehicle.cover_image]
      : [];

  const whatsappLink = generateWhatsAppLink({
    phone: WHATSAPP_NUMBER,
    vehicleName: vehicle.title,
  });

  const plateEnding = vehicle.plate_ending || "-";

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="pb-14 pt-32">
        <Container>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/35">
                Detalhes do veículo
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                {vehicle.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-black/55">
                Confira fotos, especificações e fale direto no WhatsApp para
                atendimento rápido.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-black/10 bg-white px-6 py-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-black/35">
                Preço
              </p>
              <p className="mt-2 text-3xl font-bold">
                {formatVehiclePrice(vehicle.price)}
              </p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <VehicleGallery images={images} title={vehicle.title} />

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/40">
                  Informações
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <SpecCard label="Ano" value={String(vehicle.year ?? "-")} />
                  <SpecCard
                    label="KM"
                    value={
                      vehicle.km !== null
                        ? `${vehicle.km.toLocaleString("pt-BR")} km`
                        : "-"
                    }
                  />
                  <SpecCard label="Combustível" value={vehicle.fuel || "-"} />
                  <SpecCard label="Câmbio" value={vehicle.transmission || "-"} />
                  <SpecCard label="Cor" value={vehicle.color || "-"} />
                  <SpecCard label="Carroceria" value={vehicle.body_type || "-"} />
                  <SpecCard
                    label="Aceita troca"
                    value={vehicle.accepts_trade ? "Sim" : "Não"}
                  />
                  <SpecCard label="Final da placa" value={plateEnding} />
                  <SpecCard
                    label="IPVA pago"
                    value={vehicle.ipva_paid ? "Sim" : "Não"}
                  />
                  <SpecCard
                    label="Licenciado"
                    value={vehicle.licensed ? "Sim" : "Não"}
                  />
                </div>

                <div className="mt-6">
                  <WhatsAppButton href={whatsappLink} vehicleId={vehicle.id} />
                </div>

                <div className="mt-6 rounded-2xl bg-black/[0.04] px-4 py-3 text-sm text-black/50">
                  👁 {vehicle.views ?? 0} visualizações
                </div>
              </div>

              {vehicle.description && (
                <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
                    Descrição
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">Sobre o veículo</h2>
                  <p className="mt-4 whitespace-pre-line leading-7 text-black/65">
                    {vehicle.description}
                  </p>
                </div>
              )}

              <div className="rounded-[2rem] bg-black p-6 text-white shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                  Atendimento
                </p>
                <h3 className="mt-3 text-2xl font-bold">
                  Gostou deste veículo?
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Fale com a equipe da Valério Veículos e receba atendimento
                  rápido, mais fotos, condições e disponibilidade.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function SpecCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fafafa] px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/40">
        {label}
      </p>
      <p className="mt-3 text-base font-semibold leading-tight text-black md:text-lg">
        {value}
      </p>
    </div>
  );
}