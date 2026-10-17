import { legalModule, type LegalDefaults } from "./legal";

const defaults: LegalDefaults = {
  "meta": {
    "title": "Terms & Conditions | Recenturesoft Infotech Pvt Ltd",
    "description": "Terms and Conditions of Recenturesoft Infotech Pvt Ltd governing website access, acceptable use, intellectual property, and limitation of liability.",
    "image": ""
  },
  "hero": {
    "title": "Terms and Conditions",
    "lead": "The terms, conditions and acceptable use rules governing your visit to this website.",
    "image": "/images/terms-hero.jpg",
    "imageAlt": "Recenturesoft Infotech terms and conditions banner"
  },
  "quick": [
    {
      "title": "Use of content",
      "text": "Trademarks, copyright and intellectual property rules",
      "target": "Use of content",
      "icon": "document"
    },
    {
      "title": "Security rules",
      "text": "Prohibitions against unauthorized access and interference",
      "target": "Acceptable website use: Security rules",
      "icon": "shield"
    },
    {
      "title": "General conduct",
      "text": "Rules against unlawful or infringing content transmission",
      "target": "Acceptable website use: General rules",
      "icon": "eye"
    },
    {
      "title": "Liability and indemnity",
      "text": "Limits of liability, indemnity and damage disclaimers",
      "target": "Liability",
      "icon": "handshake"
    }
  ],
  "sections": [
    {
      "title": "Terms and conditions",
      "body": "The terms “We” / “Us” / “Our” / “Company” individually and collectively refer to Recenturesoft Infotech Pvt Ltd and the terms “Visitor” / “User” refer to the users.\n\nThis page states the Terms and Conditions under which you (Visitor) may visit this website (“Website”). Please read this page carefully. If you do not accept the Terms and Conditions stated here, we would request you to exit this site.\n\n> The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this Website."
    },
    {
      "title": "Use of content",
      "body": "All logos, brands, marks headings, labels, names, signatures, numerals, shapes or any combinations thereof, appearing in this site, except as otherwise noted, are properties either owned, or used under licence, by the business and / or its associate entities who feature on this Website.\n\nThe use of these properties or any other content on this site, except as provided in these terms and conditions or in the site content, is strictly prohibited.\n\n> You may not sell or modify the content of this Website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organisation's or entity's written permission."
    },
    {
      "title": "Acceptable website use: Security rules",
      "body": "Visitors are prohibited from violating or attempting to violate the security of the Web site, including, without limitation:\n\n> Violations of system or network security may result in civil or criminal liability. The business and / or its associate entities will have the right to investigate occurrences that they suspect as involving such violations and will have the right to involve, and cooperate with, law enforcement authorities in prosecuting users who are involved in such violations."
    },
    {
      "title": "Acceptable website use: General rules",
      "body": "Visitors may not use the Web Site in order to transmit, distribute, store or destroy material:"
    },
    {
      "title": "Indemnity",
      "body": "> The User unilaterally agree to indemnify and hold harmless, without objection, the Company, its officers, directors, employees and agents from and against any claims, actions and/or demands and/or liabilities and/or losses and/or damages whatsoever arising from or resulting from their use of https://websiterecentresoft.vercel.app/ or their breach of the terms."
    },
    {
      "title": "Liability",
      "body": "User agrees that neither Company nor its group companies, directors, officers or employee shall be liable for any direct or/and indirect or/and incidental or/and special or/and consequential or/and exemplary damages, resulting from the use or/and the inability to use the service or/and for cost of procurement of substitute goods or/and services or resulting from any goods or/and data or/and information or/and services purchased or/and obtained or/and messages received or/and transactions entered into through or/and from the service or/and resulting from unauthorized access to or/and alteration of user's transmissions or/and data or/and arising from any other matter relating to the service, including but not limited to, damages for loss of profits or/and use or/and data or other intangible, even if Company has been advised of the possibility of such damages.\n\nUser further agrees that Company shall not be liable for any damages arising from interruption, suspension or termination of service, including but not limited to direct or/and indirect or/and incidental or/and special consequential or/and exemplary damages, whether such interruption or/and suspension or/and termination was justified or not, negligent or intentional, inadvertent or advertent.\n\n> User agrees that Company shall not be responsible or liable to user, or anyone, for the statements or conduct of any third party of the service. In sum, in no event shall Company's total liability to the User for all damages or/and losses or/and causes of action exceed the amount paid by the User to Company, if any, that is related to the cause of action."
    },
    {
      "title": "Disclaimer of consequential damages",
      "body": "In no event shall Company or any parties, organisations or entities associated with the corporate brand name us or otherwise, mentioned at this Website be liable for any damages whatsoever (including, without limitations, incidental and consequential damages, lost profits, or damage to computer hardware or loss of data information or business interruption) resulting from the use or inability to use the Website and the Website material, whether based on warranty, contract, tort, or any other legal theory, and whether or not, such organisation or entities were advised of the possibility of such damages."
    },
    {
      "title": "Revisions to terms",
      "body": "The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this Website."
    },
    {
      "title": "Contact information",
      "body": "For formal legal communications, notices, or inquiries regarding these Terms and Conditions, please contact our registered office:"
    }
  ],
  "contact": {
    "officer": "Legal & Compliance Department",
    "railTitle": "Questions about these terms?",
    "railText": "Write to our legal contact for formal notices and questions."
  }
};

export const termsModule = legalModule({
  id: "terms",
  title: "Terms & Conditions",
  route: "/terms-and-conditions",
  contactLabel: "Legal contact",
  defaults,
});
