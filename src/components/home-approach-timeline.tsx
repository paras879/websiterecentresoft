"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon, iconPaths, type IconName } from "@/app/services/icons";
import styles from "@/app/home.module.css";

const isIcon = (name: string): name is IconName => name in iconPaths;

function Glyph({ name, className }: { name: string; className?: string }) {
  return isIcon(name) ? <Icon name={name} className={className} /> : null;
}

export interface ApproachItem {
  title: string;
  tagline?: string;
  chips?: string[];
  desc: string;
  outcome?: string;
  icon: string;
}

const defaultHighlights: Record<string, { tagline: string; chips: string[] }> = {
  Discover: {
    tagline: "Scoping & Technical Strategy",
    chips: ["Roadmap", "Feasibility", "Architecture"],
  },
  Design: {
    tagline: "System Schemas & Prototyping",
    chips: ["UI/UX Wireframes", "Microservices", "Database"],
  },
  Build: {
    tagline: "Agile Engineering & QA",
    chips: ["Clean Code", "2-Week Sprints", "Automated QA"],
  },
  Deliver: {
    tagline: "Cloud Launch & Support",
    chips: ["CI/CD Pipelines", "Code Handover", "24/7 SLA"],
  },
};

export interface ApproachProps {
  approach: {
    title: string;
    lead: string;
    stepWord: string;
    outcomeLabel: string;
    items: ApproachItem[];
    buttonLabel?: string;
    buttonHref?: string;
  };
}

export function HomeApproachTimeline({ approach }: ApproachProps) {
  // activeStep is null when no card is hovered / when user leaves the section
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Automatically reset active step if user scrolls out of the approach section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setActiveStep(null);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.approach}
      aria-labelledby="approach-heading"
      onMouseLeave={() => setActiveStep(null)}
    >
      <div className="container">
        <header className={`${styles.sectionHead} ${styles.centered}`}>
          <h2 id="approach-heading" className={styles.h2}>
            {approach.title}
          </h2>
          <p className={styles.lead}>{approach.lead}</p>
        </header>

        <ol className={styles.stages}>
          {approach.items.map((item, index) => {
            const isActive = activeStep === index;
            const isPassed = activeStep !== null && activeStep > index;
            const isReached = activeStep !== null && activeStep >= index;

            // Connector 0 connects Step 1-2, Connector 1 connects Step 2-3, Connector 2 connects Step 3-4
            const isConnectorCompleted = activeStep !== null && index < activeStep - 1;
            const isConnectorActive = activeStep !== null && index === activeStep - 1;

            return (
              <li
                key={`${item.title}-${index}`}
                className={`${styles.stage} ${isActive ? styles.stageActive : ""} ${
                  isPassed ? styles.stagePassed : ""
                } ${isReached ? styles.stageReached : ""}`}
                onMouseEnter={() => setActiveStep(index)}
                onFocus={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
              >
                {/* Timeline Track with Circle Node + Animated Connector Line */}
                <div className={styles.stageTrack} aria-hidden="true">
                  <span
                    className={`${styles.stageNode} ${
                      isActive ? styles.stageNodeActive : ""
                    } ${isReached ? styles.stageNodeReached : ""} ${
                      isPassed ? styles.stageNodePassed : ""
                    }`}
                  >
                    {/* Rotating Color Ring around the icon (icon itself does NOT spin) */}
                    <span className={styles.stageNodeRing} aria-hidden="true" />

                    {/* Solid inner node containing the steady upright icon */}
                    <span className={styles.stageNodeInner}>
                      <Glyph name={item.icon} className={styles.icon} />
                    </span>
                  </span>

                  {/* Animated connector line to next step */}
                  {index < approach.items.length - 1 ? (
                    <div className={styles.stageConnector}>
                      <div
                        className={`${styles.stageConnectorFill} ${
                          isConnectorCompleted
                            ? styles.stageConnectorCompleted
                            : isConnectorActive
                            ? styles.stageConnectorActive
                            : styles.stageConnectorInactive
                        }`}
                      />
                    </div>
                  ) : null}
                </div>

                {/* Compact 3D Flip Card */}
                <div className={styles.stageFlipCard}>
                  <div className={styles.stageFlipInner}>
                    {/* Front Face: Centered, rich & informative */}
                    <div className={styles.stageFlipFront}>
                      <span className={styles.stageLabel}>
                        {approach.stepWord} {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className={styles.stageFrontBody}>
                        <h3 className={styles.stageBigTitle}>{item.title}</h3>
                        <p className={styles.stageTagline}>
                          {item.tagline ||
                            defaultHighlights[item.title]?.tagline ||
                            "Engineering & Delivery"}
                        </p>

                        <div className={styles.stageChips}>
                          {(item.chips && item.chips.length > 0
                            ? item.chips
                            : defaultHighlights[item.title]?.chips || []
                          ).map((chip, cIdx) => (
                            <span key={`${chip}-${cIdx}`} className={styles.stageChip}>
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.stageFlipHint}>
                        <span>Hover to explore</span>
                        <span className={styles.stageFlipHintIcon} aria-hidden="true">
                          &rarr;
                        </span>
                      </div>
                    </div>

                    {/* Back Face: Sleek description and outcome */}
                    <div className={styles.stageFlipBack}>
                      <div className={styles.stageBackHeader}>
                        <span className={styles.stageBackStep}>
                          {approach.stepWord} {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className={styles.stageBackTitle}>{item.title}</p>
                      </div>
                      <p className={styles.stageText}>{item.desc}</p>
                      {item.outcome ? (
                        <p className={styles.stageOutcome}>
                          <Icon name="check" className={styles.stageCheck} />
                          <span>
                            <span className={styles.stageOutcomeLabel}>
                              {approach.outcomeLabel}
                            </span>
                            {item.outcome}
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {approach.buttonLabel ? (
          <div className={styles.approachCta}>
            <Link
              href={approach.buttonHref || "/contact"}
              className={`btn btnPrimary ${styles.btnPrimary}`}
            >
              {approach.buttonLabel} &rarr;
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
