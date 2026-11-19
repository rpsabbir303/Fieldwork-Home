import test from "node:test";
import assert from "node:assert/strict";
import {
  calculatePaint,
  calculateTile,
  calculateDrywall,
  paintSchema,
  tileSchema,
  drywallSchema,
} from "../src/lib/calculators";

test("paint computes wall area, openings, coats, whole gallons, and user price", () => {
  const input = paintSchema.parse({
    length: 12,
    width: 10,
    height: 8,
    doorArea: 21,
    windowArea: 15,
    coats: 2,
    coverage: 350,
    price: 42,
  });
  const result = calculatePaint(input);
  assert.equal(result.grossArea, 352);
  assert.equal(result.netArea, 316);
  assert.equal(result.coverageArea, 632);
  assert.equal(result.purchaseGallons, 2);
  assert.equal(result.subtotal, 84);
});
test("paint rejects openings larger than the walls", () => {
  assert.equal(
    paintSchema.safeParse({
      length: 10,
      width: 10,
      height: 8,
      doorArea: 500,
      windowArea: 0,
      coats: 1,
      coverage: 350,
      price: 0,
    }).success,
    false,
  );
});
test("tile converts US and metric tile dimensions and rounds up", () => {
  const us = calculateTile(
    tileSchema.parse({
      unit: "imperial",
      roomLength: 10,
      roomWidth: 8,
      tileLength: 12,
      tileWidth: 12,
      waste: 10,
      price: 3,
    }),
  );
  assert.equal(us.area, 80);
  assert.equal(us.purchaseCount, 88);
  assert.equal(us.subtotal, 264);
  const metric = calculateTile(
    tileSchema.parse({
      unit: "metric",
      roomLength: 2,
      roomWidth: 2,
      tileLength: 50,
      tileWidth: 50,
      waste: 0,
      price: 0,
    }),
  );
  assert.equal(metric.tileArea, 0.25);
  assert.equal(metric.purchaseCount, 16);
});
test("drywall includes ceiling, subtracts openings, waste, and sheet area", () => {
  const result = calculateDrywall(
    drywallSchema.parse({
      wallLength: 40,
      wallHeight: 8,
      openingArea: 32,
      ceilingLength: 10,
      ceilingWidth: 10,
      sheetLength: 8,
      sheetWidth: 4,
      waste: 10,
    }),
  );
  assert.equal(result.netWallArea, 288);
  assert.equal(result.ceilingArea, 100);
  assert.equal(result.purchaseSheets, 14);
});
test("drywall requires both ceiling dimensions and sensible openings", () => {
  const base = {
    wallLength: 10,
    wallHeight: 8,
    openingArea: 0,
    ceilingLength: 0,
    ceilingWidth: 0,
    sheetLength: 8,
    sheetWidth: 4,
    waste: 10,
  };
  assert.equal(drywallSchema.safeParse({ ...base, ceilingLength: 10 }).success, false);
  assert.equal(drywallSchema.safeParse({ ...base, openingArea: 90 }).success, false);
});
