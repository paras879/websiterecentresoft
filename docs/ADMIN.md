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

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` (optional): turns on Google reCAPTCHA ("I'm not a robot") on the Contact and Careers forms. Create a reCAPTCHA v2 checkbox key in the Google reCAPTCHA admin, add your domain, then set both values in Vercel and redeploy. Without them the forms work with no check.

- `AI_API_KEY` (optional): turns on the AI assistant chat. It answers only from the website's own content (so it follows what you edit in the admin), in English or Hinglish, and sends other questions to the Contact form. The service is picked from the key (Anthropic, OpenAI, Gemini, Groq, OpenRouter). `AI_MODEL`, `AI_PROVIDER`, `AI_BASE_URL` and `AI_MAX_PER_MINUTE` are optional. Answers are remembered for 3 minutes and each visitor is limited to 12 questions per 3 minutes, so the AI service does not return 429. Without a key the chat still gives contact details and basic answers.

Forgot the password? Set `ADMIN_PASSWORD` in Vercel and delete the key `admin:credentials` in the Upstash data browser. Then the environment password works again.

## Adding a new editable field

1. Add the key and its original value to `defaults` in the page's file under `src/content/`.
2. Add a field for it in the matching section (`text`, `longtext`, `url`, `image`, `icon`, `toggle`, `select`, `strings`, `group`, `list`).
3. Read it in the page with `const { <module> } = await getSiteContent();`.

A missing field is caught by `sanitizeModule`: keys that no section describes keep their original value.

## Adding pictures that ship with the site

Put files in `public/images` (or `public/tech` for logos), then run `node scripts/list-images.mjs` so they show in the picker. Pictures uploaded from the admin panel are stored in the database and need no deploy.

## The /admin1 panel (users and access control)

`/admin1` is a second panel with a Payload CMS style look. It edits the same website content as `/admin`, and adds:

- **Users**: create people with their own email and password, switch an account off, delete it.
- **Roles and access control**: a role is a set of permissions. Every page, plus Messages, Media, Versions, Users and Roles, has actions (Read, Create, Update, Delete, Restore) that a role can allow or not. Built-in roles: Super admin, Editor, Viewer. You can make your own.
- Pages a person may not read are not even sent to their browser. The server checks every save, so hiding a button is never the only protection.
- Nobody can hand out more access than they hold, and nobody can edit a user whose role has more access than their own.

Signing in: the administrator from the environment (`ADMIN_USERNAME` and `ADMIN_PASSWORD`, the same as `/admin`) is a built-in Super admin with the username as the "email". Use it to create the first users. Users are stored in the same database as the content (Upstash Redis on Vercel).

Each page saves on its own and is merged into the newest saved copy, so two people editing different pages do not overwrite each other. Saves are listed under Versions with the name of the person who made them.


## Custom pages (new pages made from the admin)

Both `/admin` (Pages > Custom pages) and `/admin1` (Pages collection) can create new pages without code.

- A page is a stack of blocks: Hero, Text, Picture, Picture and text, Cards, Gallery, Questions and answers, Banner with button.
- Pictures come from the media library or the website pictures. Blocks can be moved by drag handle, up/down arrows, or the "Position" box.
- Address: `/something`, or `/services/something`. Names already used by the site (and the built-in services) are reserved.
- Status: Draft pages are only visible in the preview (`/admin1/preview/<id>`). Published pages go live at once and are added to the sitemap.
- Menu: a page can be added to the Services menu or the footer. These links are added when the page is drawn and are not saved into the site content.
- Pages are stored in the `cms:pages` key. Who may create, edit or delete them is set per role (Roles > Pages).

## Activity log

Both panels have an **Activity log** (Collections in /admin1, Access in /admin). It records who did what and when: content edits (which page and fields), custom pages, users, roles, images, messages and resume downloads, restored versions, and sign-ins (including failed ones). The newest 1000 entries are kept under the `audit:log` key. Only the Super admin sees it by default; give the "Activity log" permission to another role under Roles.

## Live preview and usernames

- The page editor has a **Live preview** beside the form (desktop, tablet or phone size, light or dark). It redraws while you type and scrolls to the block you are editing. Nothing goes on the website until you save.
- A user can have a **username** (3 to 32 letters, numbers, dots, dashes or underscores). People in /admin1 sign in with either the email or the username. The environment administrator keeps its own username, which no user can take.
