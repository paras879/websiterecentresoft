# Security

What protects this website, what was checked, and what the owner still needs to do. No site can be promised unhackable;
this list is how the risk is kept small and how problems are noticed early.

## What protects the site

- **Passwords** are stored only as scrypt hashes. The environment admin password is never stored in the database.
- **Sign-in cookies** (`rs_admin`) are HttpOnly, SameSite=Strict and Secure on the live site, and signed with `ADMIN_SESSION_SECRET`.
- **Sign-in limits**: 10 tries per address and 10 tries per account in 15 minutes (so one account cannot be guessed from many
  addresses), plus the reCAPTCHA box. A switched-off user is signed out on the next request.
- **Roles and access** are checked on the server for every admin action, not only hidden in the screen.
- **Forms** (contact, careers, assistant) check the request comes from this site, have a hidden honeypot field, a rate limit,
  reCAPTCHA, and refuse oversized bodies (413) before reading them. Names and other single-line fields have control
  characters and line breaks removed, so nothing can be smuggled into e-mail headers or the inbox.
- **Resume uploads** are checked by their real file signature, not only the name, and are never served from a public folder.
- **Security headers** on every page: Content-Security-Policy (scripts and frames only from this site and Google reCAPTCHA,
  no other site may frame the pages, forms post only back here), nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy,
  Cross-Origin-Opener-Policy. The Content-Security-Policy is applied in the live build only.
- **security.txt** at `/.well-known/security.txt` tells researchers where to report a problem. Update its `Expires` date
  every year (currently 2027-10-23).
- **Dependencies**: `npm audit` reports 0 known vulnerabilities (Next.js 16.4.2).
- **Secrets**: none are committed. They live in Vercel environment variables.

## What was checked

Content-Security-Policy violations in a real browser on the home, about, services, contact, careers, chat assistant, both
admin sign-ins and the 404 page; the reCAPTCHA box still loads under the policy; the account throttle, body-size limits and
line-break cleaning; the full admin flow (roles, users, pages, restore, activity log, switching a user off).

## Owner checklist (things only you can do)

1. Turn on **two-factor sign-in** for GitHub, Vercel and Upstash.
2. In Vercel, mark `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `KV_REST_API_TOKEN`, `RECAPTCHA_SECRET_KEY` and `AI_API_KEY` as **Sensitive**.
3. **Rotate** (change) any key or password that was ever pasted in a chat, screenshot or e-mail.
4. Use a long, unique admin password and a long random `ADMIN_SESSION_SECRET`.
5. On GitHub, enable **Dependabot alerts** and protect the `main` branch.
6. Consider Vercel's **Firewall / Attack Challenge Mode** if the site is ever attacked.
7. Keep Upstash backups on, or export the content from the admin now and then.
8. Open downloaded resumes carefully (Word files can carry macros); scan them first.
9. Update `security.txt` expiry yearly and run `npm audit` after each upgrade.

## Good to know

- The per-account limit can briefly stop the real admin from signing in while someone is attacking that account; waiting
  15 minutes clears it.
- Report a problem to info@recenturesoft.com.
