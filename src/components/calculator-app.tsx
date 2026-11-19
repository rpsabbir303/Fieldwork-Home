"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Info, Printer, RotateCcw } from "lucide-react";
import {
  calculateDrywall,
  calculatePaint,
  calculateTile,
  drywallSchema,
  moneyFormat,
  numberFormat,
  paintSchema,
  tileSchema,
  type DrywallInput,
  type PaintInput,
  type TileInput,
} from "@/lib/calculators";
import { trackEvent } from "@/lib/analytics";

function Field({
  label,
  unit,
  registration,
  error,
  step = "any",
  hint,
}: {
  label: string;
  unit?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  step?: string;
  hint?: string;
}) {
  const id = registration.name;
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="field-control">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min="0"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...registration}
        />
        {unit && <span>{unit}</span>}
      </div>
      {hint && !error && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <small id={`${id}-error`} className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
function Results({
  children,
  title = "Your estimate",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  useEffect(() => {
    trackEvent("calculator_completed");
  }, []);
  return (
    <div className="result-panel" aria-live="polite">
      <p className="eyebrow">Calculated estimate</p>
      <h2>{title}</h2>
      {children}
      <button
        className="print-button"
        type="button"
        onClick={() => {
          trackEvent("result_printed");
          window.print();
        }}
      >
        Print results <Printer size={17} />
      </button>
    </div>
  );
}
function ResultRow({
  label,
  value,
  major = false,
}: {
  label: string;
  value: string;
  major?: boolean;
}) {
  return (
    <div className={`result-row ${major ? "major" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function Buttons({ reset }: { reset: () => void }) {
  return (
    <div className="form-actions">
      <button
        className="button button-primary"
        type="submit"
        onClick={() => trackEvent("calculator_started")}
      >
        Calculate estimate <ArrowUpRight size={17} />
      </button>
      <button className="reset-button" type="button" onClick={reset}>
        <RotateCcw size={16} /> Reset
      </button>
    </div>
  );
}
function Guidance({
  formula,
  assumptions,
  links,
}: {
  formula: string;
  assumptions: string[];
  links: { title: string; href: string }[];
}) {
  return (
    <div className="calculator-guidance">
      <div>
        <p className="eyebrow">How it works</p>
        <h2>The calculation, explained</h2>
        <p>{formula}</p>
        <ul>
          {assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </div>
      <div className="guidance-links">
        <p className="eyebrow">Keep planning</p>
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.title}
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </div>
    </div>
  );
}

const paintDefaults: PaintInput = {
  length: 12,
  width: 10,
  height: 8,
  doorArea: 21,
  windowArea: 15,
  coats: 2,
  coverage: 350,
  price: 0,
};
function PaintCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculatePaint> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaintInput>({ resolver: zodResolver(paintSchema), defaultValues: paintDefaults });
  return (
    <>
      <div className="calculator-layout">
        <form
          className="calculator-form"
          onSubmit={handleSubmit((values) => setResult(calculatePaint(values)))}
          noValidate
        >
          <div className="form-section">
            <span className="form-step">01 / ROOM DIMENSIONS</span>
            <h2>Measure your room</h2>
            <p>Measure in feet. Wall area is based on the room’s perimeter and wall height.</p>
            <div className="fields-grid">
              <Field
                label="Room length"
                unit="ft"
                registration={register("length", { valueAsNumber: true })}
                error={errors.length?.message}
              />
              <Field
                label="Room width"
                unit="ft"
                registration={register("width", { valueAsNumber: true })}
                error={errors.width?.message}
              />
              <Field
                label="Wall height"
                unit="ft"
                registration={register("height", { valueAsNumber: true })}
                error={errors.height?.message}
              />
            </div>
          </div>
          <div className="form-section">
            <span className="form-step">02 / OPENINGS & COATS</span>
            <h2>Refine the coverage</h2>
            <p>
              Enter the combined area of doors and windows you will not paint. The example values
              are editable.
            </p>
            <div className="fields-grid">
              <Field
                label="Door area"
                unit="sq ft"
                registration={register("doorArea", { valueAsNumber: true })}
                error={errors.doorArea?.message}
              />
              <Field
                label="Window area"
                unit="sq ft"
                registration={register("windowArea", { valueAsNumber: true })}
                error={errors.windowArea?.message}
              />
              <Field
                label="Number of coats"
                registration={register("coats", { valueAsNumber: true })}
                error={errors.coats?.message}
                step="1"
              />
            </div>
          </div>
          <div className="form-section">
            <span className="form-step">03 / YOUR PRODUCT</span>
            <h2>Set your assumptions</h2>
            <div className="fields-grid">
              <Field
                label="Coverage per gallon"
                unit="sq ft"
                registration={register("coverage", { valueAsNumber: true })}
                error={errors.coverage?.message}
                hint="Check the label for your chosen paint."
              />
              <Field
                label="Price per gallon (optional)"
                unit="$"
                registration={register("price", { valueAsNumber: true })}
                error={errors.price?.message}
                hint="Enter 0 to omit cost planning."
              />
            </div>
          </div>
          <Buttons
            reset={() => {
              reset(paintDefaults);
              setResult(null);
            }}
          />
        </form>
        <div className="calculator-side">
          {result ? (
            <Results>
              <ResultRow
                label="Gross wall area"
                value={`${numberFormat(result.grossArea)} sq ft`}
              />
              <ResultRow
                label="Openings deducted"
                value={`${numberFormat(result.openings)} sq ft`}
              />
              <ResultRow
                label="Net paintable area"
                value={`${numberFormat(result.netArea)} sq ft`}
              />
              <ResultRow
                label="Coat-adjusted coverage"
                value={`${numberFormat(result.coverageArea)} sq ft`}
              />
              <ResultRow
                label="Exact calculated quantity"
                value={`${numberFormat(result.gallons, 2)} gal`}
              />
              <ResultRow
                label="Purchase estimate"
                value={`${result.purchaseGallons} ${result.purchaseGallons === 1 ? "gallon" : "gallons"}`}
                major
              />
              <ResultRow label="Material subtotal" value={moneyFormat(result.subtotal)} />
              <p className="result-note">
                Subtotal uses whole gallons and your entered price. Taxes and supplies are excluded.
              </p>
            </Results>
          ) : (
            <div className="result-placeholder">
              <Info size={25} />
              <h2>Your project, measured</h2>
              <p>
                Review the example measurements, replace them with your own, and calculate to see
                the breakdown here.
              </p>
              <div className="placeholder-rule" />
            </div>
          )}
        </div>
      </div>
      <Guidance
        formula="Gross wall area = 2 × (length + width) × height. Net area = gross area − door area − window area, floored at zero. Gallons = net area × coats ÷ coverage per gallon. Purchase quantity rounds up to a whole gallon."
        assumptions={[
          "The 350 sq ft per gallon example is a planning assumption, not a universal coverage claim.",
          "Texture, color changes, application method, and primer can affect actual coverage.",
          "If openings exceed wall area, paintable area is treated as zero; check your measurements.",
        ]}
        links={[
          { title: "Paint an interior room", href: "/projects/paint-an-interior-room" },
          { title: "Interior painting budget", href: "/cost-guides/interior-painting-budget" },
          { title: "Measure a room for paint", href: "/guides/how-to-measure-a-room-for-paint" },
        ]}
      />
    </>
  );
}

const tileDefaults: TileInput = {
  unit: "imperial",
  roomLength: 10,
  roomWidth: 8,
  tileLength: 12,
  tileWidth: 12,
  waste: 10,
  price: 0,
};
function TileCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateTile> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TileInput>({ resolver: zodResolver(tileSchema), defaultValues: tileDefaults });
  const metric = useWatch({ control, name: "unit" }) === "metric";
  return (
    <>
      <div className="calculator-layout">
        <form
          className="calculator-form"
          onSubmit={handleSubmit((values) => setResult(calculateTile(values)))}
          noValidate
        >
          <div className="form-section">
            <span className="form-step">01 / MEASUREMENT SYSTEM</span>
            <h2>Set your units</h2>
            <div className="form-field">
              <label htmlFor="unit">Measurement units</label>
              <select id="unit" {...register("unit")}>
                <option value="imperial">US customary · feet and inches</option>
                <option value="metric">Metric · meters and centimeters</option>
              </select>
            </div>
          </div>
          <div className="form-section">
            <span className="form-step">02 / ROOM & TILE</span>
            <h2>Measure the surface</h2>
            <p>Use inside dimensions of the area that will receive tile.</p>
            <div className="fields-grid">
              <Field
                label="Room length"
                unit={metric ? "m" : "ft"}
                registration={register("roomLength", { valueAsNumber: true })}
                error={errors.roomLength?.message}
              />
              <Field
                label="Room width"
                unit={metric ? "m" : "ft"}
                registration={register("roomWidth", { valueAsNumber: true })}
                error={errors.roomWidth?.message}
              />
              <Field
                label="Tile length"
                unit={metric ? "cm" : "in"}
                registration={register("tileLength", { valueAsNumber: true })}
                error={errors.tileLength?.message}
              />
              <Field
                label="Tile width"
                unit={metric ? "cm" : "in"}
                registration={register("tileWidth", { valueAsNumber: true })}
                error={errors.tileWidth?.message}
              />
            </div>
          </div>
          <div className="form-section">
            <span className="form-step">03 / WASTE & PRICE</span>
            <h2>Plan the purchase</h2>
            <div className="fields-grid">
              <Field
                label="Waste allowance"
                unit="%"
                registration={register("waste", { valueAsNumber: true })}
                error={errors.waste?.message}
                hint="Adjust for cuts, pattern, and breakage."
              />
              <Field
                label="Price per tile (optional)"
                unit="$"
                registration={register("price", { valueAsNumber: true })}
                error={errors.price?.message}
              />
            </div>
          </div>
          <Buttons
            reset={() => {
              reset(tileDefaults);
              setResult(null);
            }}
          />
        </form>
        <div className="calculator-side">
          {result ? (
            <Results>
              <ResultRow
                label="Surface area"
                value={`${numberFormat(result.area, 2)} ${metric ? "sq m" : "sq ft"}`}
              />
              <ResultRow
                label="Area per tile"
                value={`${numberFormat(result.tileArea, 4)} ${metric ? "sq m" : "sq ft"}`}
              />
              <ResultRow label="Tiles before waste" value={numberFormat(result.baseCount, 2)} />
              <ResultRow label="Tiles with waste" value={numberFormat(result.adjustedCount, 2)} />
              <ResultRow label="Purchase estimate" value={`${result.purchaseCount} tiles`} major />
              <ResultRow label="Material subtotal" value={moneyFormat(result.subtotal)} />
              <p className="result-note">
                Compare this count with the pieces per carton. Carton rounding, grout, setting
                materials, tax, and delivery are excluded.
              </p>
            </Results>
          ) : (
            <div className="result-placeholder">
              <Info size={25} />
              <h2>Plan the pattern</h2>
              <p>
                Enter your surface and tile dimensions, then add a waste allowance that fits your
                layout.
              </p>
              <div className="placeholder-rule" />
            </div>
          )}
        </div>
      </div>
      <Guidance
        formula="Surface area = room length × room width. Tile area converts inches to square feet (÷ 144) or centimeters to square meters (÷ 10,000). Base count = surface area ÷ tile area. Purchase count = ceiling(base count × (1 + waste %))."
        assumptions={[
          "This is an area estimate; it does not create a cut plan or account for grout joint dimensions.",
          "The 10% example waste allowance is editable and may not fit complex patterns.",
          "Check product cartons and order quantities before buying.",
        ]}
        links={[
          { title: "Install a tile backsplash", href: "/projects/install-a-tile-backsplash" },
          { title: "Tile project budget", href: "/cost-guides/tile-project-budget" },
          { title: "Plan your tile layout", href: "/guides/tile-layout-before-you-set" },
        ]}
      />
    </>
  );
}

const drywallDefaults: DrywallInput = {
  wallLength: 40,
  wallHeight: 8,
  openingArea: 36,
  ceilingLength: 0,
  ceilingWidth: 0,
  sheetLength: 8,
  sheetWidth: 4,
  waste: 10,
};
function DrywallCalculator() {
  const [result, setResult] = useState<ReturnType<typeof calculateDrywall> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DrywallInput>({
    resolver: zodResolver(drywallSchema),
    defaultValues: drywallDefaults,
  });
  return (
    <>
      <div className="calculator-layout">
        <form
          className="calculator-form"
          onSubmit={handleSubmit((values) => setResult(calculateDrywall(values)))}
          noValidate
        >
          <div className="form-section">
            <span className="form-step">01 / WALLS</span>
            <h2>Measure the wall surface</h2>
            <p>
              For several walls of the same height, add their lengths. Calculate different heights
              separately.
            </p>
            <div className="fields-grid">
              <Field
                label="Total wall length"
                unit="ft"
                registration={register("wallLength", { valueAsNumber: true })}
                error={errors.wallLength?.message}
              />
              <Field
                label="Wall height"
                unit="ft"
                registration={register("wallHeight", { valueAsNumber: true })}
                error={errors.wallHeight?.message}
              />
              <Field
                label="Openings"
                unit="sq ft"
                registration={register("openingArea", { valueAsNumber: true })}
                error={errors.openingArea?.message}
                hint="Combined area of doors and windows."
              />
            </div>
          </div>
          <div className="form-section">
            <span className="form-step">02 / OPTIONAL CEILING</span>
            <h2>Add a ceiling</h2>
            <p>Leave both measurements at zero if you are only covering walls.</p>
            <div className="fields-grid">
              <Field
                label="Ceiling length"
                unit="ft"
                registration={register("ceilingLength", { valueAsNumber: true })}
                error={errors.ceilingLength?.message}
              />
              <Field
                label="Ceiling width"
                unit="ft"
                registration={register("ceilingWidth", { valueAsNumber: true })}
                error={errors.ceilingWidth?.message}
              />
            </div>
          </div>
          <div className="form-section">
            <span className="form-step">03 / SHEETS</span>
            <h2>Choose a sheet size</h2>
            <div className="fields-grid">
              <Field
                label="Sheet length"
                unit="ft"
                registration={register("sheetLength", { valueAsNumber: true })}
                error={errors.sheetLength?.message}
              />
              <Field
                label="Sheet width"
                unit="ft"
                registration={register("sheetWidth", { valueAsNumber: true })}
                error={errors.sheetWidth?.message}
              />
              <Field
                label="Waste allowance"
                unit="%"
                registration={register("waste", { valueAsNumber: true })}
                error={errors.waste?.message}
              />
            </div>
          </div>
          <Buttons
            reset={() => {
              reset(drywallDefaults);
              setResult(null);
            }}
          />
        </form>
        <div className="calculator-side">
          {result ? (
            <Results>
              <ResultRow
                label="Gross wall area"
                value={`${numberFormat(result.grossWallArea)} sq ft`}
              />
              <ResultRow
                label="Net wall area"
                value={`${numberFormat(result.netWallArea)} sq ft`}
              />
              <ResultRow label="Ceiling area" value={`${numberFormat(result.ceilingArea)} sq ft`} />
              <ResultRow
                label="Combined surface"
                value={`${numberFormat(result.totalArea)} sq ft`}
              />
              <ResultRow
                label="Area with waste"
                value={`${numberFormat(result.adjustedArea)} sq ft`}
              />
              <ResultRow
                label="Purchase estimate"
                value={`${result.purchaseSheets} ${result.purchaseSheets === 1 ? "sheet" : "sheets"}`}
                major
              />
              <p className="result-note">
                Area alone cannot determine seam layout or exact cuts. Sketch each wall and check
                board type, thickness, and local requirements.
              </p>
            </Results>
          ) : (
            <div className="result-placeholder">
              <Info size={25} />
              <h2>Measure the surface</h2>
              <p>
                Add wall and optional ceiling measurements to estimate how many sheets you may need.
              </p>
              <div className="placeholder-rule" />
            </div>
          )}
        </div>
      </div>
      <Guidance
        formula="Net wall area = max(0, total wall length × height − openings). Add ceiling length × width. Multiply by (1 + waste %), divide by sheet length × width, then round up to whole sheets."
        assumptions={[
          "The example 4 × 8 ft sheet and 10% allowance are editable planning values.",
          "Board type, thickness, fastener spacing, and rated assemblies can depend on local requirements.",
          "A separate cut layout is needed to account for seams and unusable offcuts.",
        ]}
        links={[
          { title: "Repair and patch drywall", href: "/projects/repair-and-patch-drywall" },
          { title: "Drywall repair budget", href: "/cost-guides/drywall-repair-budget" },
          { title: "Drywall sheet sizes and waste", href: "/guides/drywall-sheet-sizes-and-waste" },
        ]}
      />
    </>
  );
}

export function CalculatorApp({ tool }: { tool: "paint" | "tile" | "drywall" }) {
  return tool === "paint" ? (
    <PaintCalculator />
  ) : tool === "tile" ? (
    <TileCalculator />
  ) : (
    <DrywallCalculator />
  );
}
