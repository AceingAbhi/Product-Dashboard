interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <h2 className="section-heading-title">{title}</h2>
      {subtitle && <p className="section-heading-subtitle">{subtitle}</p>}
    </div>
  );
}
