import Link from "next/link";
import { Breadcrumbs } from "./content-ui";

type LegalKey = "about" | "contact" | "privacy" | "terms" | "disclaimer" | "editorial-policy";
const pages: Record<
  LegalKey,
  { title: string; intro: string; blocks: { title: string; text: string }[]; review?: boolean }
> = {
  about: {
    title: "About Fieldwork Home",
    intro: "A practical home improvement resource built around better planning.",
    blocks: [
      {
        title: "What we offer",
        text: "Fieldwork Home connects project instructions, material comparisons, cost planning, and transparent calculators. The site is written for US homeowners who want to make informed decisions before buying or beginning work.",
      },
      {
        title: "How to use it",
        text: "Start with a project or question. Check the linked guide, enter your own measurements and prices, then verify product instructions, local code, permits, and the conditions in your home.",
      },
      {
        title: "Our starting point",
        text: "This is an independent starter editorial platform. We do not claim hands-on testing, professional credentials, partnerships, or current regional prices. Content will be reviewed and expanded as the platform develops.",
      },
    ],
  },
  contact: {
    title: "Contact",
    intro: "Questions, corrections, and feedback help improve these resources.",
    blocks: [
      {
        title: "Contact channel",
        text: "A public contact address has not been configured for this starter site. The site owner can set NEXT_PUBLIC_CONTACT_EMAIL to display a contact link here. Do not include private, medical, legal, or sensitive financial details in routine feedback.",
      },
      {
        title: "Corrections",
        text: "Please identify the page, the statement in question, and a reliable source or product instruction where possible. We aim to correct material errors clearly.",
      },
    ],
  },
  privacy: {
    title: "Privacy policy",
    intro: "A plain-language starter notice for the current site.",
    review: true,
    blocks: [
      {
        title: "Information you enter",
        text: "Public calculators run in your browser. Their measurements and prices are not sent to a server by the calculator. Site search sends your query to this website so the results page can be rendered. The maintenance checklist stores its state only for the current page session.",
      },
      {
        title: "Admin data",
        text: "When configured, the protected CMS stores administrator email addresses, password hashes, and editorial content in PostgreSQL. A secure session cookie is used for admin access. This starter site does not offer public accounts.",
      },
      {
        title: "Analytics and third parties",
        text: "No analytics integration or third-party tracking is enabled by default. Hosting providers may maintain routine server logs. A future deployment should review its hosting, analytics, retention, and cookie practices and update this policy accordingly.",
      },
    ],
  },
  terms: {
    title: "Terms of use",
    intro: "Starter terms for informational use of this website.",
    review: true,
    blocks: [
      {
        title: "Use of resources",
        text: "The site provides general educational and planning information. Measurements, formulas, product labels, local requirements, and site conditions should be checked independently before work or purchase.",
      },
      {
        title: "No professional relationship",
        text: "Using the site does not create a contractor, engineering, architectural, legal, or other professional relationship. Hire qualified professionals for regulated or high-risk work.",
      },
      {
        title: "Changes",
        text: "Resources may be corrected, revised, or removed. Site owners should review these starter terms with appropriate counsel before public deployment.",
      },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    intro: "Know the limits of a planning tool.",
    review: true,
    blocks: [
      {
        title: "Estimates are estimates",
        text: "Calculators use simplified geometry and editable assumptions. Actual material needs vary with product coverage, layout, cuts, surface condition, installation method, and waste. Prices are entered by the visitor and are not market quotes.",
      },
      {
        title: "Safety and code",
        text: "Home work can involve hazards including electrical systems, structural loads, ladders, dust, lead paint, asbestos, water damage, and chemicals. Follow product instructions, use appropriate protection, and check permits and local code. Stop and consult a qualified professional when a task exceeds safe access or your experience.",
      },
      {
        title: "Editorial limitations",
        text: "Content is general information, not project-specific professional advice. Materials and building requirements change; confirm current requirements before acting.",
      },
    ],
  },
  "editorial-policy": {
    title: "Editorial policy",
    intro: "Practical guidance should show its assumptions and limits.",
    blocks: [
      {
        title: "Our approach",
        text: "We aim to explain steps in a useful order, distinguish planning assumptions from product facts, and link related decisions so readers can move from inspiration to execution. Starter material is original editorial content without claimed expert credentials.",
      },
      {
        title: "Calculators and costs",
        text: "Calculator formulas are shown alongside results. Example coverage, waste, and dimensions are editable and are not universal product specifications. Cost guides use budget components and visitor-entered prices rather than invented regional rates.",
      },
      {
        title: "Corrections and updates",
        text: "We should revise content when credible product guidance, standards, or reader feedback identifies an error. Dates reflect actual publication or review activity. The CMS tracks update timestamps for configured database content.",
      },
      {
        title: "Commercial independence",
        text: "This starter site has no affiliate integrations, sponsored placement, product ratings, or manufacturer partnerships.",
      },
    ],
  },
};

export function LegalPage({ page }: { page: LegalKey }) {
  const data = pages[page];
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <main>
      <div className="page-intro">
        <div className="container">
          <Breadcrumbs links={[{ label: "Home", href: "/" }, { label: data.title }]} />
          <p className="eyebrow">Fieldwork Home / Information</p>
          <h1>{data.title}</h1>
          <p className="lead">{data.intro}</p>
        </div>
      </div>
      <div className="container page-content">
        <div className="legal-copy">
          {data.review && (
            <div className="legal-flag">
              <strong>Review before public deployment.</strong> This is starter language and should
              be checked for the actual operator, hosting setup, and applicable law. It is not legal
              advice.
            </div>
          )}
          {page === "contact" && email && (
            <p>
              <a href={`mailto:${email}`}>Email {email}</a>
            </p>
          )}
          {data.blocks.map((block) => (
            <section key={block.title}>
              <h2>{block.title}</h2>
              <p>{block.text}</p>
            </section>
          ))}
          <p>
            Explore <Link href="/projects">projects</Link>,{" "}
            <Link href="/calculators">calculators</Link>, or our{" "}
            <Link href="/editorial-policy">editorial policy</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
