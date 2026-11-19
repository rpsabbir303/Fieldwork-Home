import { z } from "zod";

const positive = z.number().finite().positive("Enter a number greater than zero.");
const nonnegative = z.number().finite().min(0, "Use zero or more.");
const price = z.number().finite().min(0, "Price cannot be negative.");

export const paintSchema = z
  .object({
    length: positive,
    width: positive,
    height: positive,
    doorArea: nonnegative,
    windowArea: nonnegative,
    coats: z.number().int().min(1).max(6),
    coverage: positive,
    price,
  })
  .superRefine((value, context) => {
    if (value.doorArea + value.windowArea > 2 * (value.length + value.width) * value.height)
      context.addIssue({
        code: "custom",
        path: ["doorArea"],
        message: "Openings cannot exceed the gross wall area.",
      });
  });
export const tileSchema = z.object({
  unit: z.enum(["imperial", "metric"]),
  roomLength: positive,
  roomWidth: positive,
  tileLength: positive,
  tileWidth: positive,
  waste: z.number().min(0).max(100),
  price,
});
export const drywallSchema = z
  .object({
    wallLength: positive,
    wallHeight: positive,
    openingArea: nonnegative,
    ceilingLength: nonnegative,
    ceilingWidth: nonnegative,
    sheetLength: positive,
    sheetWidth: positive,
    waste: z.number().min(0).max(100),
  })
  .superRefine((value, context) => {
    if (value.openingArea > value.wallLength * value.wallHeight)
      context.addIssue({
        code: "custom",
        path: ["openingArea"],
        message: "Openings cannot exceed the gross wall area.",
      });
    if ((value.ceilingLength === 0) !== (value.ceilingWidth === 0))
      context.addIssue({
        code: "custom",
        path: ["ceilingWidth"],
        message: "Enter both ceiling dimensions or leave both at zero.",
      });
  });

export type PaintInput = z.infer<typeof paintSchema>;
export type TileInput = z.infer<typeof tileSchema>;
export type DrywallInput = z.infer<typeof drywallSchema>;

export function calculatePaint(input: PaintInput) {
  const grossArea = 2 * (input.length + input.width) * input.height;
  const openings = input.doorArea + input.windowArea;
  const netArea = Math.max(0, grossArea - openings);
  const coverageArea = netArea * input.coats;
  const gallons = coverageArea / input.coverage;
  const purchaseGallons = Math.ceil(gallons);
  return {
    grossArea,
    openings,
    netArea,
    coverageArea,
    gallons,
    purchaseGallons,
    subtotal: purchaseGallons * input.price,
  };
}

export function calculateTile(input: TileInput) {
  const area = input.roomLength * input.roomWidth;
  const tileArea =
    input.unit === "imperial"
      ? (input.tileLength * input.tileWidth) / 144
      : (input.tileLength * input.tileWidth) / 10000;
  const baseCount = area / tileArea;
  const adjustedCount = baseCount * (1 + input.waste / 100);
  const purchaseCount = Math.ceil(adjustedCount);
  return {
    area,
    tileArea,
    baseCount,
    adjustedCount,
    purchaseCount,
    subtotal: purchaseCount * input.price,
  };
}

export function calculateDrywall(input: DrywallInput) {
  const grossWallArea = input.wallLength * input.wallHeight;
  const netWallArea = Math.max(0, grossWallArea - input.openingArea);
  const ceilingArea = input.ceilingLength * input.ceilingWidth;
  const totalArea = netWallArea + ceilingArea;
  const sheetArea = input.sheetLength * input.sheetWidth;
  const adjustedArea = totalArea * (1 + input.waste / 100);
  const sheets = adjustedArea / sheetArea;
  return {
    grossWallArea,
    netWallArea,
    ceilingArea,
    totalArea,
    sheetArea,
    adjustedArea,
    sheets,
    purchaseSheets: Math.ceil(sheets),
  };
}

export const numberFormat = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
export const moneyFormat = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
