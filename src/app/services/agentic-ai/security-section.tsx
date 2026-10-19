import React from "react";
import styles from "./security-section.module.css";

// =====================================================================
// Icons
// =====================================================================

function ShieldOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CheckCircleMini() {
  return (
    <svg className={styles.widgetCheckIcon} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#38bdf8" strokeWidth="2" />
      <path d="M8 12l2.5 2.5L16 9" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// =====================================================================
// Center 3D Security Shield Hologram Graphic
// =====================================================================

function SecurityHologramGraphic() {
  return (
    <svg
      viewBox="0 0 340 370"
      className={styles.hologramWrapper}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        {/* Glow Filters - Optimized for 60fps scroll */}
        <filter id="hologramGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="pedestalGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Shield Gradient */}
        <linearGradient id="shieldGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="85%" stopColor="#1d4ed8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0b2a74" stopOpacity="0.95" />
        </linearGradient>

        {/* Pedestal Top */}
        <linearGradient id="pedestalTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Pedestal Rim */}
        <linearGradient id="neonRim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* Orbital Dashed Rings */}
      <ellipse
        cx="170"
        cy="195"
        rx="155"
        ry="85"
        fill="none"
        stroke="rgba(56, 189, 248, 0.2)"
        strokeWidth="1.2"
        strokeDasharray="5 5"
      />
      <ellipse
        cx="170"
        cy="185"
        rx="135"
        ry="75"
        fill="none"
        stroke="rgba(96, 165, 250, 0.15)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Ambient Pedestal Ground Shadow */}
      <ellipse cx="170" cy="298" rx="120" ry="40" fill="rgba(0, 0, 0, 0.75)" filter="url(#pedestalGlow)" />
      <ellipse cx="170" cy="285" rx="90" ry="30" fill="rgba(37, 99, 235, 0.35)" filter="url(#pedestalGlow)" />

      {/* Pedestal (Lower Tier) */}
      <path
        d="M 68 280 A 102 30 0 0 0 272 280 L 272 298 A 102 30 0 0 1 68 298 Z"
        fill="#081836"
        stroke="rgba(56, 189, 248, 0.3)"
        strokeWidth="1"
      />
      <ellipse cx="170" cy="280" rx="102" ry="30" fill="#0f2752" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />

      {/* Pedestal (Middle Tier with Neon Rim) */}
      <path
        d="M 88 268 A 82 24 0 0 0 252 268 L 252 280 A 82 24 0 0 1 88 280 Z"
        fill="#0b2347"
      />
      <ellipse cx="170" cy="268" rx="82" ry="24" fill="url(#pedestalTop)" stroke="url(#neonRim)" strokeWidth="2.2" />
      <ellipse cx="170" cy="268" rx="66" ry="19" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

      {/* Vertical Light Pillar Glow */}
      <path
        d="M 125 100 L 215 100 L 245 268 L 95 268 Z"
        fill="url(#shieldGlass)"
        opacity="0.14"
        filter="url(#pedestalGlow)"
      />

      {/* Central Floating Hologram Shield */}
      <g transform="translate(170, 175) scale(0.96)">
        {/* Outer Shield Glow */}
        <path
          d="M 0 -85 L 56 -52 C 56 12 36 60 0 85 C -36 60 -56 12 -56 -52 Z"
          fill="rgba(56, 189, 248, 0.3)"
          filter="url(#hologramGlow)"
        />

        {/* 3D Glass Shield Body */}
        <path
          d="M 0 -85 L 56 -52 C 56 12 36 60 0 85 C -36 60 -56 12 -56 -52 Z"
          fill="url(#shieldGlass)"
          stroke="#7dd3fc"
          strokeWidth="2.2"
        />

        {/* Inner Facet Highlight */}
        <path
          d="M 0 -72 L 44 -44 C 44 8 28 48 0 68 C -28 48 -44 8 -44 -44 Z"
          fill="none"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="1.2"
        />

        {/* Center Padlock Icon */}
        <g transform="translate(-16, -18)">
          <rect x="4" y="14" width="24" height="18" rx="4" fill="#ffffff" />
          <path d="M 8 14 V 9 A 8 8 0 0 1 24 9 V 14" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="22" r="2.5" fill="#0b2a74" />
          <path d="M 16 23 V 27" stroke="#0b2a74" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>

      {/* 4 Orbiting Floating Glass Badges */}
      {/* Top Badge: User Icon */}
      <g transform="translate(149, 44)">
        <rect x="0" y="0" width="42" height="42" rx="13" fill="rgba(37, 99, 235, 0.35)" stroke="#38bdf8" strokeWidth="1.5" filter="url(#hologramGlow)" />
        <rect x="0" y="0" width="42" height="42" rx="13" fill="rgba(11, 35, 75, 0.88)" stroke="#7dd3fc" strokeWidth="1.2" />
        <g transform="translate(12, 12)">
          <path d="M 14 16 v -2 a 3 3 0 0 0 -3 -3 H 5 a 3 3 0 0 0 -3 3 v 2" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="8" cy="6" r="3" stroke="#ffffff" strokeWidth="1.8" />
        </g>
      </g>

      {/* Left Badge: Document Icon */}
      <g transform="translate(32, 138)">
        <rect x="0" y="0" width="38" height="38" rx="11" fill="rgba(37, 99, 235, 0.3)" stroke="#38bdf8" strokeWidth="1.4" filter="url(#hologramGlow)" />
        <rect x="0" y="0" width="38" height="38" rx="11" fill="rgba(11, 35, 75, 0.88)" stroke="#7dd3fc" strokeWidth="1" />
        <g transform="translate(10, 10)">
          <path d="M 11 2 H 4 a 2 2 0 0 0 -2 2 v 12 a 2 2 0 0 0 2 2 h 10 a 2 2 0 0 0 2 -2 V 7 z" stroke="#ffffff" strokeWidth="1.6" fill="none" />
          <path d="M 11 2 v 5 h 5" stroke="#ffffff" strokeWidth="1.6" />
        </g>
      </g>

      {/* Bottom-Left Badge: Database Icon */}
      <g transform="translate(48, 250)">
        <rect x="0" y="0" width="38" height="38" rx="11" fill="rgba(37, 99, 235, 0.3)" stroke="#38bdf8" strokeWidth="1.4" filter="url(#hologramGlow)" />
        <rect x="0" y="0" width="38" height="38" rx="11" fill="rgba(11, 35, 75, 0.88)" stroke="#7dd3fc" strokeWidth="1" />
        <g transform="translate(9, 9)">
          <ellipse cx="10" cy="5" rx="7" ry="3" fill="none" stroke="#ffffff" strokeWidth="1.6" />
          <path d="M 3 5 v 8 c 0 1.6 3.1 3 7 3 s 7 -1.4 7 -3 V 5" fill="none" stroke="#ffffff" strokeWidth="1.6" />
        </g>
      </g>

      {/* Right Badge: Shield Icon */}
      <g transform="translate(262, 226)">
        <rect x="0" y="0" width="38" height="38" rx="11" fill="rgba(37, 99, 235, 0.3)" stroke="#38bdf8" strokeWidth="1.4" filter="url(#hologramGlow)" />
        <rect x="0" y="0" width="38" height="38" rx="11" fill="rgba(11, 35, 75, 0.88)" stroke="#7dd3fc" strokeWidth="1" />
        <g transform="translate(10, 10)">
          <path d="M 9 17 s 6 -3 6 -7.5 V 4 L 9 2 L 3 4 v 5.5 C 3 14 9 17 9 17 z" stroke="#ffffff" strokeWidth="1.6" fill="none" />
        </g>
      </g>
    </svg>
  );
}

// =====================================================================
// Main SecuritySection Component
// =====================================================================

export interface SafetyContent {
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
  badges: string[];
  items: { title: string; desc: string; icon: string }[];
}

const BADGE_ICONS = [LockIcon, UsersIcon, DatabaseIcon];

function splitHead(title: string, plainWords: number) {
  const words = title.trim().split(/\s+/);
  return { plain: words.slice(0, plainWords).join(" "), accent: words.slice(plainWords).join(" ") };
}

export function SecuritySection({ data }: { data: SafetyContent }) {
  const head = splitHead(data.title, 2);
  const items = data.items ?? [];
  const points = data.points ?? [];
  const badges = data.badges ?? [];
  return (
    <section className={styles.section} id="safety" aria-labelledby="security-governance-title">
      <div className={styles.wrap}>
        <div className={styles.canvas}>
          <div className={styles.canvasGlow} aria-hidden="true" />

          <div className={styles.layout}>
            {/* ---------------- Left Column ---------------- */}
            <div className={styles.leftCol}>
              <div className={styles.headerCopy}>
                <div className={styles.eyebrowBadge}>
                  <ShieldOutlineIcon className={styles.eyebrowIcon} />
                  <span>{data.eyebrow}</span>
                </div>

                <h2 id="security-governance-title" className={styles.mainTitle}>
                  {head.plain}
                  {head.accent ? (
                    <>
                      {" "}
                      <span className={styles.titleCyan}>{head.accent}</span>
                    </>
                  ) : null}
                </h2>

                <p className={styles.leadText}>{data.lead}</p>

                <ul className={styles.govList}>
                  {points.map((point) => {
                    const cut = point.indexOf(":");
                    return (
                      <li key={point} className={styles.govItem}>
                        <span className={styles.govDot} aria-hidden="true" />
                        <span>
                          {cut > 0 ? <strong>{point.slice(0, cut + 1)}</strong> : null}
                          {cut > 0 ? point.slice(cut + 1) : point}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 3 Horizontal Trust Badges in a single row */}
              <div className={styles.leftBadges}>
                {badges.map((label, i) => {
                  const BadgeIcon = BADGE_ICONS[i % BADGE_ICONS.length];
                  return (
                    <div key={label} className={styles.leftBadgeItem}>
                      <div className={styles.leftBadgeIconBox}>
                        <BadgeIcon />
                      </div>
                      <span className={styles.leftBadgeText}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---------------- Center Hologram ---------------- */}
            <div className={styles.hologramCol}>
              <SecurityHologramGraphic />
            </div>

            {/* ---------------- Right 2x2 Grid ---------------- */}
            <div className={styles.gridCol}>
              {/* Card 01: Human checkpoints */}
              <div className={styles.securityCard}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardNum}>
                    01 <span className={styles.cardNumLine} aria-hidden="true" />
                  </div>
                  <div className={styles.cardTextGroup}>
                    <h3 className={styles.cardTitle}>{items[0]?.title}</h3>
                    <p className={styles.cardDesc}>{items[0]?.desc}</p>
                  </div>
                  <div className={styles.cardActionBtn} aria-hidden="true">
                    <ArrowRightIcon />
                  </div>
                </div>

                {/* Right Mini Widget: Checklist */}
                <div className={styles.cardRight}>
                  <div className={styles.widgetBox}>
                    <div className={styles.widgetAvatar}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className={styles.widgetCheckRow}>
                      <CheckCircleMini />
                      <span>Agent action</span>
                    </div>
                    <div className={styles.widgetCheckRow}>
                      <CheckCircleMini />
                      <span>Needs approval</span>
                    </div>
                    <div className={styles.widgetCheckRow}>
                      <CheckCircleMini />
                      <span>Human review</span>
                    </div>
                    <div className={styles.widgetCheckRow}>
                      <CheckCircleMini />
                      <span>Approved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 02: Scoped access */}
              <div className={styles.securityCard}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardNum}>
                    02 <span className={styles.cardNumLine} aria-hidden="true" />
                  </div>
                  <div className={styles.cardTextGroup}>
                    <h3 className={styles.cardTitle}>{items[1]?.title}</h3>
                    <p className={styles.cardDesc}>{items[1]?.desc}</p>
                  </div>
                  <div className={styles.cardActionBtn} aria-hidden="true">
                    <ArrowRightIcon />
                  </div>
                </div>

                {/* Right Mini Widget: 3D Stacked Layers */}
                <div className={styles.cardRight}>
                  <div className={`${styles.widgetBox} ${styles.layersWidget}`}>
                    <div className={styles.layerPill}>
                      <span>✓ CRM</span>
                    </div>
                    <div className={`${styles.layerPill} ${styles.layerActive}`}>
                      <span>✓ Database</span>
                    </div>
                    <div className={styles.layerPill}>
                      <span>✓ Internal Tools</span>
                    </div>
                    <div className={`${styles.layerPill} ${styles.layerLock}`}>
                      <span>🔒 Limited Access</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 03: Sensitive data protection */}
              <div className={styles.securityCard}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardNum}>
                    03 <span className={styles.cardNumLine} aria-hidden="true" />
                  </div>
                  <div className={styles.cardTextGroup}>
                    <h3 className={styles.cardTitle}>{items[2]?.title}</h3>
                    <p className={styles.cardDesc}>{items[2]?.desc}</p>
                  </div>
                  <div className={styles.cardActionBtn} aria-hidden="true">
                    <ArrowRightIcon />
                  </div>
                </div>

                {/* Right Mini Widget: Masked Data Card */}
                <div className={styles.cardRight}>
                  <div className={styles.widgetBox}>
                    <div className={styles.maskedHeader}>
                      <span className={styles.maskedTitlePill}>Masked</span>
                      <svg className={styles.maskedLockIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div className={styles.maskedRow}>
                      <span className={styles.maskedLabel}>Name</span>
                      <span className={styles.maskedStars}>*******</span>
                    </div>
                    <div className={styles.maskedRow}>
                      <span className={styles.maskedLabel}>Email</span>
                      <span className={styles.maskedStars}>*******</span>
                    </div>
                    <div className={styles.maskedRow}>
                      <span className={styles.maskedLabel}>Phone</span>
                      <span className={styles.maskedStars}>********</span>
                    </div>
                    <div className={styles.maskedRow}>
                      <span className={styles.maskedLabel}>Address</span>
                      <span className={styles.maskedStars}>*******</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 04: Complete audit trail */}
              <div className={styles.securityCard}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardNum}>
                    04 <span className={styles.cardNumLine} aria-hidden="true" />
                  </div>
                  <div className={styles.cardTextGroup}>
                    <h3 className={styles.cardTitle}>{items[3]?.title}</h3>
                    <p className={styles.cardDesc}>{items[3]?.desc}</p>
                  </div>
                  <div className={styles.cardActionBtn} aria-hidden="true">
                    <ArrowRightIcon />
                  </div>
                </div>

                {/* Right Mini Widget: Timeline Stream */}
                <div className={styles.cardRight}>
                  <div className={`${styles.widgetBox} ${styles.timelineWidget}`}>
                    <div className={styles.timelineRow}>
                      <span className={styles.timelineTime}>10:24</span>
                      <span>Plan created</span>
                    </div>
                    <div className={styles.timelineRow}>
                      <span className={styles.timelineTime}>10:25</span>
                      <span>Tool called</span>
                    </div>
                    <div className={styles.timelineRow}>
                      <span className={styles.timelineTime}>10:26</span>
                      <span>Result rec&apos;d</span>
                    </div>
                    <div className={styles.timelineRow}>
                      <span className={styles.timelineTime}>10:27</span>
                      <span className={styles.timelineApproved}>Approved</span>
                    </div>
                    <div className={styles.timelineRow}>
                      <span className={styles.timelineTime}>10:28</span>
                      <span>Logged</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
