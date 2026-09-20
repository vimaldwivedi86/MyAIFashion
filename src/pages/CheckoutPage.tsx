import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../lib/auth';
import { createOrder, getProfile, saveProfile } from '../lib/orders';
import { useStore } from '../store/useStore';
import type { BankDetails, CardDetails, PaymentMethod, ShippingAddress } from '../types';

const inputClass = 'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

const emptyShipping: ShippingAddress = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  taxId: '',
};

const emptyCard: CardDetails = { nameOnCard: '', cardNumber: '', expiry: '', cvv: '' };
const emptyBank: BankDetails = { accountHolder: '', bankName: '', accountNumber: '', ifscOrRouting: '' };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = getUser();
  const { cart, removeAllFromCart } = useStore();

  const [shipping, setShipping] = useState<ShippingAddress>(() => {
    if (!user) return emptyShipping;
    return getProfile(user.username) ?? { ...emptyShipping, email: user.username.includes('@') ? user.username : '' };
  });
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [card, setCard] = useState<CardDetails>(emptyCard);
  const [bank, setBank] = useState<BankDetails>(emptyBank);
  const [submitting, setSubmitting] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * (item.customization.quantity || 1), 0);

  const updateShipping = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setShipping((s) => ({ ...s, [field]: e.target.value }));
  const updateCard = (field: keyof CardDetails) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCard((c) => ({ ...c, [field]: e.target.value }));
  const updateBank = (field: keyof BankDetails) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBank((b) => ({ ...b, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cart.length === 0) return;
    setSubmitting(true);

    saveProfile(user.username, shipping);
    const order = createOrder(
      user.username,
      cart,
      total,
      shipping,
      method === 'card' ? { method, card } : { method, bank }
    );
    removeAllFromCart();
    setSubmitting(false);
    navigate(`/order-confirmation/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#fcfbf8] px-6 py-16 text-center">
        <p className="text-sm text-gray-500">Your bag is empty — add something before checking out.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfbf8] px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Checkout</p>
        <h1 className="mt-3 text-3xl font-semibold text-gray-900">Complete your order</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">Contact &amp; shipping</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full name</label>
                <input required value={shipping.fullName} onChange={updateShipping('fullName')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date of birth</label>
                <input type="date" required value={shipping.dateOfBirth} onChange={updateShipping('dateOfBirth')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" required value={shipping.email} onChange={updateShipping('email')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" required value={shipping.phone} onChange={updateShipping('phone')} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Street address</label>
                <input required value={shipping.street} onChange={updateShipping('street')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input required value={shipping.city} onChange={updateShipping('city')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input required value={shipping.state} onChange={updateShipping('state')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Postal code</label>
                <input required value={shipping.postalCode} onChange={updateShipping('postalCode')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input required value={shipping.country} onChange={updateShipping('country')} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>PAN / Tax ID <span className="font-normal text-gray-400">(orders above ₹50,000)</span></label>
                <input value={shipping.taxId} onChange={updateShipping('taxId')} className={inputClass} placeholder="Optional" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">Payment</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide ${method === 'card' ? 'bg-black text-white' : 'border border-gray-200 text-gray-600'}`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide ${method === 'bank' ? 'bg-black text-white' : 'border border-gray-200 text-gray-600'}`}
              >
                Bank transfer
              </button>
            </div>

            {method === 'card' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Name on card</label>
                  <input required value={card.nameOnCard} onChange={updateCard('nameOnCard')} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Card number</label>
                  <input required value={card.cardNumber} onChange={updateCard('cardNumber')} className={inputClass} placeholder="4111 1111 1111 1111" inputMode="numeric" />
                </div>
                <div>
                  <label className={labelClass}>Expiry (MM/YY)</label>
                  <input required value={card.expiry} onChange={updateCard('expiry')} className={inputClass} placeholder="MM/YY" />
                </div>
                <div>
                  <label className={labelClass}>CVV</label>
                  <input required value={card.cvv} onChange={updateCard('cvv')} className={inputClass} inputMode="numeric" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Account holder name</label>
                  <input required value={bank.accountHolder} onChange={updateBank('accountHolder')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Bank name</label>
                  <input required value={bank.bankName} onChange={updateBank('bankName')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>IFSC / routing code</label>
                  <input required value={bank.ifscOrRouting} onChange={updateBank('ifscOrRouting')} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Account number</label>
                  <input required value={bank.accountNumber} onChange={updateBank('accountNumber')} className={inputClass} inputMode="numeric" />
                </div>
              </div>
            )}
          </section>

          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-xl font-semibold">₹{total.toLocaleString()}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </div>
    </main>
  );
}
