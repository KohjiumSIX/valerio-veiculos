"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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

export default function EditVehiclePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "idle">(
    "idle"
  );

  useEffect(() => {
    async function loadVehicle() {
      setLoading(true);
      setFeedback("");

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setFeedback("Erro ao carregar veículo.");
        setFeedbackType("error");
        setLoading(false);
        return;
      }

      setForm({
        title: data.title || "",
        slug: data.slug || "",
        brand: data.brand || "",
        model: data.model || "",
        year: String(data.year || ""),
        price: String(data.price || ""),
        km: String(data.km || ""),
        fuel: data.fuel || "",
        transmission: data.transmission || "",
        color: data.color || "",
        bodyType: data.body_type || "",
        acceptsTrade: Boolean(data.accepts_trade),
        plateEnding: data.plate_ending || "",
        ipvaPaid: Boolean(data.ipva_paid),
        licensed: Boolean(data.licensed),
        coverImage: data.cover_image || "",
        images: (data.images || []).join("\n"),
        description: data.description || "",
        isPublished: Boolean(data.is_published),
        isFeatured: Boolean(data.is_featured),
        isOffer: Boolean(data.is_offer),
        isNewArrival: Boolean(data.is_new_arrival),
      });

      setLoading(false);
    }

    loadVehicle();
  }, [id, supabase]);

  const previewPrice = useMemo(() => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(form?.price || 0));
  }, [form?.price]);

  const galleryPreview = useMemo(() => {
    return (form?.images || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form?.images]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev!, [key]: value }));
  }

  function setGalleryImages(nextImages: string[]) {
    setForm((prev) => ({
      ...prev!,
      images: nextImages.join("\n"),
      coverImage: nextImages.includes(prev!.coverImage)
        ? prev!.coverImage
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
      ...prev!,
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
        const existing = (prev?.images || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);

        const nextImages = [...existing, ...uploadedUrls];

        return {
          ...prev!,
          images: nextImages.join("\n"),
          coverImage: prev!.coverImage || nextImages[0] || "",
        };
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form) return;

    setSaving(true);
    setFeedback("");
    setFeedbackType("idle");

    try {
      const imageList = form.images
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean);

      const { error } = await supabase
        .from("vehicles")
        .update({
          title: form.title.trim(),
          slug: generateSlug(form.slug || form.title),
          brand: form.brand.trim(),
          model: form.model.trim(),
          year: Number(form.year),
          price: Number(form.price),
          km: Number(form.km),
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
          is_published: form.isPublished,
          is_featured: form.isFeatured,
          is_offer: form.isOffer,
          is_new_arrival: form.isNewArrival,
        })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      setFeedback("Veículo atualizado com sucesso.");
      setFeedbackType("success");
      router.refresh();
    } catch {
      setFeedback("Erro ao salvar.");
      setFeedbackType("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = confirm("Deseja realmente excluir este veículo?");
    if (!confirmed) return;

    const { error } = await supabase.from("vehicles").delete().eq("id", id);

    if (error) {
      setFeedback("Erro ao excluir veículo.");
      setFeedbackType("error");
      return;
    }

    router.push("/admin/veiculos");
    router.refresh();
  }

  if (loading || !form) {
    return (
      <main className="min-h-screen bg-white text-black">
        <Navbar />
        <section className="pt-32 pb-10">
          <Container>
            <div className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm">
              Carregando...
            </div>
          </Container>
        </section>
      </main>
    );
  }

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
                Editar veículo
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">
                Atualize informações, imagens e status do anúncio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/veiculos"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Voltar
              </Link>

              <Link
                href={`/veiculos/${form.slug}`}
                className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-white/90"
              >
                Ver anúncio
              </Link>
            </div>
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

              <div className="mt-8 space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Título">
                    <input
                      type="text"
                      placeholder="Ex: Honda Civic Touring 2020"
                      className="input-admin"
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
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
                      placeholder="Honda"
                      className="input-admin"
                      value={form.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                    />
                  </Field>

                  <Field label="Modelo">
                    <input
                      type="text"
                      placeholder="Civic Touring"
                      className="input-admin"
                      value={form.model}
                      onChange={(e) => updateField("model", e.target.value)}
                    />
                  </Field>

                  <Field label="Ano">
                    <input
                      type="number"
                      placeholder="2020"
                      className="input-admin"
                      value={form.year}
                      onChange={(e) => updateField("year", e.target.value)}
                    />
                  </Field>

                  <Field label="Preço">
                    <input
                      type="number"
                      placeholder="89900"
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
                      placeholder="48000"
                      className="input-admin"
                      value={form.km}
                      onChange={(e) => updateField("km", e.target.value)}
                    />
                  </Field>

                  <Field label="Combustível">
                    <input
                      type="text"
                      placeholder="Flex"
                      className="input-admin"
                      value={form.fuel}
                      onChange={(e) => updateField("fuel", e.target.value)}
                    />
                  </Field>

                  <Field label="Câmbio">
                    <input
                      type="text"
                      placeholder="Automático"
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
                      placeholder="Preto"
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
                      placeholder="SUV, Sedan, Hatch..."
                      className="input-admin"
                      value={form.bodyType}
                      onChange={(e) => updateField("bodyType", e.target.value)}
                    />
                  </Field>

                  <Field label="Final da placa">
                    <input
                      type="text"
                      placeholder="Ex: 7"
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
                        JPG, PNG, WEBP • múltiplos arquivos
                      </p>

                      <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85">
                        {uploading ? "Enviando..." : "Selecionar imagens"}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
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
                      placeholder="Uma URL por linha"
                      className="input-admin min-h-[120px] resize-none"
                      value={form.images}
                      onChange={(e) => updateField("images", e.target.value)}
                    />
                  </Field>

                  {galleryPreview.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-black/70">
                          Prévia da galeria
                        </p>
                        <p className="text-xs text-black/45">
                          Arrume a ordem com as setas e escolha a capa
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {galleryPreview.map((image, index) => {
                          const isCover = form.coverImage === image;

                          return (
                            <div
                              key={`${image}-${index}`}
                              className={`overflow-hidden rounded-2xl border ${
                                isCover
                                  ? "border-black bg-black text-white"
                                  : "border-black/10 bg-black/5"
                              }`}
                            >
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="h-40 w-full object-cover"
                              />

                              <div className="space-y-3 p-3">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`text-xs ${
                                      isCover
                                        ? "text-white/70"
                                        : "text-black/50"
                                    }`}
                                  >
                                    {isCover
                                      ? "Imagem de capa"
                                      : `Imagem ${index + 1}`}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                                      isCover
                                        ? "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                                        : "border border-black/10 hover:bg-black/5"
                                    }`}
                                  >
                                    Remover
                                  </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => moveImage(index, "left")}
                                    disabled={index === 0}
                                    className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                                      isCover
                                        ? "border border-white/15 bg-white/10 text-white disabled:opacity-30"
                                        : "border border-black/10 bg-white disabled:opacity-30"
                                    }`}
                                  >
                                    ← Subir
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => moveImage(index, "right")}
                                    disabled={index === galleryPreview.length - 1}
                                    className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                                      isCover
                                        ? "border border-white/15 bg-white/10 text-white disabled:opacity-30"
                                        : "border border-black/10 bg-white disabled:opacity-30"
                                    }`}
                                  >
                                    Descer →
                                  </button>

                                  {!isCover && (
                                    <button
                                      type="button"
                                      onClick={() => setAsCover(image)}
                                      className="rounded-lg bg-black px-2 py-1 text-xs font-medium text-white transition hover:bg-black/85"
                                    >
                                      Definir capa
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Field label="Descrição">
                    <textarea
                      className="input-admin min-h-[160px] resize-none"
                      rows={6}
                      placeholder="Descreva o veículo..."
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                  </Field>
                </div>

                <div>
                  <p className="text-sm font-medium text-black/70">
                    Configurações
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                      onChange={(checked) =>
                        updateField("isNewArrival", checked)
                      }
                    />
                    <Toggle
                      label="Aceita troca"
                      checked={form.acceptsTrade}
                      onChange={(checked) =>
                        updateField("acceptsTrade", checked)
                      }
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
                </div>

                {feedback && (
                  <p
                    className={`text-sm font-medium ${
                      feedbackType === "success"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {feedback}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
                  >
                    {saving ? "Salvando..." : "Salvar"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving || uploading}
                    className="rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                  >
                    Excluir veículo
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                  Resumo
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Atualização do anúncio
                </h2>

                <div className="mt-6 space-y-4 text-white/75">
                  <p>Edite as informações e salve para atualizar o catálogo.</p>
                  <p>Você pode subir novas fotos, mudar a capa e reorganizar a galeria.</p>
                  <p>O anúncio público refletirá essas mudanças automaticamente.</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-black/40">
                  Prévia rápida
                </p>
                <h2 className="mt-2 text-2xl font-bold">Visualização</h2>

                <div className="mt-6 rounded-[1.5rem] border border-black/10 bg-black/5 p-5">
                  <div className="aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-black/10">
                    {form.coverImage ? (
                      <img
                        src={form.coverImage}
                        alt="Prévia do veículo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-black/35">
                        Imagem principal
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-lg font-semibold">
                    {form.title || "Título do veículo"}
                  </p>
                  <p className="mt-1 text-sm text-black/55">
                    {form.brand || "Marca"} • {form.model || "Modelo"}
                  </p>
                  <p className="mt-4 text-xl font-bold">{previewPrice}</p>

                  {galleryPreview.length > 0 && (
                    <p className="mt-3 text-sm text-black/55">
                      {galleryPreview.length} imagem(ns) na galeria
                    </p>
                  )}
                </div>
              </div>
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
      <span className="mb-2 block text-sm font-medium text-black/70">
        {label}
      </span>
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
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-black/10 bg-black/5 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="checkbox"
        className="h-4 w-4 accent-black"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}