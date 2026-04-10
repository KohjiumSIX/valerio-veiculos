import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { createClient } from "@/lib/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: vehicles, error: vehiclesError } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (vehiclesError) {
    console.error("Erro ao buscar veículos no admin:", vehiclesError.message);
  }

  const safeVehicles = vehicles ?? [];

  const totalVehicles = safeVehicles.length;
  const publishedVehicles = safeVehicles.filter((v) => v.is_published).length;
  const totalViews = safeVehicles.reduce((acc, v) => acc + (v.views || 0), 0);

  const topVehicles = [...safeVehicles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const stats = [
    { label: "Veículos cadastrados", value: totalVehicles },
    { label: "Publicados", value: publishedVehicles },
    { label: "Total de visualizações", value: totalViews },
  ];

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <section className="border-b border-black/10 bg-black pb-12 pt-32 text-white">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                Painel
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                Dashboard da loja
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">
                Acompanhe o desempenho dos veículos e gerencie seu estoque.
              </p>
              <p className="mt-3 text-sm text-white/50">
                Logado como: {user.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/veiculos"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Ver catálogo
              </Link>

              <Link
                href="/admin/veiculos/novo"
                className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90"
              >
                Novo veículo
              </Link>

              <AdminLogoutButton />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-sm"
              >
                <p className="text-sm text-black/45">{item.label}</p>
                <p className="mt-3 text-3xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-black/40">
                    Performance
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    Veículos mais vistos
                  </h2>
                </div>

                <Link
                  href="/admin/veiculos"
                  className="rounded-xl border border-black/10 bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
                >
                  Gerenciar
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {topVehicles.length === 0 && (
                  <p className="text-sm text-black/50">
                    Nenhum veículo ainda.
                  </p>
                )}

                {topVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between rounded-xl border border-black/10 bg-black/5 px-4 py-4"
                  >
                    <div>
                      <p className="font-semibold">
                        #{index + 1} {vehicle.title}
                      </p>

                      <p className="text-sm text-black/50">
                        {vehicle.brand} • {vehicle.model}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">
                        👁 {vehicle.views ?? 0}
                      </p>

                      <Link
                        href={`/veiculos/${vehicle.slug}`}
                        className="text-xs text-black/50 hover:underline"
                      >
                        Ver página
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                Ações rápidas
              </p>
              <h2 className="mt-2 text-2xl font-bold">Gerencie a loja</h2>

              <div className="mt-6 space-y-3">
                <Link
                  href="/admin/veiculos/novo"
                  className="block w-full rounded-xl bg-white px-4 py-3 text-left font-semibold text-black transition hover:bg-white/90"
                >
                  Cadastrar novo veículo
                </Link>

<Link
  href="/admin/veiculos"
  className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left font-semibold text-white transition hover:bg-white/10"
>
  Editar veículos
</Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}