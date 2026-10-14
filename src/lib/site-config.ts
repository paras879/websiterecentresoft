import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Recenturesoft",
  legalName: "Recenturesoft Infotech Pvt Ltd",
  description:
    "Recenturesoft Infotech Pvt Ltd is a premier software development company offering custom software development, web application engineering, and AI-driven automation solutions.",
  navItems: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About Us",
      href: "/about",
    },
    {
      title: "Services",
      href: "/services/software-development",
      children: [
        {
          title: "Software Development",
          href: "/services/software-development",
          description: "Custom software engineering and scalable business applications.",
        },
        {
          title: "AI Automation",
          href: "/services/ai-automation",
          description: "Intelligent workflow automation and enterprise AI capabilities.",
        },
      ],
    },
    {
      title: "Contact Us",
      href: "/contact",
    },
  ],
  contact: {
    email: "info@recenturesoft.com",
    phone: "+91 777 000 3288",
    phoneRaw: "+917770003288",
    whatsappUrl: "https://api.whatsapp.com/send?phone=+917770003288&text=Hi",
    address: "A-125, 1st Floor, Sector-63, Noida, Uttar Pradesh, 201301, India",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("A-125, 1st Floor, Sector-63, Noida, Uttar Pradesh, 201301, India"),
  },
};
