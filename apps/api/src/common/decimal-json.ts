import { Prisma } from "@prisma/client";

/**
 * API money convention: Decimal values serialise as strings with at least 2 decimal places ("200.00"), never as JS numbers
 * (no float drift). Rates with more precision (VAT 0.1400) keep their significant digits.
 */
const proto = Prisma.Decimal.prototype as unknown as { toJSON: () => string };
proto.toJSON = function toJSON(this: Prisma.Decimal): string {
  return this.decimalPlaces() <= 2 ? this.toFixed(2) : this.toString();
};
