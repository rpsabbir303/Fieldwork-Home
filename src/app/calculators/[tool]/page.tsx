import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, calculatorCards } from "@/components/content-ui";
import { CalculatorApp } from "@/components/calculator-app";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  const card = calculatorCards.find((item) => item.slug === tool);
  return card
    ? {
        title: card.title,
        description: card.summary,
        alternates: { canonical: `/calculators/${tool}` },
      }
    : { title: "Calculator not found" };
}
export default async function Page({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const card = calculatorCards.find((item) => item.slug === tool);
  if (!card) notFound();
  return (
    <main>
      <div className="page-intro calculator-intro">
        <div className="container">
          <Breadcrumbs
            links={[
              { label: "Home", href: "/" },
              { label: "Calculators", href: "/calculators" },
              { label: card.title },
            ]}
          />
          <p className="eyebrow">{card.tag} / Free planning tool</p>
          <h1>{card.title}</h1>
          <p className="lead">{card.summary} Change any input to match your project.</p>
        </div>
      </div>
      <div className="container page-content">
        <CalculatorApp tool={tool as "paint" | "tile" | "drywall"} />
      </div>
    </main>
  );
}
