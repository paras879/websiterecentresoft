"use client";

import Link from "next/link";
import { modules } from "@/content";
import { pageResource } from "@/lib/cms-access";
import { UiIcon } from "../../admin/_components/ui";
import cms from "../cms.module.css";
import { useCms } from "./cms-context";
import { PageHead } from "./page-head";

const BASE = "/admin1";

interface Card {
  title: string;
  meta?: string;
  href: string;
  /** Where the plus button goes, when there is something to create. */
  create?: string;
}

export function DashboardView({ newMessages }: { newMessages: number }) {
  const { can, user, isDirty } = useCms();

  const collections: Card[] = [];
  if (can("users", "read")) collections.push({ title: "Users", href: `${BASE}/collections/users`, create: can("users", "create") ? `${BASE}/collections/users/create` : undefined });
  if (can("roles", "read")) collections.push({ title: "Roles", href: `${BASE}/collections/roles`, create: can("roles", "create") ? `${BASE}/collections/roles/create` : undefined });
  if (can("pages", "read")) collections.push({ title: "Custom pages", href: `${BASE}/collections/pages`, create: can("pages", "create") ? `${BASE}/collections/pages/create` : undefined });
  if (can("media", "read")) collections.push({ title: "Media", href: `${BASE}/collections/media` });
  if (can("inbox", "read")) {
    collections.push({
      title: "Messages & applications",
      meta: newMessages ? `${newMessages} new` : "No new messages",
      href: `${BASE}/collections/messages`,
    });
  }
  if (can("history", "read")) collections.push({ title: "Versions", href: `${BASE}/collections/versions` });

  const groups = (["Pages", "Services", "Site"] as const)
    .map((group) => ({
      title: group === "Site" ? "Site-wide" : group,
      cards: modules
        .filter((m) => m.group === group && can(pageResource(m.id), "read"))
        .map<Card>((m) => ({
          title: m.id === "site" ? "Header, footer & contact" : m.id === "reviews" ? "Customer reviews" : m.title,
          meta: isDirty(m.id) ? "Unsaved changes" : can(pageResource(m.id), "update") ? undefined : "Read only",
          href: `${BASE}/globals/${m.id}`,
        })),
    }))
    .filter((g) => g.cards.length > 0);

  const sections: { title: string; cards: Card[] }[] = [];
  if (collections.length) sections.push({ title: "Collections", cards: collections });
  sections.push(...groups);

  return (
    <>
      <PageHead title="Dashboard" lead={`Welcome back, ${user.name}. Pick something to edit.`} />
      {sections.length === 0 ? (
        <div className={cms.empty}>Your role does not give access to anything yet. Ask an administrator.</div>
      ) : null}
      {sections.map((section) => (
        <section key={section.title} className={cms.dashGroup}>
          <h2 className={cms.dashGroupTitle}>{section.title}</h2>
          <div className={cms.cards}>
            {section.cards.map((card) => (
              <div key={card.href} style={{ position: "relative" }}>
                <Link href={card.href} className={cms.cardItem}>
                  <span className={cms.cardMain}>
                    <span className={cms.cardTitle}>{card.title}</span>
                    {card.meta ? <span className={cms.cardMeta}>{card.meta}</span> : null}
                  </span>
                  {card.create ? <span style={{ width: 30 }} aria-hidden="true" /> : null}
                </Link>
                {card.create ? (
                  <Link
                    href={card.create}
                    className={cms.cardPlus}
                    aria-label={`Create new ${card.title}`}
                    style={{ position: "absolute", top: "50%", right: 18, transform: "translateY(-50%)" }}
                  >
                    <UiIcon name="plus" />
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
