import styles from "./reviews-section.module.css";

export interface PublicReview {
  author: string;
  role: string;
  rating: string;
  text: string;
  date: string;
  source: string;
}

/** Real customer reviews. Renders nothing until reviews are added in the admin panel. */
export function ReviewsSection({ items }: { items: PublicReview[] }) {
  const reviews = items.filter((r) => r.author.trim() && r.text.trim());
  if (reviews.length === 0) return null;

  const average = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;

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

        <ul className={styles.list}>
          {reviews.map((r, i) => (
            <li key={`${r.author}-${i}`} className={styles.item}>
              <p className={styles.stars} role="img" aria-label={`${r.rating} out of 5 stars`}>
                {"★".repeat(Number(r.rating) || 0)}
                <span aria-hidden="true">{"★".repeat(5 - (Number(r.rating) || 0))}</span>
              </p>
              <blockquote className={styles.quote}>{r.text}</blockquote>
              <p className={styles.who}>
                <strong>{r.author}</strong>
                {r.role ? <span>{r.role}</span> : null}
                {r.source ? <span className={styles.source}>via {r.source}</span> : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
