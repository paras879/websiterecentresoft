import { defineModule, group, list, longtext, select, text } from "./fields";

export interface ReviewItem {
  author: string;
  role: string;
  rating: string;
  text: string;
  date: string;
  source: string;
}

// No reviews are listed until real ones are added: the website never makes up testimonials or ratings.
const defaults = {
  reviews: { items: [] as ReviewItem[] },
};

export const reviewsModule = defineModule({
  id: "reviews",
  title: "Customer reviews",
  group: "Site",
  defaults,
  sections: [
    {
      id: "reviews",
      title: "Customer reviews",
      description:
        "Add only genuine reviews from real customers. They are shown on the home page and sent to Google as review and rating information. Leave the list empty if you have none yet.",
      fields: [
        group("reviews", "Customer reviews", [
          list(
            "items",
            "Reviews",
            "review",
            [
              text("author", "Customer name", { required: true, max: 80 }),
              text("role", "Role and company", { max: 120, help: "For example: Operations Head, ABC Logistics." }),
              select("rating", "Rating", [
                { value: "5", label: "5 out of 5" },
                { value: "4", label: "4 out of 5" },
                { value: "3", label: "3 out of 5" },
                { value: "2", label: "2 out of 5" },
                { value: "1", label: "1 out of 5" },
              ]),
              longtext("text", "What they said", { required: true, rows: 4, max: 800 }),
              text("date", "Date of the review", { max: 10, help: "Format: 2026-03-28." }),
              text("source", "Where it was given", { max: 80, help: "For example: Google, Clutch, email." }),
            ],
            { titleKey: "author", max: 30 },
          ),
        ]),
      ],
    },
  ],
});
