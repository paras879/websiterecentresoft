# Recenturesoft Website Implementation Prompt

First, read these project documents:

- requirements.txt
- PROJECT_STRUCTURE.md
- ASSET_SOURCES.md
- QA_CHECKLIST.md

Official company website:
https://www.recenturesoft.com/

Design inspiration:
- HCLTech
- Accenture

Use these companies only as general design inspiration. Do not copy their branding, logos, website text, assets or exact layouts.

## Goal

Build a premium, minimal, responsive corporate website for Recenturesoft using Next.js App Router, React and TypeScript.

## Required Pages

1. Home: /
2. About Us: /about
3. Software Development: /services/software-development
4. AI Automation: /services/ai-automation
5. Contact Us: /contact

## Design Rules

- Use only a blue color palette ranging from dark navy to light blue, with white and neutral surfaces where necessary.
- Use readable, normal-sized typography.
- Maintain a clean and professional corporate appearance.
- Target approximately 8px vertical margins and spacing where practical.
- Make the website fully responsive across mobile, tablet and desktop.
- Start the Home page main content with one clear H1.
- Use one descriptive H1 on each page.
- Build reusable header, navigation, footer and service components.
- Keep animations subtle and lightweight.

## Frontend Only

Do not implement:
- Backend
- Database
- Authentication
- API integrations
- Server actions
- Fake contact form submissions

Use verified mailto:, tel: and WhatsApp links where applicable.

## Content

Inspect the official company website and use accurate company information.

Do not invent:
- Clients
- Awards
- Testimonials
- Certifications
- Statistics
- Addresses
- Company achievements

## Performance

- Avoid heavy dependencies.
- Do not use unnecessary 3D scenes or particle effects.
- Minimize client-side JavaScript.
- Use Server Components by default.
- Optimize images and prevent layout shifts.
- Avoid autoplay videos and heavy sliders.
- Use lightweight CSS transitions.
- Do not guarantee 1ms page loads or fabricate Lighthouse scores.

## SEO and Accessibility

Implement appropriate metadata, semantic HTML, accessible navigation, descriptive alt text, responsive layouts and reduced-motion support.

Configure sitemap and robots rules appropriately.

## Workflow

1. Inspect the existing repository and its dependencies.
2. Preserve useful existing configuration.
3. Create the approved five pages.
4. Implement shared components and styling.
5. Check mobile, tablet and desktop layouts.
6. Run lint and production build.
7. Fix errors before finishing.
8. Report modified files and remaining issues.
9. Document image sources in ASSET_SOURCES.md.

Do not add unrequested pages, backend services or unnecessary packages.
