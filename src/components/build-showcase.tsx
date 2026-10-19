"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/app/services/icons";
import styles from "./build-showcase.module.css";

export interface BuildItem {
  icon: IconName;
  title: string;
  desc: string;
  image: string;
  alt: string;
  tags: string[];
}

export function BuildShowcase({
  items,
  intro,
}: {
  items: BuildItem[];
  intro?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(index)) setActive(index);
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    refs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        {intro ? <div className={styles.intro}>{intro}</div> : null}
        <div className={styles.visual}>
          <div className={styles.frame}>
            {items.map((item, index) => (
              <Image
                key={item.image + index}
                src={item.image}
                alt={item.alt}
                aria-hidden={index === active ? undefined : true}
                fill
                sizes="(max-width: 1000px) 0px, 720px"
                quality={90}
                className={`${styles.img} ${index === active ? styles.imgActive : ""}`}
              />
            ))}
            <div className={styles.caption}>
              <span className={styles.captionCount}>
                {active + 1} / {items.length}
              </span>
              <span className={styles.captionTitle}>{items[active].title}</span>
            </div>
          </div>
          <div className={styles.dots} role="tablist" aria-label="Services">
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={item.title}
                className={`${styles.dot} ${index === active ? styles.dotActive : ""}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {items.map((item, index) => (
          <article
            key={item.title}
            ref={(el) => {
              refs.current[index] = el;
            }}
            data-index={index}
            className={`${styles.card} ${index === active ? styles.cardActive : ""}`}
          >
            <span className={styles.icon}>
              <Icon name={item.icon} className={styles.iconSvg} />
            </span>
            <div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.text}>{item.desc}</p>
              <ul className={styles.tags} aria-label="Typical solutions">
                {item.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
