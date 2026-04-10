type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
}: SectionTitleProps) {
  const isCenter = align === "center";
  const isDark = theme === "dark";

  return (
    <div className={`${isCenter ? "text-center mx-auto" : ""} max-w-3xl`}>
      {eyebrow && (
        <p
          className={`text-sm font-semibold uppercase tracking-[0.2em] ${
            isDark ? "text-white/70" : "text-slate-500"
          }`}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={`mt-2 text-3xl font-bold md:text-4xl ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 ${
            isDark ? "text-white/70" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}