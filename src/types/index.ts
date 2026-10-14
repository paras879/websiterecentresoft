export interface NavItem {
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
  address: string;
  mapUrl: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  description: string;
  navItems: NavItem[];
  contact: ContactInfo;
}
