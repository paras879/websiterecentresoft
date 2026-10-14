import Image from "next/image";
import { Icon, type IconName } from "@/app/services/icons";
import styles from "./career-perks.module.css";

export interface Perk {
  icon: IconName;
  title: string;
  desc: string;
  points: string[];
  image: string;
  alt: string;
}

export function CareerPerks({ items }: { items: Perk[] }) {
  return (
    <ul className={styles.grid}>
      {items.map((item, index) => (
        <li key={item.title} className={styles.perk}>
          <div className={styles.art}>
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 300px"
              quality={85}
              className={styles.img}
            />
            <span className={styles.shade} aria-hidden="true" />
            <span className={styles.badge} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <span className={styles.chip}>
            <Icon name={item.icon} className={styles.chipSvg} />
          </span>

          <div className={styles.body}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.text}>{item.desc}</p>
            <ul className={styles.points}>
              {item.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
