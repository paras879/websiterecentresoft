const stats = [
  { value: "100%", label: "Client source code & IP ownership" },
  { value: "2", label: "Focused service lines: software & AI automation" },
  { value: "4", label: "Phase milestone-driven delivery framework" },
  { value: "Noida", label: "Headquarters, Sector-63, Uttar Pradesh" },
];

export function StatBand() {
  return (
    <section className="stat-band" aria-label="Recenturesoft at a glance">
      <div className="container stat-band__grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-band__item">
            <span className="stat-band__value">{stat.value}</span>
            <span className="stat-band__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
