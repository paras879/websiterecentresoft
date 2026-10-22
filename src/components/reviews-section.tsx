import Image from "next/image";
import styles from "./reviews-section.module.css";
import { ReviewsSlider } from "./reviews-slider";

export interface PublicReview {
  author: string;
  role: string;
  photo?: string;
  rating: string;
  text: string;
  date: string;
  source: string;
}

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

const Stars = ({ value, label }: { value: number; label: string }) => (
  <span className={styles.stars} role="img" aria-label={label}>
    {"★".repeat(value)}
    <span aria-hidden="true">{"★".repeat(5 - value)}</span>
  </span>
);

/** Real customer reviews. Renders nothing until reviews are added in the admin panel. */
export function ReviewsSection({ items }: { items: PublicReview[] }) {
  const reviews = items.filter((r) => r.author.trim() && r.text.trim());
  if (reviews.length === 0) return null;

  // Up to four fit in the row; more than that slide.
  const slides = reviews.length > 4;

  const cards = reviews.map((r, i) => {
    const rating = Math.min(5, Math.max(0, Number(r.rating) || 0));
    return (
      <li key={`${r.author}-${i}`} className={styles.item}>
        <Stars value={rating} label={`${rating} out of 5 stars`} />
        <blockquote className={styles.quote}>{r.text}</blockquote>
        <div className={styles.person}>
          {r.photo ? (
            <Image className={styles.avatar} src={r.photo} alt={`Photo of ${r.author}`} width={96} height={96} sizes="48px" />
          ) : (
            <span className={styles.initials} aria-hidden="true">
              {initials(r.author)}
            </span>
          )}
          <p className={styles.who}>
            <strong>{r.author}</strong>
            {r.role ? <span>{r.role}</span> : null}
            {r.source ? <span className={styles.source}>via {r.source}</span> : null}
          </p>
        </div>
      </li>
    );
  });

  return (
    <div className={styles.wrap} role="region" aria-labelledby="reviews-heading">
      <div className="container">
        <header className={styles.head}>
          <h2 id="reviews-heading" className={styles.title}>
            What our customers say
          </h2>
        </header>

        {slides ? <ReviewsSlider>{cards}</ReviewsSlider> : <ul className={styles.list}>{cards}</ul>}
      </div>
    </div>
  );
}
