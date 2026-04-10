"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { createClient } from "@/lib/client";
import { uploadVehicleImage } from "@/lib/storage";
import { generateSlug } from "@/lib/utils";

type FormState = {
  title: string;
  slug: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  km: string;
  fuel: string;
  transmission: string;
  color: string;
  bodyType: string;
  plateEnding: string;
  coverImage: string;
  images: string;
  description: string;
  isPublished: boolean;
  isFeatured: boolean;
  isOffer: boolean;
  isNewArrival: boolean;
  acceptsTrade: boolean;
  ipvaPaid: boolean;
  licensed: boolean;
};

const initialState: FormState = {
  title: "",
  slug: "",
  brand: "",
  model: "",
  year: "",
  price: "",
  km: "",
  fuel: "",
  transmission: "",
  color: "",
  bodyType: "",
  plateEnding: "",
  coverImage: "",
  images: "",
  description: "",
  isPublished: true,
  isFeatured: false,
  isOffer: false,
  isNewArrival: false,
  acceptsTrade: false,
  ipvaPaid: false,
  licensed: false,
};

export default function AdminNewVehiclePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "idle">(
    "idle"
  );

  const previewPrice = useMemo(() => {
    const value = Number(form.price || 0);

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, [form.price]);

  const galleryPreview = useMemo(() => {
    return form.images
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form.images]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((prev) => {
      const shouldAutoGenerateSlug =
        !prev.slug || prev.slug === generateSlug(prev.title);

      return {
        ...prev,
        title: value,
        slug: shouldAutoGenerateSlug ? generateSlug(value) : prev.slug,
      };
    });
  }

  function setGalleryImages(nextImages: string[]) {
    setForm((prev) => ({
      ...prev,
      images: nextImages.join("\n"),
      coverImage: nextImages.includes(prev.coverImage)
        ? prev.coverImage
        : nextImages[0] || "",
    }));
  }

  function moveImage(index: number, direction: "left" | "right") {
    const nextImages = [...galleryPreview];
    const targetIndex = direction === "left" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= nextImages.length) return;

    [nextImages[index], nextImages[targetIndex]] = [
      nextImages[targetIndex],
      nextImages[index],
    ];

    setGalleryImages(nextImages);
  }

  function removeImage(index: number) {
    const nextImages = galleryPreview.filter((_, i) => i !== index);
    setGalleryImages(nextImages);
  }

  function setAsCover(image: string) {
    setForm((prev) => ({
      ...prev,
      coverImage: image,
    }));
  }

  async function handleFiles(files: File[]) {
    if (!files.length) return;

    try {
      setUploading(true);

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const { publicUrl } = await uploadVehicleImage(file);
        uploadedUrls.push(publicUrl);
      }

      setForm((prev) => {
        const existing = prev.images
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);

        const nextImages = [...existing, ...uploadedUrls];

        return {
          ...prev,
          images: nextImages.join("\n"),
          coverImage: prev.coverImage || nextImages[0] || "",
        };
      });
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Erro ao enviar imagem."
      );
      setFeedbackType("error");
    } finally {
      setUploading(false);
    }
  }

  async function validateSlug(slug: string) {
    const { data, error } = await supabase
      .from("vehicles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error("Não foi possível validar o slug.");
    }

    if (data?.id) {
      throw new Error("Já existe um veículo com este slug.");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    publish: boolean
  ) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");
    setFeedbackType("idle");

    try {
      const parsedYear = Number(form.year);
      const parsedPrice = Number(form.price);
      const parsedKm = Number(form.km);

      if (
        !form.title.trim() ||
        !form.brand.trim() ||
        !form.model.trim() ||
        !form.fuel.trim() ||
        !form.transmission.trim()
      ) {
        throw new Error("Preencha os campos principais do veículo.");
      }

      if (
        !parsedYear ||
        Number.isNaN(parsedYear) ||
        Number.isNaN(parsedPrice) ||
        Number.isNaN(parsedKm) ||
        parsedPrice < 0 ||
        parsedKm < 0
      ) {
        throw new Error("Ano, preço e KM precisam ser válidos.");
      }

      const slug = generateSlug(form.slug || form.title);

      if (!slug) {
        throw new Error("Slug inválido.");
      }

      await validateSlug(slug);

      const imageList = form.images
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        title: form.title.trim(),
        slug,
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: parsedYear,
        price: parsedPrice,
        km: parsedKm,
        fuel: form.fuel.trim(),
        transmission: form.transmission.trim(),
        color: form.color.trim() || null,
        body_type: form.bodyType.trim() || null,
        accepts_trade: form.acceptsTrade,
        plate_ending: form.plateEnding.trim() || null,
        ipva_paid: form.ipvaPaid,
        licensed: form.licensed,
        description: form.description.trim() || null,
        cover_image: form.coverImage.trim() || imageList[0] || null,
        images: imageList,
        is_published: publish,
        is_featured: form.isFeatured,
        is_offer: form.isOffer,
        is_new_arrival: form.isNewArrival,
      };

      const { error } = await supabase.from("vehicles").insert([payload]);

      if (error) {
        throw new Error(error.message);
      }

      router.push("/admin/veiculos");
      router.refresh();
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o veículo."
      );
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  }

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
                Cadastrar novo veículo
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">
                Preencha os dados do veículo para adicionar um novo anúncio ao
                catálogo da Valério Veículos.
              </p>
            </div>

            <Link
              href="/admin/veiculos"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Voltar para veículos
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-black/40">
                  Formulário
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Informações do veículo
                </h2>
              </div>

              <form className="mt-8 space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Título">
                    <input
                      type="text"
                      placeholder="Ex: Honda Civic Touring 2020"
                      className="input-admin"
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </Field>

                  <Field label="Slug">
                    <input
                      type="text"
                      placeholder="honda-civic-touring-2020"
                      className="input-admin"
                      value={form.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Field label="Marca">
                    <input
                      type="text"
                      className="input-admin"
                      value={form.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                    />
                  </Field>

                  <Field label="Modelo">
                    <input
                      type="text"
                      className="input-admin"
                      value={form.model}
                      onChange={(e) => updateField("model", e.target.value)}
                    />
                  </Field>

                  <Field label="Ano">
                    <input
                      type="number"
                      className="input-admin"
                      value={form.year}
                      onChange={(e) => updateField("year", e.target.value)}
                    />
                  </Field>

                  <Field label="Preço">
                    <input
                      type="number"
                      className="input-admin"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Field label="KM">
                    <input
                      type="number"
                      className="input-admin"
                      value={form.km}
                      onChange={(e) => updateField("km", e.target.value)}
                    />
                  </Field>

                  <Field label="Combustível">
                    <input
                      type="text"
                      className="input-admin"
                      value={form.fuel}
                      onChange={(e) => updateField("fuel", e.target.value)}
                    />
                  </Field>

                  <Field label="Câmbio">
                    <input
                      type="text"
                      className="input-admin"
                      value={form.transmission}
                      onChange={(e) =>
                        updateField("transmission", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Cor">
                    <input
                      type="text"
                      className="input-admin"
                      value={form.color}
                      onChange={(e) => updateField("color", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Field label="Carroceria">
                    <input
                      type="text"
                      className="input-admin"
                      value={form.bodyType}
                      onChange={(e) => updateField("bodyType", e.target.value)}
                    />
                  </Field>

                  <Field label="Final da placa">
                    <input
                      type="text"
                      maxLength={1}
                      className="input-admin"
                      value={form.plateEnding}
                      onChange={(e) =>
                        updateField(
                          "plateEnding",
                          e.target.value.replace(/[^0-9]/g, "")
                        )
                      }
                    />
                  </Field>
                </div>

                <div className="grid gap-4">
                  <Field label="Imagem principal">
                    <input
                      type="text"
                      placeholder="https://..."
                      className="input-admin"
                      value={form.coverImage}
                      onChange={(e) => updateField("coverImage", e.target.value)}
                    />
                  </Field>

                  <Field label="Upload de imagens">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragActive(false);
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsDragActive(false);
                        const files = Array.from(e.dataTransfer.files || []);
                        await handleFiles(files);
                      }}
                      className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                        isDragActive
                          ? "border-black bg-black/5"
                          : "border-black/15 bg-black/[0.03]"
                      }`}
                    >
                      <p className="text-sm font-medium text-black/75">
                        Arraste imagens aqui ou selecione arquivos
                      </p>
                      <p className="mt-2 text-xs text-black/45">
                        JPG, PNG, WEBP • até 8 MB por imagem
                      </p>

                      <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85">
                        {uploading ? "Enviando..." : "Selecionar imagens"}
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.webp"
                          className="hidden"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            await handleFiles(files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </Field>

                  <Field label="Galeria (URLs)">
                    <textarea
                      rows={4}
                      className="input-admin min-h-[120px] resize-none"
                      value={form.images}
                      onChange={(e) => updateField("images", e.target.value)}
                      placeholder="Uma URL por linha"
                    />
                  </Field>
                </div>

                <Field label="Descrição">
                  <textarea
                    rows={6}
                    className="input-admin min-h-[150px] resize-none"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </Field>

                <div className="grid gap-3 md:grid-cols-2">
                  <Toggle
                    label="Publicado"
                    checked={form.isPublished}
                    onChange={(checked) => updateField("isPublished", checked)}
                  />
                  <Toggle
                    label="Destaque"
                    checked={form.isFeatured}
                    onChange={(checked) => updateField("isFeatured", checked)}
                  />
                  <Toggle
                    label="Oferta"
                    checked={form.isOffer}
                    onChange={(checked) => updateField("isOffer", checked)}
                  />
                  <Toggle
                    label="Recém-chegado"
                    checked={form.isNewArrival}
                    onChange={(checked) => updateField("isNewArrival", checked)}
                  />
                  <Toggle
                    label="Aceita troca"
                    checked={form.acceptsTrade}
                    onChange={(checked) => updateField("acceptsTrade", checked)}
                  />
                  <Toggle
                    label="IPVA pago"
                    checked={form.ipvaPaid}
                    onChange={(checked) => updateField("ipvaPaid", checked)}
                  />
                  <Toggle
                    label="Licenciado"
                    checked={form.licensed}
                    onChange={(checked) => updateField("licensed", checked)}
                  />
                </div>

                {feedback && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm ${
                      feedbackType === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {feedback}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={loading || uploading}
                    className="rounded-xl border border-black/10 px-5 py-3 font-semibold text-black transition hover:bg-black/5 disabled:opacity-60"
                  >
                    {loading ? "Salvando..." : "Salvar rascunho"}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={loading || uploading}
                    className="rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
                  >
                    {loading ? "Publicando..." : "Publicar veículo"}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-black/40">
                  Preview
                </p>
                <h2 className="mt-2 text-2xl font-bold">{form.title || "—"}</h2>
                <p className="mt-3 text-black/60">
                  {form.brand || "Marca"} • {form.model || "Modelo"}
                </p>
                <p className="mt-4 text-3xl font-bold">{previewPrice}</p>
              </div>

              {galleryPreview.length > 0 && (
                <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-black/40">
                    Galeria
                  </p>

                  <div className="mt-4 space-y-3">
                    {galleryPreview.map((image, index) => {
                      const isCover = form.coverImage === image;

                      return (
                        <div
                          key={`${image}-${index}`}
                          className="rounded-2xl border border-black/10 p-3"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              className="h-20 w-28 rounded-xl object-cover"
                            />

                            <div className="flex-1 space-y-2">
                              <p className="line-clamp-2 text-sm text-black/60">
                                {image}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => setAsCover(image)}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                    isCover
                                      ? "bg-black text-white"
                                      : "border border-black/10 text-black"
                                  }`}
                                >
                                  {isCover ? "Capa" : "Definir como capa"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => moveImage(index, "left")}
                                  className="rounded-lg border border-black/10 px-3 py-1.5 text-xs"
                                >
                                  ←
                                </button>

                                <button
                                  type="button"
                                  onClick={() => moveImage(index, "right")}
                                  className="rounded-lg border border-black/10 px-3 py-1.5 text-xs"
                                >
                                  →
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm font-medium text-black/70">{label}</p>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3">
      <span className="text-sm font-medium text-black/75">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}