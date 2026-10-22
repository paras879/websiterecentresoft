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

/** Real customer reviews. Renders nothing until reviews are added in the admin panel. */
export function ReviewsSection({ items }: { items: PublicReview[] }) {
  const reviews = items.filter((r) => r.author.trim() && r.text.trim());
  if (reviews.length === 0) return null;

  // Up to four fit in the row; more than that slide.
  const slides = reviews.length > 4;
  const average = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;

  const cards = reviews.map((r, i) => (
    <li key={`${r.author}-${i}`} className={styles.item}>
      <p className={styles.stars} role="img" aria-label={`${r.rating} out of 5 stars`}>
        {"★".repeat(Number(r.rating) || 0)}
        <span aria-hidden="true">{"★".repeat(5 - (Number(r.rating) || 0))}</span>
      </p>
      <blockquote className={styles.quote}>{r.text}</blockquote>
      <div className={styles.person}>
        {r.photo ? <Image className={styles.avatar} src={r.photo} alt={`Photo of ${r.author}`} width={96} height={96} sizes="48px" /> : null}
        <p className={styles.who}>
          <strong>{r.author}</strong>
          {r.role ? <span>{r.role}</span> : null}
          {r.source ? <span className={styles.source}>via {r.source}</span> : null}
        </p>
      </div>
    </li>
  ));

  return (
    <div className={styles.wrap} role="region" aria-labelledby="reviews-heading">
      <div className="container">
        <header className={styles.head}>
          <h2 id="reviews-heading" className={styles.title}>
            What our customers say
          </h2>
          <p className={styles.summary}>
            <span className={styles.score}>{average.toFixed(1)}</span> out of 5, from {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </header>

        {slides ? <ReviewsSlider>{cards}</ReviewsSlider> : <ul className={styles.list}>{cards}</ul>}
      </div>
    </div>
  );
}
