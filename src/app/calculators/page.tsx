import type { Metadata } from "next";
import {
  CalculatorCard,
  Breadcrumbs,
  SectionHeading,
  calculatorCards,
} from "@/components/content-ui";
export const metadata: Metadata = {
  title: "Project calculators",
  description:
    "Free paint, tile, and drywall calculators with adjustable assumptions and transparent formulas.",
  alternates: { canonical: "/calculators" },
};
export default function Page() {
  return (
    <main>
      <div className="page-intro">
        <div className="container">
          <Breadcrumbs links={[{ label: "Home", href: "/" }, { label: "Calculators" }]} />
          <p className="eyebrow">Measure with confidence</p>
          <h1>Project calculators</h1>
          <p className="lead">
            Get a useful starting estimate. Adjust assumptions to match your products and local
            prices.
          </p>
        </div>
      </div>
      <div className="container page-content">
        <SectionHeading
          kicker="Available tools"
          title="Choose what you’re planning"
          intro="Each calculator explains its formula and rounds quantities up for purchasing."
        />
        <div className="calculator-grid">
          {calculatorCards.map((card) => (
            <CalculatorCard key={card.slug} card={card} />
          ))}
        </div>
        <div className="notice calculator-notice">
          <strong>Planning estimates only.</strong> Measure on site, check packaging and product
          instructions, and account for layout or surface conditions before ordering.
        </div>
      </div>
    </main>
  );
}
