/**
 * What each bundled website picture shows. Used as the image description when none was typed in the admin,
 * so a picture swapped in the admin never keeps the description of the one it replaced.
 */
const BUNDLED: Record<string, string> = {
  "/images/careers-software.jpg": "Developer typing on a laptop with code on two monitors beside a city window",
  "/images/services-agentic.jpg": "Person at a curved monitor showing a multi-agent system diagram in an evening office",
  "/images/services-app.jpg": "Developer at a desk with app designs on a monitor and two phones on stands",
  "/images/services-ai.jpg": "Team discussing workflow diagrams on wall screens in a control room",
  "/images/careers-custom.jpg": "Hands on a keyboard in front of a monitor showing code on a wooden desk",
  "/images/careers-seo.jpg": "Laptop screen showing an analytics chart and a pie chart",
  "/images/software-discover.jpg": "Man presenting sticky notes on a whiteboard to a group in a planning workshop",
  "/images/software-design.jpg": "Notebook with hand-drawn app wireframes and pens on a wooden desk",
  "/images/software-develop.jpg": "Laptop on a dark desk showing code in an editor",
  "/images/software-test.jpg": "Laptop showing bar and pie charts next to a tablet with a calendar",
  "/images/software-deliver.jpg": "Two colleagues seated at a conference table seen through a glass window",
  "/images/software-maintainable.jpg": "Close-up of source code on a dark screen",
  "/images/software-scalable.jpg": "Tall glass skyscraper rising against a blue sky",
  "/images/software-usability.jpg": "Wireframe sketch on paper beside a computer mouse and a green marker",
  "/images/software-security.jpg": "Padlock and chain securing a green metal gate",
  "/images/seo-technical.jpg": "Laptop with code on screen next to a coffee cup",
  "/images/seo-onpage.jpg": "Three letter tiles spelling SEO on a wooden table",
  "/images/seo-offpage.jpg": "Two people shaking hands across a desk",
  "/images/seo-keywords.jpg": "Tablet showing the Google search page beside a wireless keyboard",
  "/images/seo-local.jpg": "Aerial view of a city skyline in haze",
  "/images/seo-audit.jpg": "Printed analytics dashboard with charts beside a keyboard and a pen",
};

/** Image description: the one typed in the admin, else the one for a bundled picture, else the fallback. */
export function imageAlt(typed: string | undefined, image: string, fallback: string): string {
  return typed?.trim() || BUNDLED[image] || fallback;
}
