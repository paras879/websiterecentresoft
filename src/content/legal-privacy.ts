import { legalModule, type LegalDefaults } from "./legal";

const defaults: LegalDefaults = {
  "meta": {
    "title": "Official Privacy Policy | Recenturesoft Infotech Pvt Ltd",
    "description": "Read the official Privacy Policy of Recenturesoft Infotech Pvt Ltd explaining how we collect, protect, process, and secure your personal data.",
    "image": ""
  },
  "hero": {
    "title": "Privacy Policy",
    "lead": "How Recenturesoft Infotech Pvt Ltd collects, uses, protects and shares information on this website.",
    "image": "/images/hero.jpg",
    "imageAlt": "Recenturesoft Infotech privacy policy banner"
  },
  "quick": [
    {
      "title": "User information",
      "text": "What you provide to use our services",
      "target": "User information",
      "icon": "document"
    },
    {
      "title": "Cookies and logs",
      "text": "How cookies and server logs work",
      "target": "Cookies",
      "icon": "eye"
    },
    {
      "title": "Information sharing",
      "text": "The limited cases where it is disclosed",
      "target": "Information sharing",
      "icon": "handshake"
    },
    {
      "title": "Information security",
      "text": "How stored information is protected",
      "target": "Information security",
      "icon": "shield"
    }
  ],
  "sections": [
    {
      "title": "Introduction and acceptance",
      "body": "The terms “We” / “Us” / “Our” / “Company” individually and collectively refer to Recenturesoft Infotech Pvt Ltd and the terms “You” / “Your” / “Yourself” refer to the users.\n\nThis Privacy Policy is an electronic record in the form of an electronic contract formed under the Information Technology Act, 2000 and the rules made thereunder and the amended provisions pertaining to electronic documents / records in various statutes as amended by the Information Technology Act, 2000. This Privacy Policy does not require any physical, electronic or digital signature.\n\n> This Privacy Policy is a legally binding document between you and the Company (both the terms defined above). The terms of this Privacy Policy will be effective upon your acceptance of the same (directly or indirectly in electronic form, by clicking on the I accept tab or by use of the website or by other means) and will govern the relationship between you and the Company for your use of the website https://websiterecentresoft.vercel.app/ (referred to as “website” or “site” in this document).\n\nThis document is published and shall be construed in accordance with the provisions of the Information Technology (Reasonable security practices and procedures and sensitive personal data of information) Rules, 2011 under Information Technology Act, 2000; that require publishing of the Privacy Policy for collection, use, storage and transfer of sensitive personal data or information.\n\nPlease read this Privacy Policy carefully by using the Website, you indicate that you understand, agree and consent to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use this Website.\n\nBy providing us your Information or by making use of the facilities provided by the Website, You hereby consent to the collection, storage, processing and transfer of any or all of Your Personal Information and Non-Personal Information by us as specified under this Privacy Policy. You further agree that such collection, use, storage and transfer of Your Information shall not cause any loss or wrongful gain to you or any other person."
    },
    {
      "title": "User information",
      "body": "To avail certain services on our Websites, users are required to provide certain information for the registration process namely:\n\n- Legal name\n\n- Email address\n\n- Sex and age\n\n- PIN code\n\n- Payment parameters\n\n- Occupation and interests\n\nThe Information as supplied by the users enables us to improve our sites and provide you the most user-friendly experience.\n\nAll required information is service dependent and we may use the above said user information to maintain, protect, and improve our services (including advertising services) and for developing new services.\n\n> Such information will not be considered as sensitive if it is freely available and accessible in the public domain or is furnished under the Right to Information Act, 2005 or any other law for the time being in force."
    },
    {
      "title": "Cookies",
      "body": "To improve the responsiveness of the sites for our users, we may use “cookies”, or similar electronic tools to collect information to assign each visitor a unique, random number as a User Identification (User ID) to understand the user's individual interests using the Identified Computer.\n\nUnless you voluntarily identify yourself (through registration, for example), we will have no way of knowing who you are, even if we assign a cookie to your computer. The only personal information a cookie can contain is information you supply. A cookie cannot read data off your hard drive. Our advertisers may also assign their own cookies to your browser (if you click on their ads), a process that we do not control.\n\n## Web server access logs\n\nOur web servers automatically collect limited information about your computer's connection to the Internet, including your IP address, when you visit our site. (Your IP address is a number that lets computers attached to the Internet know where to send you data — such as the web pages you view.) Your IP address does not identify you personally. We use this information to deliver our web pages to you upon request, to tailor our site to the interests of our users, to measure traffic within our site and let advertisers know the geographic locations from where our visitors come."
    },
    {
      "title": "Links to other sites",
      "body": "Our policy discloses the privacy practices for our own web site only. Our site provides links to other websites also that are beyond our control. We shall in no way be responsible in any way for your use of such sites."
    },
    {
      "title": "Information sharing",
      "body": "We share the sensitive personal information to any third party without obtaining the prior consent of the user in the following limited circumstances:"
    },
    {
      "title": "Information security",
      "body": "We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data. These include internal reviews of our data collection, storage and processing practices and security measures, including appropriate encryption and physical security measures to guard against unauthorized access to systems where we store personal data.\n\nAll information gathered on our Website is securely stored within our controlled database. The database is stored on servers secured behind a firewall; access to the servers is password-protected and is strictly limited.\n\n> However, as effective as our security measures are, no security system is impenetrable. We cannot guarantee the security of our database, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet. And, of course, any information you include in a posting to the discussion areas is available to anyone with Internet access."
    },
    {
      "title": "Policy updates",
      "body": "However the internet is an ever evolving medium. We may change our Privacy Policy from time to time to incorporate necessary future changes. Of course, our use of any information we gather will always be consistent with the policy under which the information was collected, regardless of what the new policy may be."
    },
    {
      "title": "Grievance redressal",
      "body": "Any complaints, abuse or concerns with regards to content and or comment or breach of these terms shall be immediately informed to the designated Grievance Officer as mentioned below via in writing or through email signed with the electronic signature (“Grievance Officer”)."
    }
  ],
  "contact": {
    "officer": "Grievance Officer",
    "railTitle": "Questions about this policy?",
    "railText": "Write to our Grievance Officer. Privacy concerns are handled here."
  }
};

export const privacyModule = legalModule({
  id: "privacy",
  title: "Privacy Policy",
  route: "/privacy-policy",
  contactLabel: "Grievance officer",
  defaults,
});
