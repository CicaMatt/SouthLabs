// Shared title/subtitle block used to keep section headings visually consistent.
export default function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={className}>
      <h2 className="font-headline text-3xl md:text-4xl tracking-tight text-on-background mb-4">{title}</h2>
      <p className="font-body text-on-surface-variant">{subtitle}</p>
    </div>
  );
}
