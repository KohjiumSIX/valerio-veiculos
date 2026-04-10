import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import HeroGallery from "@/components/HeroGallery";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="bg-black text-white">
        <Container>
          <Navbar />

          <div className="grid min-h-[92vh] gap-12 pt-28 pb-24 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-16 lg:pt-32">
            <div className="max-w-[720px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45 md:text-xs">
                Desde 2009
              </p>

<h1 className="mt-4 max-w-[14ch] text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl lg:text-[72px]">
  Compra, venda e financiamento com{" "}
  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
    confiança e procedência
  </span>
</h1>

              <p className="mt-7 max-w-[58ch] text-base leading-8 text-white/72 md:text-xl">
                Na Valério Veículos você encontra atendimento rápido, veículos
                selecionados e uma negociação mais segura, transparente e direta.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/veiculos"
                  className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-white/90"
                >
                  Ver estoque
                </Link>

                <a
                  href="https://wa.me/5547984629584?text=Olá!%20Quero%20ver%20os%20veículos%20da%20Valério%20Veículos."
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Falar no WhatsApp
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <InfoMiniCard label="Atendimento" value="Rápido e direto" />
                <InfoMiniCard label="Negociação" value="Mais confiança" />
                <InfoMiniCard label="Loja" value="Desde 2009" />
              </div>
            </div>

            <div className="mx-auto w-full max-w-[760px] lg:mx-0 lg:ml-auto">
              <HeroGallery />
            </div>
          </div>
        </Container>
      </section>

      <section className="-mt-10 bg-black pb-20 text-white lg:-mt-14">
        <Container>
          <div className="grid gap-10 rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.18)] md:p-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:p-11">
            <div className="max-w-[700px]">
              <SectionTitle
                eyebrow="Catálogo"
                title="Veja todos os veículos em uma página exclusiva"
                description="Para deixar a página principal mais limpa e elegante, o catálogo completo fica separado. Assim o cliente encontra os carros com mais foco, sem poluição visual."
                theme="dark"
              />

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/veiculos"
                  className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-white/90"
                >
                  Acessar catálogo
                </Link>

                <a
                  href="https://wa.me/5547984629584"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                title="Landing mais limpa"
                description="Foco total na apresentação da loja, da confiança e do contato rápido."
              />
              <FeatureCard
                title="Catálogo separado"
                description="Melhor experiência na busca por veículos, sem poluição visual na home."
              />
              <FeatureWideCard
                title="Fotos e navegação"
                description="Galeria com zoom, troca de imagens e apresentação mais premium para cada anúncio."
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <SectionTitle
            eyebrow="Diferenciais"
            title="Mais confiança em cada atendimento"
            description="O site foi pensado para passar credibilidade, apresentar melhor os veículos e facilitar o contato."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.75rem] bg-black p-7 text-white">
              <h3 className="text-xl font-bold">Visual forte</h3>
              <p className="mt-3 text-white/70">
                Identidade visual elegante em preto e branco para transmitir mais presença.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-black/10 bg-white p-7">
              <h3 className="text-xl font-bold">Organização</h3>
              <p className="mt-3 text-black/65">
                Estrutura limpa e pensada para facilitar a navegação do cliente.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-black p-7 text-white">
              <h3 className="text-xl font-bold">Contato direto</h3>
              <p className="mt-3 text-white/70">
                Atendimento rápido pelo WhatsApp para tirar dúvidas e consultar disponibilidade.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="contato" className="bg-white pb-20">
        <Container>
          <div className="rounded-[2rem] bg-black p-8 text-white md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-[760px]">
                <SectionTitle
                  eyebrow="Contato"
                  title="Quer atendimento rápido?"
                  description="Fale agora com a Valério Veículos para tirar dúvidas, consultar disponibilidade e receber atendimento direto."
                  theme="dark"
                />

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">WhatsApp</p>
                  <p className="mt-1 text-lg font-semibold">(47) 98462-9584</p>
                </div>
              </div>

              <div>
                <a
                  href="https://wa.me/5547984629584?text=Olá!%20Quero%20atendimento%20pela%20Valério%20Veículos."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-2xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-white/90"
                >
                  Enviar mensagem
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function InfoMiniCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
      <h3 className="text-2xl font-bold leading-tight">{title}</h3>
      <p className="mt-3 text-white/70">{description}</p>
    </div>
  );
}

function FeatureWideCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 sm:col-span-2">
      <h3 className="text-2xl font-bold leading-tight">{title}</h3>
      <p className="mt-3 text-white/70">{description}</p>
    </div>
  );
}