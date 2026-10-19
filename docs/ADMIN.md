# Website admin panel

Sign in at `/admin`. Everything visitors read on the website (text, pictures, links, menus, footer, contact details, job openings) is edited there, with no code.

## How it works

- Every editable piece of content is described in `src/content/*.ts`. Each file holds the original text of one page (`defaults`) and the forms the admin panel shows for it (`sections`).
- When you press **Save changes**, the content is validated and stored. The website reads it on every request, so changes are live straight away.
- The last 20 saves are kept under **History**, where any version can be restored.
- Messages from the Contact page and job applications (with resumes) arrive in **Messages & applications**.

## Where changes are stored

| Where | Storage |
| --- | --- |
| Your computer (`npm run dev`) | A file in `.data/` (ignored by git) |
| Live website on Vercel | Upstash Redis |

To switch on saving on the live website: Vercel, your project, **Storage**, add **Upstash Redis** (free plan) and connect it to the project. Vercel adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for you. Then redeploy.

Without a database the live website still works and shows the original content. The admin panel opens, but saving is switched off and the forms fall back to email.

## Environment variables

See `.env.example`.

- `ADMIN_USERNAME`, `ADMIN_PASSWORD`: the first sign-in. Once you change the password inside the panel (Account), the new one is stored hashed and this value is ignored.
- `ADMIN_SESSION_SECRET`: at least 32 random characters. Signs the login cookie. Changing it signs everyone out.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (optional): turns on email notifications. Job applications are emailed to the HR email and contact messages to the main email set under Site-wide > Contact details, with the resume attached. Every message is also saved in the Inbox, so nothing is lost if email is not set up or fails. `MAIL_FROM` (sender) and `MAIL_TO` (send everything to one address) are optional.

Forgot the password? Set `ADMIN_PASSWORD` in Vercel and delete the key `admin:credentials` in the Upstash data browser. Then the environment password works again.

## Adding a new editable field

1. Add the key and its original value to `defaults` in the page's file under `src/content/`.
2. Add a field for it in the matching section (`text`, `longtext`, `url`, `image`, `icon`, `toggle`, `select`, `strings`, `group`, `list`).
3. Read it in the page with `const { <module> } = await getSiteContent();`.

A missing field is caught by `sanitizeModule`: keys that no section describes keep their original value.

## Adding pictures that ship with the site

Put files in `public/images` (or `public/tech` for logos), then run `node scripts/list-images.mjs` so they show in the picker. Pictures uploaded from the admin panel are stored in the database and need no deploy.
