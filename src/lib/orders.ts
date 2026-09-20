import type { CartItem, CustomerProfile, Order, PaymentDetails, ShippingAddress } from '../types';
import { hasConsent } from './consent';

// Temporary in-memory/localStorage persistence — for dev only, no backend.
// Mirrors the pattern in lib/auth.ts. Profiles and orders are stored in full
// (including card/bank numbers) to model how a real order-management and
// CRM system would retain this data downstream of checkout.

const PROFILE_KEY = 'myaifashion_profiles';
const ORDERS_KEY = 'myaifashion_orders';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — no-op in this demo
  }
}

export function saveProfile(username: string, shipping: ShippingAddress): CustomerProfile {
  const profiles = readJson<Record<string, CustomerProfile>>(PROFILE_KEY, {});
  const profile: CustomerProfile = { ...shipping, username, updatedAt: new Date().toISOString() };
  profiles[username] = profile;
  writeJson(PROFILE_KEY, profiles);
  return profile;
}

export function getProfile(username: string): CustomerProfile | null {
  const profiles = readJson<Record<string, CustomerProfile>>(PROFILE_KEY, {});
  return profiles[username] ?? null;
}

export function createOrder(
  username: string,
  items: CartItem[],
  total: number,
  shipping: ShippingAddress,
  payment: PaymentDetails
): Order {
  const order: Order = {
    id: crypto.randomUUID(),
    username,
    items,
    total,
    shipping,
    payment,
    createdAt: new Date().toISOString(),
  };

  const orders = readJson<Order[]>(ORDERS_KEY, []);
  orders.push(order);
  writeJson(ORDERS_KEY, orders);

  trackPurchase(order);

  return order;
}

export function getOrders(username: string): Order[] {
  const orders = readJson<Order[]>(ORDERS_KEY, []);
  return orders.filter((o) => o.username === username).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrder(orderId: string): Order | null {
  const orders = readJson<Order[]>(ORDERS_KEY, []);
  return orders.find((o) => o.id === orderId) ?? null;
}

export function eraseCustomerData(username: string): void {
  const profiles = readJson<Record<string, CustomerProfile>>(PROFILE_KEY, {});
  delete profiles[username];
  writeJson(PROFILE_KEY, profiles);

  const orders = readJson<Order[]>(ORDERS_KEY, []).filter((o) => o.username !== username);
  writeJson(ORDERS_KEY, orders);
}

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s+/g, '');
  return `•••• •••• •••• ${digits.slice(-4)}`;
}

export function maskAccountNumber(accountNumber: string): string {
  return `••••${accountNumber.slice(-4)}`;
}

// Fires a purchase event at the marketing pixel / analytics layer declared in
// index.html — a downstream sink that receives contact PII and order value
// once marketing/analytics consent is granted. Demonstrates the checkout ->
// third-party tag data flow for mapping purposes.
function trackPurchase(order: Order): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent('marketing') && !hasConsent('analytics')) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
    orderId: order.id,
    value: order.total,
    email: order.shipping.email,
    phone: order.shipping.phone,
    fullName: order.shipping.fullName,
  });
}
