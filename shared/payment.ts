// Pure computation over PII/payment data, shared by the client (pre-submit
// validation) and the server (authoritative decision at /api/checkout).

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 12) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function detectCardNetwork(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'American Express';
  if (/^6(0|81|82|21)/.test(digits)) return 'RuPay';
  return 'Unknown';
}

export function isValidIfsc(code: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(code.trim().toUpperCase());
}

export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export const MIN_AGE = 18;
export const PAN_REQUIRED_THRESHOLD = 50000;
export const HIGH_VALUE_REVIEW_THRESHOLD = 100000;

export type DecisionStatus = 'approved' | 'review' | 'declined';

export interface OrderDecision {
  status: DecisionStatus;
  score: number;
  reasons: string[];
}

interface DecisionInput {
  total: number;
  dateOfBirth: string;
  taxId?: string;
  paymentMethod: 'card' | 'bank';
  cardNumber?: string;
  ifscOrRouting?: string;
}

// Automated risk decision computed from the order's PII and payment data.
// This is the "automated decision-making" node in the data map: PII goes
// in, a scored accept/review/decline decision comes out.
export function decideOrder(input: DecisionInput): OrderDecision {
  const reasons: string[] = [];
  let score = 0;

  const age = calculateAge(input.dateOfBirth);
  if (age < MIN_AGE) {
    score += 100;
    reasons.push(`Customer is under the minimum age of ${MIN_AGE}`);
  }

  if (input.total > PAN_REQUIRED_THRESHOLD && !input.taxId) {
    score += 40;
    reasons.push(`Order exceeds ₹${PAN_REQUIRED_THRESHOLD.toLocaleString()} but no PAN/Tax ID was provided`);
  }

  if (input.paymentMethod === 'card' && input.cardNumber && !luhnCheck(input.cardNumber)) {
    score += 50;
    reasons.push('Card number failed Luhn checksum validation');
  }

  if (input.paymentMethod === 'bank' && input.ifscOrRouting && !isValidIfsc(input.ifscOrRouting)) {
    score += 30;
    reasons.push('IFSC/routing code does not match expected format');
  }

  if (input.total > HIGH_VALUE_REVIEW_THRESHOLD) {
    score += 15;
    reasons.push(`Order value exceeds the ₹${HIGH_VALUE_REVIEW_THRESHOLD.toLocaleString()} review threshold`);
  }

  const status: DecisionStatus = score >= 80 ? 'declined' : score >= 30 ? 'review' : 'approved';
  if (reasons.length === 0) reasons.push('No risk signals detected');

  return { status, score, reasons };
}
