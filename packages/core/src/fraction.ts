/**
 * Exact rational arithmetic on BigInt, used by the equation balancer so
 * that balancing never accumulates floating-point error. Not part of the
 * package's public API — see index.ts.
 */
export interface Fraction {
  readonly num: bigint;
  readonly den: bigint;
}

function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) {
    [x, y] = [y, x % y];
  }
  return x === 0n ? 1n : x;
}

export function fraction(num: number | bigint, den: number | bigint = 1): Fraction {
  let n = BigInt(num);
  let d = BigInt(den);
  if (d === 0n) throw new Error('Fraction denominator cannot be zero.');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcdBigInt(n, d);
  return { num: n / g, den: d / g };
}

export const ZERO: Fraction = fraction(0);
export const ONE: Fraction = fraction(1);

export function add(a: Fraction, b: Fraction): Fraction {
  return fraction(a.num * b.den + b.num * a.den, a.den * b.den);
}

export function sub(a: Fraction, b: Fraction): Fraction {
  return fraction(a.num * b.den - b.num * a.den, a.den * b.den);
}

export function mul(a: Fraction, b: Fraction): Fraction {
  return fraction(a.num * b.num, a.den * b.den);
}

export function div(a: Fraction, b: Fraction): Fraction {
  if (b.num === 0n) throw new Error('Division by zero fraction.');
  return fraction(a.num * b.den, a.den * b.num);
}

export function isZero(a: Fraction): boolean {
  return a.num === 0n;
}

export function negate(a: Fraction): Fraction {
  return { num: -a.num, den: a.den };
}

export function bigintGcd(a: bigint, b: bigint): bigint {
  return gcdBigInt(a, b);
}
